import { useState } from "react";
import { Link } from "react-router-dom";
import { useMode } from "../context/ModeContext";
import { getModeLoadingMessage, getModeResponse } from "../utils/modeResponse";
import { useLanguage } from "../context/useLanguage";

function AssignmentHelperPage() {
  const { mode } = useMode();
  const { language } = useLanguage();
  const isHindi = language === "hi";
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [answer, setAnswer] = useState(null);

  const generateStructuredAnswer = (inputTopic) => {
    const cleanTopic = inputTopic.trim();

    return {
      introduction: isHindi
        ? `परिचय: ${cleanTopic} एक महत्वपूर्ण विषय है क्योंकि यह सिद्धांत को वास्तविक जीवन से जोड़ता है और व्यावहारिक समझ विकसित करता है।`
        : `Introduction: ${cleanTopic} is an important topic because it connects theory with real-world application and helps build practical understanding.`,
      keyPoints: [
        isHindi
          ? `बिंदु 1: ${cleanTopic} को स्पष्ट रूप से परिभाषित करें और इसकी मूल अवधारणा सरल शब्दों में समझाएं।`
          : `Point 1: Define ${cleanTopic} clearly and explain its core idea in simple words.`,
        isHindi
          ? `बिंदु 2: इसके मुख्य लाभ, उपयोग और सामान्य अनुप्रयोगों का वर्णन करें।`
          : `Point 2: Describe the main benefits, uses, and where it is commonly applied.`,
        isHindi
          ? `बिंदु 3: एक वास्तविक उदाहरण दें ताकि ${cleanTopic} का व्यावहारिक उपयोग स्पष्ट हो।`
          : `Point 3: Add one real-life example to show how ${cleanTopic} works in practice.`,
      ],
      conclusion: isHindi
        ? `निष्कर्ष: ${cleanTopic} को छोटे भागों में बांटकर और उदाहरणों के साथ समझाने पर यह आसान हो जाता है।`
        : `Conclusion: ${cleanTopic} becomes easier when broken into small parts and explained with examples.`,
    };
  };

  const handleGenerate = (event) => {
    event.preventDefault();

    if (!topic.trim()) {
      return;
    }

    setLoading(true);
    setLoadingMessage(getModeLoadingMessage(mode, "assignment"));
    setAnswer(null);

    setTimeout(() => {
      setAnswer(generateStructuredAnswer(topic));
      setLoading(false);
    }, 1200);
  };

  return (
    <section className="tool-page">
      <div className="tool-page-header">
        <h1>{isHindi ? "असाइनमेंट हेल्पर" : "Assignment Helper"}</h1>
        <p>{getModeResponse(mode, isHindi ? "टॉपिक दर्ज करें और संरचित उत्तर ड्राफ्ट पाएं।" : "Enter a topic and get a structured answer draft.", "reply")}</p>
      </div>

      <form className="tool-form" onSubmit={handleGenerate}>
        <label htmlFor="topic">{isHindi ? "असाइनमेंट विषय" : "Assignment Topic"}</label>
        <input
          id="topic"
          name="topic"
          placeholder={isHindi ? "उदाहरण: शिक्षा में आर्टिफिशियल इंटेलिजेंस" : "Example: Artificial Intelligence in Education"}
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? (isHindi ? "बन रहा है..." : "Generating...") : (isHindi ? "उत्तर बनाएं" : "Generate Answer")}
        </button>
      </form>

      {loading && <p className="tool-loading">{loadingMessage}</p>}

      {answer && (
        <div className="generated-output">
          <h3>{isHindi ? "संरचित उत्तर" : "Structured Answer"}</h3>
          <p>{answer.introduction}</p>
          <ul className="answer-list">
            {answer.keyPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <p>{answer.conclusion}</p>
        </div>
      )}

      <div className="tool-links">
        <Link to="/quick-tasks">{isHindi ? "टूल्स पर वापस" : "Back to Tools"}</Link>
        <Link to="/quick-tasks/pdf-tools">{isHindi ? "अगला: PDF टूल्स" : "Next: PDF Tools"}</Link>
      </div>
    </section>
  );
}

export default AssignmentHelperPage;

