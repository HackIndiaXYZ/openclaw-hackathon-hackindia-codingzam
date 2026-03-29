import { Link } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";

function FeatureCard({ title, description, to }) {
  const { language } = useLanguage();

  return (
    <Link to={to} className="feature-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <span>{language === "hi" ? "देखें" : "Explore"}</span>
    </Link>
  );
}

export default FeatureCard;

