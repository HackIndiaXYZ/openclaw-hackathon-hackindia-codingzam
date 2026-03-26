import { Link } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";

function FeaturePlaceholderPage({ title }) {
  const { language } = useLanguage();
  const isHindi = language === "hi";

  return (
    <section className="placeholder-page">
      <h1>{title}</h1>
      <p>
        {isHindi
          ? "यह फीचर स्क्रीन अगले इम्प्लीमेंटेशन स्टेप्स के लिए तैयार है।"
          : "This feature screen is ready for next implementation steps."}
      </p>
      <Link to="/dashboard" className="back-link">
        {isHindi ? "डैशबोर्ड पर वापस" : "Back to Dashboard"}
      </Link>
    </section>
  );
}

export default FeaturePlaceholderPage;

