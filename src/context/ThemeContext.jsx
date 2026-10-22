import { createContext, useContext, useEffect, useState } from "react";
import { loadState, saveState, STORAGE_KEYS } from "../utils/storage";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => loadState(STORAGE_KEYS.theme, "dark"));

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    saveState(STORAGE_KEYS.theme, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
