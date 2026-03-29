const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getActivity, syncActivity, trackOpportunityAction } = require("../controllers/activityController");

const router = express.Router();

router.get("/", authMiddleware, getActivity);
router.put("/sync", authMiddleware, syncActivity);
router.post("/opportunity-action", authMiddleware, trackOpportunityAction);

module.exports = router;
