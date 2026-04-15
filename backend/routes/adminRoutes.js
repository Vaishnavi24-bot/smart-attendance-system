const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const User = require("../models/User");
const Attendance = require("../models/Attendance");

// 🔹 GET ALL USERS (STUDENTS)
router.get("/users", protect, async (req, res) => {
    try {
        const users = await User.find({ role: "student" });

        const usersWithAttendance = await Promise.all(
            users.map(async (user) => {
                const attendanceCount = await Attendance.countDocuments({
                    userId: user._id
                });

                return {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    totalAttendance: attendanceCount
                };
            })
        );

        res.json(usersWithAttendance);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

// 🔹 ADMIN STATS
router.get("/stats", protect, async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: "student" });
        const totalAttendance = await Attendance.countDocuments();

        res.json({
            totalStudents,
            totalAttendance
        });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;