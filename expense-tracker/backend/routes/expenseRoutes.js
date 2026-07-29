const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// Add Expense
router.post("/", async (req, res) => {
    try {
        const expense = await Expense.create(req.body);
        res.status(201).json(expense);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get All Expenses
router.get("/", async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ createdAt: -1 });
        res.json(expenses);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete Expense
router.delete("/:id", async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({
            message: "Expense Deleted",
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;