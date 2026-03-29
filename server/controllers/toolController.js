const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const OpenAI = require("openai");

const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

const aiText = async (task, prompt, fallback) => {
  const client = getOpenAIClient();

  if (!client) {
    return fallback;
  }

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_TEXT_MODEL || "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an expert assistant for ${task}. Give practical, structured, clean output.`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.6,
  });

  return completion.choices?.[0]?.message?.content?.trim() || fallback;
};

const respondError = (res, message, error) => {
  return res.status(500).json({
    message,
    ...(process.env.NODE_ENV === "production" ? {} : { error: error.message }),
  });
};

const generateEmail = async (req, res) => {
  try {
    const { purpose, tone, recipient } = req.body;

    if (!purpose || !tone || !recipient) {
      return res.status(400).json({ message: "purpose, tone and recipient are required." });
    }

    const fallback = `Hi ${recipient},\n\nI am writing regarding ${purpose}. I am using a ${tone} tone for this outreach and would value your response.\n\nBest regards,\nYour Name`;
    const output = await aiText(
      "email generation",
      `Write a ${tone} email to ${recipient} for: ${purpose}. Keep it clear and professional.`,
      fallback
    );

    return res.status(200).json({ output });
  } catch (error) {
    return respondError(res, "Failed to generate email.", error);
  }
};

const generateAssignmentHelp = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "topic is required." });
    }

    const fallback = `# ${topic}\n\n## Introduction\nBrief context and why this topic matters.\n\n## Key Points\n- Core idea 1\n- Core idea 2\n- Real-world example\n\n## Conclusion\nSummarize insights and practical implications.`;
    const output = await aiText(
      "assignment drafting",
      `Create a structured assignment on ${topic}. Include headings, bullet points, and a conclusion.`,
      fallback
    );

    return res.status(200).json({ output });
  } catch (error) {
    return respondError(res, "Failed to generate assignment help.", error);
  }
};

const generateResumePolish = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "text is required." });
    }

    const fallback = `Improved resume bullets:\n- Delivered feature with measurable impact\n- Collaborated cross-functionally to reduce blockers\n- Optimized process resulting in faster delivery`;
    const output = await aiText(
      "resume optimization",
      `Polish these resume bullets with action + impact style:\n${text}`,
      fallback
    );

    return res.status(200).json({ output });
  } catch (error) {
    return respondError(res, "Failed to polish resume.", error);
  }
};

const generateCoverLetter = async (req, res) => {
  try {
    const { role, company, experience } = req.body;
    if (!role || !company || !experience) {
      return res.status(400).json({ message: "role, company and experience are required." });
    }

    const fallback = `Dear Hiring Team at ${company},\n\nI am excited to apply for ${role}. My background includes ${experience}. I am confident this aligns with your needs.\n\nSincerely,\nYour Name`;
    const output = await aiText(
      "cover letter generation",
      `Write a tailored cover letter for role: ${role}, company: ${company}, experience: ${experience}.`,
      fallback
    );

    return res.status(200).json({ output });
  } catch (error) {
    return respondError(res, "Failed to generate cover letter.", error);
  }
};

const generateLinkedInHeadline = async (req, res) => {
  try {
    const { skills, role } = req.body;
    if (!skills || !role) {
      return res.status(400).json({ message: "skills and role are required." });
    }

    const fallback = `1) ${role} | ${skills} | Building impact\n2) ${role} with ${skills}\n3) Problem-solver in ${skills}`;
    const output = await aiText(
      "linkedin headline generation",
      `Generate 7 LinkedIn headline options for role ${role} with skills ${skills}.`,
      fallback
    );

    return res.status(200).json({ output });
  } catch (error) {
    return respondError(res, "Failed to generate LinkedIn headlines.", error);
  }
};

const generateInterviewQuestions = async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ message: "role is required." });
    }

    const fallback = `Q1: Describe a challenging bug you fixed.\nA1: Explain context, diagnosis, fix, and result.\n\nQ2: How do you prioritize tasks?\nA2: Use impact, urgency, and dependencies.`;
    const output = await aiText(
      "interview preparation",
      `Generate 10 interview questions and strong sample answers for role: ${role}.`,
      fallback
    );

    return res.status(200).json({ output });
  } catch (error) {
    return respondError(res, "Failed to generate interview questions.", error);
  }
};

const generateStudyPlan = async (req, res) => {
  try {
    const { goals, time } = req.body;
    if (!goals || !time) {
      return res.status(400).json({ message: "goals and time are required." });
    }

    const fallback = `Weekly plan for ${goals} (${time}):\n- Mon: Concepts\n- Tue: Practice\n- Wed: Mini project\n- Thu: Revision\n- Fri: Mock test\n- Sat: Build\n- Sun: Review`;
    const output = await aiText(
      "study planning",
      `Create a practical weekly plan for goals: ${goals}, available time: ${time}.`,
      fallback
    );

    return res.status(200).json({ output });
  } catch (error) {
    return respondError(res, "Failed to generate study plan.", error);
  }
};

const generateCode = async (req, res) => {
  try {
    const { description, language } = req.body;
    if (!description || !language) {
      return res.status(400).json({ message: "description and language are required." });
    }

    const fallback = `// ${language} solution\n// ${description}\nfunction solve() {\n  // TODO\n}`;
    const output = await aiText(
      "code generation",
      `Generate ${language} code for: ${description}. Add concise comments.`,
      fallback
    );

    return res.status(200).json({ output });
  } catch (error) {
    return respondError(res, "Failed to generate code.", error);
  }
};

