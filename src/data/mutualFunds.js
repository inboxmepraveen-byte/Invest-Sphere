import { generateHistorySeries } from "../utils/mockSeries";

const RAW_FUNDS = [
  { id: "mf-flexi-apex", name: "Apex Flexi Cap Fund", amc: "Northbridge Mutual", category: "Flexi Cap", risk: "High", nav: 84.32, r1y: 24.8, r3y: 19.2, r5y: 17.6, expenseRatio: 0.68, aum: 18450, minSip: 500, minLumpsum: 5000, rating: 5 },
  { id: "mf-large-summit", name: "Summit Large Cap Fund", amc: "Northbridge Mutual", category: "Large Cap", risk: "Moderate", nav: 142.11, r1y: 16.4, r3y: 14.1, r5y: 13.5, expenseRatio: 0.52, aum: 32110, minSip: 500, minLumpsum: 5000, rating: 4 },
  { id: "mf-mid-vertex", name: "Vertex Mid Cap Growth", amc: "Bluepeak Asset Mgmt", category: "Mid Cap", risk: "High", nav: 61.87, r1y: 29.3, r3y: 22.7, r5y: 20.1, expenseRatio: 0.79, aum: 9870, minSip: 500, minLumpsum: 5000, rating: 4 },
  { id: "mf-small-pioneer", name: "Pioneer Small Cap Fund", amc: "Bluepeak Asset Mgmt", category: "Small Cap", risk: "Very High", nav: 38.94, r1y: 34.6, r3y: 26.4, r5y: 22.9, expenseRatio: 0.92, aum: 5420, minSip: 500, minLumpsum: 5000, rating: 4 },
  { id: "mf-debt-shield", name: "Shield Short Duration Debt", amc: "Ironclad Investments", category: "Debt", risk: "Low", nav: 24.15, r1y: 7.2, r3y: 6.8, r5y: 6.5, expenseRatio: 0.34, aum: 12980, minSip: 500, minLumpsum: 5000, rating: 4 },
  { id: "mf-elss-sage", name: "Sage Tax Saver ELSS", amc: "Ironclad Investments", category: "ELSS", risk: "High", nav: 96.42, r1y: 21.9, r3y: 18.3, r5y: 16.8, expenseRatio: 0.61, aum: 14230, minSip: 500, minLumpsum: 500, rating: 5 },
  { id: "mf-hybrid-balance", name: "Balance Hybrid Advantage", amc: "Northbridge Mutual", category: "Hybrid", risk: "Moderate", nav: 45.28, r1y: 13.7, r3y: 12.4, r5y: 11.9, expenseRatio: 0.58, aum: 8760, minSip: 500, minLumpsum: 5000, rating: 4 },
  { id: "mf-index-nifty", name: "Nifty 50 Index Fund", amc: "Cornerstone AMC", category: "Index", risk: "Moderate", nav: 210.55, r1y: 15.1, r3y: 13.2, r5y: 12.8, expenseRatio: 0.12, aum: 41200, minSip: 500, minLumpsum: 1000, rating: 4 },
  { id: "mf-flexi-horizon", name: "Horizon Flexi Cap Value", amc: "Cornerstone AMC", category: "Flexi Cap", risk: "High", nav: 71.09, r1y: 19.5, r3y: 16.8, r5y: 15.4, expenseRatio: 0.71, aum: 11080, minSip: 500, minLumpsum: 5000, rating: 3 },
  { id: "mf-large-anchor", name: "Anchor Bluechip Fund", amc: "Ironclad Investments", category: "Large Cap", risk: "Moderate", nav: 305.6, r1y: 14.9, r3y: 13.8, r5y: 13.1, expenseRatio: 0.48, aum: 27650, minSip: 500, minLumpsum: 5000, rating: 4 },
  { id: "mf-mid-catalyst", name: "Catalyst Mid Cap Fund", amc: "Cornerstone AMC", category: "Mid Cap", risk: "High", nav: 54.2, r1y: 26.1, r3y: 20.5, r5y: 18.7, expenseRatio: 0.83, aum: 6540, minSip: 500, minLumpsum: 5000, rating: 3 },
  { id: "mf-small-momentum", name: "Momentum Small Cap Fund", amc: "Bluepeak Asset Mgmt", category: "Small Cap", risk: "Very High", nav: 29.71, r1y: 31.2, r3y: 24.9, r5y: 21.3, expenseRatio: 0.97, aum: 3980, minSip: 500, minLumpsum: 5000, rating: 3 },
  { id: "mf-debt-liquid", name: "Liquid Reserve Fund", amc: "Cornerstone AMC", category: "Debt", risk: "Low", nav: 18.62, r1y: 6.4, r3y: 6.1, r5y: 5.9, expenseRatio: 0.22, aum: 22140, minSip: 500, minLumpsum: 1000, rating: 4 },
  { id: "mf-hybrid-dynamic", name: "Dynamic Asset Allocator", amc: "Northbridge Mutual", category: "Hybrid", risk: "Moderate", nav: 38.44, r1y: 15.8, r3y: 13.9, r5y: 12.6, expenseRatio: 0.64, aum: 7320, minSip: 500, minLumpsum: 5000, rating: 4 },
  { id: "mf-gold-reserve", name: "Reserve Gold Savings Fund", amc: "Ironclad Investments", category: "Gold", risk: "Moderate", nav: 19.88, r1y: 18.2, r3y: 12.6, r5y: 11.4, expenseRatio: 0.45, aum: 4210, minSip: 500, minLumpsum: 1000, rating: 4 },
];

