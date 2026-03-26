import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ModeContext = createContext(null);

const VALID_MODES = ["default", "zenz", "savage"];

export function ModeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("mode");
    return VALID_MODES.includes(savedMode) ? savedMode : "default";
  });

  useEffect(() => {
    // Persist mode so it stays selected after page refresh.
    localStorage.setItem("mode", mode);
    document.body.setAttribute("data-mode", mode);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      modes: VALID_MODES,
    }),
    [mode]
  );

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const context = useContext(ModeContext);

  if (!context) {
    throw new Error("useMode must be used inside ModeProvider");
  }

  return context;
}

