import { useLanguage } from "../../context/useLanguage";

function HomeFooter() {
  const { language } = useLanguage();

  const content = language === "hi"
    ? {
        tagline: "छात्रों के लिए करियर स्पष्टता और व्यावहारिक निष्पादन।",
        quickLinks: "क्विक लिंक्स",
        home: "होम",
        about: "अबाउट",
        features: "फीचर्स",
        faq: "FAQ",
        contact: "संपर्क",
        hours: "सोम - शनि | सुबह 9:00 - शाम 6:00",
        note: "2026 ExplainX.ai. साफ और स्थिर विकास के लिए बनाया गया।",
      }
    : {
        tagline: "Career clarity and practical execution for students.",
        quickLinks: "Quick Links",
        home: "Home",
        about: "About",
        features: "Features",
        faq: "FAQ",
        contact: "Contact",
        hours: "Mon - Sat | 9:00 AM - 6:00 PM",
        note: "2026 ExplainX.ai. Built for clear, calm growth.",
      };

  return (
    <footer id="contact" className="home-footer">
      <div className="footer-grid">
        <section>
          <h3>ExplainX.ai</h3>
          <p>{content.tagline}</p>
        </section>

        <section>
          <h4>{content.quickLinks}</h4>
          <a href="#home">{content.home}</a>
          <a href="#about">{content.about}</a>
          <a href="#features">{content.features}</a>
          <a href="#faq">{content.faq}</a>
        </section>

        <section>
          <h4>{content.contact}</h4>
          <p>support@explainx.ai</p>
          <p>{content.hours}</p>
        </section>
      </div>

      <p className="footer-note">{content.note}</p>
    </footer>
  );
}

export default HomeFooter;

