const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// =====================
// 🔹 SIGNUP (Student + Admin)
// =====================
const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // ✅ Validation
        if (!name || !email || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        // ✅ Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create user with role
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "student" // default student
        });

        // ✅ Generate JWT with role
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            success: true,
            token,
            role: user.role
        });

    } catch (err) {
        console.error("❌ Signup Error:", err);
        res.status(500).json({ msg: "Server error" });
    }
};


// =====================
// 🔹 LOGIN (Auto role detection)
// =====================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ✅ Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ msg: "Invalid email or password" });
        }

        // ✅ Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ msg: "Invalid email or password" });
        }

        // ✅ Generate token with role
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            token,
            role: user.role
        });

    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ msg: "Server error" });
    }
};

module.exports = { signup, login };