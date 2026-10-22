import { generateHistorySeries } from "../utils/mockSeries";

const RAW_STOCKS = [
  { id: "stk-vertan-bank", symbol: "VRTBANK", name: "Vertan Bank Ltd", sector: "Banking", price: 1042.3, changePct: 1.24, open: 1029.1, high: 1051.4, low: 1024.8, week52High: 1180.5, week52Low: 812.2, volume: 5_420_000, marketCap: 728_000, pe: 14.2, dividendYield: 1.1 },
  { id: "stk-crestline-fin", symbol: "CRSTFIN", name: "Crestline Financial", sector: "Banking", price: 612.85, changePct: -0.62, open: 617.5, high: 621.0, low: 608.4, week52High: 705.0, week52Low: 498.6, volume: 3_180_000, marketCap: 412_000, pe: 11.8, dividendYield: 1.6 },
  { id: "stk-nimbus-soft", symbol: "NIMBUS", name: "Nimbus Softworks", sector: "IT", price: 3488.6, changePct: 2.18, open: 3410.0, high: 3502.5, low: 3402.1, week52High: 3820.0, week52Low: 2650.0, volume: 1_120_000, marketCap: 1_412_000, pe: 28.4, dividendYield: 0.8 },
  { id: "stk-quantel-sys", symbol: "QNTLSYS", name: "Quantel Systems", sector: "IT", price: 1560.2, changePct: 0.94, open: 1546.0, high: 1568.9, low: 1538.5, week52High: 1710.0, week52Low: 1180.0, volume: 980_000, marketCap: 645_000, pe: 24.7, dividendYield: 1.0 },
  { id: "stk-torque-motors", symbol: "TORQMTR", name: "Torque Motors", sector: "Auto", price: 2740.5, changePct: -1.45, open: 2782.0, high: 2790.0, low: 2718.4, week52High: 3120.0, week52Low: 2210.0, volume: 640_000, marketCap: 890_000, pe: 19.6, dividendYield: 0.6 },
  { id: "stk-ridgeline-auto", symbol: "RDGAUTO", name: "Ridgeline Auto Components", sector: "Auto", price: 486.4, changePct: 0.35, open: 484.9, high: 491.2, low: 480.1, week52High: 560.0, week52Low: 372.0, volume: 2_040_000, marketCap: 156_000, pe: 16.3, dividendYield: 1.3 },
  { id: "stk-meridian-pharma", symbol: "MRDPHRM", name: "Meridian Pharma", sector: "Pharma", price: 892.15, changePct: 1.78, open: 878.0, high: 898.6, low: 874.2, week52High: 960.0, week52Low: 690.0, volume: 1_450_000, marketCap: 512_000, pe: 22.1, dividendYield: 0.9 },
  { id: "stk-halowell-labs", symbol: "HLWLABS", name: "Halowell Labs", sector: "Pharma", price: 1325.9, changePct: -0.28, open: 1330.0, high: 1338.5, low: 1312.0, week52High: 1480.0, week52Low: 1040.0, volume: 720_000, marketCap: 398_000, pe: 26.5, dividendYield: 0.5 },
  { id: "stk-solara-energy", symbol: "SOLRENG", name: "Solara Energy", sector: "Energy", price: 214.6, changePct: 3.12, open: 208.4, high: 217.9, low: 207.1, week52High: 260.0, week52Low: 140.0, volume: 8_920_000, marketCap: 268_000, pe: 31.4, dividendYield: 0.3 },
  { id: "stk-carbonpeak", symbol: "CRBNPK", name: "Carbonpeak Resources", sector: "Energy", price: 1680.0, changePct: -0.85, open: 1694.0, high: 1702.0, low: 1668.5, week52High: 1920.0, week52Low: 1340.0, volume: 540_000, marketCap: 1_120_000, pe: 9.8, dividendYield: 3.2 },
  { id: "stk-hearthside", symbol: "HRTHFD", name: "Hearthside Foods", sector: "FMCG", price: 2456.3, changePct: 0.52, open: 2442.0, high: 2464.0, low: 2438.1, week52High: 2680.0, week52Low: 2080.0, volume: 410_000, marketCap: 940_000, pe: 42.1, dividendYield: 1.4 },
  { id: "stk-clearwave", symbol: "CLRWAVE", name: "Clearwave Consumer", sector: "FMCG", price: 618.75, changePct: -0.18, open: 620.0, high: 624.5, low: 614.2, week52High: 690.0, week52Low: 520.0, volume: 1_680_000, marketCap: 218_000, pe: 35.6, dividendYield: 1.1 },
  { id: "stk-ironforge-infra", symbol: "IRNFRG", name: "Ironforge Infra", sector: "Infrastructure", price: 342.9, changePct: 2.44, open: 335.0, high: 346.8, low: 333.2, week52High: 410.0, week52Low: 240.0, volume: 3_920_000, marketCap: 312_000, pe: 18.9, dividendYield: 0.7 },
  { id: "stk-bastion-build", symbol: "BSTNBLD", name: "Bastion Buildcon", sector: "Infrastructure", price: 892.4, changePct: 1.06, open: 883.0, high: 898.0, low: 879.5, week52High: 990.0, week52Low: 640.0, volume: 1_020_000, marketCap: 186_000, pe: 21.3, dividendYield: 0.5 },
  { id: "stk-vantage-it", symbol: "VNTGIT", name: "Vantage IT Services", sector: "IT", price: 745.6, changePct: -1.02, open: 753.0, high: 757.2, low: 739.8, week52High: 860.0, week52Low: 590.0, volume: 2_240_000, marketCap: 298_000, pe: 20.5, dividendYield: 1.2 },
  { id: "stk-pinecrest-bank", symbol: "PNCRBK", name: "Pinecrest Bank", sector: "Banking", price: 328.15, changePct: 0.68, open: 326.0, high: 331.5, low: 324.0, week52High: 380.0, week52Low: 260.0, volume: 4_680_000, marketCap: 245_000, pe: 12.9, dividendYield: 1.8 },
];

const PERIOD_META = {
  "1D": { points: 78, volatility: 0.004 },
  "1W": { points: 40, volatility: 0.006 },
  "1M": { points: 22, volatility: 0.01 },
  "6M": { points: 130, volatility: 0.016 },
  "1Y": { points: 260, volatility: 0.02 },
  "5Y": { points: 320, volatility: 0.03 },
};

export function buildStockHistory(stock, period = "1M") {
  const meta = PERIOD_META[period] || PERIOD_META["1M"];
  const priorClose = stock.price / (1 + stock.changePct / 100);
  const rangeReturnPct = { "1D": stock.changePct, "1W": stock.changePct * 3, "1M": stock.changePct * 6, "6M": stock.changePct * 14, "1Y": stock.changePct * 22, "5Y": stock.changePct * 60 }[period] ?? stock.changePct * 6;
  const startValue = stock.price / (1 + rangeReturnPct / 100);
  return generateHistorySeries({
    seedKey: `${stock.id}-${period}`,
    points: meta.points,
    startValue,
    endValue: period === "1D" ? priorClose : stock.price,
    volatility: meta.volatility,
  });
}

export const stocks = RAW_STOCKS.map((s) => ({
  ...s,
  change: Number(((s.price * s.changePct) / (100 + s.changePct)).toFixed(2)),
  sparkline: buildStockHistory(s, "1M").filter((_, i) => i % 2 === 0),
}));

export const STOCK_SECTORS = ["All", "Banking", "IT", "Auto", "Pharma", "Energy", "FMCG", "Infrastructure"];

export function getStockById(id) {
  return stocks.find((s) => s.id === id);
}
