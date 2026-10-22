import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Bell, Menu, X, ChevronsRight, ShoppingCart } from "lucide-react";
import SearchBar from "./SearchBar";
import NotificationPanel from "./NotificationPanel";
import { useNotifications } from "../context/NotificationContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

const PRIMARY_LINKS = [
  { to: "/mutual-funds", label: "Mutual Funds" },
  { to: "/stocks", label: "Stocks" },
  { to: "/bonds", label: "Bonds" },
];

const SECONDARY_LINKS = [
  { to: "/dashboard", label: "Explore" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/watchlist", label: "Watchlist" },
  { to: "/goals", label: "Goals" },
  { to: "/analytics", label: "Analytics" },
  { to: "/calculators", label: "Calculators" },
  { to: "/learn", label: "Learn" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const { items: cartItems } = useCart();

  useEffect(() => {
    function onClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [navigate]);

  return (
    <header className="navbar">
      <div className="navbar-top container">
        <button className="mobile-menu-btn" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <NavLink to="/" className="brand">
          <span className="brand-mark">
            <ChevronsRight size={16} strokeWidth={2.75} />
          </span>
          <span className="brand-name">InvestSphere</span>
        </NavLink>

        <nav className="navbar-primary">
          {PRIMARY_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-search">
          <SearchBar variant="nav" />
        </div>

        <div className="navbar-actions">
          <NavLink to="/cart" className="icon-btn" aria-label="Investment cart">
            <ShoppingCart size={18} />
            {cartItems.length > 0 && <span className="icon-badge">{cartItems.length > 9 ? "9+" : cartItems.length}</span>}
          </NavLink>
          <div className="notif-wrap" ref={notifRef}>
            <button className="icon-btn" onClick={() => setNotifOpen((v) => !v)} aria-label="Notifications">
              <Bell size={18} />
              {unreadCount > 0 && <span className="icon-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>}
            </button>
            {notifOpen && (
              <div className="notif-dropdown">
                <NotificationPanel
                  onNavigateAll={() => {
                    setNotifOpen(false);
                    navigate("/notifications");
                  }}
                />
              </div>
            )}
          </div>
          <NavLink to="/profile" className="avatar-link" aria-label="Profile">
            <span className="avatar">IS</span>
          </NavLink>
        </div>
      </div>

      <div className="navbar-sub container">
        {SECONDARY_LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? "subnav-link active" : "subnav-link")}>
            {link.label}
          </NavLink>
        ))}
      </div>

      {mobileOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-search">
            <SearchBar variant="mobile" autoFocus onNavigate={() => setMobileOpen(false)} />
          </div>
          {[...PRIMARY_LINKS, ...SECONDARY_LINKS].map((link) => (
            <NavLink key={link.to} to={link.to} className="mobile-link" onClick={() => setMobileOpen(false)}>
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/cart" className="mobile-link" onClick={() => setMobileOpen(false)}>
            Investment Cart
          </NavLink>
          <NavLink to="/risk-assessment" className="mobile-link" onClick={() => setMobileOpen(false)}>
            Risk Assessment
          </NavLink>
          <NavLink to="/notifications" className="mobile-link" onClick={() => setMobileOpen(false)}>
            Notifications
          </NavLink>
          <NavLink to="/profile" className="mobile-link" onClick={() => setMobileOpen(false)}>
            Profile
          </NavLink>
          <NavLink to="/settings" className="mobile-link" onClick={() => setMobileOpen(false)}>
            Settings
          </NavLink>
        </div>
      )}
    </header>
  );
}
