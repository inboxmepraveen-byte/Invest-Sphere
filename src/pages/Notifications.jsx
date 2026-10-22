import { useMemo, useState } from "react";
import { Bell, TrendingUp, Target, Eye, BookOpen, Wallet, CheckCheck } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { NOTIFICATION_CATEGORY_LABELS } from "../data/notifications";
import { CategoryPills } from "../components/FilterBar";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import { formatDate, timeAgo } from "../utils/formatting";
import "./Notifications.css";

const CATEGORY_ICON = { sip: Wallet, portfolio: TrendingUp, goal: Target, watchlist: Eye, education: BookOpen };

export default function Notifications() {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();
  const [filter, setFilter] = useState("All");

  const categoryOptions = ["All", "Unread", ...Object.values(NOTIFICATION_CATEGORY_LABELS)];

  const filtered = useMemo(() => {
    const sorted = [...notifications].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (filter === "All") return sorted;
    if (filter === "Unread") return sorted.filter((n) => !n.read);
    const categoryKey = Object.entries(NOTIFICATION_CATEGORY_LABELS).find(([, label]) => label === filter)?.[0];
    return sorted.filter((n) => n.category === categoryKey);
  }, [notifications, filter]);

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p>{unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.` : "You're all caught up."}</p>
        </div>
        {unreadCount > 0 && (
          <div className="page-header-actions">
            <Button variant="secondary" icon={CheckCheck} onClick={markAllAsRead}>
              Mark all read
            </Button>
          </div>
        )}
      </div>

      <div style={{ marginBottom: 18 }}>
        <CategoryPills options={categoryOptions} value={filter} onChange={setFilter} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="Nothing to show for this filter." />
      ) : (
        <div className="notif-list">
          {filtered.map((n) => {
            const Icon = CATEGORY_ICON[n.category] || Bell;
            return (
              <button key={n.id} className={n.read ? "notif-list-item" : "notif-list-item unread"} onClick={() => markAsRead(n.id)}>
                <div className="notif-list-icon">
                  <Icon size={17} />
                </div>
                <div className="notif-list-body">
                  <div className="notif-list-title">{n.title}</div>
                  <div className="notif-list-message">{n.message}</div>
                  <div className="notif-list-time">{formatDate(n.date)} · {timeAgo(n.date)}</div>
                </div>
                {!n.read && <span className="badge badge-neutral">New</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
