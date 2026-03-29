import { useCallback, useEffect, useMemo, useState } from "react";
import { LanguageContext } from "./languageStore";

const VALID_LANGUAGES = ["en", "hi"];

// Detect the best default language from browser settings.
const detectBrowserLanguage = () => {
  if (typeof navigator === "undefined") {
    return "en";
  }

  const browserLang = (navigator.language || "en").toLowerCase();
  return browserLang.startsWith("hi") ? "hi" : "en";
};

const translations = {
  en: {
    common: {
      language: "Language",
      english: "English",
      hindi: "Hindi",
      changeLanguage: "Change language",
      loading: "Loading...",
      back: "Back",
      next: "Next",
      submit: "Submit",
      clear: "Clear",
      save: "Save",
      yes: "Yes",
      no: "No",
    },
  },
  hi: {
    common: {
      language: "भाषा",
      english: "अंग्रेजी",
      hindi: "हिंदी",
      changeLanguage: "भाषा बदलें",
      loading: "लोड हो रहा है...",
      back: "वापस",
      next: "आगे",
      submit: "सबमिट करें",
      clear: "साफ करें",
      save: "सेव करें",
      yes: "हाँ",
      no: "नहीं",
    },
  },
};

function interpolate(template, vars) {
  if (!vars) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_, key) => {
    if (vars[key] === undefined || vars[key] === null) {
      return `{${key}}`;
    }

    return String(vars[key]);
  });
}

function getByPath(object, path) {
  return path.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), object);
}

export function LanguageProvider({ children }) {
  // Keep language preference persistent across sessions.
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem("language");
    return VALID_LANGUAGES.includes(saved) ? saved : detectBrowserLanguage();
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  const t = useCallback((key, fallback = "", vars) => {
    const selected = translations[language] || translations.en;
    const fallbackSet = translations.en;

    const direct = getByPath(selected, key);
    if (typeof direct === "string") {
      return interpolate(direct, vars);
    }

    const fallbackValue = getByPath(fallbackSet, key);
    if (typeof fallbackValue === "string") {
      return interpolate(fallbackValue, vars);
    }

    return interpolate(fallback || key, vars);
  }, [language]);

  // Utility helpers used by pages to keep text/format behavior consistent.
  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "en" ? "hi" : "en"));
  }, []);

  const resetLanguage = useCallback(() => {
    setLanguage("en");
  }, []);

  const setAutoLanguage = useCallback(() => {
    setLanguage(detectBrowserLanguage());
  }, []);

  const formatNumber = useCallback(
    (value) => new Intl.NumberFormat(language === "hi" ? "hi-IN" : "en-US").format(value),
    [language]
  );

  const formatDate = useCallback(
    (value) => new Intl.DateTimeFormat(language === "hi" ? "hi-IN" : "en-US").format(new Date(value)),
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      languages: VALID_LANGUAGES,
      t,
      isHindi: language === "hi",
      toggleLanguage,
      resetLanguage,
      setAutoLanguage,
      formatNumber,
      formatDate,
    }),
    [formatDate, formatNumber, language, resetLanguage, setAutoLanguage, t, toggleLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

