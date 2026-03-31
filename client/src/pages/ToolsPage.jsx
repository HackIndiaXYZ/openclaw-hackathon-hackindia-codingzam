import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMode } from "../context/useMode";
import { getModeResponse } from "../utils/modeResponse";
import { useLanguage } from "../context/useLanguage";
import { pdfApi, toolApi } from "../services/toolApi";
import { addMomentum, recordCounter } from "../utils/userActivity";

const toolSections = [
  { key: "email-generator", icon: "✉", title: "Email Generator" },
  { key: "pdf-tools", icon: "📄", title: "PDF Tools" },
  { key: "pdf-front-page-editor", icon: "🧾", title: "PDF Front Page Editor" },
  { key: "assignment-helper", icon: "🧠", title: "Assignment Helper" },
  { key: "resume-polisher", icon: "📃", title: "Resume Polisher" },
  { key: "cover-letter-builder", icon: "📝", title: "Cover Letter Builder" },
  { key: "linkedin-headline-lab", icon: "💼", title: "LinkedIn Headline" },
  { key: "interview-question-bank", icon: "🎯", title: "Interview Q&A" },
  { key: "study-plan-scheduler", icon: "📅", title: "Study Plan" },
  { key: "code-generator", icon: "💻", title: "Code Generator" },
  { key: "grammar-checker", icon: "✅", title: "Grammar Checker" },
  { key: "notes-summarizer", icon: "📚", title: "Notes Summarizer" },
  { key: "smart-goal-plan", icon: "🎯", title: "SMART Goal Planner" },
  { key: "project-ideas", icon: "🚀", title: "Project Ideas" },
  { key: "password-generator", icon: "🔐", title: "Password Generator" },
  { key: "json-formatter", icon: "🧾", title: "JSON Formatter" },
  { key: "qr-generator", icon: "🔳", title: "QR Generator" },
  { key: "text-to-speech", icon: "🔊", title: "Text To Speech" },
  { key: "voice-to-text", icon: "🎙", title: "Voice to Text" },
  { key: "timestamp-converter", icon: "⏱", title: "Timestamp Converter" },
  { key: "cgpa-calculator", icon: "📊", title: "CGPA Calculator" },
  { key: "attendance-calculator", icon: "📌", title: "Attendance Calculator" },
  { key: "citation-generator", icon: "📚", title: "Citation Generator" },
  { key: "exam-planner", icon: "🗓", title: "Exam Planner" },
];

const initialForms = {
  recipient: "",
  purpose: "",
  tone: "Professional",
  topic: "",
  text: "",
  role: "",
  skills: "",
  submittedTo: "",
  assignmentTitle: "",
  subjectName: "",
  semester: "",
  rollNumber: "",
  submissionDate: "",
  collegeName: "",
  departmentName: "",
  frontTemplate: "modern",
  logoFile: null,
  customElementName: "",
  customElementText: "",
  customElementX: 50,
  customElementY: 70,
  customElementSize: 12,
  customElements: [],
  semesterGpas: "",
  semesterCredits: "",
  attendedClasses: "",
  totalClasses: "",
  targetAttendance: "75",
  citeStyle: "APA",
  citeAuthor: "",
  citeTitle: "",
  citeYear: "",
  citeSource: "",
  citeUrl: "",
  examSubjects: "",
  examStartDate: "",
  revisionHoursPerDay: "3",
  goals: "",
  time: "",
  company: "",
  experience: "",
  description: "",
  language: "JavaScript",
  prompt: "",
  query: "",
  goal: "",
  duration: "8 weeks",
  domain: "Web Development",
  level: "Intermediate",
  passwordLength: 14,
  includeUppercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeAmbiguous: true,
  avoidSequential: true,
  jsonInput: "",
  jsonMode: "beautify",
  qrText: "",
  qrSize: "512",
  speechText: "",
  speechRate: 1,
  speechPitch: 1,
  speechVoice: "auto",
  voiceLanguage: "auto",
  voiceTimeoutSec: 10,
  voiceAutoRetry: true,
  unixTimestamp: "",
  dateTimeInput: "",
  pdfPage: 1,
  pdfMode: "compress",
  overlayText: "",
  pdfFile: null,
  mergeFiles: [],
};

const outputHistoryKey = "explainx-tool-history";

