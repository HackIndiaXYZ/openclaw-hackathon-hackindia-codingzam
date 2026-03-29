import { useEffect, useMemo, useState } from "react";
import { ModeContext, VALID_MODES } from "./modeStore";

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

