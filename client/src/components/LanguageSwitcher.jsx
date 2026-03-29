import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useLanguage } from "../context/useLanguage";

const languages = [
  { code: "en", key: "common.english", flag: "🌐" },
  { code: "hi", key: "common.hindi", flag: "🇮🇳" },
];

function LanguageSwitcher() {
  const {
    language,
    setLanguage,
    toggleLanguage,
    resetLanguage,
    setAutoLanguage,
    t,
    isHindi,
  } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const switcherRef = useRef(null);

  useEffect(() => {
    // Trigger smooth transition
    gsap.to(".language-switcher-btn", {
      scale: 0.95,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    });
  }, [language]);

  // Close dropdown on outside click and Escape for cleaner interaction.
  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (!switcherRef.current || switcherRef.current.contains(event.target)) {
        return;
      }

      setDropdownOpen(false);
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLanguageChange = (code) => {
    setLanguage(code);
    setDropdownOpen(false);
  };

  const currentLang = languages.find((l) => l.code === language);
  const currentLabel = currentLang ? t(currentLang.key) : t("common.english");

  return (
    <div ref={switcherRef} className="language-switcher">
      <button
        type="button"
        className="language-switcher-btn"
        onClick={() => setDropdownOpen((prev) => !prev)}
        aria-label={t("common.changeLanguage")}
        title={`${t("common.language")}: ${currentLabel}`}
      >
        <span className="language-flag">{currentLang.flag}</span>
      </button>

      {dropdownOpen && (
        <div className="language-dropdown">
          <button
            type="button"
            className="language-option"
            onClick={() => {
              toggleLanguage();
              setDropdownOpen(false);
            }}
          >
            <span>🔁</span>
            <span>{isHindi ? "तुरंत बदलें" : "Quick Toggle"}</span>
          </button>

          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              className={`language-option ${language === lang.code ? "active" : ""}`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span>{lang.flag}</span>
              <span>{t(lang.key)}</span>
            </button>
          ))}

          <button
            type="button"
            className="language-option"
            onClick={() => {
              setAutoLanguage();
              setDropdownOpen(false);
            }}
          >
            <span>🧭</span>
            <span>{isHindi ? "ऑटो डिटेक्ट" : "Auto Detect"}</span>
          </button>

          <button
            type="button"
            className="language-option"
            onClick={() => {
              resetLanguage();
              setDropdownOpen(false);
            }}
          >
            <span>↩</span>
            <span>{isHindi ? "डिफॉल्ट अंग्रेजी" : "Reset English"}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;

