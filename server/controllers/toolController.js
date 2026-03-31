const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const OpenAI = require("openai");

const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

const clampText = (value, max = 2000) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, max);
};

const aiText = async (task, prompt, fallback, options = {}) => {
  const client = getOpenAIClient();

  if (!client) {
    return fallback;
  }

  try {
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_TEXT_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            options.systemPrompt ||
            `You are an expert assistant for ${task}. Give practical, structured, clean output in markdown.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: options.temperature ?? 0.4,
      max_tokens: options.maxTokens ?? 900,
    });

    return completion.choices?.[0]?.message?.content?.trim() || fallback;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`AI fallback used for task '${task}': ${error.message}`);
    }
    return fallback;
  }
};

const respondError = (res, message, error) => {
  return res.status(500).json({
    message,
    ...(process.env.NODE_ENV === "production" ? {} : { error: error.message }),
  });
};

const generateEmail = async (req, res) => {
  try {
    const purpose = clampText(req.body.purpose, 280);
    const tone = clampText(req.body.tone, 60);
    const recipient = clampText(req.body.recipient, 120);

    if (!purpose || !tone || !recipient) {
      return res.status(400).json({ message: "purpose, tone and recipient are required." });
    }

    const fallback = `Subject: ${purpose}\n\nHi ${recipient},\n\nI hope you are doing well. I am writing regarding ${purpose}.\n\nI would appreciate your guidance and any next steps you recommend.\n\nThank you for your time.\n\nBest regards,\nYour Name`;
    const output = await aiText(
      "email generation",
      `Write one high-quality ${tone} email to ${recipient} for this purpose: ${purpose}.
Use this structure exactly:
1) Subject line
2) Greeting
3) Context in 1-2 lines
4) Clear ask
5) Polite close
Keep total length under 170 words and avoid generic filler.`,
      fallback,
      { temperature: 0.35, maxTokens: 450 }
    );

    return res.status(200).json({ output });
  } catch (error) {
    return respondError(res, "Failed to generate email.", error);
  }
};

const generateAssignmentHelp = async (req, res) => {
  try {
    const topic = clampText(req.body.topic, 200);

    if (!topic) {
      return res.status(400).json({ message: "topic is required." });
    }

    const fallback = `# ${topic}\n\n## Introduction\nBrief context and why this topic matters.\n\n## Key Points\n- Core idea 1\n- Core idea 2\n- Real-world example\n\n## Conclusion\nSummarize insights and practical implications.`;
    const output = await aiText(
      "assignment drafting",
      `Create a concise assignment draft on: ${topic}
Output sections exactly as:
- Introduction
- Core Concepts (3 bullets)
- Real-world Application
- Challenges
- Conclusion
Use simple, factual language suitable for college submissions.`,
      fallback,
      { temperature: 0.3, maxTokens: 700 }
    );

    return res.status(200).json({ output });
  } catch (error) {
    return respondError(res, "Failed to generate assignment help.", error);
  }
};

const generateResumePolish = async (req, res) => {
  try {
    const text = clampText(req.body.text, 1800);
    if (!text) {
      return res.status(400).json({ message: "text is required." });
    }

    const fallback = `Improved resume bullets:\n- Delivered feature with measurable impact\n- Collaborated cross-functionally to reduce blockers\n- Optimized process resulting in faster delivery`;
    const output = await aiText(
      "resume optimization",
      `Rewrite these resume points for ATS and recruiter clarity:
${text}
Rules:
- Start each bullet with a strong action verb
- Add measurable impact where possible
- Keep each bullet under 24 words
- Return 4 to 8 bullets only`,
      fallback,
      { temperature: 0.25, maxTokens: 700 }
    );

    return res.status(200).json({ output });
  } catch (error) {
    return respondError(res, "Failed to polish resume.", error);
  }
};

