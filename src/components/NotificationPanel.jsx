import { Bell, TrendingUp, Target, Eye, BookOpen, Wallet, CheckCheck } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { timeAgo } from "../utils/formatting";
import EmptyState from "./EmptyState";
import "./NotificationPanel.css";

const CATEGORY_ICON = {
  sip: Wallet,
  portfolio: TrendingUp,
  goal: Target,
  watchlist: Eye,
  education: BookOpen,
};

export default function NotificationPanel({ onNavigateAll }) {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();
  const recent = notifications.slice(0, 8);

  return (
    <div className="notif-panel">
      <div className="notif-panel-header">
        <span>Notifications</span>
        {unreadCount > 0 && (
          <button className="notif-mark-all" onClick={markAllAsRead}>
            <CheckCheck size={13} />
            Mark all read
          </button>
        )}
      </div>
      <div className="notif-panel-body">
        {recent.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications" description="You're all caught up." />
        ) : (
          recent.map((n) => {
            const Icon = CATEGORY_ICON[n.category] || Bell;
            return (
              <button
                key={n.id}
                className={n.read ? "notif-item" : "notif-item unread"}
                onClick={() => markAsRead(n.id)}
              >
                <div className="notif-item-icon">
                  <Icon size={15} />
                </div>
                <div className="notif-item-body">
                  <div className="notif-item-title">{n.title}</div>
                  <div className="notif-item-message">{n.message}</div>
                  <div className="notif-item-time">{timeAgo(n.date)}</div>
                </div>
                {!n.read && <span className="notif-dot" />}
              </button>
            );
          })
        )}
      </div>
      <button className="notif-panel-footer" onClick={onNavigateAll}>
        View all notifications
      </button>
    </div>
  );
}
