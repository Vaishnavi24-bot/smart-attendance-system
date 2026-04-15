const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const User = require('../models/User');
const Attendance = require('../models/Attendance');

// 🔐 ADMIN MIDDLEWARE
const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: "Access denied" });
    }
    next();
};


// =====================
// 🔹 GET ALL USERS + THEIR ATTENDANCE
// =====================
router.get('/users', protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find({ role: "student" }).select('-password');

        const data = await Promise.all(
            users.map(async (user) => {
                const attendance = await Attendance.find({ userId: user._id });

                return {
                    ...user._doc,
                    totalAttendance: attendance.length
                };
            })
        );

        res.json(data);

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});


// =====================
// 🔹 ADMIN STATS
// =====================
router.get('/stats', protect, adminOnly, async (req, res) => {
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