import { useState } from "react";
import { Link } from "react-router-dom";
import { useMode } from "../context/useMode";
import { getModeLoadingMessage, getModeResponse } from "../utils/modeResponse";
import { useLanguage } from "../context/useLanguage";

function PDFToolsPage() {
  const { mode } = useMode();
  const { language } = useLanguage();
  const isHindi = language === "hi";
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const runDemoAction = (actionName) => {
    setLoading(true);
    setStatus(getModeLoadingMessage(mode, "pdf"));

    setTimeout(() => {
      setLoading(false);
      const doneMessage = isHindi
        ? `${actionName} डेमो पूरा। फाइल सिम्युलेशन मोड में प्रोसेस हुई।`
        : `${actionName} demo complete. File was processed in simulation mode.`;
      setStatus(getModeResponse(mode, doneMessage, "reply"));
    }, 900);
  };

  return (
    <section className="tool-page">
      <div className="tool-page-header">
        <h1>{isHindi ? "PDF टूल्स" : "PDF Tools"}</h1>
        <p>{getModeResponse(mode, isHindi ? "एक एक्शन चुनें। यह अभी डेमो UI है।" : "Choose an action. This is a demo-only UI for now.", "reply")}</p>
      </div>

      <div className="pdf-actions">
        <button type="button" onClick={() => runDemoAction(isHindi ? "Merge" : "Merge")}>{isHindi ? "PDF मर्ज" : "Merge PDF"}</button>
        <button type="button" onClick={() => runDemoAction(isHindi ? "Compress" : "Compress")}>{isHindi ? "PDF कंप्रेस" : "Compress PDF"}</button>
        <button type="button" onClick={() => runDemoAction(isHindi ? "Edit" : "Edit")}>{isHindi ? "PDF एडिट" : "Edit PDF"}</button>
      </div>

      {status && <p className={loading ? "tool-loading" : "tool-status"}>{status}</p>}

      <div className="tool-links">
        <Link to="/quick-tasks">{isHindi ? "टूल्स पर वापस" : "Back to Tools"}</Link>
        <Link to="/quick-tasks/assignment-helper">{isHindi ? "असाइनमेंट हेल्पर खोलें" : "Open Assignment Helper"}</Link>
      </div>
    </section>
  );
}

export default PDFToolsPage;

