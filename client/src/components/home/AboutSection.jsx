import { useLanguage } from "../../context/useLanguage";

function AboutSection() {
  const { language } = useLanguage();

  const content = language === "hi"
    ? {
        kicker: "✨ ExplainX.ai के बारे में",
        title: "छात्रों के लिए बिना रुकावट आगे बढ़ने का एक स्मार्ट वर्कस्पेस।",
        intro:
          "ExplainX इंटर्नशिप गाइडेंस, स्कॉलरशिप, मेंटरशिप और प्रैक्टिकल टूल्स को एक साफ और आसान अनुभव में लाता है।",
        points: [
          {
            title: "📍 स्पष्टता",
            text: "गाइडेड विकल्प और संरचित स्टेप्स ताकि हर समय अगला कदम स्पष्ट रहे।",
          },
          {
            title: "⚡ गति",
            text: "तेज एक्शन्स और टेम्पलेट्स जो दोहराव वाले काम को कम करते हैं।",
          },
          {
            title: "🤝 सहयोग",
            text: "मेंटर्स और प्रोफाइल-आधारित सुझाव बेहतर निर्णय लेने में मदद करते हैं।",
          },
        ],
      }
    : {
        kicker: "✨ About ExplainX.ai",
        title: "A student-first workspace for growth without friction.",
        intro:
          "ExplainX brings internship guidance, scholarships, mentorship, and practical tools into one clean experience. The platform is designed for clarity, fast decisions, and daily progress.",
        points: [
          {
            title: "📍 Clarity",
            text: "Guided choices and structured steps so users always know what to do next.",
          },
          {
            title: "⚡ Speed",
            text: "Quick actions and templates that reduce repetitive work and save effort.",
          },
          {
            title: "🤝 Support",
            text: "Mentor connections and profile-based recommendations for smarter decisions.",
          },
        ],
      };

  return (
    <section id="about" className="section-wrapper about-section">
      <div className="sections-container">
        <p className="about-kicker">{content.kicker}</p>
        <h2>{content.title}</h2>
        <p>{content.intro}</p>

        <div className="about-points">
          {content.points.map((point) => (
            <article key={point.title}>
              <h3>{point.title}</h3>
              <p>{point.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutSection;

