import Expense from "../models/expense.model.js";
import asyncHandler from "express-async-handler";

export const getMonthlyExpenses = asyncHandler(async (req, res) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const expenses = await Expense.find({
        date: { $gte: startOfMonth, $lte: endOfMonth }
    }).sort({ date: -1 });

    res.json(expenses);
});

export const addExpense = asyncHandler(async (req, res) => {
    const { category, description, amount, date } = req.body;

    if (!category || !amount) {
        res.status(400);
        throw new Error("Category and Amount are required");
    }

    const expense = await Expense.create({
        category,
        description: description || category,
        amount,
        date: date || new Date()
    });

    res.status(201).json(expense);
});

export const deleteExpense = asyncHandler(async (req, res) => {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
        res.status(404);
        throw new Error("Expense not found");
    }

    await expense.deleteOne();
    res.json({ id: req.params.id });
});