const express = require('express');
const protect = require('../middleware/authMiddleware');
const { markAttendance, getMyAttendance } = require('../controllers/attendanceController');

const router = express.Router();

router.post('/mark', protect, markAttendance);
router.get('/my', protect, getMyAttendance);

module.exports = router;