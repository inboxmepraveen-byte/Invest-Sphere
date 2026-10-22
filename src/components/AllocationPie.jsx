import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "../utils/formatting";

const COLORS = ["#6d8cff", "#2ecf8a", "#e8a33d", "#a97fe8", "#f0596b", "#3fb8c4"];

function PieTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0];
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-label">{p.name}</div>
      <div className="chart-tooltip-value">{formatCurrency(p.value, { compact: true })}</div>
    </div>
  );
}

export default function AllocationPie({ data, height = 240 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="82%" paddingAngle={2}>
          {data.map((entry, idx) => (
            <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} stroke="none" />
          ))}
        </Pie>
        <Tooltip content={<PieTooltip />} />
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
