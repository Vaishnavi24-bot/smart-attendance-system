const Attendance = require('../models/Attendance');

const markAttendance = async (req, res) => {
    console.log("📍 Mark Attendance called by user ID:", req.user?.id);

    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Please login first" });
        }

        // Check if already marked today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const existing = await Attendance.findOne({
            userId: req.user.id,
            date: { $gte: today, $lt: tomorrow }
        });

        if (existing) {
            return res.status(400).json({ success: false, message: "Attendance already marked for today" });
        }

        const attendance = await Attendance.create({
            userId: req.user.id,
            date: new Date()
        });

        console.log("✅ Attendance marked successfully!");
        res.status(201).json({ 
            success: true, 
            message: "Attendance marked successfully" 
        });

    } catch (error) {
        console.error("❌ Mark Attendance Error:", error.message);
        res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
};

const getMyAttendance = async (req, res) => {
    try {
        const attendances = await Attendance.find({ userId: req.user.id }).sort({ date: -1 });

        res.json({
            success: true,
            attendances,
            stats: {
                totalMarked: attendances.length,
                totalExpected: 60,
                percentage: Math.round((attendances.length / 60) * 100)
            }
        });
    } catch (error) {
        console.error("Get Attendance Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { markAttendance, getMyAttendance };