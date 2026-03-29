import { Link } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";

function ToolPlaceholderPage({ title }) {
  const { language } = useLanguage();
  const isHindi = language === "hi";

  return (
    <section className="tool-page">
      <div className="tool-page-header">
        <h1>{title}</h1>
        <p>
          {isHindi
            ? "इस टूल का UI तैयार है। अगला स्टेप लॉजिक जोड़ना है।"
            : "This tool UI is ready. Logic can be added in the next step."}
        </p>
      </div>

      <div className="tool-links">
        <Link to="/quick-tasks">{isHindi ? "टूल्स पर वापस" : "Back to Tools"}</Link>
      </div>
    </section>
  );
}

export default ToolPlaceholderPage;