const generateCoverLetter = async (req, res) => {
  try {
    const role = clampText(req.body.role, 100);
    const company = clampText(req.body.company, 120);
    const experience = clampText(req.body.experience, 1200);
    if (!role || !company || !experience) {
      return res.status(400).json({ message: "role, company and experience are required." });
    }

    const fallback = `Dear Hiring Team at ${company},\n\nI am excited to apply for ${role}. My background includes ${experience}. I am confident this aligns with your needs.\n\nSincerely,\nYour Name`;
    const output = await aiText(
      "cover letter generation",
      `Write a tailored cover letter for role: ${role} at ${company} using this experience: ${experience}
Constraints:
- 3 short paragraphs
- Mention role-company fit clearly
- Include 2 concrete achievements from provided experience
- End with a direct call to action`,
      fallback,
      { temperature: 0.35, maxTokens: 650 }
    );

    return res.status(200).json({ output });
  } catch (error) {
    return respondError(res, "Failed to generate cover letter.", error);
  }
};

const generateLinkedInHeadline = async (req, res) => {
  try {
    const skills = clampText(req.body.skills, 200);
    const role = clampText(req.body.role, 100);
    if (!skills || !role) {
      return res.status(400).json({ message: "skills and role are required." });
    }

    const fallback = `1) ${role} | ${skills} | Building impact\n2) ${role} with ${skills}\n3) Problem-solver in ${skills}`;
    const output = await aiText(
      "linkedin headline generation",
      `Generate 10 distinct LinkedIn headline options for role ${role} with skills ${skills}.
Rules:
- Max 120 characters each
- Mix authority, impact, and specialization styles
- No hashtags or emojis
- Return as numbered list only`,
      fallback,
      { temperature: 0.45, maxTokens: 500 }
    );

    return res.status(200).json({ output });
  } catch (error) {
    return respondError(res, "Failed to generate LinkedIn headlines.", error);
  }
};

const generateInterviewQuestions = async (req, res) => {
  try {
    const role = clampText(req.body.role, 120);
    if (!role) {
      return res.status(400).json({ message: "role is required." });
    }

    const fallback = `Q1: Describe a challenging bug you fixed.\nA1: Explain context, diagnosis, fix, and result.\n\nQ2: How do you prioritize tasks?\nA2: Use impact, urgency, and dependencies.`;
    const output = await aiText(
      "interview preparation",
      `Generate interview prep for ${role}.
Return exactly 8 items. Each item must contain:
- Question
- What interviewer evaluates
- Model answer in 3-5 lines
Focus on practical, high-signal questions.`,
      fallback,
      { temperature: 0.35, maxTokens: 900 }
    );

    return res.status(200).json({ output });
  } catch (error) {
    return respondError(res, "Failed to generate interview questions.", error);
  }
};

const generateStudyPlan = async (req, res) => {
  try {
    const goals = clampText(req.body.goals, 220);
    const time = clampText(req.body.time, 120);
    if (!goals || !time) {
      return res.status(400).json({ message: "goals and time are required." });
    }

    const fallback = `Weekly plan for ${goals} (${time}):\n- Mon: Concepts\n- Tue: Practice\n- Wed: Mini project\n- Thu: Revision\n- Fri: Mock test\n- Sat: Build\n- Sun: Review`;
    const output = await aiText(
      "study planning",
      `Create a 4-week plan for goal: ${goals}, available time: ${time}.
Output for each week:
- Focus
- Daily routine
- Practice tasks
- Milestone check
Keep it realistic for students.`,
      fallback,
      { temperature: 0.3, maxTokens: 850 }
    );

    return res.status(200).json({ output });
  } catch (error) {
    return respondError(res, "Failed to generate study plan.", error);
  }
};

const generateCode = async (req, res) => {
  try {
    const description = clampText(req.body.description, 600);
    const language = clampText(req.body.language, 50);
    if (!description || !language) {
      return res.status(400).json({ message: "description and language are required." });
    }

    const fallback = `// ${language} solution\n// ${description}\nfunction solve() {\n  // TODO\n}`;
    const output = await aiText(
      "code generation",
      `Generate a correct ${language} solution for: ${description}
Requirements:
- Include only one complete runnable snippet
- Add brief comments only where logic is non-obvious
- Mention time and space complexity at end
- Avoid pseudo code`,
      fallback,
      { temperature: 0.2, maxTokens: 900 }
    );

    return res.status(200).json({ output });
  } catch (error) {
    return respondError(res, "Failed to generate code.", error);
  }
};

