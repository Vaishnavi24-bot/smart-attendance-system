const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 🔹 ADMIN SIGNUP
const adminSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ msg: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "admin"
        });

        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({ token, role: admin.role });

    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

// 🔹 ADMIN LOGIN
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await User.findOne({ email, role: "admin" });

        if (!admin || !(await admin.matchPassword(password))) {
            return res.status(401).json({ msg: "Invalid admin credentials" });
        }

        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ token, role: admin.role });

    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

module.exports = { adminSignup, adminLogin };