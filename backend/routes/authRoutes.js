const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/authController");

// Student routes only
router.post("/register", signup);
router.post("/login", login);

module.exports = router;