const checkGrammar = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "text is required." });
    }

    const fallback = text;
    const output = await aiText(
      "grammar correction",
      `Correct grammar and improve readability for:\n${text}`,
      fallback
    );

    return res.status(200).json({ output });
  } catch (error) {
    return respondError(res, "Failed to check grammar.", error);
  }
};

const summarizeNotes = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "text is required." });
    }

    const fallback = `Summary:\n- Key idea 1\n- Key idea 2\n- Action point`;
    const output = await aiText(
      "note summarization",
      `Summarize this text in clear bullets and a short conclusion:\n${text}`,
      fallback
    );

    return res.status(200).json({ output });
  } catch (error) {
    return respondError(res, "Failed to summarize notes.", error);
  }
};

const assistantChat = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ message: "query is required." });
    }

    const fallback = "I can help with planning, learning, and task execution. Share your goal and constraints.";
    const output = await aiText(
      "chat assistance",
      `Respond to user query in concise helpful style: ${query}`,
      fallback
    );

    return res.status(200).json({ output });
  } catch (error) {
    return respondError(res, "Failed to get assistant response.", error);
  }
};

const generateSmartGoalPlan = async (req, res) => {
  try {
    const { goal, duration } = req.body;
    if (!goal || !duration) {
      return res.status(400).json({ message: "goal and duration are required." });
    }

    const fallback = `SMART Plan for ${goal} (${duration}):\n- Specific: Define one measurable outcome\n- Measurable: Track weekly progress\n- Achievable: Break into small milestones\n- Relevant: Align with your target role\n- Time-bound: Weekly review and final deadline`;
    const output = await aiText(
      "smart goal planning",
      `Create a SMART action plan for goal: ${goal}, duration: ${duration}. Include weekly milestones and risk mitigation.`,
      fallback
    );

    return res.status(200).json({ output });
  } catch (error) {
    return respondError(res, "Failed to generate SMART goal plan.", error);
  }
};

const generateProjectIdeas = async (req, res) => {
  try {
    const { domain, skills, level } = req.body;
    if (!domain || !skills || !level) {
      return res.status(400).json({ message: "domain, skills and level are required." });
    }

    const fallback = `Project Ideas (${domain} | ${level}):\n1) Portfolio-grade project using ${skills}\n2) Real-world automation mini app\n3) Data-backed dashboard with deploy link`;    
    const output = await aiText(
      "project ideation",
      `Generate 8 project ideas for domain ${domain}, level ${level}, using skills ${skills}. Include one-liner impact and complexity tag.`,
      fallback
    );

    return res.status(200).json({ output });
  } catch (error) {
    return respondError(res, "Failed to generate project ideas.", error);
  }
};

const generateImagePrompt = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: "prompt is required." });
    }

    const client = getOpenAIClient();
    if (!client) {
      return res.status(200).json({
        output: "Image generation requires OPENAI_API_KEY. Add it in server/.env and retry.",
      });
    }

    const image = await client.images.generate({
      model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-1",
      prompt,
      size: "1024x1024",
    });

    return res.status(200).json({ imageBase64: image.data?.[0]?.b64_json || null });
  } catch (error) {
    return respondError(res, "Failed to generate image.", error);
  }
};

const mergePdf = async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ message: "At least 2 PDF files are required." });
    }

    const merged = await PDFDocument.create();

    for (const file of req.files) {
      const source = await PDFDocument.load(file.buffer);
      const pages = await merged.copyPages(source, source.getPageIndices());
      pages.forEach((page) => merged.addPage(page));
    }

    const bytes = await merged.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=merged.pdf");
    return res.send(Buffer.from(bytes));
  } catch (error) {
    return respondError(res, "Failed to merge PDFs.", error);
  }
};

const splitPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required." });
    }

    const pageNumber = Number(req.body.page || 1);
    const source = await PDFDocument.load(req.file.buffer);

    if (pageNumber < 1 || pageNumber > source.getPageCount()) {
      return res.status(400).json({ message: "Invalid page number." });
    }

    const output = await PDFDocument.create();
    const [copiedPage] = await output.copyPages(source, [pageNumber - 1]);
    output.addPage(copiedPage);

    const bytes = await output.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=split-page.pdf");
    return res.send(Buffer.from(bytes));
  } catch (error) {
    return respondError(res, "Failed to split PDF.", error);
  }
};

const compressPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required." });
    }

    const source = await PDFDocument.load(req.file.buffer);
    const bytes = await source.save({ useObjectStreams: true });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=compressed.pdf");
    return res.send(Buffer.from(bytes));
  } catch (error) {
    return respondError(res, "Failed to compress PDF.", error);
  }
};

const overlayPdfText = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required." });
    }

    const { text, x, y, page } = req.body;
    if (!text) {
      return res.status(400).json({ message: "text is required." });
    }

    const source = await PDFDocument.load(req.file.buffer);
    const pageIndex = Math.max(0, Number(page || 1) - 1);
    const targetPage = source.getPages()[pageIndex];

    if (!targetPage) {
      return res.status(400).json({ message: "Invalid page number." });
    }

    const font = await source.embedFont(StandardFonts.Helvetica);
    targetPage.drawText(text, {
      x: Number(x || 50),
      y: Number(y || 50),
      size: 14,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });

    const bytes = await source.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=edited.pdf");
    return res.send(Buffer.from(bytes));
  } catch (error) {
    return respondError(res, "Failed to overlay text on PDF.", error);
  }
};

module.exports = {
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
};
