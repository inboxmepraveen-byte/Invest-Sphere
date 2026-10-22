import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadState, saveState, STORAGE_KEYS } from "../utils/storage";
import { SEED_NOTIFICATIONS } from "../data/notifications";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() =>
    loadState(STORAGE_KEYS.notifications, SEED_NOTIFICATIONS)
  );

  useEffect(() => {
    saveState(STORAGE_KEYS.notifications, notifications);
  }, [notifications]);

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = (notification) => {
    setNotifications((prev) => [
      { id: `ntf-${Date.now()}`, date: new Date().toISOString(), read: false, ...notification },
      ...prev,
    ]);
  };

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  return (
    <NotificationContext.Provider
      value={{ notifications, markAsRead, markAllAsRead, addNotification, unreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