const PERIOD_META = {
  "1M": { points: 22, volatility: 0.008 },
  "6M": { points: 130, volatility: 0.01 },
  "1Y": { points: 260, volatility: 0.012 },
  "3Y": { points: 300, volatility: 0.018 },
  "5Y": { points: 320, volatility: 0.022 },
};

export function buildFundHistory(fund, period = "1Y") {
  const meta = PERIOD_META[period] || PERIOD_META["1Y"];
  const yearsBack = { "1M": 1 / 12, "6M": 0.5, "1Y": 1, "3Y": 3, "5Y": 5 }[period] || 1;
  const annualReturn = { "1M": fund.r1y, "6M": fund.r1y, "1Y": fund.r1y, "3Y": fund.r3y, "5Y": fund.r5y }[period] || fund.r1y;
  const startValue = fund.nav / Math.pow(1 + annualReturn / 100, yearsBack);
  return generateHistorySeries({
    seedKey: `${fund.id}-${period}`,
    points: meta.points,
    startValue,
    endValue: fund.nav,
    volatility: meta.volatility,
  });
}

export const mutualFunds = RAW_FUNDS.map((f) => ({
  ...f,
  sparkline: buildFundHistory(f, "6M").filter((_, i) => i % 6 === 0),
}));

export const FUND_CATEGORIES = ["All", "Large Cap", "Mid Cap", "Small Cap", "Flexi Cap", "ELSS", "Debt", "Hybrid", "Index"];

export const FUND_COLLECTIONS = {
  "high-return": { label: "High Return", filter: (f) => f.r3y >= 20 },
  "popular-sips": { label: "Popular SIPs", filter: (f) => f.minSip <= 500 && f.rating >= 4 },
  "large-cap": { label: "Large Cap", filter: (f) => f.category === "Large Cap" },
  "mid-cap": { label: "Mid Cap", filter: (f) => f.category === "Mid Cap" },
  "small-cap": { label: "Small Cap", filter: (f) => f.category === "Small Cap" },
  "low-risk": { label: "Low Risk", filter: (f) => f.risk === "Low" },
  "tax-saving": { label: "Tax Saving", filter: (f) => f.category === "ELSS" },
  gold: { label: "Gold", filter: (f) => f.category === "Gold" },
};

export function getFundById(id) {
  return mutualFunds.find((f) => f.id === id);
}
