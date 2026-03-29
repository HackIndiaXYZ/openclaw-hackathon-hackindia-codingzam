const express = require("express");
const { generateEmail, getPDFTools, generateAssignmentHelp } = require("../controllers/toolController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Generate email (protected)
router.post("/email", authMiddleware, generateEmail);

// Get PDF tools (protected)
router.get("/pdf", authMiddleware, getPDFTools);

// Generate assignment help (protected)
router.post("/assignment-help", authMiddleware, generateAssignmentHelp);

module.exports = router;
