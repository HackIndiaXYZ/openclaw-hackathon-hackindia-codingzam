const express = require("express");
const { signup, login, getProfile } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// Protected route: requires Bearer token in Authorization header.
router.get("/profile", authMiddleware, getProfile);

module.exports = router;
