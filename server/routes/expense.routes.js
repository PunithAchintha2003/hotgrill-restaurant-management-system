import express from "express";
import { getMonthlyExpenses, addExpense, deleteExpense } from "../controllers/expense.controller.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", adminAuth, getMonthlyExpenses);
router.post("/", adminAuth, addExpense);
router.delete("/:id", adminAuth, deleteExpense);

export default router;