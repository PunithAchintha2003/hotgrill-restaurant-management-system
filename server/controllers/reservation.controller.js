import Reservation from "../models/reservation.model.js";
import Config from "../models/config.model.js";
import asyncHandler from "express-async-handler";

const assignTables = async (date, time, guests, excludeResId = null) => {
    const config = await Config.findOne({ key: "totalTables" });
    const totalTables = config ? parseInt(config.value) : 10;
    const tablesNeeded = Math.ceil(guests / 4);

    if (tablesNeeded > totalTables) {
        return { success: false, reason: "Group exceeds total restaurant capacity", tables: [] };
    }

    const query = { 
        date, 
        time, 
        status: { $in: ["pending", "confirmed"] } 
    };
    if (excludeResId) {
        query._id = { $ne: excludeResId };
    }
    
    const existingReservations = await Reservation.find(query);

    let occupiedTables = [];
    existingReservations.forEach(res => {
        if (res.tableNumber && res.tableNumber !== "Unassigned" && res.tableNumber !== "Conflict") {
            const tables = res.tableNumber.split(',').map(t => parseInt(t.trim().replace('T', '')));
            occupiedTables = [...occupiedTables, ...tables];
        }
    });

    let assignedTables = [];
    for (let i = 1; i <= totalTables; i++) {
        if (!occupiedTables.includes(i)) {
            assignedTables.push(i);
            if (assignedTables.length === tablesNeeded) break;
        }
    }

    if (assignedTables.length < tablesNeeded) {
        return { success: false, reason: "Not enough tables available", tables: [] };
    }

    return { 
        success: true, 
        tables: assignedTables.map(t => `T${t}`).join(', ') 
    };
};

export const getDailyStats = asyncHandler(async (req, res) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const reservations = await Reservation.find({
        date: { $gte: startOfDay, $lte: endOfDay },
        status: { $in: ["pending", "confirmed", "completed"] }
    });

    const expectedGuests = reservations.reduce((acc, curr) => acc + curr.guests, 0);

    const bookedTablesSet = new Set();
    reservations.forEach(res => {
        if (res.tableNumber && res.tableNumber !== "Unassigned" && res.tableNumber !== "Conflict") {
            const tables = res.tableNumber.split(',').map(t => t.trim());
            tables.forEach(t => bookedTablesSet.add(t));
        }
    });

    const config = await Config.findOne({ key: "totalTables" });
    const totalTables = config ? parseInt(config.value) : 10;

    const tablesUtilized = bookedTablesSet.size;
    const tablesFreeToday = Math.max(0, totalTables - tablesUtilized);

    res.json({
        date: startOfDay,
        expectedGuests,
        tablesUtilized,
        totalTables,
        tablesFreeToday
    });
});

export const createReservation = asyncHandler(async (req, res) => {
    const { name, email, phone, date, time, guests, notes, userId } = req.body;

    if (!name || !email || !phone || !date || !time || !guests) {
        res.status(400);
        throw new Error("Please fill in all required fields");
    }

    const assignment = await assignTables(date, time, guests);
    
    let tableNumber = "Unassigned";
    let status = "pending";
    let conflictNote = "";

    if (assignment.success) {
        tableNumber = assignment.tables;
    } else {
        tableNumber = "Conflict";
        conflictNote = ` [System Alert: ${assignment.reason}]`;
    }

    const reservation = await Reservation.create({
        userId: userId || null,
        name,
        email,
        phone,
        date,
        time,
        guests,
        tableNumber,
        status,
        notes: (notes || "") + conflictNote
    });

    const io = req.app.get('socketio');
    io.emit("new_notification", {
        type: "reservation",
        message: `New Table booked by ${name} for ${guests} people`,
        link: "/admin/reservations"
    });

    res.status(201).json(reservation);
});

export const updateReservation = asyncHandler(async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
        res.status(404);
        throw new Error("Reservation not found");
    }
    
    const updatedReservation = await Reservation.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(updatedReservation);
});

export const getUserReservations = asyncHandler(async (req, res) => {
    const reservations = await Reservation.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(reservations);
});

export const getAllReservations = asyncHandler(async (req, res) => {
    const reservations = await Reservation.find().sort({ date: 1, time: 1 });
    res.json(reservations);
});

export const deleteReservation = asyncHandler(async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
        res.status(404);
        throw new Error("Reservation not found");
    }
    await reservation.deleteOne();
    res.json({ id: req.params.id });
});

export const getConfig = asyncHandler(async (req, res) => {
    const config = await Config.findOne({ key: req.params.key });
    res.json(config || { value: null });
});

export const setConfig = asyncHandler(async (req, res) => {
    const { key, value } = req.body;
    const config = await Config.findOneAndUpdate(
        { key },
        { value },
        { new: true, upsert: true }
    );
    res.json(config);
});