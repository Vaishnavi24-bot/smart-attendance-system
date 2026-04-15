const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

dotenv.config();

const app = express(); // ✅ MUST be before using app

// =====================
// ✅ CORS FIX (IMPORTANT)
// =====================
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://smart-attendance-system-f28cxoyf6-vaishnavi24-bots-projects.vercel.app"
  ],
  credentials: true
}));

// =====================
// Middleware
// =====================
app.use(express.json());

// =====================
// MongoDB Connection
// =====================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// =====================
// Routes
// =====================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/admin', require('./routes/adminRoutes')); // ✅ admin route

// =====================
// Test Route
// =====================
app.get('/', (req, res) => {
  res.send('API Running 🚀');
});

// =====================
// Start Server
// =====================
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});