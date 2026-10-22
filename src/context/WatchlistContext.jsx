import { createContext, useContext, useEffect, useState } from "react";
import { loadState, saveState, STORAGE_KEYS } from "../utils/storage";
import { useToast } from "./ToastContext";

const WatchlistContext = createContext(null);

export function WatchlistProvider({ children }) {
  const [items, setItems] = useState(() => loadState(STORAGE_KEYS.watchlist, []));
  const { showToast } = useToast();

  useEffect(() => {
    saveState(STORAGE_KEYS.watchlist, items);
  }, [items]);

  const isWatchlisted = (type, refId) => items.some((i) => i.type === type && i.refId === refId);

  const addToWatchlist = (entry) => {
    if (isWatchlisted(entry.type, entry.refId)) return;
    setItems((prev) => [...prev, { ...entry, addedAt: new Date().toISOString() }]);
    showToast(`Added ${entry.name} to watchlist`);
  };

  const removeFromWatchlist = (type, refId, name) => {
    setItems((prev) => prev.filter((i) => !(i.type === type && i.refId === refId)));
    showToast(`Removed ${name || "item"} from watchlist`);
  };

  const toggleWatchlist = (entry) => {
    if (isWatchlisted(entry.type, entry.refId)) {
      removeFromWatchlist(entry.type, entry.refId, entry.name);
    } else {
      addToWatchlist(entry);
    }
  };

  return (
    <WatchlistContext.Provider
      value={{ items, isWatchlisted, addToWatchlist, removeFromWatchlist, toggleWatchlist }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error("useWatchlist must be used within WatchlistProvider");
  return ctx;
}
