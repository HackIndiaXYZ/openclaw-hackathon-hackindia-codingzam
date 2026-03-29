import { useContext } from "react";
import { ModeContext } from "./modeStore";

export function useMode() {
  const context = useContext(ModeContext);

  if (!context) {
    throw new Error("useMode must be used inside ModeProvider");
  }

  return context;
}
