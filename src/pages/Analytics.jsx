import { useMemo } from "react";
import { LineChart, Line, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { usePortfolio } from "../context/PortfolioContext";
import { buildPortfolioValueHistory, buildBenchmarkHistory } from "../data/portfolio";
import AllocationPie from "../components/AllocationPie";
import EmptyState from "../components/EmptyState";
import {
  calculateAbsoluteReturn,
  calculateAnnualizedReturn,
  calculateVolatility,
  calculateMaxDrawdown,
  calculateSharpeRatio,
} from "../utils/calculations";
import { formatCurrency, formatPercent } from "../utils/formatting";
import { BarChart3 } from "lucide-react";

function BenchmarkTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-label">{label}</div>
      {payload.map((p) => (
        <div className="chart-tooltip-value" key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.dataKey === "portfolio" ? formatCurrency(p.value, { compact: true }) : p.value.toFixed(1)}
        </div>
      ))}
    </div>
  );
}

export default function Analytics() {
  const { holdings, allocation, sectorAllocation } = usePortfolio();

  const history = useMemo(() => buildPortfolioValueHistory(holdings, 52), [holdings]);

  const metrics = useMemo(() => {
    if (history.length < 2) return null;
    return {
      absoluteReturn: calculateAbsoluteReturn(history),
      annualizedReturn: calculateAnnualizedReturn(history),
      volatility: calculateVolatility(history),
      maxDrawdown: calculateMaxDrawdown(history),
      sharpe: calculateSharpeRatio(history),
    };
  }, [history]);

  const benchmarkSeries = useMemo(() => {
    if (history.length < 2) return [];
    const benchmark = buildBenchmarkHistory(history.length, 100);
    const portfolioBase = history[0].value || 1;
    const benchmarkBase = benchmark[0] || 1;
    return history.map((point, i) => ({
      label: point.date.slice(5),
      portfolio: (point.value / portfolioBase) * 100,
      benchmark: (benchmark[i] / benchmarkBase) * 100,
    }));
  }, [history]);

  if (holdings.length === 0) {
    return (
      <div className="container">
        <div className="page-header">
          <div>
            <h1>Portfolio Analytics</h1>
          </div>
        </div>
        <EmptyState icon={BarChart3} title="No data to analyze yet" description="Add investments to your portfolio to see analytics here." />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Portfolio Analytics</h1>
          <p>Performance metrics derived from your current holdings and their historical price movement.</p>
        </div>
      </div>

      {metrics && (
        <div className="stat-tiles" style={{ marginBottom: 22 }}>
          <div className="stat-tile">
            <div className="stat-tile-label">Absolute Return</div>
            <div className={`stat-tile-value ${metrics.absoluteReturn >= 0 ? "positive" : "negative"}`}>{formatPercent(metrics.absoluteReturn)}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-label">Annualized Return (CAGR)</div>
            <div className={`stat-tile-value ${metrics.annualizedReturn >= 0 ? "positive" : "negative"}`}>{formatPercent(metrics.annualizedReturn)}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-label">Volatility</div>
            <div className="stat-tile-value">{metrics.volatility.toFixed(2)}%</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-label">Max Drawdown</div>
            <div className="stat-tile-value negative">{metrics.maxDrawdown.toFixed(2)}%</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-label">Sharpe Ratio</div>
            <div className="stat-tile-value">{metrics.sharpe.toFixed(2)}</div>
          </div>
        </div>
      )}

      <div className="panel" style={{ marginBottom: 22 }}>
        <div className="section-header">
          <h2>Portfolio vs Benchmark</h2>
          <span className="text-muted" style={{ fontSize: 11.5 }}>Rebased to 100</span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={benchmarkSeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={{ stroke: "var(--border)" }} tickLine={false} minTickGap={40} />
            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} width={44} />
            <Tooltip content={<BenchmarkTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="portfolio" name="Your Portfolio" stroke="var(--accent)" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="benchmark" name="Nifty 50 (Benchmark)" stroke="var(--text-muted)" strokeWidth={2} dot={false} isAnimationActive={false} strokeDasharray="4 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="section-header">
            <h2>Asset Allocation</h2>
          </div>
          <AllocationPie data={allocation} />
        </div>
        <div className="panel">
          <div className="section-header">
            <h2>Sector Allocation</h2>
          </div>
          <AllocationPie data={sectorAllocation} />
        </div>
      </div>
    </div>
  );
}
