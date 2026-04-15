const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// 🔹 SIGNUP (Student + Admin)
const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check existing user
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with role from frontend
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "student"   // ✅ FIXED
        });

        // Generate token with role
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            token,
            role: user.role
        });

    } catch (err) {
        console.error("Signup Error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
};


// 🔹 LOGIN (Works for BOTH student + admin)
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user (no role restriction)
        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ msg: "Invalid email or password" });
        }

        // Generate token with role
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            role: user.role
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ msg: "Server error" });
    }
};

module.exports = { signup, login };