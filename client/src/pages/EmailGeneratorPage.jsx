import { useState } from "react";
import { Link } from "react-router-dom";
import { useMode } from "../context/ModeContext";
import { getModeResponse } from "../utils/modeResponse";
import { useLanguage } from "../context/useLanguage";

function EmailGeneratorPage() {
  const { mode } = useMode();
  const { language } = useLanguage();
  const isHindi = language === "hi";
  const [form, setForm] = useState({
    recipient: isHindi ? "Hiring Manager" : "Hiring Manager",
    purpose: isHindi ? "इंटर्नशिप अवसर का अनुरोध" : "Requesting internship opportunity",
    tone: isHindi ? "Professional" : "Professional",
  });
  const [generatedEmail, setGeneratedEmail] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = (event) => {
    event.preventDefault();

    const baseEmail = isHindi
      ? `नमस्ते ${form.recipient},\n\nआशा है आप अच्छे होंगे। मैं ${form.purpose} के संबंध में लिख रहा/रही हूँ। मैं इसमें बहुत रुचि रखता/रखती हूँ और इस पर आगे बात करना चाहूंगा/चाहूंगी।\n\nअपने समय और विचार के लिए धन्यवाद।\n\nसादर,\nआपका नाम`
      : `Hi ${form.recipient},\n\nI hope you are doing well. I am writing regarding ${form.purpose}. I am very interested and would love to discuss this further.\n\nThank you for your time and consideration.\n\nBest regards,\nYour Name`;

    setGeneratedEmail(getModeResponse(mode, baseEmail, "reply"));
  };

  return (
    <section className="tool-page">
      <div className="tool-page-header">
        <h1>{isHindi ? "ईमेल जेनरेटर" : "Email Generator"}</h1>
        <p>{getModeResponse(mode, isHindi ? "डिटेल भरें और ईमेल ड्राफ्ट बनाएं।" : "Fill details and generate your email draft.", "reply")}</p>
      </div>

      <form className="tool-form" onSubmit={handleGenerate}>
        <label htmlFor="recipient">{isHindi ? "प्राप्तकर्ता" : "Recipient"}</label>
        <input
          id="recipient"
          name="recipient"
          value={form.recipient}
          onChange={handleChange}
          required
        />

        <label htmlFor="purpose">{isHindi ? "उद्देश्य" : "Purpose"}</label>
        <input id="purpose" name="purpose" value={form.purpose} onChange={handleChange} required />

        <label htmlFor="tone">{isHindi ? "टोन" : "Tone"}</label>
        <select id="tone" name="tone" value={form.tone} onChange={handleChange}>
          <option>{isHindi ? "प्रोफेशनल" : "Professional"}</option>
          <option>{isHindi ? "फ्रेंडली" : "Friendly"}</option>
          <option>{isHindi ? "फॉर्मल" : "Formal"}</option>
        </select>

        <button type="submit">{isHindi ? "ईमेल बनाएं" : "Generate Email"}</button>
      </form>

      {generatedEmail && (
        <div className="generated-output">
          <h3>{isHindi ? "बना हुआ ईमेल" : "Generated Email"}</h3>
          <pre>{generatedEmail}</pre>
        </div>
      )}

      <div className="tool-links">
        <Link to="/quick-tasks">{isHindi ? "टूल्स पर वापस" : "Back to Tools"}</Link>
        <Link to="/quick-tasks/pdf-tools">{isHindi ? "अगला: PDF टूल्स" : "Next: PDF Tools"}</Link>
      </div>
    </section>
  );
}

export default EmailGeneratorPage;

