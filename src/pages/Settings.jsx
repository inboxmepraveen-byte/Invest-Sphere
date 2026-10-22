import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import { loadState, saveState, STORAGE_KEYS } from "../utils/storage";
import "./Settings.css";

const DEFAULT_SETTINGS = {
  sipReminders: true,
  portfolioAlerts: true,
  watchlistAlerts: true,
  educationalUpdates: false,
};

const TOGGLES = [
  { key: "sipReminders", label: "SIP reminders", desc: "Get notified before scheduled SIP investments." },
  { key: "portfolioAlerts", label: "Portfolio alerts", desc: "Weekly summaries of portfolio value changes." },
  { key: "watchlistAlerts", label: "Watchlist alerts", desc: "Significant price movements on watchlist items." },
  { key: "educationalUpdates", label: "Educational updates", desc: "New articles added to the Learning Center." },
];

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState(() => loadState(STORAGE_KEYS.settings, DEFAULT_SETTINGS));
  const { showToast } = useToast();

  useEffect(() => {
    saveState(STORAGE_KEYS.settings, settings);
  }, [settings]);

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    showToast("Settings updated");
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Control how InvestSphere looks and how it notifies you.</p>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 20, maxWidth: 640 }}>
        <div className="section-header">
          <h2>Theme</h2>
        </div>
        <div className="theme-toggle-row">
          <button className={theme === "dark" ? "theme-option active" : "theme-option"} onClick={() => setTheme("dark")}>
            <Moon size={16} />
            Dark
          </button>
          <button className={theme === "light" ? "theme-option active" : "theme-option"} onClick={() => setTheme("light")}>
            <Sun size={16} />
            Light
          </button>
        </div>
      </div>

      <div className="panel" style={{ maxWidth: 640 }}>
        <div className="section-header">
          <h2>Notifications</h2>
        </div>
        {TOGGLES.map((t) => (
          <div className="settings-toggle-row" key={t.key}>
            <div>
              <div className="settings-toggle-label">{t.label}</div>
              <div className="settings-toggle-desc">{t.desc}</div>
            </div>
            <button
              className={settings[t.key] ? "switch active" : "switch"}
              onClick={() => toggle(t.key)}
              role="switch"
              aria-checked={settings[t.key]}
              aria-label={t.label}
            >
              <span className="switch-knob" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
