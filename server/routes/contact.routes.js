import express from "express";
import { submitMessage, getAllMessages, markAsRead, deleteMessage } from "../controllers/contact.controller.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/", submitMessage);
router.get("/", adminAuth, getAllMessages);
router.put("/:id/read", adminAuth, markAsRead);
router.delete("/:id", adminAuth, deleteMessage);

export default router;