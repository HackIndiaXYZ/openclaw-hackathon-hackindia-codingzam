import ModeSelector from "../ModeSelector";
import { useLanguage } from "../../context/useLanguage";

function ModeSelectionSection() {
  const { language } = useLanguage();

  const content = language === "hi"
    ? {
        kicker: "⚡ अपना मूड चुनें",
        title: "अपने अनुभव का टोन कभी भी बदलें।",
        intro: "अपनी पर्सनैलिटी के हिसाब से मोड चुनें और कभी भी बदलें।",
      }
    : {
        kicker: "⚡ Choose Your Vibe",
        title: "Switch the tone of your experience anytime.",
        intro: "Pick a mode that matches your personality and stick with it—or change it whenever you want.",
      };

  return (
    <section className="section-wrapper mode-section">
      <div className="sections-container">
        <p className="mode-kicker">{content.kicker}</p>
        <h2>{content.title}</h2>
        <p className="mode-intro">{content.intro}</p>
        <ModeSelector />
      </div>
    </section>
  );
}

export default ModeSelectionSection;

