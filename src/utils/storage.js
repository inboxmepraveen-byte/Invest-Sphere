const PREFIX = "investsphere:";

export function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveState(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage unavailable or full — fail silently, state stays in memory */
  }
}

export const STORAGE_KEYS = {
  watchlist: "watchlist",
  portfolio: "portfolio",
  transactions: "transactions",
  goals: "goals",
  notifications: "notifications",
  theme: "theme",
  settings: "settings",
  profile: "profile",
  cart: "cart",
};
