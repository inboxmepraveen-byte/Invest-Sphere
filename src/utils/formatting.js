export function formatCurrency(value, { compact = false, decimals = 0 } = {}) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  if (compact) {
    const abs = Math.abs(value);
    const fixed = (divisor, unitDecimals) => (value / divisor).toLocaleString("en-IN", { minimumFractionDigits: unitDecimals, maximumFractionDigits: unitDecimals });
    if (abs >= 1e7) return `₹${fixed(1e7, 2)} Cr`;
    if (abs >= 1e5) return `₹${fixed(1e5, 2)} L`;
    if (abs >= 1e3) return `₹${fixed(1e3, 1)} K`;
  }
  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function formatNumber(value, decimals = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatPercent(value, decimals = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

export function formatDate(value, options = { day: "numeric", month: "short", year: "numeric" }) {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", options);
}

export function formatCompactNumber(value) {
  if (value === null || value === undefined) return "—";
  const abs = Math.abs(value);
  if (abs >= 1e7) return `${(value / 1e7).toFixed(2)}Cr`;
  if (abs >= 1e5) return `${(value / 1e5).toFixed(2)}L`;
  if (abs >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return `${value}`;
}

export function classNames(...args) {
  return args.filter(Boolean).join(" ");
}

export function timeAgo(value) {
  const d = typeof value === "string" ? new Date(value) : value;
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(d);
}
