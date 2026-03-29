import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMode } from "../context/useMode";
import { getModeResponse } from "../utils/modeResponse";
import { useLanguage } from "../context/useLanguage";
import { pdfApi, toolApi } from "../services/toolApi";
import { addMomentum, recordCounter } from "../utils/userActivity";

const toolSections = [
  { key: "email-generator", icon: "✉", title: "Email Generator" },
  { key: "pdf-tools", icon: "📄", title: "PDF Tools" },
  { key: "assignment-helper", icon: "🧠", title: "Assignment Helper" },
  { key: "resume-polisher", icon: "📃", title: "Resume Polisher" },
  { key: "cover-letter-builder", icon: "📝", title: "Cover Letter Builder" },
  { key: "linkedin-headline-lab", icon: "💼", title: "LinkedIn Headline" },
  { key: "interview-question-bank", icon: "🎯", title: "Interview Q&A" },
  { key: "study-plan-scheduler", icon: "📅", title: "Study Plan" },
  { key: "ai-image-generator", icon: "🖼", title: "AI Image Generator" },
  { key: "code-generator", icon: "💻", title: "Code Generator" },
  { key: "grammar-checker", icon: "✅", title: "Grammar Checker" },
  { key: "notes-summarizer", icon: "📚", title: "Notes Summarizer" },
  { key: "chatbot-assistant", icon: "🤖", title: "Chat Assistant" },
  { key: "smart-goal-plan", icon: "🎯", title: "SMART Goal Planner" },
  { key: "project-ideas", icon: "🚀", title: "Project Ideas" },
  { key: "voice-to-text", icon: "🎙", title: "Voice to Text" },
];

const initialForms = {
  recipient: "",
  purpose: "",
  tone: "Professional",
  topic: "",
  text: "",
  role: "",
  skills: "",
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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

  const setField = (name, value) => {
    setForms((prev) => ({ ...prev, [name]: value }));
  };

  const persistHistory = (entry) => {
    const next = [entry, ...history].slice(0, 20);
    setHistory(next);
    localStorage.setItem(outputHistoryKey, JSON.stringify(next));
  };

  const fillSample = () => {
    if (selected.key === "email-generator") {
      setForms((prev) => ({ ...prev, recipient: "Recruiter", purpose: "Follow-up after internship interview", tone: "Professional" }));
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
    } else if (selected.key === "chatbot-assistant") {
      setForms((prev) => ({ ...prev, query: "How do I prepare a 30-day internship strategy?" }));
    } else if (selected.key === "ai-image-generator") {
      setForms((prev) => ({ ...prev, prompt: "Bright futuristic campus with students building robots" }));
    } else if (selected.key === "smart-goal-plan") {
      setForms((prev) => ({ ...prev, goal: "Crack SDE internship", duration: "10 weeks" }));
    } else if (selected.key === "project-ideas") {
      setForms((prev) => ({ ...prev, domain: "AI/ML", skills: "Python, FastAPI, React", level: "Intermediate" }));
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

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setOutput("");
    setImageBase64("");

    try {
      let result;

      if (selected.key === "email-generator") {
        result = await toolApi.generateEmail({
          recipient: forms.recipient,
          purpose: forms.purpose,
          tone: forms.tone,
        });
      } else if (selected.key === "assignment-helper") {
        result = await toolApi.assignmentHelper({ topic: forms.topic });
      } else if (selected.key === "resume-polisher") {
        result = await toolApi.resumePolisher({ text: forms.text });
      } else if (selected.key === "cover-letter-builder") {
        result = await toolApi.coverLetterBuilder({
          role: forms.role,
          company: forms.company,
          experience: forms.experience,
        });
      } else if (selected.key === "linkedin-headline-lab") {
        result = await toolApi.linkedinHeadline({ role: forms.role, skills: forms.skills });
      } else if (selected.key === "interview-question-bank") {
        result = await toolApi.interviewQuestionBank({ role: forms.role });
      } else if (selected.key === "study-plan-scheduler") {
        result = await toolApi.studyPlan({ goals: forms.goals, time: forms.time });
      } else if (selected.key === "code-generator") {
        result = await toolApi.codeGenerator({ description: forms.description, language: forms.language });
      } else if (selected.key === "grammar-checker") {
        result = await toolApi.grammarChecker({ text: forms.text });
      } else if (selected.key === "notes-summarizer") {
        result = await toolApi.notesSummarizer({ text: forms.text });
      } else if (selected.key === "chatbot-assistant") {
        result = await toolApi.chatAssistant({ query: forms.query });
      } else if (selected.key === "smart-goal-plan") {
        result = await toolApi.smartGoalPlan({ goal: forms.goal, duration: forms.duration });
      } else if (selected.key === "project-ideas") {
        result = await toolApi.projectIdeas({ domain: forms.domain, skills: forms.skills, level: forms.level });
      } else if (selected.key === "ai-image-generator") {
        result = await toolApi.imageGenerator({ prompt: forms.prompt });
        if (result.data?.imageBase64) {
          setImageBase64(result.data.imageBase64);
        }
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
      } else if (selected.key === "voice-to-text") {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
          throw new Error("Web Speech API is not supported in this browser.");
        }

        const recognition = new SpeechRecognition();
        recognition.lang = language === "hi" ? "hi-IN" : "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.start();

        await new Promise((resolve, reject) => {
          recognition.onresult = (e) => {
            const transcript = e.results[0][0].transcript;
            setOutput(transcript);
            resolve();
          };
          recognition.onerror = () => reject(new Error("Voice recognition failed."));
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

    if (selected.key === "ai-image-generator") {
      return (
        <>
          <label>Prompt</label>
          <textarea value={forms.prompt} onChange={(e) => setField("prompt", e.target.value)} placeholder="Neon cyberpunk city skyline at dusk" required />
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

    if (selected.key === "chatbot-assistant") {
      return (
        <>
          <label>Ask Assistant</label>
          <textarea value={forms.query} onChange={(e) => setField("query", e.target.value)} placeholder="How should I prepare for a data analyst internship?" required />
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

    if (selected.key === "voice-to-text") {
      return <p className="tool-inline-note">Click run to start microphone capture and convert speech to text.</p>;
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

          {imageBase64 && (
            <div className="tool-output-card">
              <h3>Generated Image</h3>
              <img src={`data:image/png;base64,${imageBase64}`} alt="AI generated" className="tool-image-output" />
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

