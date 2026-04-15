const Attendance = require('../models/Attendance');

const markAttendance = async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existing = await Attendance.findOne({
      userId: userId,
      date: { $gte: today, $lt: tomorrow },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already marked today",
      });
    }

    await Attendance.create({
      userId: userId,
      date: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Attendance marked",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getMyAttendance = async (req, res) => {
  try {
    const userId = req.user.id;

    const attendances = await Attendance.find({ userId }).sort({
      date: -1,
    });

    const totalMarked = attendances.length;
    const totalExpected = 60;

    res.json({
      success: true,
      attendances,
      stats: {
        totalMarked,
        totalExpected,
        percentage:
          totalExpected === 0
            ? 0
            : Math.round((totalMarked / totalExpected) * 100),
      },
    });
  } catch (error) {
    console.error("Get Attendance Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { markAttendance, getMyAttendance };