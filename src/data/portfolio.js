import { mutualFunds, buildFundHistory } from "./mutualFunds";
import { stocks, buildStockHistory } from "./stocks";
import { bonds } from "./bonds";
import { generateHistorySeries } from "../utils/mockSeries";

// Seed holdings so the portfolio/analytics pages have realistic data to
// derive from on first load. Users can add more via the Add Investment flow,
// and everything after this point is persisted to localStorage.
export const SEED_HOLDINGS = [
  { id: "hold-1", type: "mutualFund", refId: "mf-flexi-apex", quantity: 214.6, avgPrice: 68.4, date: "2023-04-12" },
  { id: "hold-2", type: "mutualFund", refId: "mf-large-summit", quantity: 96.2, avgPrice: 118.75, date: "2022-11-03" },
  { id: "hold-3", type: "mutualFund", refId: "mf-index-nifty", quantity: 58.4, avgPrice: 178.2, date: "2023-08-20" },
  { id: "hold-4", type: "stock", refId: "stk-nimbus-soft", quantity: 12, avgPrice: 2980.0, date: "2023-02-15" },
  { id: "hold-5", type: "stock", refId: "stk-vertan-bank", quantity: 40, avgPrice: 945.5, date: "2023-06-01" },
  { id: "hold-6", type: "bond", refId: "bnd-taxfree-nhai", quantity: 10, avgPrice: 1000, date: "2022-09-10" },
];

export function resolveInstrument(type, refId) {
  if (type === "mutualFund") return mutualFunds.find((f) => f.id === refId);
  if (type === "stock") return stocks.find((s) => s.id === refId);
  if (type === "bond") return bonds.find((b) => b.id === refId);
  return null;
}

export function getCurrentPrice(type, instrument) {
  if (!instrument) return 0;
  if (type === "mutualFund") return instrument.nav;
  if (type === "stock") return instrument.price;
  if (type === "bond") return instrument.faceValue;
  return 0;
}

export function enrichHolding(holding) {
  const instrument = resolveInstrument(holding.type, holding.refId);
  if (!instrument) return null;
  const currentPrice = getCurrentPrice(holding.type, instrument);
  const investedAmount = holding.quantity * holding.avgPrice;
  const currentValue = holding.quantity * currentPrice;
  return {
    ...holding,
    name: instrument.name,
    symbol: instrument.symbol || instrument.id,
    category: instrument.category || instrument.sector || instrument.type,
    currentPrice,
    investedAmount,
    currentValue,
    gain: currentValue - investedAmount,
    gainPct: investedAmount > 0 ? ((currentValue - investedAmount) / investedAmount) * 100 : 0,
  };
}

const ASSET_LABELS = { mutualFund: "Mutual Funds", stock: "Stocks", bond: "Bonds", gold: "Gold", cash: "Cash" };

export function summarizePortfolio(holdings) {
  const enriched = holdings.map(enrichHolding).filter(Boolean);
  const totalInvested = enriched.reduce((s, h) => s + h.investedAmount, 0);
  const currentValue = enriched.reduce((s, h) => s + h.currentValue, 0);
  const gain = currentValue - totalInvested;
  const gainPct = totalInvested > 0 ? (gain / totalInvested) * 100 : 0;

  const allocationMap = {};
  const sectorMap = {};
  enriched.forEach((h) => {
    const label = ASSET_LABELS[h.type] || h.type;
    allocationMap[label] = (allocationMap[label] || 0) + h.currentValue;
    const sectorLabel = h.category || "Other";
    sectorMap[sectorLabel] = (sectorMap[sectorLabel] || 0) + h.currentValue;
  });

  return {
    holdings: enriched,
    totalInvested,
    currentValue,
    gain,
    gainPct,
    allocation: Object.entries(allocationMap).map(([name, value]) => ({ name, value })),
    sectorAllocation: Object.entries(sectorMap).map(([name, value]) => ({ name, value })),
  };
}

// Derives a combined portfolio value series from each holding's own
// generated price history, rather than a hardcoded curve.
export function buildPortfolioValueHistory(holdings, points = 52) {
  const enriched = holdings.map(enrichHolding).filter(Boolean);
  if (enriched.length === 0) return [];

  const perHoldingSeries = enriched.map((h) => {
    const instrument = resolveInstrument(h.type, h.refId);
    let raw;
    if (h.type === "mutualFund") {
      raw = buildFundHistory(instrument, "1Y");
    } else if (h.type === "stock") {
      raw = buildStockHistory(instrument, "1Y");
    } else {
      raw = null;
    }
    if (!raw) {
      const flat = new Array(points).fill(h.currentPrice);
      return flat.map((price) => price * h.quantity);
    }
    const resampled = resample(raw, points);
    return resampled.map((price) => price * h.quantity);
  });

  const today = new Date();
  const series = [];
  for (let i = 0; i < points; i++) {
    const value = perHoldingSeries.reduce((sum, s) => sum + s[i], 0);
    const d = new Date(today);
    d.setDate(d.getDate() - (points - 1 - i) * 7);
    series.push({ date: d.toISOString().slice(0, 10), value: Math.round(value) });
  }
  return series;
}

function resample(arr, points) {
  if (arr.length === points) return arr;
  const out = [];
  for (let i = 0; i < points; i++) {
    const idx = Math.floor((i / (points - 1)) * (arr.length - 1));
    out.push(arr[idx]);
  }
  return out;
}

// Simple benchmark index series for the "vs benchmark" analytics chart.
export function buildBenchmarkHistory(points = 52, endValue = 100) {
  const series = generateHistorySeries({
    seedKey: "benchmark-nifty50",
    points,
    startValue: endValue / 1.14,
    endValue,
    volatility: 0.014,
  });
  return series;
}
