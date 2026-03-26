import { useState } from "react";
import { useLanguage } from "../../context/useLanguage";

function HomeNavbar() {
  // Mobile menu state for compact navigation layout.
  const [menuOpen, setMenuOpen] = useState(false);
  const { language } = useLanguage();

  const text = language === "hi"
    ? {
        home: "होम",
        about: "हमारे बारे में",
        features: "फीचर्स",
        faq: "अक्सर पूछे जाने वाले सवाल",
        contact: "संपर्क",
        dashboard: "डैशबोर्ड",
        menu: "मेन्यू",
      }
    : {
        home: "Home",
        about: "About Us",
        features: "Features",
        faq: "FAQ",
        contact: "Contact",
        dashboard: "Dashboard",
        menu: "Menu",
      };

  return (
    <header className="home-navbar">
      <div className="home-branding">
        <h2>ExplainX.ai</h2>
      </div>

      <button
        type="button"
        className={menuOpen ? "hamburger open" : "hamburger"}
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label={text.menu}
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={menuOpen ? "nav-links open" : "nav-links"}>
        <a href="#home" onClick={() => setMenuOpen(false)}>{text.home}</a>
        <a href="#about" onClick={() => setMenuOpen(false)}>{text.about}</a>
        <a href="#features" onClick={() => setMenuOpen(false)}>{text.features}</a>
        <a href="#faq" onClick={() => setMenuOpen(false)}>{text.faq}</a>
        <a href="#contact" onClick={() => setMenuOpen(false)}>{text.contact}</a>
      </nav>
    </header>
  );
}

export default HomeNavbar;

