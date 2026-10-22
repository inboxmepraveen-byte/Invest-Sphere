import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import Sparkline from "./Sparkline";
import Button from "./Button";
import { useWatchlist } from "../context/WatchlistContext";
import { formatPercent, formatCurrency } from "../utils/formatting";
import "./Card.css";

export default function StockCard({ stock }) {
  const navigate = useNavigate();
  const { isWatchlisted, toggleWatchlist } = useWatchlist();
  const watchlisted = isWatchlisted("stock", stock.id);
  const positive = stock.changePct >= 0;

  return (
    <div className="entity-card" onClick={() => navigate(`/stocks/${stock.id}`)}>
      <div className="entity-card-top">
        <div>
          <div className="entity-card-name">{stock.symbol}</div>
          <div className="entity-card-meta">{stock.name} · {stock.sector}</div>
        </div>
        <button
          className={watchlisted ? "watch-btn active" : "watch-btn"}
          onClick={(e) => {
            e.stopPropagation();
            toggleWatchlist({ type: "stock", refId: stock.id, name: stock.name, category: stock.sector });
          }}
          aria-label="Toggle watchlist"
        >
          <Star size={15} fill={watchlisted ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="price-line">
        <span className="price">{formatCurrency(stock.price, { decimals: 2 })}</span>
        <span className={positive ? "positive" : "negative"}>
          {formatCurrency(stock.change, { decimals: 2 })} ({formatPercent(stock.changePct)})
        </span>
      </div>

      <div className="entity-card-chart">
        <Sparkline data={stock.sparkline} positive={positive} height={44} />
      </div>

      <div className="entity-card-actions">
        <Button variant="secondary" size="sm" className="btn-block" onClick={(e) => { e.stopPropagation(); navigate(`/stocks/${stock.id}`); }}>
          View Details
        </Button>
        <Button
          variant={watchlisted ? "outline" : "primary"}
          size="sm"
          className="btn-block"
          onClick={(e) => {
            e.stopPropagation();
            toggleWatchlist({ type: "stock", refId: stock.id, name: stock.name, category: stock.sector });
          }}
        >
          {watchlisted ? "In Watchlist" : "Add to Watchlist"}
        </Button>
      </div>
    </div>
  );
}
