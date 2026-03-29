import { Link } from "react-router-dom";
import { useMode } from "../../context/useMode";
import { getModeResponse } from "../../utils/modeResponse";
import { useLanguage } from "../../context/useLanguage";

function HeroSection() {
  // Hero content uses language and mode together for personalized first impression.
  const { mode } = useMode();
  const { language } = useLanguage();

  const content = language === "hi"
    ? {
        kicker: "✨ ExplainX प्लेटफ़ॉर्म",
        titlePrefix: "अपने करियर की योजना बनाएं",
        titleAccent: "स्पष्टता, गति और व्यक्तित्व के साथ",
        subtitle: "अवसर खोजें, कार्य पूरे करें और एक ही जगह में मेंटर्स से जुड़ें।",
        ctaPrimary: "अभी शुरू करें",
        ctaSecondary: "डैशबोर्ड खोलें",
        statA: "7x तेज़",
        statB: "95% स्पष्ट लक्ष्य",
        statC: "24/7 AI + मेंटर",
      }
    : {
        kicker: "✨ ExplainX Platform",
        titlePrefix: "Plan your career with",
        titleAccent: "clarity, speed & personality",
        subtitle: "Explore opportunities, finish tasks, and connect with mentors in one place.",
        ctaPrimary: "Get Started Today",
        ctaSecondary: "Open Dashboard",
        statA: "7x Faster",
        statB: "95% Goal Clarity",
        statC: "24/7 AI + Mentors",
      };

  return (
    <section id="home" className="section-wrapper hero-section">
      <div className="sections-container hero-layout">
        <div className="hero-copy">
          <p className="hero-kicker">{content.kicker}</p>
          <h1 className="hero-title">
            {content.titlePrefix}
            <br />
            <span className="accent-text">{content.titleAccent}</span>
          </h1>
          <p className="hero-subtitle">
            {getModeResponse(
              mode,
              content.subtitle,
              "reply"
            )}
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="primary-btn">
              {content.ctaPrimary}
            </Link>
            <Link to="/dashboard" className="ghost-btn">
              {content.ctaSecondary}
            </Link>
          </div>
        </div>

        {/* Visual side cards keep first screen engaging without heavy assets. */}
        <div className="hero-visual-stack" aria-hidden="true">
          <article className="hero-visual-card">
            <h3>{content.statA}</h3>
            <p>{language === "hi" ? "टास्क पूर्णता" : "Task Completion"}</p>
          </article>
          <article className="hero-visual-card">
            <h3>{content.statB}</h3>
            <p>{language === "hi" ? "रोडमैप सटीकता" : "Roadmap Precision"}</p>
          </article>
          <article className="hero-visual-card">
            <h3>{content.statC}</h3>
            <p>{language === "hi" ? "सपोर्ट सिस्टम" : "Support System"}</p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

