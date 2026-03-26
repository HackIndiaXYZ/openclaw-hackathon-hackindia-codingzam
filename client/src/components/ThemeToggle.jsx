import { useEffect, useState } from "react";
import gsap from "gsap";

function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    gsap.to(".theme-toggle-icon", {
      rotation: 180,
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
        gsap.set(".theme-toggle-icon", { rotation: 0 });
      },
    });
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <span className="theme-toggle-icon">
        {theme === "dark" ? "🌙" : "☀️"}
      </span>
    </button>
  );
}

export default ThemeToggle;

