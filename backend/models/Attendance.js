const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
}, { timestamps: true });

// Important: Prevent duplicate attendance for the same user on the same day
attendanceSchema.index({ userId: 1, date: { $gte: new Date().setHours(0,0,0,0) } }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;