import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";

export default function Sparkline({ data, positive = true, height = 40 }) {
  const points = (data || []).map((value, i) => ({ i, value }));
  const color = positive ? "var(--positive)" : "var(--negative)";

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={points} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
        <YAxis hide domain={["dataMin", "dataMax"]} />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={1.75} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
