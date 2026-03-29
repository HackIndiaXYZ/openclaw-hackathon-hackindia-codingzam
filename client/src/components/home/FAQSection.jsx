import { useState } from "react";
import { useLanguage } from "../../context/useLanguage";

function FAQSection() {
  const [expanded, setExpanded] = useState(null);
  const { language } = useLanguage();

  const content = language === "hi"
    ? {
        kicker: "❓ अक्सर पूछे जाने वाले सवाल",
        title: "सामान्य सवालों के तेज जवाब।",
        faqs: [
          {
            q: "क्या ExplainX.ai मुफ्त है?",
            a: "कोर फीचर्स स्टूडेंट-फ्रेंडली हैं। कुछ मेंटर सेशन्स पेड हो सकते हैं।",
          },
          {
            q: "क्या मैं बाद में मोड बदल सकता/सकती हूँ?",
            a: "हाँ। आप होम या डैशबोर्ड से कभी भी मोड बदल सकते हैं।",
          },
          {
            q: "क्या इसे इस्तेमाल करने के लिए तकनीकी ज्ञान जरूरी है?",
            a: "नहीं। ऐप शुरुआती यूज़र्स के लिए आसान फ्लो के साथ बना है।",
          },
        ],
      }
    : {
        kicker: "❓ FAQ",
        title: "Quick answers to common questions.",
        faqs: [
          {
            q: "Is ExplainX.ai free to use?",
            a: "Core features are designed to be student-friendly. Some mentor sessions can be paid.",
          },
          {
            q: "Can I switch mode later?",
            a: "Yes. You can change mode anytime from the mode selector on the home page or dashboard.",
          },
          {
            q: "Do I need technical knowledge to use it?",
            a: "No. The app is designed with simple flows for beginners.",
          },
        ],
      };
  
  return (
    <section id="faq" className="section-wrapper faq-section">
      <div className="sections-container">
        <p className="faq-kicker">{content.kicker}</p>
        <h2>{content.title}</h2>
        <div className="faq-list">
          {content.faqs.map((item, idx) => (
            <article key={item.q} className="faq-item">
              <button
                type="button"
                className={`faq-question ${expanded === idx ? "active" : ""}`}
                onClick={() => setExpanded(expanded === idx ? null : idx)}
              >
                <span>{item.q}</span>
                <span className="faq-icon">+</span>
              </button>
              {expanded === idx && (
                <p className="faq-answer">{item.a}</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;

