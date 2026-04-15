const express = require("express");
const router = express.Router();

const {
  adminSignup,
  adminLogin,
} = require("../controllers/adminAuthController");

// Admin routes only
router.post("/register", adminSignup);
router.post("/login", adminLogin);

module.exports = router;