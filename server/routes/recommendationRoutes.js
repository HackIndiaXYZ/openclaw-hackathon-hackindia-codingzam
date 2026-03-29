const express = require("express");
const { generateRecommendations } = require("../controllers/recommendationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protected route: generate recommendations
router.post("/", authMiddleware, generateRecommendations);

module.exports = router;
