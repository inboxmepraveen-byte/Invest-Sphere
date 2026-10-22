import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Star, GitCompare } from "lucide-react";
import { getFundById, buildFundHistory } from "../data/mutualFunds";
import { toLabeledSeries } from "../utils/mockSeries";
import ChartCard from "../components/ChartCard";
import Button from "../components/Button";
import InvestModal from "../components/InvestModal";
import EmptyState from "../components/EmptyState";
import { useWatchlist } from "../context/WatchlistContext";
import { formatCurrency, formatPercent } from "../utils/formatting";
import "./DetailsPage.css";

export default function MutualFundDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fund = getFundById(id);
  const { isWatchlisted, toggleWatchlist } = useWatchlist();
  const [investOpen, setInvestOpen] = useState(false);

  if (!fund) {
    return (
      <div className="container">
        <EmptyState title="Fund not found" description="This mutual fund doesn't exist or was removed." />
      </div>
    );
  }

  const watchlisted = isWatchlisted("mutualFund", fund.id);

  return (
    <div className="container">
      <div className="details-header">
        <div>
          <div className="details-eyebrow">{fund.category} · {fund.amc}</div>
          <h1>{fund.name}</h1>
          <div className="details-price-row">
            <span className="details-price mono">{formatCurrency(fund.nav, { decimals: 2 })}</span>
            <span className={fund.r1y >= 0 ? "positive" : "negative"}>{formatPercent(fund.r1y)} (1Y)</span>
          </div>
        </div>
        <div className="details-actions">
          <Button variant="secondary" icon={Star} onClick={() => toggleWatchlist({ type: "mutualFund", refId: fund.id, name: fund.name, category: fund.category })}>
            {watchlisted ? "In Watchlist" : "Add to Watchlist"}
          </Button>
          <Button variant="secondary" icon={GitCompare} onClick={() => navigate(`/compare?add=${fund.id}`)}>
            Compare
          </Button>
          <Button variant="primary" onClick={() => setInvestOpen(true)}>
            Invest
          </Button>
        </div>
      </div>

      <div className="details-grid">
        <div className="panel">
          <ChartCard
            periods={["1M", "6M", "1Y", "3Y", "5Y"]}
            defaultPeriod="1Y"
            positive={fund.r1y >= 0}
            getSeries={(period) => toLabeledSeries(buildFundHistory(fund, period), period)}
          />
        </div>

        <div className="panel stat-tiles">
          <div className="stat-tile">
            <div className="stat-tile-label">NAV</div>
            <div className="stat-tile-value">{formatCurrency(fund.nav, { decimals: 2 })}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-label">1Y Return</div>
            <div className={`stat-tile-value ${fund.r1y >= 0 ? "positive" : "negative"}`}>{formatPercent(fund.r1y)}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-label">3Y Return</div>
            <div className={`stat-tile-value ${fund.r3y >= 0 ? "positive" : "negative"}`}>{formatPercent(fund.r3y)}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-label">5Y Return</div>
            <div className={`stat-tile-value ${fund.r5y >= 0 ? "positive" : "negative"}`}>{formatPercent(fund.r5y)}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-label">Expense Ratio</div>
            <div className="stat-tile-value">{fund.expenseRatio}%</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-label">AUM</div>
            <div className="stat-tile-value">{formatCurrency(fund.aum * 1e5, { compact: true })}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-label">Risk Level</div>
            <div className="stat-tile-value">{fund.risk}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-label">Min. Investment</div>
            <div className="stat-tile-value">{formatCurrency(fund.minLumpsum)}</div>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 20 }}>
        <div className="section-header">
          <h2>About this fund</h2>
        </div>
        <p className="text-secondary" style={{ lineHeight: 1.6, fontSize: 13.5 }}>
          {fund.name} is a {fund.risk.toLowerCase()}-risk {fund.category.toLowerCase()} fund managed by{" "}
          {fund.amc}, with a minimum SIP of {formatCurrency(fund.minSip)} and a minimum lump sum of{" "}
          {formatCurrency(fund.minLumpsum)}. It carries an expense ratio of {fund.expenseRatio}% and currently
          manages {formatCurrency(fund.aum * 1e5, { compact: true })} in assets.
        </p>
        <Link to="/mutual-funds" className="link" style={{ fontSize: 12.5 }}>
          ← Back to Mutual Funds
        </Link>
      </div>

      <InvestModal
        open={investOpen}
        onClose={() => setInvestOpen(false)}
        type="mutualFund"
        refId={fund.id}
        name={fund.name}
        price={fund.nav}
        minAmount={fund.minLumpsum}
        unitLabel="units"
      />
    </div>
  );
}
