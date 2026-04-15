const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Attendance = require("../models/Attendance");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// ✅ Get all users
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Delete user
router.delete("/user/:id", protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Attendance.deleteMany({ userId: req.params.id });

    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting user" });
  }
});

// ✅ Get attendance of a user
router.get("/attendance/:id", protect, adminOnly, async (req, res) => {
  try {
    const data = await Attendance.find({ userId: req.params.id }).sort({ date: -1 });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching attendance" });
  }
});

// ✅ Stats
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAttendance = await Attendance.countDocuments();

    res.json({
      success: true,
      totalUsers,
      totalAttendance
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;