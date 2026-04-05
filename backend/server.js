require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/get-expenses', async (req, res) => {
    try {
        const expenses = await Expense.find();

        res.json({
            message: "Expenses fetched successfully ✅",
            data: expenses
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching expenses ❌",
            error: error.message
        });
    }
});

// Add expense route
app.post('/add-expense', async (req, res) => {
    try {
        const { title, amount } = req.body;

        const newExpense = new Expense({ title, amount });
        await newExpense.save();

        res.json({
            message: "Expense saved to DB ✅",
            data: newExpense
        });

    } catch (error) {
        res.status(500).json({
            message: "Error saving expense ❌",
            error: error.message
        });
    }
});

// ✅ Fixed MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected successfully ✅"))
.catch((err) => console.log("MongoDB connection error ❌", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

console.log("MONGO_URI:", process.env.MONGO_URI);

const Expense = require('./models/Expense');

app.delete('/delete-expense/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await Expense.findByIdAndDelete(id);

        res.json({
            message: "Expense deleted successfully ✅"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting expense ❌",
            error: error.message
        });
    }
});

app.put('/update-expense/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, amount } = req.body;

        const updatedExpense = await Expense.findByIdAndUpdate(
            id,
            { title, amount },
            { new: true } // returns updated data
        );

        res.json({
            message: "Expense updated successfully ✅",
            data: updatedExpense
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating expense ❌",
            error: error.message
        });
    }
});
