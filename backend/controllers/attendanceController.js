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
       const attendanceCount = await Attendance.find({
  userId: student._id,
}).countDocuments();

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