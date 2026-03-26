import { useLanguage } from "../../context/useLanguage";

function FeaturesSection() {
  const { language } = useLanguage();

  const content = language === "hi"
    ? {
        kicker: "🎨 प्लेटफ़ॉर्म फीचर्स",
        title: "आगे बढ़ने के लिए ज़रूरी सब कुछ, एक ही जगह।",
        cards: [
          {
            title: "Best Match",
            text: "आपकी प्रोफाइल के आधार पर इंटर्नशिप और स्कॉलरशिप सुझाव पाएं।",
          },
          {
            title: "Quick Tasks",
            text: "ईमेल जेनरेटर, PDF टूल्स और असाइनमेंट हेल्पर जैसे टूल्स इस्तेमाल करें।",
          },
          {
            title: "Career Roadmap",
            text: "अपने लक्ष्य करियर के लिए पर्सनलाइज़्ड स्टेप-बाय-स्टेप प्लान बनाएं।",
          },
          {
            title: "Connect Seniors",
            text: "मेंटर्स खोजें, कॉल बुक करें और प्रैक्टिकल करियर सवाल पूछें।",
          },
        ],
      }
    : {
        kicker: "🎨 Platform Features",
        title: "Everything you need to grow, in one place.",
        cards: [
          {
            title: "Best Match",
            text: "Get internship and scholarship suggestions based on your profile.",
          },
          {
            title: "Quick Tasks",
            text: "Use tools like email generator, PDF utilities, and assignment helper.",
          },
          {
            title: "Career Roadmap",
            text: "Generate personalized step-by-step plans for your target career path.",
          },
          {
            title: "Connect Seniors",
            text: "Discover mentors, book calls, and ask practical career questions.",
          },
        ],
      };

  return (
    <section id="features" className="section-wrapper home-features-section">
      <div className="sections-container">
        <p className="features-kicker">{content.kicker}</p>
        <h2>{content.title}</h2>
        <div className="home-feature-grid">
          {content.cards.map((feature) => (
            <article key={feature.title} className="home-feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;

