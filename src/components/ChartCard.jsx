import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatNumber } from "../utils/formatting";
import "./ChartCard.css";

function ChartTooltip({ active, payload, label, valuePrefix = "" }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-label">{label}</div>
      <div className="chart-tooltip-value">
        {valuePrefix}
        {formatNumber(payload[0].value)}
      </div>
    </div>
  );
}

export default function ChartCard({ periods = ["1M", "6M", "1Y"], defaultPeriod, getSeries, positive = true, valuePrefix = "", height = 260 }) {
  const [period, setPeriod] = useState(defaultPeriod || periods[Math.min(1, periods.length - 1)]);

  const data = useMemo(() => getSeries(period), [getSeries, period]);
  const color = positive ? "var(--positive)" : "var(--negative)";
  const gradientId = useMemo(() => `chart-grad-${Math.random().toString(36).slice(2)}`, []);

  return (
    <div className="chart-card">
      <div className="chart-period-tabs">
        {periods.map((p) => (
          <button
            key={p}
            className={p === period ? "chart-tab active" : "chart-tab"}
            onClick={() => setPeriod(p)}
          >
            {p}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
            minTickGap={30}
          />
          <YAxis
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            domain={["dataMin", "dataMax"]}
            width={54}
            tickFormatter={(v) => formatNumber(v, 0)}
          />
          <Tooltip content={<ChartTooltip valuePrefix={valuePrefix} />} />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#${gradientId})`} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