function ToolsPage() {
  const { mode } = useMode();
  const { language } = useLanguage();
  const { toolKey } = useParams();
  const navigate = useNavigate();
  const [forms, setForms] = useState(initialForms);
  const [output, setOutput] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [availableVoices, setAvailableVoices] = useState([]);
  const [history, setHistory] = useState(() => {
    try {
      const raw = localStorage.getItem(outputHistoryKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const selected = useMemo(
    () => toolSections.find((item) => item.key === toolKey) || toolSections[0],
    [toolKey]
  );

  useEffect(() => {
    if (!window.speechSynthesis) {
      return undefined;
    }

    const syncVoices = () => {
      const voices = window.speechSynthesis.getVoices() || [];
      setAvailableVoices(voices.filter((voice) => !!voice.lang));
    };

    syncVoices();
    window.speechSynthesis.addEventListener("voiceschanged", syncVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", syncVoices);
    };
  }, []);

  const setField = (name, value) => {
    setForms((prev) => ({ ...prev, [name]: value }));
  };

  const persistHistory = (entry) => {
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, 20);
      localStorage.setItem(outputHistoryKey, JSON.stringify(next));
      return next;
    });
  };

  const buildLocalFallbackOutput = (key) => {
    if (key === "email-generator") {
      return `Subject: ${forms.purpose || "Following up"}

Hi ${forms.recipient || "there"},

I hope you are doing well. I am writing regarding ${forms.purpose || "our previous conversation"}.

I wanted to quickly follow up and check if there are any updates or next steps I should complete from my side.

If helpful, I can also share a brief summary of my recent progress and timeline.

Thank you for your time and support.

Best regards,
Your Name

Suggested edit tips:
- Add one sentence with your achievement/context.
- Keep total email under 170 words.
- End with one clear call to action.`;
    }

    if (key === "assignment-helper") {
      return `# ${forms.topic || "Assignment Topic"}

## Introduction
${forms.topic || "This topic"} is important because it affects technology, society, and future innovation. This section should define the concept clearly and set the scope.

## Core Concepts
- Concept 1: Explain the fundamental idea in simple language.
- Concept 2: Mention one model/framework related to the topic.
- Concept 3: Add one practical example from current industry.

## Real-world Application
Describe where this concept is used in products, businesses, or public systems. Include one short use case.

## Challenges and Limitations
- Implementation cost/time
- Ethical or privacy concerns
- Skill or infrastructure gap

## Conclusion
Summarize the key takeaway, current impact, and one future direction.

Submission checklist:
- Add 2 references
- Add one diagram/table
- Keep headings consistent`;
    }

    if (key === "resume-polisher") {
      return `Polished Resume Bullets:
- Led implementation of ${forms.text || "a high-impact feature"}, improving measurable outcomes and delivery quality.
- Collaborated with cross-functional stakeholders to ship features on schedule with reduced blocker time.
- Improved performance and maintainability by standardizing reusable components and workflows.
- Documented solutions and created handover notes to accelerate team onboarding.

ATS Improvement Tips:
- Start bullets with action verbs.
- Add one metric per bullet if possible.
- Keep each bullet under 24 words.`;
    }

    if (key === "cover-letter-builder") {
      return `Dear Hiring Team at ${forms.company || "your company"},

I am excited to apply for the ${forms.role || "target role"} position. My background includes ${forms.experience || "relevant project work and internships"}, where I focused on practical implementation, clear communication, and measurable outcomes.

In recent work, I improved delivery quality by structuring tasks, validating edge cases, and collaborating closely with stakeholders. I am confident this execution style aligns with your team expectations.

I would welcome the opportunity to discuss how I can contribute to ${forms.company || "your organization"}.

Sincerely,
Your Name

Customization tips:
- Replace one paragraph with company-specific product alignment.
- Add one quantified achievement.`;
    }

    if (key === "linkedin-headline-lab") {
      return `LinkedIn Headline Options:
1) ${forms.role || "Developer"} | ${forms.skills || "Modern Web Stack"} | Building practical products
2) ${forms.role || "Engineer"} focused on impact-driven solutions and scalable delivery
3) Turning ${forms.skills || "technical skills"} into measurable business outcomes
4) ${forms.role || "Tech Professional"} | Problem Solving | Product Execution
5) Building user-first solutions with ${forms.skills || "engineering best practices"}

Profile boost tips:
- Use one headline with role + niche + impact.
- Keep under 120 characters for full visibility.`;
    }

    if (key === "interview-question-bank") {
      return `Interview Prep Set for ${forms.role || "your role"}:

Q1) Tell me about a challenging project.
A1) Use STAR: Situation, Task, Action, Result. Mention one measurable result.

Q2) How do you debug production issues?
A2) Reproduce issue, isolate module, inspect logs/metrics, patch safely, validate with tests, monitor post-release.

Q3) How do you prioritize tasks?
A3) Impact first, then urgency, then dependency risk. Keep stakeholders updated.

Q4) How do you handle disagreement in code review?
A4) Align on objective criteria: correctness, performance, maintainability, and product impact.

Q5) Why should we hire you?
A5) Connect your strongest 2 skills to team needs and outcomes.

Practice tip: Record and review 2-minute answers for each question.`;
    }

    if (key === "study-plan-scheduler") {
      return `4-Week Plan for ${forms.goals || "your goal"} (${forms.time || "2 hours/day"})

Week 1: Core concepts
- Day 1-4: Learn fundamentals
- Day 5-6: Solve basic problems
- Day 7: Review and summary notes

Week 2: Applied practice
- Solve medium difficulty tasks
- Build one mini feature/project
- Weekly checkpoint test

Week 3: Advanced + project
- Advanced topics and edge cases
- Continue project and document learnings
- Peer/mock discussion

Week 4: Interview + final polish
- Mock tests + timed practice
- Revise mistakes log
- Final portfolio/notes cleanup`;
    }

    if (key === "code-generator") {
      return `// ${forms.language || "JavaScript"}
// Task: ${forms.description || "Implement a utility function"}

function solve(input) {
  if (input == null) {
    return null;
  }

  // TODO: apply core logic here
  const result = input;

  return result;
}

// Complexity
// Time: O(n) based on input size
// Space: O(1) auxiliary space

Implementation tips:
1) Write sample I/O first.
2) Add edge-case checks before optimization.
3) Keep helper functions small and testable.`;
    }

    if (key === "grammar-checker") {
      return `Corrected Text:
${forms.text || "Provide your text to improve grammar and clarity."}

Improvements to apply manually:
- Use shorter sentences for readability.
- Replace vague words with specific verbs.
- Keep tense consistent across the paragraph.
- Remove repeated filler words.`;
    }

    if (key === "notes-summarizer") {
      return `Summary:
- Main concept explained in simple terms
- Supporting mechanism or process
- One real example
- Key exam/interview revision point

Flashcards:
Q1: What is the core definition?
A1: Write one-line definition.
Q2: Where is it used?
A2: Mention one practical scenario.
Q3: Common mistake?
A3: Note one misunderstanding to avoid.`;
    }

    if (key === "smart-goal-plan") {
      return `SMART Plan for ${forms.goal || "your goal"} (${forms.duration || "8 weeks"})\n- Specific: Define one clear deliverable\n- Measurable: Weekly metric tracking\n- Achievable: Split into milestones\n- Relevant: Align with target role\n- Time-bound: Deadline and review date`;
    }

    if (key === "project-ideas") {
      return `Project Ideas (${forms.domain || "General"} | ${forms.level || "Intermediate"})

1) Portfolio-grade app using ${forms.skills || "your stack"}
- Problem: organize and showcase real work
- Deliverable: deployed app + README + demo video

2) Automation tool for repetitive workflow
- Problem: manual time loss
- Deliverable: script/service + logs + metrics

3) Data dashboard with insights
- Problem: unstructured data visibility
- Deliverable: cleaned dataset + analytics + interactive charts

Execution plan:
- Week 1: problem + scope
- Week 2: build MVP
- Week 3: polish + deploy
- Week 4: documentation + resume bullets`;
    }

    return "Generated a local fallback response because AI service is temporarily unavailable.";
  };

  const runApiWithFallback = async (key, apiCall) => {
    try {
      return await apiCall();
    } catch (apiError) {
      const status = apiError?.response?.status;
      if (status === 401) {
        throw new Error("Please login first to use AI tools.");
      }

      return {
        data: {
          output: buildLocalFallbackOutput(key),
        },
      };
    }
  };

  const addCustomFrontElement = () => {
    const name = String(forms.customElementName || "").trim();
    const text = String(forms.customElementText || "").trim();
    if (!name || !text) {
      setError("Provide custom element name and text before adding.");
      return;
    }

    const x = Math.max(5, Math.min(95, Number(forms.customElementX || 50)));
    const y = Math.max(10, Math.min(95, Number(forms.customElementY || 70)));
    const size = Math.max(8, Math.min(28, Number(forms.customElementSize || 12)));

    setForms((prev) => ({
      ...prev,
      customElements: [
        ...prev.customElements,
        { id: `el-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, name, text, x, y, size },
      ],
      customElementName: "",
      customElementText: "",
    }));
    setSuccess("Custom element added on canvas preview.");
  };

  const removeCustomFrontElement = (id) => {
    setForms((prev) => ({
      ...prev,
      customElements: prev.customElements.filter((element) => element.id !== id),
    }));
  };

  const updateCustomFrontElement = (id, patch) => {
    setForms((prev) => ({
      ...prev,
      customElements: prev.customElements.map((element) =>
        element.id === id ? { ...element, ...patch } : element
      ),
    }));
  };

  const handleFrontCanvasClick = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const xPct = ((event.clientX - bounds.left) / bounds.width) * 100;
    const yPct = ((event.clientY - bounds.top) / bounds.height) * 100;
    setForms((prev) => ({
      ...prev,
      customElementX: Math.round(Math.max(5, Math.min(95, xPct))),
      customElementY: Math.round(Math.max(10, Math.min(95, yPct))),
    }));
  };

  const fillSample = () => {
    if (selected.key === "email-generator") {
      setForms((prev) => ({ ...prev, recipient: "Recruiter", purpose: "Follow-up after internship interview", tone: "Professional" }));
    } else if (selected.key === "pdf-front-page-editor") {
      setForms((prev) => ({
        ...prev,
        collegeName: "ABC Institute of Technology",
        departmentName: "Department of Computer Science",
        assignmentTitle: "Mini Project Report",
        subjectName: "Web Development",
        submittedBy: "Aarav Singh",
        rollNumber: "CS-23124",
        semester: "6th Semester",
        submittedTo: "Prof. Sharma",
        submissionDate: "2026-03-29",
        frontTemplate: "modern",
        customElementName: "Project Guide",
        customElementText: "Dr. Neha Kapoor",
        customElementX: 50,
        customElementY: 78,
        customElementSize: 12,
        customElements: [
          {
            id: `el-${Date.now()}`,
            name: "Batch",
            text: "2022-2026",
            x: 50,
            y: 84,
            size: 12,
          },
        ],
      }));
    } else if (selected.key === "assignment-helper") {
      setForms((prev) => ({ ...prev, topic: "Future of AI in Healthcare" }));
    } else if (selected.key === "resume-polisher") {
      setForms((prev) => ({ ...prev, text: "Built dashboard for 1000+ users and improved retention." }));
    } else if (selected.key === "cover-letter-builder") {
      setForms((prev) => ({ ...prev, role: "Frontend Engineer", company: "Adobe", experience: "Built React apps, improved load speed, led UI redesign." }));
    } else if (selected.key === "linkedin-headline-lab") {
      setForms((prev) => ({ ...prev, role: "Data Analyst", skills: "SQL, Python, Power BI" }));
    } else if (selected.key === "interview-question-bank") {
      setForms((prev) => ({ ...prev, role: "Backend Developer" }));
    } else if (selected.key === "study-plan-scheduler") {
      setForms((prev) => ({ ...prev, goals: "Placement prep", time: "2 hours/day" }));
    } else if (selected.key === "code-generator") {
      setForms((prev) => ({ ...prev, description: "Create throttled scroll handler", language: "JavaScript" }));
    } else if (selected.key === "grammar-checker") {
      setForms((prev) => ({ ...prev, text: "i has done many project and i am quick lerner" }));
    } else if (selected.key === "notes-summarizer") {
      setForms((prev) => ({ ...prev, text: "OSI model has 7 layers and each serves protocol-specific abstraction..." }));
    } else if (selected.key === "smart-goal-plan") {
      setForms((prev) => ({ ...prev, goal: "Crack SDE internship", duration: "10 weeks" }));
    } else if (selected.key === "project-ideas") {
      setForms((prev) => ({ ...prev, domain: "AI/ML", skills: "Python, FastAPI, React", level: "Intermediate" }));
    } else if (selected.key === "password-generator") {
      setForms((prev) => ({
        ...prev,
        passwordLength: 16,
        includeUppercase: true,
        includeNumbers: true,
        includeSymbols: true,
        excludeAmbiguous: true,
        avoidSequential: true,
      }));
    } else if (selected.key === "json-formatter") {
      setForms((prev) => ({
        ...prev,
        jsonInput: '{"name":"Alex","skills":["React","Node"],"active":true}',
        jsonMode: "beautify",
      }));
    } else if (selected.key === "qr-generator") {
      setForms((prev) => ({ ...prev, qrText: "https://openclaw-hackathon-hackindia-codingzam.onrender.com", qrSize: "512" }));
    } else if (selected.key === "text-to-speech") {
      setForms((prev) => ({ ...prev, speechText: "Welcome to ExplainX quick tools demo." }));
    } else if (selected.key === "voice-to-text") {
      setForms((prev) => ({ ...prev, voiceLanguage: "en-US", voiceTimeoutSec: 10, voiceAutoRetry: true }));
    } else if (selected.key === "timestamp-converter") {
      setForms((prev) => ({ ...prev, unixTimestamp: "1711670400", dateTimeInput: "2026-03-29T10:30" }));
    } else if (selected.key === "cgpa-calculator") {
      setForms((prev) => ({ ...prev, semesterGpas: "8.1, 8.4, 8.8, 9.0", semesterCredits: "20, 22, 21, 23" }));
    } else if (selected.key === "attendance-calculator") {
      setForms((prev) => ({ ...prev, attendedClasses: "54", totalClasses: "80", targetAttendance: "75" }));
    } else if (selected.key === "citation-generator") {
      setForms((prev) => ({
        ...prev,
        citeStyle: "APA",
        citeAuthor: "Sharma, A.",
        citeTitle: "Machine Learning in Healthcare",
        citeYear: "2025",
        citeSource: "International Journal of AI Systems",
        citeUrl: "https://example.com/ml-healthcare",
      }));
    } else if (selected.key === "exam-planner") {
      setForms((prev) => ({
        ...prev,
        examSubjects: "DSA, DBMS, OS, CN",
        examStartDate: "2026-04-20",
        revisionHoursPerDay: "3",
      }));
    }
  };

  const copyOutput = async () => {
    if (!output) {
      return;
    }
    try {
      await navigator.clipboard.writeText(output);
      setSuccess("Output copied to clipboard.");
    } catch {
      setError("Could not copy output.");
    }
  };

  const downloadOutput = () => {
    if (!output) {
      return;
    }
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selected.key}-output.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadGeneratedImage = async () => {
    const imageSrc = imageBase64 ? `data:image/png;base64,${imageBase64}` : imageUrl;
    if (!imageSrc) {
      return;
    }

    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${selected.key}-${Date.now()}.png`;
      link.click();
      URL.revokeObjectURL(url);
      setSuccess("Image downloaded successfully.");
    } catch {
      setError("Could not download image automatically. Please open image in a new tab.");
      window.open(imageSrc, "_blank", "noopener,noreferrer");
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setOutput("");
    setImageBase64("");
    setImageUrl("");

    try {
      let result;

      if (selected.key === "email-generator") {
        result = await runApiWithFallback("email-generator", () => toolApi.generateEmail({
          recipient: forms.recipient,
          purpose: forms.purpose,
          tone: forms.tone,
        }));
      } else if (selected.key === "assignment-helper") {
        result = await runApiWithFallback("assignment-helper", () => toolApi.assignmentHelper({ topic: forms.topic }));
      } else if (selected.key === "resume-polisher") {
        result = await runApiWithFallback("resume-polisher", () => toolApi.resumePolisher({ text: forms.text }));
      } else if (selected.key === "cover-letter-builder") {
        result = await runApiWithFallback("cover-letter-builder", () => toolApi.coverLetterBuilder({
          role: forms.role,
          company: forms.company,
          experience: forms.experience,
        }));
      } else if (selected.key === "linkedin-headline-lab") {
        result = await runApiWithFallback("linkedin-headline-lab", () => toolApi.linkedinHeadline({ role: forms.role, skills: forms.skills }));
      } else if (selected.key === "interview-question-bank") {
        result = await runApiWithFallback("interview-question-bank", () => toolApi.interviewQuestionBank({ role: forms.role }));
      } else if (selected.key === "study-plan-scheduler") {
        result = await runApiWithFallback("study-plan-scheduler", () => toolApi.studyPlan({ goals: forms.goals, time: forms.time }));
      } else if (selected.key === "code-generator") {
        result = await runApiWithFallback("code-generator", () => toolApi.codeGenerator({ description: forms.description, language: forms.language }));
      } else if (selected.key === "grammar-checker") {
        result = await runApiWithFallback("grammar-checker", () => toolApi.grammarChecker({ text: forms.text }));
      } else if (selected.key === "notes-summarizer") {
        result = await runApiWithFallback("notes-summarizer", () => toolApi.notesSummarizer({ text: forms.text }));
      } else if (selected.key === "smart-goal-plan") {
        result = await runApiWithFallback("smart-goal-plan", () => toolApi.smartGoalPlan({ goal: forms.goal, duration: forms.duration }));
      } else if (selected.key === "project-ideas") {
        result = await runApiWithFallback("project-ideas", () => toolApi.projectIdeas({ domain: forms.domain, skills: forms.skills, level: forms.level }));
      } else if (selected.key === "password-generator") {
        const lettersLowerBase = "abcdefghijklmnopqrstuvwxyz";
        const lettersUpperBase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbersBase = "0123456789";
        const symbolsBase = "!@#$%^&*()_+-=[]{}|;:,.<>?";
        const ambiguousChars = new Set(["I", "l", "1", "O", "0", "|"]);
        const cleanCharset = (charset) => {
          if (!forms.excludeAmbiguous) {
            return charset;
          }
          return [...charset].filter((char) => !ambiguousChars.has(char)).join("");
        };

        const lettersLower = cleanCharset(lettersLowerBase);
        const lettersUpper = cleanCharset(lettersUpperBase);
        const numbers = cleanCharset(numbersBase);
        const symbols = cleanCharset(symbolsBase);

        let pool = lettersLower;
        const mustInclude = [lettersLower[Math.floor(Math.random() * lettersLower.length)]];
        if (forms.includeUppercase) {
          pool += lettersUpper;
          mustInclude.push(lettersUpper[Math.floor(Math.random() * lettersUpper.length)]);
        }
        if (forms.includeNumbers) {
          pool += numbers;
          mustInclude.push(numbers[Math.floor(Math.random() * numbers.length)]);
        }
        if (forms.includeSymbols) {
          pool += symbols;
          mustInclude.push(symbols[Math.floor(Math.random() * symbols.length)]);
        }

        if (!pool.length || mustInclude.some((char) => !char)) {
          throw new Error("Selected character sets are too restrictive. Try enabling more options.");
        }

        const length = Math.min(64, Math.max(8, Number(forms.passwordLength || 14)));
        const hasSequentialRun = (value) => {
          for (let i = 0; i <= value.length - 3; i += 1) {
            const a = value.charCodeAt(i);
            const b = value.charCodeAt(i + 1);
            const c = value.charCodeAt(i + 2);
            if ((b === a + 1 && c === b + 1) || (b === a - 1 && c === b - 1)) {
              return true;
            }
          }
          return false;
        };

        const buildPassword = () => {
          const generatedChars = [...mustInclude];
          for (let i = generatedChars.length; i < length; i += 1) {
            generatedChars.push(pool[Math.floor(Math.random() * pool.length)]);
          }

          for (let i = generatedChars.length - 1; i > 0; i -= 1) {
            const swapIndex = Math.floor(Math.random() * (i + 1));
            [generatedChars[i], generatedChars[swapIndex]] = [generatedChars[swapIndex], generatedChars[i]];
          }

          return generatedChars.join("");
        };

        let generated = buildPassword();
        if (forms.avoidSequential) {
          let attempts = 0;
          while (hasSequentialRun(generated) && attempts < 12) {
            generated = buildPassword();
            attempts += 1;
          }
        }

        const estimatedEntropy = Math.round(length * Math.log2(pool.length));
        let strengthScore = 0;
        if (length >= 12) {
          strengthScore += 1;
        }
        if (length >= 16) {
          strengthScore += 1;
        }
        if (forms.includeUppercase) {
          strengthScore += 1;
        }
        if (forms.includeNumbers) {
          strengthScore += 1;
        }
        if (forms.includeSymbols) {
          strengthScore += 1;
        }
        if (estimatedEntropy >= 80) {
          strengthScore += 1;
        }

        const strengthLabel =
          strengthScore >= 6 ? "Very Strong" :
          strengthScore >= 5 ? "Strong" :
          strengthScore >= 3 ? "Fair" : "Weak";

        const passwordReport = [
          generated,
          "",
          `Strength: ${strengthLabel} (${strengthScore}/6)`,
          `Estimated entropy: ${estimatedEntropy} bits`,
          `Length: ${length}`,
          `Options: uppercase=${forms.includeUppercase ? "on" : "off"}, numbers=${forms.includeNumbers ? "on" : "off"}, symbols=${forms.includeSymbols ? "on" : "off"}, excludeAmbiguous=${forms.excludeAmbiguous ? "on" : "off"}, avoidSequential=${forms.avoidSequential ? "on" : "off"}`,
        ].join("\n");

        setOutput(passwordReport);
        persistHistory({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          tool: selected.title,
          output: passwordReport,
          at: Date.now(),
        });
      } else if (selected.key === "json-formatter") {
        let parsed;
        try {
          parsed = JSON.parse(forms.jsonInput);
        } catch (jsonError) {
          const errorMessage = jsonError?.message || "Invalid JSON.";
          const positionMatch = errorMessage.match(/position\s(\d+)/i);
          const positionHint = positionMatch ? ` Error position: ${positionMatch[1]}.` : "";
          throw new Error(`Invalid JSON format.${positionHint} ${errorMessage}`.trim());
        }

        const formatted = forms.jsonMode === "minify"
          ? JSON.stringify(parsed)
          : JSON.stringify(parsed, null, 2);

        setOutput(formatted);
        persistHistory({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          tool: selected.title,
          output: formatted,
          at: Date.now(),
        });
      } else if (selected.key === "qr-generator") {
        const text = forms.qrText.trim();
        if (!text) {
          throw new Error("Enter text or URL for QR generation.");
        }

        const allowedSizes = ["256", "512", "768", "1024"];
        const selectedSize = allowedSizes.includes(forms.qrSize) ? forms.qrSize : "512";
        const encoded = encodeURIComponent(text);
        const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=${selectedSize}x${selectedSize}&format=png&data=${encoded}`;
        setImageUrl(qrSrc);
        const qrOutput = `QR generated for: ${text}\nSize: ${selectedSize}x${selectedSize}`;
        setOutput(qrOutput);
        persistHistory({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          tool: selected.title,
          output: qrOutput,
          at: Date.now(),
        });
      } else if (selected.key === "text-to-speech") {
        const text = forms.speechText.trim();
        if (!text) {
          throw new Error("Enter text for speech output.");
        }

        if (!window.speechSynthesis) {
          throw new Error("Text-to-speech is not supported in this browser.");
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === "hi" ? "hi-IN" : "en-US";
        utterance.rate = Math.min(2, Math.max(0.5, Number(forms.speechRate || 1)));
        utterance.pitch = Math.min(2, Math.max(0, Number(forms.speechPitch || 1)));

        if (forms.speechVoice !== "auto") {
          const selectedVoice = availableVoices.find((voice) => voice.name === forms.speechVoice);
          if (selectedVoice) {
            utterance.voice = selectedVoice;
            utterance.lang = selectedVoice.lang || utterance.lang;
          }
        }

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
        setOutput(text);
        persistHistory({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          tool: selected.title,
          output: text,
          at: Date.now(),
        });
      } else if (selected.key === "pdf-tools") {
        if (forms.pdfMode === "merge") {
          if (forms.mergeFiles.length < 2) {
            throw new Error("Please upload at least 2 PDFs for merge.");
          }
          await pdfApi.merge(forms.mergeFiles);
          setSuccess("Merged PDF downloaded.");
        } else if (forms.pdfMode === "overlay") {
          if (!forms.pdfFile || !forms.overlayText.trim()) {
            throw new Error("Upload one PDF and add overlay text.");
          }
          await pdfApi.overlay(forms.pdfFile, forms.overlayText, forms.pdfPage);
          setSuccess("Edited PDF downloaded.");
        } else if (forms.pdfMode === "split") {
          if (!forms.pdfFile) {
            throw new Error("Upload one PDF for split.");
          }
          await pdfApi.split(forms.pdfFile, forms.pdfPage);
          setSuccess("Split page PDF downloaded.");
        } else {
          if (!forms.pdfFile) {
            throw new Error("Upload one PDF for compression.");
          }
          await pdfApi.compress(forms.pdfFile);
          setSuccess("Compressed PDF downloaded.");
        }
      } else if (selected.key === "pdf-front-page-editor") {
        if (!forms.pdfFile) {
          throw new Error("Upload a PDF first for front page editing.");
        }

        await pdfApi.frontPage(forms.pdfFile, {
          collegeName: forms.collegeName,
          departmentName: forms.departmentName,
          assignmentTitle: forms.assignmentTitle,
          subjectName: forms.subjectName,
          submittedBy: forms.submittedBy,
          rollNumber: forms.rollNumber,
          semester: forms.semester,
          submittedTo: forms.submittedTo,
          submissionDate: forms.submissionDate,
          template: forms.frontTemplate,
          customElements: forms.customElements,
        }, forms.logoFile);
        setSuccess("Front page edited and downloaded.");
        setOutput(
          [
            "PDF Front Page Applied",
            `Template: ${forms.frontTemplate || "modern"}`,
            `Logo: ${forms.logoFile ? forms.logoFile.name : "Not provided"}`,
            `College: ${forms.collegeName || "-"}`,
            `Department: ${forms.departmentName || "-"}`,
            `Title: ${forms.assignmentTitle || "-"}`,
            `Student: ${forms.submittedBy || "-"}`,
            `Roll: ${forms.rollNumber || "-"}`,
            `Submitted To: ${forms.submittedTo || "-"}`,
            `Custom Elements: ${(forms.customElements || []).length}`,
          ].join("\n")
        );
      } else if (selected.key === "voice-to-text") {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
          throw new Error("Web Speech API is not supported in this browser.");
        }

        const resolvedLanguage = forms.voiceLanguage === "auto"
          ? (language === "hi" ? "hi-IN" : "en-US")
          : forms.voiceLanguage;
        const timeoutMs = Math.min(20000, Math.max(3000, Number(forms.voiceTimeoutSec || 10) * 1000));
        const maxAttempts = forms.voiceAutoRetry ? 2 : 1;

        const recognizeOnce = () => new Promise((resolve, reject) => {
          const recognition = new SpeechRecognition();
          let settled = false;
          let timeoutId;

          const cleanup = () => {
            if (timeoutId) {
              clearTimeout(timeoutId);
            }
            recognition.onresult = null;
            recognition.onerror = null;
            recognition.onnomatch = null;
            recognition.onend = null;
          };

          recognition.lang = resolvedLanguage;
          recognition.interimResults = false;
          recognition.maxAlternatives = 1;

          recognition.onresult = (eventResult) => {
            if (settled) {
              return;
            }
            settled = true;
            const transcript = eventResult.results?.[0]?.[0]?.transcript?.trim();
            cleanup();
            if (transcript) {
              resolve(transcript);
            } else {
              reject(new Error("No speech detected. Please speak clearly and retry."));
            }
          };

          recognition.onerror = (eventError) => {
            if (settled) {
              return;
            }
            settled = true;
            cleanup();
            const reason = eventError?.error ? ` (${eventError.error})` : "";
            reject(new Error(`Voice recognition failed${reason}.`));
          };

          recognition.onnomatch = () => {
            if (settled) {
              return;
            }
            settled = true;
            cleanup();
            reject(new Error("Speech could not be matched. Please retry."));
          };

          recognition.onend = () => {
            if (settled) {
              return;
            }
            settled = true;
            cleanup();
            reject(new Error("Speech ended before a result was captured."));
          };

          timeoutId = setTimeout(() => {
            if (settled) {
              return;
            }
            settled = true;
            try {
              recognition.stop();
            } catch {
              // no-op for browsers that already stopped recognition
            }
            cleanup();
            reject(new Error("Listening timed out. Try increasing timeout or speaking sooner."));
          }, timeoutMs);

          recognition.start();
        });

        let transcript;
        let finalError;
        for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
          try {
            transcript = await recognizeOnce();
            break;
          } catch (attemptError) {
            finalError = attemptError;
          }
        }

        if (!transcript) {
          throw finalError || new Error("Voice recognition failed after retry.");
        }

        setOutput(transcript);
        persistHistory({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          tool: selected.title,
          output: transcript,
          at: Date.now(),
        });
        setSuccess(`Voice captured successfully (${resolvedLanguage}).`);
      } else if (selected.key === "timestamp-converter") {
        const rawTs = String(forms.unixTimestamp || "").trim();
        const rawDateTime = String(forms.dateTimeInput || "").trim();

        if (!rawTs && !rawDateTime) {
          throw new Error("Provide either Unix timestamp or Date-Time value.");
        }

        const lines = [];

        if (rawTs) {
          const tsNumber = Number(rawTs);
          if (Number.isNaN(tsNumber)) {
            throw new Error("Unix timestamp must be a valid number.");
          }

          const tsInMs = rawTs.length > 10 ? tsNumber : tsNumber * 1000;
          const date = new Date(tsInMs);
          if (Number.isNaN(date.getTime())) {
            throw new Error("Unix timestamp is out of valid range.");
          }

          lines.push("From Unix Timestamp");
          lines.push(`- Input: ${rawTs}`);
          lines.push(`- ISO: ${date.toISOString()}`);
          lines.push(`- Local: ${date.toLocaleString()}`);
          lines.push("");
        }

        if (rawDateTime) {
          const date = new Date(rawDateTime);
          if (Number.isNaN(date.getTime())) {
            throw new Error("Date-Time input is invalid. Use a valid date/time.");
          }

          lines.push("From Date-Time");
          lines.push(`- Input: ${rawDateTime}`);
          lines.push(`- Unix (seconds): ${Math.floor(date.getTime() / 1000)}`);
          lines.push(`- Unix (milliseconds): ${date.getTime()}`);
          lines.push(`- ISO: ${date.toISOString()}`);
        }

        const convertedOutput = lines.join("\n").trim();
        setOutput(convertedOutput);
        persistHistory({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          tool: selected.title,
          output: convertedOutput,
          at: Date.now(),
        });
      } else if (selected.key === "cgpa-calculator") {
        const gpas = String(forms.semesterGpas || "")
          .split(",")
          .map((item) => Number(item.trim()))
          .filter((item) => !Number.isNaN(item));
        const credits = String(forms.semesterCredits || "")
          .split(",")
          .map((item) => Number(item.trim()))
          .filter((item) => !Number.isNaN(item));

        if (!gpas.length || !credits.length || gpas.length !== credits.length) {
          throw new Error("Enter valid GPA and credit lists with equal counts.");
        }

        let weightedSum = 0;
        let totalCreditsValue = 0;
        gpas.forEach((gpa, index) => {
          weightedSum += gpa * credits[index];
          totalCreditsValue += credits[index];
        });

        if (totalCreditsValue <= 0) {
          throw new Error("Total credits must be greater than zero.");
        }

        const cgpa = weightedSum / totalCreditsValue;
        const report = [
          "CGPA Calculation",
          `Semesters counted: ${gpas.length}`,
          `Total credits: ${totalCreditsValue}`,
          `Weighted CGPA: ${cgpa.toFixed(2)}`,
          `Estimated percentage: ${(cgpa * 9.5).toFixed(2)}%`,
        ].join("\n");

        setOutput(report);
        persistHistory({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          tool: selected.title,
          output: report,
          at: Date.now(),
        });
      } else if (selected.key === "attendance-calculator") {
        const attended = Number(forms.attendedClasses);
        const total = Number(forms.totalClasses);
        const target = Number(forms.targetAttendance);

        if ([attended, total, target].some((item) => Number.isNaN(item))) {
          throw new Error("Please enter valid numeric values for attendance fields.");
        }
        if (attended < 0 || total <= 0 || attended > total || target <= 0 || target > 100) {
          throw new Error("Attendance values are out of range.");
        }

        const current = (attended / total) * 100;
        let needNoMiss = 0;
        while (((attended + needNoMiss) / (total + needNoMiss)) * 100 < target && needNoMiss < 2000) {
          needNoMiss += 1;
        }

        let canMissNow = 0;
        while (canMissNow < 2000) {
          const nextMiss = canMissNow + 1;
          const percentageIfMiss = (attended / (total + nextMiss)) * 100;
          if (percentageIfMiss < target) {
            break;
          }
          canMissNow = nextMiss;
        }

        const report = [
          "Attendance Analysis",
          `Current: ${current.toFixed(2)}% (${attended}/${total})`,
          `Target: ${target.toFixed(2)}%`,
          current >= target
            ? `You can miss ${canMissNow} more classes and still stay above target.`
            : `Attend next ${needNoMiss} classes without missing to reach target.`,
        ].join("\n");

        setOutput(report);
        persistHistory({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          tool: selected.title,
          output: report,
          at: Date.now(),
        });
      } else if (selected.key === "citation-generator") {
        const author = String(forms.citeAuthor || "").trim();
        const title = String(forms.citeTitle || "").trim();
        const year = String(forms.citeYear || "").trim();
        const source = String(forms.citeSource || "").trim();
        const url = String(forms.citeUrl || "").trim();

        if (!author || !title || !year || !source) {
          throw new Error("Author, title, year, and source are required for citation.");
        }

        let citation;
        if (forms.citeStyle === "MLA") {
          citation = `${author}. "${title}." ${source}, ${year}${url ? `, ${url}` : ""}.`;
        } else if (forms.citeStyle === "IEEE") {
          citation = `${author}, "${title}," ${source}, ${year}${url ? `, [Online]. Available: ${url}` : ""}.`;
        } else {
          citation = `${author} (${year}). ${title}. ${source}.${url ? ` ${url}` : ""}`;
        }

        const report = [
          `Citation Style: ${forms.citeStyle}`,
          citation,
          "",
          "Tip: Verify punctuation and capitalization with your institute guide.",
        ].join("\n");

        setOutput(report);
        persistHistory({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          tool: selected.title,
          output: report,
          at: Date.now(),
        });
      } else if (selected.key === "exam-planner") {
        const subjects = String(forms.examSubjects || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
        const startDateRaw = String(forms.examStartDate || "").trim();
        const dailyHours = Number(forms.revisionHoursPerDay);

        if (!subjects.length || !startDateRaw || Number.isNaN(dailyHours) || dailyHours <= 0) {
          throw new Error("Provide subject list, exam start date, and valid daily revision hours.");
        }

        const startDate = new Date(startDateRaw);
        if (Number.isNaN(startDate.getTime())) {
          throw new Error("Invalid exam start date.");
        }

        const today = new Date();
        const oneDayMs = 24 * 60 * 60 * 1000;
        const prepDays = Math.max(1, Math.ceil((startDate.getTime() - today.getTime()) / oneDayMs));
        const totalHours = prepDays * dailyHours;
        const hoursPerSubject = totalHours / subjects.length;

        const reportLines = [
          "Exam Revision Plan",
          `Subjects: ${subjects.length}`,
          `Preparation days available: ${prepDays}`,
          `Total revision hours: ${totalHours.toFixed(1)}`,
          `Suggested hours per subject: ${hoursPerSubject.toFixed(1)}`,
          "",
          "Subject-wise plan:",
        ];

        subjects.forEach((subject, index) => {
          reportLines.push(`${index + 1}. ${subject} -> ${hoursPerSubject.toFixed(1)} hrs (concepts + PYQs + mock)`);
        });

        setOutput(reportLines.join("\n"));
        persistHistory({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          tool: selected.title,
          output: reportLines.join("\n"),
          at: Date.now(),
        });
      }

      if (result?.data?.output) {
        setOutput(result.data.output);
        persistHistory({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          tool: selected.title,
          output: result.data.output,
          at: Date.now(),
        });
      }

      recordCounter("quickTaskActions", 1);
      addMomentum(`Used ${selected.title}`);
      setSuccess((prev) => prev || `${selected.title} completed successfully.`);
    } catch (toolError) {
      setError(toolError.response?.data?.message || toolError.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const renderFields = () => {
    if (selected.key === "email-generator") {
      return (
        <>
          <label>Recipient</label>
          <input value={forms.recipient} onChange={(e) => setField("recipient", e.target.value)} placeholder="Hiring Manager" required />
          <label>Purpose</label>
          <input value={forms.purpose} onChange={(e) => setField("purpose", e.target.value)} placeholder="Follow-up for internship" required />
          <label>Tone</label>
          <select value={forms.tone} onChange={(e) => setField("tone", e.target.value)}>
            <option>Professional</option>
            <option>Friendly</option>
            <option>Formal</option>
            <option>Confident</option>
          </select>
        </>
      );
    }

    if (selected.key === "pdf-tools") {
      return (
        <>
          <label>PDF Action</label>
          <select value={forms.pdfMode} onChange={(e) => setField("pdfMode", e.target.value)}>
            <option value="compress">Compress PDF</option>
            <option value="split">Split PDF Page</option>
            <option value="overlay">Overlay Text</option>
            <option value="merge">Merge PDFs</option>
          </select>

          <label>Upload one PDF (split/compress/overlay)</label>
          <input type="file" accept="application/pdf" onChange={(e) => setField("pdfFile", e.target.files?.[0] || null)} />
          <label>Upload multiple PDFs (merge)</label>
          <input type="file" accept="application/pdf" multiple onChange={(e) => setField("mergeFiles", Array.from(e.target.files || []))} />
          <label>Split Page Number</label>
          <input type="number" min="1" value={forms.pdfPage} onChange={(e) => setField("pdfPage", Number(e.target.value || 1))} />
          <label>Overlay Text (optional)</label>
          <input value={forms.overlayText} onChange={(e) => setField("overlayText", e.target.value)} placeholder="Approved by Team" />
        </>
      );
    }

    if (selected.key === "pdf-front-page-editor") {
      return (
        <>
          <label>Upload PDF (first page will be styled)</label>
          <input type="file" accept="application/pdf" onChange={(e) => setField("pdfFile", e.target.files?.[0] || null)} required />
          <label>Front Page Style</label>
          <select value={forms.frontTemplate} onChange={(e) => setField("frontTemplate", e.target.value)}>
            <option value="minimal">Minimal</option>
            <option value="classic">Classic</option>
            <option value="modern">Modern</option>
          </select>
          <label>College Logo (optional)</label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={(e) => setField("logoFile", e.target.files?.[0] || null)}
          />
          <label>College Name</label>
          <input value={forms.collegeName} onChange={(e) => setField("collegeName", e.target.value)} placeholder="ABC Institute of Technology" required />
          <label>Department</label>
          <input value={forms.departmentName} onChange={(e) => setField("departmentName", e.target.value)} placeholder="Department of Computer Science" required />
          <label>Assignment / Project Title</label>
          <input value={forms.assignmentTitle} onChange={(e) => setField("assignmentTitle", e.target.value)} placeholder="Mini Project Report" required />
          <label>Subject</label>
          <input value={forms.subjectName} onChange={(e) => setField("subjectName", e.target.value)} placeholder="Web Development" required />
          <label>Submitted By</label>
          <input value={forms.submittedBy} onChange={(e) => setField("submittedBy", e.target.value)} placeholder="Student Name" required />
          <label>Roll Number</label>
          <input value={forms.rollNumber} onChange={(e) => setField("rollNumber", e.target.value)} placeholder="CS-23124" required />
          <label>Semester</label>
          <input value={forms.semester} onChange={(e) => setField("semester", e.target.value)} placeholder="6th Semester" required />
          <label>Submitted To</label>
          <input value={forms.submittedTo} onChange={(e) => setField("submittedTo", e.target.value)} placeholder="Prof. Sharma" required />
          <label>Submission Date</label>
          <input type="date" value={forms.submissionDate} onChange={(e) => setField("submissionDate", e.target.value)} required />

          <label>Canvas Placement (click canvas to choose point)</label>
          <div className={`front-page-canvas front-page-canvas-${forms.frontTemplate}`} onClick={handleFrontCanvasClick}>
            <div className="front-page-canvas-title">{forms.collegeName || "College Name"}</div>
            <div className="front-page-canvas-subtitle">{forms.departmentName || "Department"}</div>
            <div className="front-page-canvas-main">{forms.assignmentTitle || "Assignment Title"}</div>
            {(forms.customElements || []).map((element) => (
              <div
                key={element.id}
                className="front-page-canvas-element"
                style={{ left: `${element.x}%`, top: `${element.y}%`, fontSize: `${element.size}px` }}
              >
                <strong>{element.name}:</strong> {element.text}
              </div>
            ))}
          </div>

          <label>Custom Element Name</label>
          <input
            value={forms.customElementName}
            onChange={(e) => setField("customElementName", e.target.value)}
            placeholder="Project Guide"
          />
          <label>Custom Element Text (paste allowed)</label>
          <textarea
            value={forms.customElementText}
            onChange={(e) => setField("customElementText", e.target.value)}
            placeholder="Dr. Neha Kapoor"
          />
          <label>Element X (%)</label>
          <input
            type="number"
            min="5"
            max="95"
            value={forms.customElementX}
            onChange={(e) => setField("customElementX", Number(e.target.value || 50))}
          />
          <label>Element Y (%)</label>
          <input
            type="number"
            min="10"
            max="95"
            value={forms.customElementY}
            onChange={(e) => setField("customElementY", Number(e.target.value || 70))}
          />
          <label>Font Size</label>
          <input
            type="number"
            min="8"
            max="28"
            value={forms.customElementSize}
            onChange={(e) => setField("customElementSize", Number(e.target.value || 12))}
          />
          <div className="tool-output-actions">
            <button type="button" onClick={addCustomFrontElement}>Add Named Element</button>
          </div>

          {!!forms.customElements?.length && (
            <div className="tool-output-card">
              <h3>Custom Elements</h3>
              <ul className="tool-history-list">
                {forms.customElements.map((element) => (
                  <li key={element.id}>
                    <strong>{element.name}</strong>
                    <p>{element.text}</p>
                    <div className="tool-output-actions">
                      <input
                        type="number"
                        min="5"
                        max="95"
                        value={element.x}
                        onChange={(e) => updateCustomFrontElement(element.id, { x: Number(e.target.value || element.x) })}
                      />
                      <input
                        type="number"
                        min="10"
                        max="95"
                        value={element.y}
                        onChange={(e) => updateCustomFrontElement(element.id, { y: Number(e.target.value || element.y) })}
                      />
                      <button type="button" onClick={() => removeCustomFrontElement(element.id)}>Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="tool-inline-note">Upload PDF, choose template, optionally upload logo, click canvas to set position, and add named elements for a complete college front page.</p>
        </>
      );
    }

    if (selected.key === "assignment-helper") {
      return (
        <>
          <label>Topic</label>
          <input value={forms.topic} onChange={(e) => setField("topic", e.target.value)} placeholder="Artificial Intelligence in Education" required />
        </>
      );
    }

    if (selected.key === "resume-polisher" || selected.key === "grammar-checker" || selected.key === "notes-summarizer") {
      return (
        <>
          <label>Text</label>
          <textarea value={forms.text} onChange={(e) => setField("text", e.target.value)} placeholder="Paste your content here" required />
        </>
      );
    }

    if (selected.key === "cover-letter-builder") {
      return (
        <>
          <label>Job Role</label>
          <input value={forms.role} onChange={(e) => setField("role", e.target.value)} placeholder="Frontend Engineer" required />
          <label>Company</label>
          <input value={forms.company} onChange={(e) => setField("company", e.target.value)} placeholder="Google" required />
          <label>Experience</label>
          <textarea value={forms.experience} onChange={(e) => setField("experience", e.target.value)} placeholder="2 internships, React projects..." required />
        </>
      );
    }

    if (selected.key === "linkedin-headline-lab") {
      return (
        <>
          <label>Role</label>
          <input value={forms.role} onChange={(e) => setField("role", e.target.value)} placeholder="Data Analyst" required />
          <label>Skills</label>
          <input value={forms.skills} onChange={(e) => setField("skills", e.target.value)} placeholder="SQL, Python, Power BI" required />
        </>
      );
    }

    if (selected.key === "interview-question-bank") {
      return (
        <>
          <label>Role</label>
          <input value={forms.role} onChange={(e) => setField("role", e.target.value)} placeholder="Backend Developer" required />
        </>
      );
    }

    if (selected.key === "study-plan-scheduler") {
      return (
        <>
          <label>Goals</label>
          <input value={forms.goals} onChange={(e) => setField("goals", e.target.value)} placeholder="Prepare for placements" required />
          <label>Available Time</label>
          <input value={forms.time} onChange={(e) => setField("time", e.target.value)} placeholder="2 hours per day" required />
        </>
      );
    }

    if (selected.key === "code-generator") {
      return (
        <>
          <label>Problem Description</label>
          <textarea value={forms.description} onChange={(e) => setField("description", e.target.value)} placeholder="Build a debounced search input" required />
          <label>Language</label>
          <select value={forms.language} onChange={(e) => setField("language", e.target.value)}>
            <option>JavaScript</option>
            <option>Python</option>
            <option>Java</option>
            <option>C++</option>
            <option>TypeScript</option>
          </select>
        </>
      );
    }

    if (selected.key === "smart-goal-plan") {
      return (
        <>
          <label>Goal</label>
          <input value={forms.goal} onChange={(e) => setField("goal", e.target.value)} placeholder="Crack data analyst internship" required />
          <label>Duration</label>
          <input value={forms.duration} onChange={(e) => setField("duration", e.target.value)} placeholder="8 weeks" required />
        </>
      );
    }

    if (selected.key === "project-ideas") {
      return (
        <>
          <label>Domain</label>
          <input value={forms.domain} onChange={(e) => setField("domain", e.target.value)} placeholder="AI/ML" required />
          <label>Skills</label>
          <input value={forms.skills} onChange={(e) => setField("skills", e.target.value)} placeholder="Python, FastAPI, React" required />
          <label>Level</label>
          <select value={forms.level} onChange={(e) => setField("level", e.target.value)}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </>
      );
    }

    if (selected.key === "password-generator") {
      return (
        <>
          <label>Password Length</label>
          <input
            type="number"
            min="8"
            max="64"
            value={forms.passwordLength}
            onChange={(e) => setField("passwordLength", Number(e.target.value || 14))}
          />
          <label>
            <input
              type="checkbox"
              checked={forms.includeUppercase}
              onChange={(e) => setField("includeUppercase", e.target.checked)}
            />
            Include Uppercase Letters
          </label>
          <label>
            <input
              type="checkbox"
              checked={forms.includeNumbers}
              onChange={(e) => setField("includeNumbers", e.target.checked)}
            />
            Include Numbers
          </label>
          <label>
            <input
              type="checkbox"
              checked={forms.includeSymbols}
              onChange={(e) => setField("includeSymbols", e.target.checked)}
            />
            Include Symbols
          </label>
            <label>
              <input
                type="checkbox"
                checked={forms.excludeAmbiguous}
                onChange={(e) => setField("excludeAmbiguous", e.target.checked)}
              />
              Exclude ambiguous characters (I, l, 1, O, 0, |)
            </label>
            <label>
              <input
                type="checkbox"
                checked={forms.avoidSequential}
                onChange={(e) => setField("avoidSequential", e.target.checked)}
              />
              Avoid obvious sequential patterns (abc, 123)
            </label>
            <p className="tool-inline-note">Tip: 16+ chars with symbols and numbers is recommended for high security.</p>
        </>
      );
    }

    if (selected.key === "json-formatter") {
      return (
        <>
          <label>Formatter Mode</label>
          <select
            value={forms.jsonMode}
            onChange={(e) => setField("jsonMode", e.target.value)}
          >
            <option value="beautify">Beautify (indented)</option>
            <option value="minify">Minify (single line)</option>
          </select>
          <label>JSON Input</label>
          <textarea
            value={forms.jsonInput}
            onChange={(e) => setField("jsonInput", e.target.value)}
            placeholder='{"name":"OpenClaw","skills":["React","Node"]}'
            required
          />
          <p className="tool-inline-note">Tip: Use beautify for readability and minify for compact payloads.</p>
        </>
      );
    }

    if (selected.key === "qr-generator") {
      return (
        <>
          <label>Text or URL</label>
          <input
            value={forms.qrText}
            onChange={(e) => setField("qrText", e.target.value)}
            placeholder="https://openclaw-hackathon-hackindia-codingzam.onrender.com"
            required
          />
          <label>QR Size</label>
          <select
            value={forms.qrSize}
            onChange={(e) => setField("qrSize", e.target.value)}
          >
            <option value="256">256 x 256</option>
            <option value="512">512 x 512</option>
            <option value="768">768 x 768</option>
            <option value="1024">1024 x 1024</option>
          </select>
        </>
      );
    }

    if (selected.key === "text-to-speech") {
      return (
        <>
          <label>Text to Speak</label>
          <textarea
            value={forms.speechText}
            onChange={(e) => setField("speechText", e.target.value)}
            placeholder="Type the text you want to hear..."
            required
          />
          <label>Voice</label>
          <select
            value={forms.speechVoice}
            onChange={(e) => setField("speechVoice", e.target.value)}
          >
            <option value="auto">Auto (system default)</option>
            {availableVoices.map((voice) => (
              <option key={`${voice.name}-${voice.lang}`} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
          <label>Speech Rate</label>
          <input
            type="number"
            min="0.5"
            max="2"
            step="0.1"
            value={forms.speechRate}
            onChange={(e) => setField("speechRate", Number(e.target.value || 1))}
          />
          <label>Speech Pitch</label>
          <input
            type="number"
            min="0"
            max="2"
            step="0.1"
            value={forms.speechPitch}
            onChange={(e) => setField("speechPitch", Number(e.target.value || 1))}
          />
          <div className="tool-output-actions">
            <button
              type="button"
              onClick={() => {
                if (window.speechSynthesis) {
                  window.speechSynthesis.cancel();
                  setSuccess("Speech stopped.");
                }
              }}
            >
              Stop Speech
            </button>
          </div>
        </>
      );
    }

    if (selected.key === "voice-to-text") {
      return (
        <>
          <label>Recognition Language</label>
          <select
            value={forms.voiceLanguage}
            onChange={(e) => setField("voiceLanguage", e.target.value)}
          >
            <option value="auto">Auto (based on app language)</option>
            <option value="en-US">English (US)</option>
            <option value="en-IN">English (India)</option>
            <option value="hi-IN">Hindi (India)</option>
          </select>
          <label>Listening Timeout (seconds)</label>
          <input
            type="number"
            min="3"
            max="20"
            value={forms.voiceTimeoutSec}
            onChange={(e) => setField("voiceTimeoutSec", Number(e.target.value || 10))}
          />
          <label>
            <input
              type="checkbox"
              checked={forms.voiceAutoRetry}
              onChange={(e) => setField("voiceAutoRetry", e.target.checked)}
            />
            Auto retry once on failure
          </label>
          <p className="tool-inline-note">Click run, allow microphone permission, and speak clearly within timeout.</p>
        </>
      );
    }

    if (selected.key === "timestamp-converter") {
      return (
        <>
          <label>Unix Timestamp (seconds or milliseconds)</label>
          <input
            value={forms.unixTimestamp}
            onChange={(e) => setField("unixTimestamp", e.target.value)}
            placeholder="1711670400"
          />
          <label>Date-Time</label>
          <input
            type="datetime-local"
            value={forms.dateTimeInput}
            onChange={(e) => setField("dateTimeInput", e.target.value)}
          />
          <p className="tool-inline-note">Fill either one or both fields to convert in both directions.</p>
        </>
      );
    }

    if (selected.key === "cgpa-calculator") {
      return (
        <>
          <label>Semester GPA List (comma separated)</label>
          <input
            value={forms.semesterGpas}
            onChange={(e) => setField("semesterGpas", e.target.value)}
            placeholder="8.1, 8.4, 8.8, 9.0"
            required
          />
          <label>Semester Credits List (comma separated)</label>
          <input
            value={forms.semesterCredits}
            onChange={(e) => setField("semesterCredits", e.target.value)}
            placeholder="20, 22, 21, 23"
            required
          />
          <p className="tool-inline-note">Enter GPA and credit values in matching order for weighted CGPA.</p>
        </>
      );
    }

    if (selected.key === "attendance-calculator") {
      return (
        <>
          <label>Attended Classes</label>
          <input
            type="number"
            min="0"
            value={forms.attendedClasses}
            onChange={(e) => setField("attendedClasses", e.target.value)}
            placeholder="54"
            required
          />
          <label>Total Classes</label>
          <input
            type="number"
            min="1"
            value={forms.totalClasses}
            onChange={(e) => setField("totalClasses", e.target.value)}
            placeholder="80"
            required
          />
          <label>Target Attendance (%)</label>
          <input
            type="number"
            min="1"
            max="100"
            value={forms.targetAttendance}
            onChange={(e) => setField("targetAttendance", e.target.value)}
            placeholder="75"
            required
          />
        </>
      );
    }

    if (selected.key === "citation-generator") {
      return (
        <>
          <label>Citation Style</label>
          <select value={forms.citeStyle} onChange={(e) => setField("citeStyle", e.target.value)}>
            <option value="APA">APA</option>
            <option value="MLA">MLA</option>
            <option value="IEEE">IEEE</option>
          </select>
          <label>Author</label>
          <input value={forms.citeAuthor} onChange={(e) => setField("citeAuthor", e.target.value)} placeholder="Sharma, A." required />
          <label>Title</label>
          <input value={forms.citeTitle} onChange={(e) => setField("citeTitle", e.target.value)} placeholder="Machine Learning in Healthcare" required />
          <label>Year</label>
          <input value={forms.citeYear} onChange={(e) => setField("citeYear", e.target.value)} placeholder="2025" required />
          <label>Source / Journal / Website</label>
          <input value={forms.citeSource} onChange={(e) => setField("citeSource", e.target.value)} placeholder="International Journal of AI Systems" required />
          <label>URL (optional)</label>
          <input value={forms.citeUrl} onChange={(e) => setField("citeUrl", e.target.value)} placeholder="https://example.com/article" />
        </>
      );
    }

    if (selected.key === "exam-planner") {
      return (
        <>
          <label>Subjects (comma separated)</label>
          <input
            value={forms.examSubjects}
            onChange={(e) => setField("examSubjects", e.target.value)}
            placeholder="DSA, DBMS, OS, CN"
            required
          />
          <label>Exam Start Date</label>
          <input
            type="date"
            value={forms.examStartDate}
            onChange={(e) => setField("examStartDate", e.target.value)}
            required
          />
          <label>Revision Hours Per Day</label>
          <input
            type="number"
            min="1"
            max="16"
            value={forms.revisionHoursPerDay}
            onChange={(e) => setField("revisionHoursPerDay", e.target.value)}
            required
          />
        </>
      );
    }

    return null;
  };

  return (
    <section className="tools-workspace-page">
      <div className="tools-workspace-shell">
        <aside className="tools-sidebar">
          <h2>{language === "hi" ? "क्विक टूल्स" : "Quick Tools"}</h2>
          <p>{getModeResponse(mode, language === "hi" ? "हर टूल कार्यशील है और API से जुड़ा है।" : "Every tool is functional and API-backed.", "reply")}</p>

          <div className="tools-sidebar-list">
            {toolSections.map((item) => (
              <button
                key={item.key}
                type="button"
                className={selected.key === item.key ? "tool-nav-btn active" : "tool-nav-btn"}
                onClick={() => navigate(`/quick-tasks/${item.key}`)}
              >
                <span>{item.icon}</span>
                <span>{item.title}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="tool-main-panel">
          <header className="tool-main-header">
            <h1>{selected.icon} {selected.title}</h1>
            <p>{language === "hi" ? "इनपुट भरें और रन करें।" : "Provide input and run."}</p>
          </header>

          <form className="tool-dynamic-form" onSubmit={submit}>
            {renderFields()}
            <div className="tool-form-actions">
              <button type="button" className="tool-secondary-btn" onClick={fillSample}>Try Sample</button>
              <button type="submit" disabled={loading}>{loading ? "Running..." : "Run Tool"}</button>
            </div>
          </form>

          {error && <div className="tool-state error">{error}</div>}
          {success && <div className="tool-state success">{success}</div>}

          {(imageBase64 || imageUrl) && (
            <div className="tool-output-card">
              <h3>Generated Image</h3>
              <div className="tool-output-actions">
                <button type="button" onClick={downloadGeneratedImage}>Download PNG</button>
              </div>
              <img
                src={imageBase64 ? `data:image/png;base64,${imageBase64}` : imageUrl}
                alt="Generated visual"
                className="tool-image-output"
              />
            </div>
          )}

          {output && (
            <div className="tool-output-card">
              <h3>Output</h3>
              <div className="tool-output-actions">
                <button type="button" onClick={copyOutput}>Copy</button>
                <button type="button" onClick={downloadOutput}>Download .txt</button>
              </div>
              <pre>{output}</pre>
            </div>
          )}

          {!!history.length && (
            <div className="tool-output-card">
              <h3>Recent Outputs</h3>
              <ul className="tool-history-list">
                {history.slice(0, 5).map((item) => (
                  <li key={item.id}>
                    <strong>{item.tool}</strong>
                    <span>{new Date(item.at).toLocaleString()}</span>
                    <p>{item.output.slice(0, 140)}{item.output.length > 140 ? "..." : ""}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ToolsPage;