const checkGrammar = async (req, res) => {
  try {
    const text = clampText(req.body.text, 2000);
    if (!text) {
      return res.status(400).json({ message: "text is required." });
    }

    const fallback = `Corrected text:\n${text}`;
    const output = await aiText(
      "grammar correction",
      `Correct grammar, punctuation, and clarity for this text:
${text}
Return exactly:
1) Corrected text
2) Top 3 improvements made`,
      fallback,
      { temperature: 0.2, maxTokens: 650 }
    );

    return res.status(200).json({ output });
  } catch (error) {
    return respondError(res, "Failed to check grammar.", error);
  }
};

const summarizeNotes = async (req, res) => {
  try {
    const text = clampText(req.body.text, 2500);
    if (!text) {
      return res.status(400).json({ message: "text is required." });
    }

    const fallback = `Summary:\n- Key idea 1\n- Key idea 2\n- Action point`;
    const output = await aiText(
      "note summarization",
      `Summarize the following notes:
${text}
Return exactly:
- 5 bullet key points
- 3 revision flashcards (Q/A)
- 1 short conclusion`,
      fallback,
      { temperature: 0.3, maxTokens: 850 }
    );

    return res.status(200).json({ output });
  } catch (error) {
    return respondError(res, "Failed to summarize notes.", error);
  }
};

const assistantChat = async (req, res) => {
  try {
    const query = clampText(req.body.query, 1200);
    if (!query) {
      return res.status(400).json({ message: "query is required." });
    }

    const fallback = "I can help with planning, learning, and task execution. Share your goal and constraints.";
    const output = await aiText(
      "chat assistance",
      `Respond to this user query with concise actionable guidance:
${query}
Response format:
1) Direct answer
2) 3 practical next steps
3) 1 common mistake to avoid`,
      fallback,
      { temperature: 0.35, maxTokens: 700 }
    );

    return res.status(200).json({ output });
  } catch (error) {
    return respondError(res, "Failed to get assistant response.", error);
  }
};

const generateSmartGoalPlan = async (req, res) => {
  try {
    const goal = clampText(req.body.goal, 180);
    const duration = clampText(req.body.duration, 80);
    if (!goal || !duration) {
      return res.status(400).json({ message: "goal and duration are required." });
    }

    const fallback = `SMART Plan for ${goal} (${duration}):\n- Specific: Define one measurable outcome\n- Measurable: Track weekly progress\n- Achievable: Break into small milestones\n- Relevant: Align with your target role\n- Time-bound: Weekly review and final deadline`;
    const output = await aiText(
      "smart goal planning",
      `Create a SMART plan for goal: ${goal} with duration: ${duration}.
Output exactly:
- Specific objective
- Success metrics
- Week-by-week milestones
- Risks and mitigation
- Final review checklist`,
      fallback,
      { temperature: 0.28, maxTokens: 850 }
    );

    return res.status(200).json({ output });
  } catch (error) {
    return respondError(res, "Failed to generate SMART goal plan.", error);
  }
};

const generateProjectIdeas = async (req, res) => {
  try {
    const domain = clampText(req.body.domain, 120);
    const skills = clampText(req.body.skills, 220);
    const level = clampText(req.body.level, 60);
    if (!domain || !skills || !level) {
      return res.status(400).json({ message: "domain, skills and level are required." });
    }

    const fallback = `Project Ideas (${domain} | ${level}):\n1) Portfolio-grade project using ${skills}\n2) Real-world automation mini app\n3) Data-backed dashboard with deploy link`;
    const output = await aiText(
      "project ideation",
      `Generate 10 project ideas for domain ${domain}, level ${level}, using skills ${skills}.
For each idea provide:
- Title
- Problem solved
- Core stack
- Complexity tag (Low/Medium/High)
- One differentiator for resume impact`,
      fallback,
      { temperature: 0.4, maxTokens: 950 }
    );

    return res.status(200).json({ output });
  } catch (error) {
    return respondError(res, "Failed to generate project ideas.", error);
  }
};

