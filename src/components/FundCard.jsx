import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import Sparkline from "./Sparkline";
import Button from "./Button";
import { useWatchlist } from "../context/WatchlistContext";
import { formatPercent, formatCurrency } from "../utils/formatting";
import "./Card.css";

export default function FundCard({ fund }) {
  const navigate = useNavigate();
  const { isWatchlisted, toggleWatchlist } = useWatchlist();
  const watchlisted = isWatchlisted("mutualFund", fund.id);
  const positive = fund.r1y >= 0;

  return (
    <div className="entity-card" onClick={() => navigate(`/mutual-funds/${fund.id}`)}>
      <div className="entity-card-top">
        <div>
          <div className="entity-card-name">{fund.name}</div>
          <div className="entity-card-meta">{fund.category} · {fund.amc}</div>
        </div>
        <button
          className={watchlisted ? "watch-btn active" : "watch-btn"}
          onClick={(e) => {
            e.stopPropagation();
            toggleWatchlist({ type: "mutualFund", refId: fund.id, name: fund.name, category: fund.category });
          }}
          aria-label="Toggle watchlist"
        >
          <Star size={15} fill={watchlisted ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="entity-card-chart">
        <Sparkline data={fund.sparkline} positive={positive} height={44} />
      </div>

      <div className="entity-card-stats">
        <div className="stat">
          <span className="stat-label">1Y Return</span>
          <span className={positive ? "stat-value positive" : "stat-value negative"}>{formatPercent(fund.r1y)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Risk</span>
          <span className="stat-value">{fund.risk}</span>
        </div>
        <div className="stat">
          <span className="stat-label">NAV</span>
          <span className="stat-value mono">{formatCurrency(fund.nav, { decimals: 2 })}</span>
        </div>
      </div>

      <div className="entity-card-actions">
        <Button variant="secondary" size="sm" className="btn-block" onClick={(e) => { e.stopPropagation(); navigate(`/mutual-funds/${fund.id}`); }}>
          View Details
        </Button>
        <Button
          variant={watchlisted ? "outline" : "primary"}
          size="sm"
          className="btn-block"
          onClick={(e) => {
            e.stopPropagation();
            toggleWatchlist({ type: "mutualFund", refId: fund.id, name: fund.name, category: fund.category });
          }}
        >
          {watchlisted ? "In Watchlist" : "Add to Watchlist"}
        </Button>
      </div>
    </div>
  );
}
