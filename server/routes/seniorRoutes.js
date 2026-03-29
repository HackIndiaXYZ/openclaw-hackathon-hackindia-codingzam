const express = require("express");
const { getSeniors, registerMentor } = require("../controllers/seniorController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all seniors (public)
router.get("/", getSeniors);

// Register as mentor (protected)
router.post("/register", authMiddleware, registerMentor);

module.exports = router;
