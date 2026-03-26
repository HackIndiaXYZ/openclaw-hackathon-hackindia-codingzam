import { useEffect, useState } from "react";
import { subscribeToGlobalLoading } from "../services/apiClient";
import { useLanguage } from "../context/useLanguage";

function GlobalLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const unsubscribe = subscribeToGlobalLoading(setIsLoading);
    return unsubscribe;
  }, []);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="global-loader" role="status" aria-live="polite">
      <div className="global-loader-box">
        <span className="loader-dot" />
        <p>{language === "hi" ? "लोड हो रहा है..." : "Loading..."}</p>
      </div>
    </div>
  );
}

export default GlobalLoading;

