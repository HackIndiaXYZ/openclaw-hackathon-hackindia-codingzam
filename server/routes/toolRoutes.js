const express = require("express");
const multer = require("multer");
const {
	generateEmail,
	generateAssignmentHelp,
	generateResumePolish,
	generateCoverLetter,
	generateLinkedInHeadline,
	generateInterviewQuestions,
	generateStudyPlan,
	generateCode,
	checkGrammar,
	summarizeNotes,
	assistantChat,
	generateSmartGoalPlan,
	generateProjectIdeas,
	generateImagePrompt,
	mergePdf,
	splitPdf,
	compressPdf,
	overlayPdfText,
	editPdfFrontPage,
} = require("../controllers/toolController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/email-generator", authMiddleware, generateEmail);
router.post("/assignment-helper", authMiddleware, generateAssignmentHelp);
router.post("/resume-polisher", authMiddleware, generateResumePolish);
router.post("/cover-letter-builder", authMiddleware, generateCoverLetter);
router.post("/linkedin-headline", authMiddleware, generateLinkedInHeadline);
router.post("/interview-question-bank", authMiddleware, generateInterviewQuestions);
router.post("/study-plan", authMiddleware, generateStudyPlan);
router.post("/code-generator", authMiddleware, generateCode);
router.post("/grammar-checker", authMiddleware, checkGrammar);
router.post("/notes-summarizer", authMiddleware, summarizeNotes);
router.post("/chat-assistant", authMiddleware, assistantChat);
router.post("/smart-goal-plan", authMiddleware, generateSmartGoalPlan);
router.post("/project-ideas", authMiddleware, generateProjectIdeas);
router.post("/image-generator", authMiddleware, generateImagePrompt);

router.post("/pdf/merge", authMiddleware, upload.array("files", 10), mergePdf);
router.post("/pdf/split", authMiddleware, upload.single("file"), splitPdf);
router.post("/pdf/compress", authMiddleware, upload.single("file"), compressPdf);
router.post("/pdf/overlay", authMiddleware, upload.single("file"), overlayPdfText);
router.post(
	"/pdf/front-page",
	authMiddleware,
	upload.fields([
		{ name: "file", maxCount: 1 },
		{ name: "logo", maxCount: 1 },
	]),
	editPdfFrontPage
);

module.exports = router;
