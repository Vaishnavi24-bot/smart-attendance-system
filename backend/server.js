const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

dotenv.config();

const app = express();


// ✅ MIDDLEWARE
app.use(express.json());

// 🔥 CORS FIX (IMPORTANT)
app.use(cors({
  origin: ["http://localhost:5173"], // frontend (local)
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.options('*', cors()); // handle preflight


// ✅ MONGODB CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => {
    console.error('❌ MongoDB Error:', err);
    process.exit(1);
  });


// ✅ ROUTES
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));


// ✅ TEST ROUTE
app.get('/', (req, res) => {
  res.send('🚀 Smart Attendance API is Running...');
});


// ✅ SERVER START
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});