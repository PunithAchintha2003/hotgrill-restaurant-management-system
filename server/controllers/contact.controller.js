import Contact from "../models/contact.model.js";
import asyncHandler from "express-async-handler";

export const submitMessage = asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !message) {
        res.status(400);
        throw new Error("Please fill in all required fields");
    }

    const newMessage = await Contact.create({
        name,
        email,
        subject,
        message
    });

    const io = req.app.get('socketio');
    io.emit("new_notification", {
        type: "message",
        message: `New Message from ${name}: ${subject}`,
        link: "/admin/messages"
    });

    res.status(201).json(newMessage);
});

export const getAllMessages = asyncHandler(async (req, res) => {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
});

export const markAsRead = asyncHandler(async (req, res) => {
    const message = await Contact.findById(req.params.id);

    if (!message) {
        res.status(404);
        throw new Error("Message not found");
    }

    message.isRead = true;
    await message.save();
    res.json(message);
});

export const deleteMessage = asyncHandler(async (req, res) => {
    const message = await Contact.findById(req.params.id);

    if (!message) {
        res.status(404);
        throw new Error("Message not found");
    }

    await message.deleteOne();
    res.json({ id: req.params.id });
});