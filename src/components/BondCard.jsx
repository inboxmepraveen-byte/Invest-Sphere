import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import Button from "./Button";
import { useWatchlist } from "../context/WatchlistContext";
import { formatCurrency, formatDate } from "../utils/formatting";
import "./Card.css";

export default function BondCard({ bond }) {
  const navigate = useNavigate();
  const { isWatchlisted, toggleWatchlist } = useWatchlist();
  const watchlisted = isWatchlisted("bond", bond.id);

  return (
    <div className="entity-card" onClick={() => navigate(`/bonds/${bond.id}`)}>
      <div className="entity-card-top">
        <div>
          <div className="entity-card-name">{bond.name}</div>
          <div className="entity-card-meta">{bond.issuer} · {bond.type}</div>
        </div>
        <button
          className={watchlisted ? "watch-btn active" : "watch-btn"}
          onClick={(e) => {
            e.stopPropagation();
            toggleWatchlist({ type: "bond", refId: bond.id, name: bond.name, category: bond.type });
          }}
          aria-label="Toggle watchlist"
        >
          <Star size={15} fill={watchlisted ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="entity-card-stats">
        <div className="stat">
          <span className="stat-label">Yield</span>
          <span className="stat-value positive">{bond.yield}%</span>
        </div>
        <div className="stat">
          <span className="stat-label">Coupon</span>
          <span className="stat-value">{bond.coupon}%</span>
        </div>
        <div className="stat">
          <span className="stat-label">Rating</span>
          <span className="stat-value">{bond.rating}</span>
        </div>
      </div>

      <div className="entity-card-stats" style={{ borderTop: "none", paddingTop: 0 }}>
        <div className="stat">
          <span className="stat-label">Maturity</span>
          <span className="stat-value">{formatDate(bond.maturity)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Min. Investment</span>
          <span className="stat-value">{formatCurrency(bond.minInvestment)}</span>
        </div>
      </div>

      <div className="entity-card-actions">
        <Button variant="secondary" size="sm" className="btn-block" onClick={(e) => { e.stopPropagation(); navigate(`/bonds/${bond.id}`); }}>
          View Details
        </Button>
        <Button
          variant={watchlisted ? "outline" : "primary"}
          size="sm"
          className="btn-block"
          onClick={(e) => {
            e.stopPropagation();
            toggleWatchlist({ type: "bond", refId: bond.id, name: bond.name, category: bond.type });
          }}
        >
          {watchlisted ? "In Watchlist" : "Add to Watchlist"}
        </Button>
      </div>
    </div>
  );
}
