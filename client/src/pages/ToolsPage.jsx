import ToolCard from "../components/ToolCard";
import { useMode } from "../context/useMode";
import { getModeResponse } from "../utils/modeResponse";
import { useLanguage } from "../context/useLanguage";

const tools = [
  {
    title: "Email Generator",
    description: "Generate professional emails in seconds.",
    to: "/quick-tasks/email-generator",
  },
  {
    title: "PDF Tools",
    description: "Merge, compress, and edit PDFs from one place.",
    to: "/quick-tasks/pdf-tools",
  },
  {
    title: "Assignment Helper",
    description: "Structure and improve your assignment drafts.",
    to: "/quick-tasks/assignment-helper",
  },
  {
    title: "Front Page Generator",
    description: "Create clean and readable project front pages.",
    to: "/quick-tasks/front-page-generator",
  },
  {
    title: "Resume Polisher",
    description: "Improve resume bullets with impact-focused wording.",
    to: "/quick-tasks/resume-polisher",
  },
  {
    title: "Cover Letter Builder",
    description: "Create role-specific cover letters from quick inputs.",
    to: "/quick-tasks/cover-letter-builder",
  },
  {
    title: "LinkedIn Headline Lab",
    description: "Generate profile headlines and summary options.",
    to: "/quick-tasks/linkedin-headline-lab",
  },
  {
    title: "Interview Question Bank",
    description: "Get practice questions based on role and difficulty.",
    to: "/quick-tasks/interview-question-bank",
  },
  {
    title: "Study Plan Scheduler",
    description: "Build weekly learning plans with realistic timelines.",
    to: "/quick-tasks/study-plan-scheduler",
  },
];

function ToolsPage() {
  const { mode } = useMode();
  const { language } = useLanguage();
  const isHindi = language === "hi";
  const localizedTools = isHindi
    ? tools.map((tool) => {
        const descriptionByTitle = {
          "Email Generator": "कुछ सेकंड में प्रोफेशनल ईमेल बनाएं।",
          "PDF Tools": "एक जगह से PDF मर्ज, कंप्रेस और एडिट करें।",
          "Assignment Helper": "असाइनमेंट ड्राफ्ट को संरचित और बेहतर बनाएं।",
          "Front Page Generator": "साफ और पढ़ने योग्य प्रोजेक्ट फ्रंट पेज बनाएं।",
          "Resume Polisher": "रिज्यूमे बुलेट्स को impact-focused बनाएं।",
          "Cover Letter Builder": "तेज़ इनपुट से रोल-विशिष्ट कवर लेटर बनाएं।",
          "LinkedIn Headline Lab": "प्रोफाइल हेडलाइन और सारांश विकल्प बनाएं।",
          "Interview Question Bank": "रोल और कठिनाई के अनुसार अभ्यास प्रश्न पाएं।",
          "Study Plan Scheduler": "यथार्थवादी टाइमलाइन के साथ साप्ताहिक स्टडी प्लान बनाएं।",
        };

        return {
          ...tool,
          description: descriptionByTitle[tool.title] || tool.description,
        };
      })
    : tools;

  return (
    <section className="tools-page">
      <div className="tools-header">
        <h1>{isHindi ? "क्विक टास्क्स" : "Quick Tasks"}</h1>
        <p>{getModeResponse(mode, isHindi ? "टूल चुनें और काम तेज़ी से पूरा करें।" : "Pick a tool and finish tasks faster.", "reply")}</p>
        <small>{isHindi ? `${tools.length} टूल उपलब्ध` : `${tools.length} tools available`}</small>
      </div>

      <div className="tool-grid">
        {localizedTools.map((tool) => (
          <ToolCard
            key={tool.title}
            title={tool.title}
            description={tool.description}
            to={tool.to}
          />
        ))}
      </div>
    </section>
  );
}

export default ToolsPage;

