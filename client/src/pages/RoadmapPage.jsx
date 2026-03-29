import { useState } from "react";
import { Link } from "react-router-dom";
import { useMode } from "../context/useMode";
import { getModeLoadingMessage, getModeResponse } from "../utils/modeResponse";
import { useLanguage } from "../context/useLanguage";

function RoadmapPage() {
  const { mode } = useMode();
  const { language } = useLanguage();
  const isHindi = language === "hi";
  const [form, setForm] = useState({
    interest: "",
    skillLevel: "Beginner",
  });
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [roadmap, setRoadmap] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const buildRoadmap = (interest, skillLevel) => {
    const lowerInterest = interest.toLowerCase();

    const baseSteps = {
      Beginner: [
        isHindi ? "फंडामेंटल्स मजबूत करें और रोज़ बेसिक्स दोहराएं।" : "Build fundamentals and revise basics every day.",
        isHindi ? "स्पष्ट डॉक्यूमेंटेशन के साथ एक शुरुआती प्रोजेक्ट पूरा करें।" : "Complete one beginner project with clear documentation.",
        isHindi ? "साप्ताहिक प्रगति साझा करें और फीडबैक लें।" : "Share progress weekly and ask for feedback.",
      ],
      Intermediate: [
        isHindi ? "एक फोकस्ड मिनी-प्रोजेक्ट से कोर कॉन्सेप्ट मजबूत करें।" : "Strengthen core concepts with one focused mini-project.",
        isHindi ? "दो पोर्टफोलियो प्रोजेक्ट बनाएं जो वास्तविक समस्याएं हल करें।" : "Create two portfolio projects that solve real problems.",
        isHindi ? "इंटरव्यू सवाल और मॉक प्रेजेंटेशन की तैयारी करें।" : "Prepare interview questions and mock presentations.",
      ],
      Advanced: [
        isHindi ? "एक niche में विशेषज्ञता बनाएं और केस स्टडी प्रकाशित करें।" : "Specialize in one niche and publish a case study.",
        isHindi ? "ओपन-सोर्स में योगदान दें या जूनियर्स को मेंटर करें।" : "Contribute to open-source or mentor juniors.",
        isHindi ? "टेलर्ड एप्लीकेशन्स के साथ high-impact इंटर्नशिप/जॉब टार्गेट करें।" : "Target high-impact internships/jobs with tailored applications.",
      ],
    };

    let tools = ["Notion", "GitHub", "LinkedIn"];
    let courses = [
      "FreeCodeCamp learning paths",
      "Coursera guided specialization",
      "YouTube project-based playlists",
    ];
    let finalGoal = isHindi
      ? `${interest} में मजबूत पोर्टफोलियो और इंटरव्यू कॉन्फिडेंस के साथ job-ready बनें।`
      : `Become job-ready in ${interest} with a strong portfolio and interview confidence.`;

    if (lowerInterest.includes("web") || lowerInterest.includes("frontend")) {
      tools = ["VS Code", "GitHub", "Figma", "Chrome DevTools"];
      courses = [
        "Responsive Web Design",
        "JavaScript + React fundamentals",
        "Frontend project bootcamp",
      ];
      finalGoal = isHindi
        ? "3 मजबूत फ्रंटएंड प्रोजेक्ट बनाकर डिप्लॉय करें और इंटर्नशिप रोल प्राप्त करें।"
        : "Build and deploy 3 strong frontend projects and secure an internship role.";
    }

    if (lowerInterest.includes("data") || lowerInterest.includes("ai")) {
      tools = ["Jupyter Notebook", "Python", "Pandas", "Kaggle"];
      courses = [
        "Python for Data Science",
        "Machine Learning fundamentals",
        "Data visualization with projects",
      ];
      finalGoal = isHindi
        ? "प्रैक्टिकल data/AI पोर्टफोलियो बनाएं और इंटर्नशिप इंटरव्यू के लिए तैयार हों।"
        : "Develop a practical data/AI portfolio and qualify for internship interviews.";
    }

    return {
      steps: baseSteps[skillLevel] || baseSteps.Beginner,
      tools,
      courses,
      finalGoal,
    };
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.interest.trim()) {
      return;
    }

    setLoading(true);
    setLoadingMessage(getModeLoadingMessage(mode, "roadmap"));
    setRoadmap(null);

    setTimeout(() => {
      setRoadmap(buildRoadmap(form.interest.trim(), form.skillLevel));
      setLoading(false);
    }, 1200);
  };

  return (
    <section className="tool-page">
      <div className="tool-page-header">
        <h1>{isHindi ? "करियर रोडमैप" : "Career Roadmap"}</h1>
        <p>{getModeResponse(mode, isHindi ? "अपनी रुचि और स्तर बताएं, हम रोडमैप बनाएंगे।" : "Tell us your interest and level to generate your roadmap.", "reply")}</p>
      </div>

      <form className="tool-form" onSubmit={handleSubmit}>
        <label htmlFor="interest">{isHindi ? "रुचि" : "Interest"}</label>
        <input
          id="interest"
          name="interest"
          placeholder={isHindi ? "उदाहरण: Frontend Development, Data Science" : "Example: Frontend Development, Data Science"}
          value={form.interest}
          onChange={handleChange}
          required
        />

        <label htmlFor="skillLevel">{isHindi ? "स्किल लेवल" : "Skill Level"}</label>
        <select id="skillLevel" name="skillLevel" value={form.skillLevel} onChange={handleChange}>
          <option>{isHindi ? "Beginner" : "Beginner"}</option>
          <option>{isHindi ? "Intermediate" : "Intermediate"}</option>
          <option>{isHindi ? "Advanced" : "Advanced"}</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? (isHindi ? "रोडमैप बन रहा है..." : "Building roadmap...") : (isHindi ? "रोडमैप बनाएं" : "Generate Roadmap")}
        </button>
      </form>

      {loading && <p className="tool-loading">{loadingMessage}</p>}

      {roadmap && (
        <div className="generated-output roadmap-output">
          <h3>{isHindi ? "आपका रोडमैप" : "Your Roadmap"}</h3>

          <h4>{isHindi ? "स्टेप्स" : "Steps"}</h4>
          <ul className="answer-list">
            {roadmap.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>

          <h4>{isHindi ? "टूल्स" : "Tools"}</h4>
          <ul className="answer-list">
            {roadmap.tools.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>

          <h4>{isHindi ? "कोर्सेस" : "Courses"}</h4>
          <ul className="answer-list">
            {roadmap.courses.map((course) => (
              <li key={course}>{course}</li>
            ))}
          </ul>

          <h4>{isHindi ? "अंतिम लक्ष्य" : "Final Goal"}</h4>
          <p>{roadmap.finalGoal}</p>
        </div>
      )}

      <div className="tool-links">
        <Link to="/dashboard">{isHindi ? "डैशबोर्ड पर वापस" : "Back to Dashboard"}</Link>
        <Link to="/best-match">{isHindi ? "Best Match चैट पर जाएँ" : "Go to Best Match Chat"}</Link>
      </div>
    </section>
  );
}

export default RoadmapPage;

