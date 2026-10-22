import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Briefcase } from "lucide-react";
import { getStockById, buildStockHistory } from "../data/stocks";
import { toLabeledSeries } from "../utils/mockSeries";
import ChartCard from "../components/ChartCard";
import Button from "../components/Button";
import InvestModal from "../components/InvestModal";
import EmptyState from "../components/EmptyState";
import { useWatchlist } from "../context/WatchlistContext";
import { formatCurrency, formatPercent, formatCompactNumber } from "../utils/formatting";
import "./DetailsPage.css";

export default function StockDetails() {
  const { id } = useParams();
  const stock = getStockById(id);
  const { isWatchlisted, toggleWatchlist } = useWatchlist();
  const [investOpen, setInvestOpen] = useState(false);

  if (!stock) {
    return (
      <div className="container">
        <EmptyState title="Stock not found" description="This stock doesn't exist or was removed." />
      </div>
    );
  }

  const watchlisted = isWatchlisted("stock", stock.id);
  const positive = stock.changePct >= 0;

  return (
    <div className="container">
      <div className="details-header">
        <div>
          <div className="details-eyebrow">{stock.symbol} · {stock.sector}</div>
          <h1>{stock.name}</h1>
          <div className="details-price-row">
            <span className="details-price mono">{formatCurrency(stock.price, { decimals: 2 })}</span>
            <span className={positive ? "positive" : "negative"}>
              {formatCurrency(stock.change, { decimals: 2 })} ({formatPercent(stock.changePct)}) today
            </span>
          </div>
        </div>
        <div className="details-actions">
          <Button variant="secondary" icon={Star} onClick={() => toggleWatchlist({ type: "stock", refId: stock.id, name: stock.name, category: stock.sector })}>
            {watchlisted ? "In Watchlist" : "Add to Watchlist"}
          </Button>
          <Button variant="primary" icon={Briefcase} onClick={() => setInvestOpen(true)}>
            Add to Portfolio
          </Button>
        </div>
      </div>

      <div className="details-grid">
        <div className="panel">
          <ChartCard
            periods={["1D", "1W", "1M", "6M", "1Y", "5Y"]}
            defaultPeriod="1M"
            positive={positive}
            getSeries={(period) => toLabeledSeries(buildStockHistory(stock, period), period)}
          />
        </div>

        <div className="panel stat-tiles">
          <div className="stat-tile">
            <div className="stat-tile-label">Open</div>
            <div className="stat-tile-value">{formatCurrency(stock.open, { decimals: 2 })}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-label">High</div>
            <div className="stat-tile-value">{formatCurrency(stock.high, { decimals: 2 })}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-label">Low</div>
            <div className="stat-tile-value">{formatCurrency(stock.low, { decimals: 2 })}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-label">52W High</div>
            <div className="stat-tile-value">{formatCurrency(stock.week52High, { decimals: 2 })}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-label">52W Low</div>
            <div className="stat-tile-value">{formatCurrency(stock.week52Low, { decimals: 2 })}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-label">Volume</div>
            <div className="stat-tile-value">{formatCompactNumber(stock.volume)}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-label">Market Cap</div>
            <div className="stat-tile-value">{formatCurrency(stock.marketCap * 1e5, { compact: true })}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-label">P/E Ratio</div>
            <div className="stat-tile-value">{stock.pe}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-label">Dividend Yield</div>
            <div className="stat-tile-value">{stock.dividendYield}%</div>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 20 }}>
        <p className="text-secondary" style={{ margin: "0 0 10px", fontSize: 12.5, lineHeight: 1.5 }}>
          This is a portfolio-management simulation — adding to your portfolio here does not execute a real
          trade.
        </p>
        <Link to="/stocks" className="link" style={{ fontSize: 12.5 }}>
          ← Back to Stocks
        </Link>
      </div>

      <InvestModal
        open={investOpen}
        onClose={() => setInvestOpen(false)}
        type="stock"
        refId={stock.id}
        name={stock.name}
        price={stock.price}
        minAmount={stock.price}
        unitLabel="shares"
      />
    </div>
  );
}
