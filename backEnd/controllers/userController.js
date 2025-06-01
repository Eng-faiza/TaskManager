const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');

// @desc Get all users (admin only)
// @route GET /api/users/
// @access Private (admin only)
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'member' }).select("-password");

        // Add task counts to each user
        const userWithTaskCounts = await Promise.all(users.map(async (user) => {
            const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: 'Pending' });
            const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: 'In Progress' });
            const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: 'Completed' });

            return {
                ...user._doc,
                pendingTasks,
                inProgressTasks,
                completedTasks
            };
        }));

        res.json(userWithTaskCounts);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// @desc Get user by ID
// @route GET /api/users/:id
// @access Private
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// @desc Delete user by ID (admin only)
// @route DELETE /api/users/:id
// @access Private (admin)
// OPTIONAL: Kudar delete functionality halkan haddii loo baahdo

module.exports = {
    getUsers,
    getUserById
}