const generateImagePrompt = async (req, res) => {
  try {
    const prompt = clampText(req.body.prompt, 500);
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
    if (process.env.NODE_ENV !== "production") {
      console.warn(`Image fallback used: ${error.message}`);
    }

    return res.status(200).json({
      output: "Image provider is currently unavailable. Please retry in a moment.",
      imageBase64: null,
    });
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

const editPdfFrontPage = async (req, res) => {
  try {
    const pdfFile = req.files?.file?.[0] || null;
    const logoFile = req.files?.logo?.[0] || null;

    if (!pdfFile) {
      return res.status(400).json({ message: "PDF file is required." });
    }

    const {
      collegeName,
      departmentName,
      assignmentTitle,
      subjectName,
      submittedBy,
      rollNumber,
      semester,
      submittedTo,
      submissionDate,
      template,
      customElements,
    } = req.body;

    let parsedCustomElements = [];
    try {
      parsedCustomElements = customElements ? JSON.parse(customElements) : [];
      if (!Array.isArray(parsedCustomElements)) {
        parsedCustomElements = [];
      }
    } catch {
      parsedCustomElements = [];
    }

    const selectedTemplate = ["minimal", "classic", "modern"].includes(template) ? template : "modern";

    const source = await PDFDocument.load(pdfFile.buffer);
    const pages = source.getPages();
    const firstPage = pages[0];

    if (!firstPage) {
      return res.status(400).json({ message: "The uploaded PDF has no pages." });
    }

    const titleFont = await source.embedFont(StandardFonts.HelveticaBold);
    const bodyFont = await source.embedFont(StandardFonts.Helvetica);

    const { width, height } = firstPage.getSize();
    const panelWidth = Math.min(500, width - 72);
    const panelHeight = Math.min(420, height - 96);
    const panelX = (width - panelWidth) / 2;
    const panelY = (height - panelHeight) / 2;

    const templatePalette = {
      minimal: {
        panelBg: rgb(1, 1, 1),
        panelOpacity: 0.95,
        border: rgb(0.72, 0.78, 0.87),
        title: rgb(0.1, 0.18, 0.28),
        subtitle: rgb(0.28, 0.34, 0.45),
        accent: rgb(0.7, 0.74, 0.82),
      },
      classic: {
        panelBg: rgb(0.99, 0.97, 0.93),
        panelOpacity: 0.96,
        border: rgb(0.35, 0.28, 0.16),
        title: rgb(0.22, 0.15, 0.08),
        subtitle: rgb(0.36, 0.27, 0.18),
        accent: rgb(0.56, 0.46, 0.31),
      },
      modern: {
        panelBg: rgb(1, 1, 1),
        panelOpacity: 0.93,
        border: rgb(0.12, 0.25, 0.5),
        title: rgb(0.07, 0.18, 0.34),
        subtitle: rgb(0.22, 0.3, 0.45),
        accent: rgb(0.7, 0.78, 0.92),
      },
    };

    const palette = templatePalette[selectedTemplate];

    firstPage.drawRectangle({
      x: panelX,
      y: panelY,
      width: panelWidth,
      height: panelHeight,
      color: palette.panelBg,
      opacity: palette.panelOpacity,
      borderColor: palette.border,
      borderWidth: selectedTemplate === "minimal" ? 1 : 2,
    });

    if (selectedTemplate === "modern") {
      firstPage.drawRectangle({
        x: panelX,
        y: panelY + panelHeight - 12,
        width: panelWidth,
        height: 12,
        color: rgb(0.13, 0.34, 0.72),
      });
    }

    if (logoFile) {
      try {
        let embeddedLogo;
        const contentType = logoFile.mimetype || "";
        if (contentType.includes("png")) {
          embeddedLogo = await source.embedPng(logoFile.buffer);
        } else {
          embeddedLogo = await source.embedJpg(logoFile.buffer);
        }

        const maxLogoWidth = 90;
        const maxLogoHeight = 90;
        const logoDims = embeddedLogo.scale(1);
        const widthRatio = maxLogoWidth / logoDims.width;
        const heightRatio = maxLogoHeight / logoDims.height;
        const ratio = Math.min(widthRatio, heightRatio, 1);
        const drawWidth = logoDims.width * ratio;
        const drawHeight = logoDims.height * ratio;

        firstPage.drawImage(embeddedLogo, {
          x: panelX + panelWidth - drawWidth - 26,
          y: panelY + panelHeight - drawHeight - 26,
          width: drawWidth,
          height: drawHeight,
        });
      } catch {
        // Ignore logo decode failures and continue PDF generation.
      }
    }

    const drawCentered = (text, y, font, size, color = palette.title) => {
      const safe = String(text || "").trim();
      if (!safe) {
        return;
      }
      const textWidth = font.widthOfTextAtSize(safe, size);
      const textX = panelX + (panelWidth - textWidth) / 2;
      firstPage.drawText(safe, { x: textX, y, size, font, color });
    };

    drawCentered(collegeName || "College Name", panelY + panelHeight - 58, titleFont, 22, palette.title);
    drawCentered(departmentName || "Department Name", panelY + panelHeight - 86, bodyFont, 14, palette.subtitle);

    const dividerY = panelY + panelHeight - 108;
    firstPage.drawLine({
      start: { x: panelX + 32, y: dividerY },
      end: { x: panelX + panelWidth - 32, y: dividerY },
      thickness: 1,
      color: palette.accent,
    });

    drawCentered(assignmentTitle || "Assignment / Project Title", dividerY - 52, titleFont, 20, palette.title);
    drawCentered(`Subject: ${subjectName || "N/A"}`, dividerY - 82, bodyFont, 13, palette.subtitle);

    const detailsLeftX = panelX + 46;
    const detailsStartY = dividerY - 138;
    const detailsGap = 28;
    const drawLabelValue = (label, value, rowIndex) => {
      const y = detailsStartY - rowIndex * detailsGap;
      firstPage.drawText(`${label}:`, {
        x: detailsLeftX,
        y,
        size: 12,
        font: titleFont,
        color: palette.title,
      });
      firstPage.drawText(String(value || "-"), {
        x: detailsLeftX + 112,
        y,
        size: 12,
        font: bodyFont,
        color: palette.subtitle,
      });
    };

    drawLabelValue("Submitted By", submittedBy, 0);
    drawLabelValue("Roll Number", rollNumber, 1);
    drawLabelValue("Semester", semester, 2);
    drawLabelValue("Submitted To", submittedTo, 3);
    drawLabelValue("Submission Date", submissionDate, 4);

    parsedCustomElements.forEach((element) => {
      const name = String(element?.name || "").trim();
      const text = String(element?.text || "").trim();
      if (!name || !text) {
        return;
      }

      const xPct = Math.max(5, Math.min(95, Number(element?.x || 50)));
      const yPct = Math.max(10, Math.min(95, Number(element?.y || 70)));
      const size = Math.max(8, Math.min(28, Number(element?.size || 12)));

      const drawX = panelX + (panelWidth * xPct) / 100;
      const drawY = panelY + (panelHeight * yPct) / 100;
      firstPage.drawText(`${name}: ${text}`, {
        x: drawX,
        y: drawY,
        size,
        font: bodyFont,
        color: palette.subtitle,
      });
    });

    drawCentered("Generated by ExplainX PDF Front Page Editor", panelY + 18, bodyFont, 10, palette.subtitle);

    const bytes = await source.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=front-page-edited.pdf");
    return res.send(Buffer.from(bytes));
  } catch (error) {
    return respondError(res, "Failed to edit PDF front page.", error);
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
  editPdfFrontPage,
};
