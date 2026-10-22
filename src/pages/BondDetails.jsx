import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star } from "lucide-react";
import { getBondById } from "../data/bonds";
import Button from "../components/Button";
import InvestModal from "../components/InvestModal";
import EmptyState from "../components/EmptyState";
import { useWatchlist } from "../context/WatchlistContext";
import { calculateBondInterest } from "../utils/calculations";
import { formatCurrency, formatDate } from "../utils/formatting";
import "./DetailsPage.css";

export default function BondDetails() {
  const { id } = useParams();
  const bond = getBondById(id);
  const { isWatchlisted, toggleWatchlist } = useWatchlist();
  const [investOpen, setInvestOpen] = useState(false);
  const [investAmount, setInvestAmount] = useState(String(bond?.minInvestment || 10000));

  const calc = useMemo(() => {
    if (!bond) return null;
    const units = Math.max(1, Math.floor(Number(investAmount || 0) / bond.faceValue));
    return calculateBondInterest({
      faceValue: bond.faceValue * units,
      couponRatePct: bond.coupon,
      years: bond.yearsToMaturity,
    });
  }, [bond, investAmount]);

  if (!bond) {
    return (
      <div className="container">
        <EmptyState title="Bond not found" description="This bond doesn't exist or was removed." />
      </div>
    );
  }

  const watchlisted = isWatchlisted("bond", bond.id);

  return (
    <div className="container">
      <div className="details-header">
        <div>
          <div className="details-eyebrow">{bond.issuer} · {bond.type} · {bond.rating}</div>
          <h1>{bond.name}</h1>
          <div className="details-price-row">
            <span className="details-price mono">{bond.yield}%</span>
            <span className="text-secondary">yield to maturity</span>
          </div>
        </div>
        <div className="details-actions">
          <Button variant="secondary" icon={Star} onClick={() => toggleWatchlist({ type: "bond", refId: bond.id, name: bond.name, category: bond.type })}>
            {watchlisted ? "In Watchlist" : "Add to Watchlist"}
          </Button>
          <Button variant="primary" onClick={() => setInvestOpen(true)}>
            Invest
          </Button>
        </div>
      </div>

      <div className="details-grid">
        <div className="panel">
          <div className="section-header">
            <h2>Return Calculator</h2>
          </div>
          <div className="form-group">
            <label>Investment Amount (₹)</label>
            <input
              className="input"
              type="number"
              min={bond.minInvestment}
              step={bond.faceValue}
              value={investAmount}
              onChange={(e) => setInvestAmount(e.target.value)}
            />
            <div className="field-hint">Face value per bond: {formatCurrency(bond.faceValue)}</div>
          </div>
          {calc && (
            <div className="stat-tiles" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
              <div className="stat-tile">
                <div className="stat-tile-label">Payout / Period</div>
                <div className="stat-tile-value">{formatCurrency(calc.periodicPayout, { decimals: 0 })}</div>
              </div>
              <div className="stat-tile">
                <div className="stat-tile-label">Total Payments</div>
                <div className="stat-tile-value">{calc.totalPayments}</div>
              </div>
              <div className="stat-tile">
                <div className="stat-tile-label">Total Interest</div>
                <div className="stat-tile-value positive">{formatCurrency(calc.totalInterest, { decimals: 0 })}</div>
              </div>
              <div className="stat-tile">
                <div className="stat-tile-label">Maturity Value</div>
                <div className="stat-tile-value">{formatCurrency(calc.maturityValue, { decimals: 0 })}</div>
              </div>
            </div>
          )}
        </div>

        <div className="panel stat-tiles">
          <div className="stat-tile">
            <div className="stat-tile-label">Coupon Rate</div>
            <div className="stat-tile-value">{bond.coupon}%</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-label">Yield</div>
            <div className="stat-tile-value positive">{bond.yield}%</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-label">Maturity</div>
            <div className="stat-tile-value">{formatDate(bond.maturity)}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-label">Credit Rating</div>
            <div className="stat-tile-value">{bond.rating}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-label">Min. Investment</div>
            <div className="stat-tile-value">{formatCurrency(bond.minInvestment)}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-label">Face Value</div>
            <div className="stat-tile-value">{formatCurrency(bond.faceValue)}</div>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 20 }}>
        <Link to="/bonds" className="link" style={{ fontSize: 12.5 }}>
          ← Back to Bonds
        </Link>
      </div>

      <InvestModal
        open={investOpen}
        onClose={() => setInvestOpen(false)}
        type="bond"
        refId={bond.id}
        name={bond.name}
        price={bond.faceValue}
        minAmount={bond.minInvestment}
        unitLabel="bonds"
      />
    </div>
  );
}
