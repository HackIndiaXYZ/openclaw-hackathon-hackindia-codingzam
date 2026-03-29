import { useLanguage } from "../context/useLanguage";

function SeniorCard({ senior }) {
  const { language } = useLanguage();
  const feeLabel = senior.paid ? (language === "hi" ? "पेड" : "Paid") : (language === "hi" ? "फ्री" : "Free");
  const stars = "⭐".repeat(Math.floor(senior.rating));

  return (
    <article className="senior-card">
      <div className="senior-head">
        <h3>{senior.name}</h3>
        <span className={senior.paid ? "fee-tag paid" : "fee-tag free"}>{feeLabel}</span>
      </div>

      <p className="senior-role">{senior.role}</p>

      {/* Rating & Stats */}
      <div className="senior-stats">
        <div className="stat-item">
          <span className="stat-label">{language === "hi" ? "रेटिंग:" : "Rating:"}</span>
          <span className="stat-value">{stars} {senior.rating}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">{language === "hi" ? "रिस्पॉन्स:" : "Response:"}</span>
          <span className="stat-value">{senior.responseTime}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">{language === "hi" ? "मेंटिज:" : "Mentees:"}</span>
          <span className="stat-value">{senior.mentees}+</span>
        </div>
      </div>

      <div className="senior-meta">
        <p><strong>{language === "hi" ? "विशेषज्ञता:" : "Expertise:"}</strong> {senior.expertise}</p>
        <p><strong>{language === "hi" ? "उपलब्धता:" : "Availability:"}</strong> {senior.availability}</p>
      </div>

      <div className="senior-actions">
        <a 
          href={senior.contactLink} 
          target="_blank" 
          rel="noreferrer"
          className="action-btn contact-btn"
        >
          {language === "hi" ? "👤 संपर्क" : "👤 Contact"}
        </a>
        <a 
          href={senior.bookCallLink} 
          target="_blank" 
          rel="noreferrer"
          className="action-btn book-btn"
        >
          {language === "hi" ? "📅 कॉल बुक करें" : "📅 Book Call"}
        </a>
      </div>
    </article>
  );
}

export default SeniorCard;

