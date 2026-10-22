// Deterministic pseudo-random series generator so charts stay stable across
// re-renders and reloads without persisting raw history arrays anywhere.

function hashString(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededRandom(seedKey) {
  const seedFn = hashString(seedKey);
  const seed = Math.floor(seedFn() * 4294967296);
  return mulberry32(seed);
}

// Generates a daily-ish price/NAV series that drifts toward a target annualized
// return with bounded random noise, ending exactly at `endValue`.
export function generateHistorySeries({ seedKey, points = 260, startValue, endValue, volatility = 0.012 }) {
  const rand = seededRandom(seedKey);
  const series = [];
  let value = startValue;
  const totalDrift = (endValue - startValue) / points;
  for (let i = 0; i < points; i++) {
    const noise = (rand() - 0.5) * 2 * volatility * value;
    value = value + totalDrift + noise;
    if (value < startValue * 0.4) value = startValue * 0.4;
    series.push(Number(value.toFixed(2)));
  }
  series[series.length - 1] = Number(endValue.toFixed(2));
  return series;
}

const PERIOD_LABEL_FORMAT = {
  "1D": { unit: "hour", format: { hour: "numeric" } },
  "1W": { unit: "day", format: { weekday: "short" } },
  "1M": { unit: "day", format: { day: "numeric", month: "short" } },
  "6M": { unit: "week", format: { day: "numeric", month: "short" } },
  "1Y": { unit: "week", format: { day: "numeric", month: "short" } },
  "3Y": { unit: "month", format: { month: "short", year: "2-digit" } },
  "5Y": { unit: "month", format: { month: "short", year: "2-digit" } },
};

// Downsamples a raw price series to ~maxPoints and attaches human-readable
// date/time labels ending "today", spaced appropriately for the period.
export function toLabeledSeries(rawValues, period, maxPoints = 44) {
  const step = Math.max(1, Math.floor(rawValues.length / maxPoints));
  const sampled = rawValues.filter((_, i) => i % step === 0 || i === rawValues.length - 1);
  const meta = PERIOD_LABEL_FORMAT[period] || PERIOD_LABEL_FORMAT["1M"];
  const now = new Date();

  return sampled.map((value, idx) => {
    const stepsFromEnd = sampled.length - 1 - idx;
    const d = new Date(now);
    if (meta.unit === "hour") d.setHours(d.getHours() - stepsFromEnd);
    else if (meta.unit === "day") d.setDate(d.getDate() - stepsFromEnd);
    else if (meta.unit === "week") d.setDate(d.getDate() - stepsFromEnd * 7);
    else if (meta.unit === "month") d.setMonth(d.getMonth() - stepsFromEnd);
    return { label: d.toLocaleString("en-IN", meta.format), value };
  });
}

export function datedSeries(values, { daysApart = 1 } = {}) {
  const today = new Date();
  return values.map((value, idx) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (values.length - 1 - idx) * daysApart);
    return { date: d.toISOString().slice(0, 10), value };
  });
}
