const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Attendance = require("../models/Attendance");
const protect = require("../middleware/authMiddleware");

// ✅ GET ALL STUDENTS WITH ATTENDANCE COUNT
router.get("/users", protect, async (req, res) => {
  try {
    const students = await User.find({ role: "student" });

    const data = await Promise.all(
      students.map(async (student) => {
        const attendanceCount = await Attendance.countDocuments({
          userId: student._id,
        });

        return {
          _id: student._id,
          name: student.name,
          email: student.email,
          totalAttendance: attendanceCount,
        };
      })
    );

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ ADMIN STATS
router.get("/stats", protect, async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalAttendance = await Attendance.countDocuments();

    res.json({
      totalStudents,
      totalAttendance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;