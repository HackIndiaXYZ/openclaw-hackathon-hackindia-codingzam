import { useMode } from "../context/ModeContext";
import gsap from "gsap";
import { useLanguage } from "../context/useLanguage";

const modeDetails = {
  default: {
    emoji: "🎯",
    label: "Default",
    description: "Professional and clear",
  },
  zenz: {
    emoji: "✨",
    label: "Zenz",
    description: "Calm, friendly, lightly playful",
  },
  savage: {
    emoji: "🔥",
    label: "Savage",
    description: "Bold, funny, reality-check style",
  },
};

function ModeSelector() {
  const { mode, setMode, modes } = useMode();
  const { language } = useLanguage();

  const translatedDetails = {
    default: {
      ...modeDetails.default,
      label: language === "hi" ? "डिफॉल्ट" : modeDetails.default.label,
      description: language === "hi" ? "प्रोफेशनल और स्पष्ट" : modeDetails.default.description,
    },
    zenz: {
      ...modeDetails.zenz,
      label: language === "hi" ? "ज़ेन्ज़" : modeDetails.zenz.label,
      description: language === "hi" ? "शांत, दोस्ताना, हल्का playful" : modeDetails.zenz.description,
    },
    savage: {
      ...modeDetails.savage,
      label: language === "hi" ? "सैवेज" : modeDetails.savage.label,
      description: language === "hi" ? "बोल्ड, मजेदार, reality-check स्टाइल" : modeDetails.savage.description,
    },
  };

  const handleModeChange = (newMode) => {
    // Trigger animation on button switch
    gsap.to(".mode-btn.active", {
      scale: 0.95,
      duration: 0.15,
      ease: "back.inOut",
      onComplete: () => {
        setMode(newMode);
        gsap.to(`.mode-btn[data-mode="${newMode}"]`, {
          scale: 1,
          duration: 0.2,
          ease: "back.out",
        });
      },
    });
  };

  return (
    <div className="mode-selector-wrapper">
      <div className="mode-selector" role="group" aria-label={language === "hi" ? "ऐप मोड चुनें" : "Select app mode"}>
        {modes.map((item) => (
          <button
            key={item}
            type="button"
            data-mode={item}
            className={mode === item ? "mode-btn active" : "mode-btn"}
            onClick={() => handleModeChange(item)}
            title={translatedDetails[item].description}
          >
            <span className="mode-emoji">{translatedDetails[item].emoji}</span>
            <span className="mode-label">{translatedDetails[item].label}</span>
          </button>
        ))}
      </div>
      <div className="mode-description">
        <p>{translatedDetails[mode].description}</p>
      </div>
    </div>
  );
}

export default ModeSelector;

