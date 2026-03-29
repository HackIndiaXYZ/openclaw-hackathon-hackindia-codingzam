// Generate email based on template and inputs
const generateEmail = async (req, res) => {
  try {
    const { to, subject, type, details } = req.body;
    const userId = req.user.userId;

    if (!to || !subject || !type) {
      return res.status(400).json({
        message: "to, subject, and type are required.",
      });
    }

    const emailTemplates = {
      inquiry: {
        body: `Dear Recipient,\n\nI hope this email finds you well. ${details?.message || "I am reaching out to inquire about..."}\n\nPlease let me know if you have any questions.\n\nBest regards`,
      },
      application: {
        body: `Dear Hiring Team,\n\nI am writing to express my interest in the ${details?.position || "position"}.\n\n${details?.message || "With my skills and experience, I believe I would be a great fit."}\n\nI look forward to hearing from you.\n\nBest regards`,
      },
      follow_up: {
        body: `Dear Team,\n\nI wanted to follow up on my previous ${details?.referenceType || "application"} regarding ${details?.topic || "our discussion"}.\n\n${details?.message || "Please let me know the next steps."}\n\nThank you!`,
      },
      collaboration: {
        body: `Dear Colleague,\n\nI would like to collaborate on ${details?.topic || "a project"}\n\n${details?.message || "I believe this could be a great opportunity."}\n\nLooking forward to your thoughts.\n\nBest regards`,
      },
    };

    const template = emailTemplates[type] || emailTemplates.inquiry;

    return res.status(200).json({
      message: "Email generated successfully.",
      email: {
        to,
        subject,
        body: template.body,
        generatedAt: new Date(),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to generate email.",
      error: error.message,
    });
  }
};

// Get PDF tools metadata
const getPDFTools = async (req, res) => {
  try {
    const tools = [
      {
        id: "merge",
        name: "Merge PDFs",
        description: "Combine multiple PDF files into one",
        icon: "📑",
      },
      {
        id: "compress",
        name: "Compress PDF",
        description: "Reduce PDF file size without losing quality",
        icon: "📦",
      },
      {
        id: "split",
        name: "Split PDF",
        description: "Extract specific pages from PDF",
        icon: "✂️",
      },
      {
        id: "convert",
        name: "Convert to PDF",
        description: "Convert images or documents to PDF format",
        icon: "🔄",
      },
    ];

    return res.status(200).json({
      message: "PDF tools retrieved successfully.",
      tools,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve PDF tools.",
      error: error.message,
    });
  }
};

// Generate assignment help
const generateAssignmentHelp = async (req, res) => {
  try {
    const { topic, requirements, deadline } = req.body;
    const userId = req.user.userId;

    if (!topic || !requirements) {
      return res.status(400).json({
        message: "topic and requirements are required.",
      });
    }

    const help = {
      topic,
      structure: [
        "Introduction (explain what you'll cover)",
        "Main Body (divide into 3-4 sections)",
        "Examples (add real-world scenarios)",
        "Analysis (discuss implications)",
        "Conclusion (summarize key points)",
        "References (cite sources properly)",
      ],
      tips: [
        "Research thoroughly before writing",
        "Create an outline first",
        "Use clear and concise language",
        "Cite all sources properly",
        "Proofread before submission",
        "Follow formatting guidelines",
      ],
      timeline: deadline ? [{
        date: new Date(),
        task: "Research and planning",
        duration: "2 days",
      }, {
        date: new Date(),
        task: "First draft",
        duration: "3 days",
      }, {
        date: new Date(),
        task: "Review and edits",
        duration: "2 days",
      }] : [],
      generatedAt: new Date(),
    };

    return res.status(200).json({
      message: "Assignment help generated successfully.",
      help,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to generate assignment help.",
      error: error.message,
    });
  }
};

module.exports = {
  generateEmail,
  getPDFTools,
  generateAssignmentHelp,
};
