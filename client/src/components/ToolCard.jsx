import { Link } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";

function ToolCard({ title, description, to }) {
  const { language } = useLanguage();

  return (
    <Link to={to} className="tool-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <span>{language === "hi" ? "टूल खोलें" : "Open Tool"}</span>
    </Link>
  );
}

export default ToolCard;

