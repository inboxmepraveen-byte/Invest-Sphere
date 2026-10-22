import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "../utils/formatting";

function GrowthTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-label">{label}</div>
      {payload
        .slice()
        .reverse()
        .map((p) => (
          <div className="chart-tooltip-value" key={p.dataKey} style={{ color: p.color }}>
            {p.name}: {formatCurrency(p.value, { compact: true })}
          </div>
        ))}
    </div>
  );
}

export default function GrowthChart({ data, height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="growth-value" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="growth-invested" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--text-muted)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--text-muted)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
        <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} width={60} tickFormatter={(v) => formatCurrency(v, { compact: true })} />
        <Tooltip content={<GrowthTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="value" name="Estimated Value" stroke="var(--accent)" strokeWidth={2} fill="url(#growth-value)" isAnimationActive={false} />
        <Area type="monotone" dataKey="invested" name="Total Invested" stroke="var(--text-muted)" strokeWidth={2} fill="url(#growth-invested)" isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
