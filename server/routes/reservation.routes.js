import express from "express";
import {
    createReservation,
    getUserReservations,
    getAllReservations,
    updateReservation,
    deleteReservation,
    getConfig,
    setConfig,
    getDailyStats
} from "../controllers/reservation.controller.js";
import auth from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/", createReservation);
router.get("/my-reservations", auth, getUserReservations);

// Admin Routes
router.get("/admin", adminAuth, getAllReservations);
router.post("/admin", adminAuth, createReservation);
router.put("/admin/:id", adminAuth, updateReservation);
router.delete("/admin/:id", adminAuth, deleteReservation);
router.get("/stats/daily", adminAuth, getDailyStats);

router.get("/config/:key", adminAuth, getConfig);
router.post("/config", adminAuth, setConfig);

export default router;