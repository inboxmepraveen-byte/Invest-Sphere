import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Wallet, Receipt } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { usePortfolio } from "../context/PortfolioContext";
import { buildPortfolioValueHistory } from "../data/portfolio";
import AllocationPie from "../components/AllocationPie";
import AddInvestmentModal from "../components/AddInvestmentModal";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import { formatCurrency, formatPercent, formatNumber } from "../utils/formatting";

function ValueTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-label">{label}</div>
      <div className="chart-tooltip-value">{formatCurrency(payload[0].value, { compact: true })}</div>
    </div>
  );
}

export default function Portfolio() {
  const { holdings, totalInvested, currentValue, gain, gainPct, allocation, sectorAllocation } = usePortfolio();
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const valueHistory = useMemo(() => buildPortfolioValueHistory(holdings, 30), [holdings]);
  const gainPositive = gain >= 0;

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Portfolio</h1>
          <p>A simulated view of your investments across mutual funds, stocks, and bonds.</p>
        </div>
        <div className="page-header-actions">
          <Button variant="secondary" icon={Receipt} onClick={() => navigate("/transactions")}>
            Transactions
          </Button>
          <Button variant="primary" icon={Plus} onClick={() => setModalOpen(true)}>
            Add Investment
          </Button>
        </div>
      </div>

      {holdings.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No investments yet"
          description="Your portfolio will appear here once you add an investment."
          action={
            <Button variant="primary" icon={Plus} onClick={() => setModalOpen(true)}>
              Add Investment
            </Button>
          }
        />
      ) : (
        <>
          <div className="stat-tiles" style={{ marginBottom: 20 }}>
            <div className="stat-tile">
              <div className="stat-tile-label">Total Invested</div>
              <div className="stat-tile-value">{formatCurrency(totalInvested, { decimals: 0 })}</div>
            </div>
            <div className="stat-tile">
              <div className="stat-tile-label">Current Value</div>
              <div className="stat-tile-value">{formatCurrency(currentValue, { decimals: 0 })}</div>
            </div>
            <div className="stat-tile">
              <div className="stat-tile-label">Overall Gain/Loss</div>
              <div className={`stat-tile-value ${gainPositive ? "positive" : "negative"}`}>
                {formatCurrency(gain, { decimals: 0 })}
              </div>
            </div>
            <div className="stat-tile">
              <div className="stat-tile-label">Return</div>
              <div className={`stat-tile-value ${gainPositive ? "positive" : "negative"}`}>{formatPercent(gainPct)}</div>
            </div>
          </div>

          <div className="grid-2" style={{ marginBottom: 24 }}>
            <div className="panel">
              <div className="section-header">
                <h2>Portfolio Value</h2>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={valueHistory} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="portfolio-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={gainPositive ? "var(--positive)" : "var(--negative)"} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={gainPositive ? "var(--positive)" : "var(--negative)"} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={{ stroke: "var(--border)" }} tickLine={false} minTickGap={40} />
                  <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} width={54} tickFormatter={(v) => formatNumber(v, 0)} />
                  <Tooltip content={<ValueTooltip />} />
                  <Area type="monotone" dataKey="value" stroke={gainPositive ? "var(--positive)" : "var(--negative)"} strokeWidth={2} fill="url(#portfolio-grad)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="panel">
              <div className="section-header">
                <h2>Asset Allocation</h2>
              </div>
              <AllocationPie data={allocation} />
            </div>
          </div>

          <div className="panel" style={{ marginBottom: 24 }}>
            <div className="section-header">
              <h2>Sector Allocation</h2>
            </div>
            <AllocationPie data={sectorAllocation} />
          </div>

          <div className="section">
            <div className="section-header">
              <h2>Holdings</h2>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Avg. Price</th>
                    <th>Current Price</th>
                    <th>Invested</th>
                    <th>Current Value</th>
                    <th>Gain/Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((h) => (
                    <tr key={h.id}>
                      <td>{h.name}</td>
                      <td className="text-secondary">{h.type === "mutualFund" ? "Mutual Fund" : h.type === "stock" ? "Stock" : "Bond"}</td>
                      <td className="mono">{formatNumber(h.quantity, h.type === "stock" ? 0 : 2)}</td>
                      <td className="mono">{formatCurrency(h.avgPrice, { decimals: 2 })}</td>
                      <td className="mono">{formatCurrency(h.currentPrice, { decimals: 2 })}</td>
                      <td className="mono">{formatCurrency(h.investedAmount, { decimals: 0 })}</td>
                      <td className="mono">{formatCurrency(h.currentValue, { decimals: 0 })}</td>
                      <td className={h.gain >= 0 ? "positive mono" : "negative mono"}>
                        {formatCurrency(h.gain, { decimals: 0 })} ({formatPercent(h.gainPct)})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <AddInvestmentModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
