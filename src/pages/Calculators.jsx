import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SliderField from "../components/SliderField";
import GrowthChart from "../components/GrowthChart";
import {
  calculateSIP,
  calculateSIPSeries,
  calculateStepUpSIP,
  calculateLumpSum,
  calculateCAGR,
  calculateFD,
  calculateBondInterest,
  calculateGoalProgress,
} from "../utils/calculations";
import { formatCurrency, formatPercent } from "../utils/formatting";
import "./Calculators.css";

const TABS = [
  { key: "sip", label: "SIP Calculator" },
  { key: "lumpsum", label: "Lump Sum" },
  { key: "cagr", label: "CAGR Calculator" },
  { key: "goal", label: "Goal Calculator" },
  { key: "fd", label: "FD Calculator" },
  { key: "bond", label: "Bond Interest" },
];

function ResultTiles({ items }) {
  return (
    <div className="stat-tiles calc-results">
      {items.map((item) => (
        <div className="stat-tile" key={item.label}>
          <div className="stat-tile-label">{item.label}</div>
          <div className={`stat-tile-value ${item.tone || ""}`}>{item.value}</div>
        </div>
      ))}
    </div>
  );
}

function SIPCalculator() {
  const [stepUp, setStepUp] = useState(false);
  const [monthly, setMonthly] = useState(10000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(10);
  const [increasePct, setIncreasePct] = useState(10);

  const result = useMemo(() => {
    if (stepUp) {
      const r = calculateStepUpSIP({ startingSIP: monthly, annualIncreasePct: increasePct, years, annualReturnPct: annualReturn });
      return { ...r };
    }
    const r = calculateSIP({ monthlyInvestment: monthly, annualReturnPct: annualReturn, years });
    return { ...r, series: calculateSIPSeries({ monthlyInvestment: monthly, annualReturnPct: annualReturn, years }) };
  }, [stepUp, monthly, annualReturn, years, increasePct]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <label className="calc-toggle">
          <input type="checkbox" checked={stepUp} onChange={(e) => setStepUp(e.target.checked)} />
          Step-up SIP (increase investment annually)
        </label>
        <SliderField label={stepUp ? "Starting Monthly SIP" : "Monthly Investment"} value={monthly} onChange={setMonthly} min={500} max={200000} step={500} format={(v) => formatCurrency(v)} />
        {stepUp && (
          <SliderField label="Annual Increase" value={increasePct} onChange={setIncreasePct} min={0} max={30} step={1} suffix="%" />
        )}
        <SliderField label="Expected Annual Return" value={annualReturn} onChange={setAnnualReturn} min={1} max={30} step={0.5} suffix="%" />
        <SliderField label="Investment Duration" value={years} onChange={setYears} min={1} max={35} step={1} suffix=" yrs" />
      </div>
      <div className="panel">
        <ResultTiles
          items={[
            { label: "Total Invested", value: formatCurrency(result.totalInvested, { decimals: 0 }) },
            { label: "Estimated Returns", value: formatCurrency(result.estimatedReturns, { decimals: 0 }), tone: "positive" },
            { label: "Final Value", value: formatCurrency(result.finalValue, { decimals: 0 }) },
          ]}
        />
        <GrowthChart data={result.series} />
      </div>
    </div>
  );
}

function LumpSumCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(10);

  const result = useMemo(() => calculateLumpSum({ principal, annualReturnPct: annualReturn, years }), [principal, annualReturn, years]);

  const series = useMemo(() => {
    const out = [];
    for (let y = 1; y <= years; y++) {
      const fv = calculateLumpSum({ principal, annualReturnPct: annualReturn, years: y });
      out.push({ label: `Yr ${y}`, invested: principal, value: Math.round(fv.finalValue) });
    }
    return out;
  }, [principal, annualReturn, years]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <SliderField label="Investment Amount" value={principal} onChange={setPrincipal} min={5000} max={5000000} step={5000} format={(v) => formatCurrency(v)} />
        <SliderField label="Expected Annual Return" value={annualReturn} onChange={setAnnualReturn} min={1} max={30} step={0.5} suffix="%" />
        <SliderField label="Investment Duration" value={years} onChange={setYears} min={1} max={35} step={1} suffix=" yrs" />
      </div>
      <div className="panel">
        <ResultTiles
          items={[
            { label: "Invested Amount", value: formatCurrency(result.totalInvested, { decimals: 0 }) },
            { label: "Estimated Returns", value: formatCurrency(result.estimatedReturns, { decimals: 0 }), tone: "positive" },
            { label: "Final Value", value: formatCurrency(result.finalValue, { decimals: 0 }) },
          ]}
        />
        <GrowthChart data={series} />
      </div>
    </div>
  );
}

function CAGRCalculator() {
  const [initial, setInitial] = useState(100000);
  const [final, setFinal] = useState(180000);
  const [years, setYears] = useState(5);

  const cagr = useMemo(() => calculateCAGR({ initialValue: initial, finalValue: final, years }), [initial, final, years]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <SliderField label="Initial Investment" value={initial} onChange={setInitial} min={1000} max={5000000} step={1000} format={(v) => formatCurrency(v)} />
        <SliderField label="Final Value" value={final} onChange={setFinal} min={1000} max={10000000} step={1000} format={(v) => formatCurrency(v)} />
        <SliderField label="Duration" value={years} onChange={setYears} min={1} max={30} step={1} suffix=" yrs" />
      </div>
      <div className="panel">
        <ResultTiles
          items={[
            { label: "CAGR", value: formatPercent(cagr), tone: cagr >= 0 ? "positive" : "negative" },
            { label: "Absolute Growth", value: formatPercent(((final - initial) / initial) * 100) },
            { label: "Total Gain", value: formatCurrency(final - initial, { decimals: 0 }) },
          ]}
        />
      </div>
    </div>
  );
}

function GoalCalculator() {
  const [target, setTarget] = useState(1000000);
  const [current, setCurrent] = useState(100000);
  const [years, setYears] = useState(5);
  const [returnPct, setReturnPct] = useState(12);

  const targetDate = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + years);
    return d.toISOString().slice(0, 10);
  }, [years]);

  const result = useMemo(
    () => calculateGoalProgress({ targetAmount: target, currentSavings: current, targetDate, expectedReturnPct: returnPct }),
    [target, current, targetDate, returnPct]
  );

  return (
    <div className="calc-grid">
      <div className="panel">
        <SliderField label="Target Amount" value={target} onChange={setTarget} min={50000} max={20000000} step={50000} format={(v) => formatCurrency(v)} />
        <SliderField label="Current Savings" value={current} onChange={setCurrent} min={0} max={target} step={10000} format={(v) => formatCurrency(v)} />
        <SliderField label="Years to Goal" value={years} onChange={setYears} min={1} max={30} step={1} suffix=" yrs" />
        <SliderField label="Expected Annual Return" value={returnPct} onChange={setReturnPct} min={1} max={25} step={0.5} suffix="%" />
      </div>
      <div className="panel">
        <ResultTiles
          items={[
            { label: "Completion", value: `${result.completionPct.toFixed(0)}%` },
            { label: "Remaining Amount", value: formatCurrency(result.remainingAmount, { decimals: 0 }) },
            { label: "Required Monthly SIP", value: formatCurrency(result.requiredMonthlyInvestment, { decimals: 0 }), tone: "positive" },
          ]}
        />
        <div className="progress-track" style={{ marginTop: 8 }}>
          <div className="progress-fill" style={{ width: `${result.completionPct}%` }} />
        </div>
      </div>
    </div>
  );
}

function FDCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(3);

  const result = useMemo(() => calculateFD({ principal, annualRatePct: rate, years }), [principal, rate, years]);
  const series = useMemo(() => {
    const out = [];
    for (let y = 1; y <= years; y++) {
      const fv = calculateFD({ principal, annualRatePct: rate, years: y });
      out.push({ label: `Yr ${y}`, invested: principal, value: Math.round(fv.finalValue) });
    }
    return out;
  }, [principal, rate, years]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <SliderField label="Deposit Amount" value={principal} onChange={setPrincipal} min={5000} max={5000000} step={5000} format={(v) => formatCurrency(v)} />
        <SliderField label="Interest Rate" value={rate} onChange={setRate} min={3} max={12} step={0.1} suffix="%" />
        <SliderField label="Tenure" value={years} onChange={setYears} min={1} max={10} step={1} suffix=" yrs" />
      </div>
      <div className="panel">
        <ResultTiles
          items={[
            { label: "Principal", value: formatCurrency(result.totalInvested, { decimals: 0 }) },
            { label: "Interest Earned", value: formatCurrency(result.estimatedReturns, { decimals: 0 }), tone: "positive" },
            { label: "Maturity Value", value: formatCurrency(result.finalValue, { decimals: 0 }) },
          ]}
        />
        <GrowthChart data={series} />
      </div>
    </div>
  );
}

function BondCalculator() {
  const [faceValue, setFaceValue] = useState(100000);
  const [coupon, setCoupon] = useState(8);
  const [years, setYears] = useState(5);
  const [frequency, setFrequency] = useState(2);

  const result = useMemo(() => calculateBondInterest({ faceValue, couponRatePct: coupon, years, frequency }), [faceValue, coupon, years, frequency]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <SliderField label="Face Value" value={faceValue} onChange={setFaceValue} min={1000} max={5000000} step={1000} format={(v) => formatCurrency(v)} />
        <SliderField label="Coupon Rate" value={coupon} onChange={setCoupon} min={1} max={15} step={0.1} suffix="%" />
        <SliderField label="Years to Maturity" value={years} onChange={setYears} min={1} max={30} step={1} suffix=" yrs" />
        <SliderField label="Payout Frequency (per year)" value={frequency} onChange={setFrequency} min={1} max={4} step={1} />
      </div>
      <div className="panel">
        <ResultTiles
          items={[
            { label: "Payout / Period", value: formatCurrency(result.periodicPayout, { decimals: 0 }) },
            { label: "Total Payments", value: `${result.totalPayments}` },
            { label: "Total Interest", value: formatCurrency(result.totalInterest, { decimals: 0 }), tone: "positive" },
            { label: "Maturity Value", value: formatCurrency(result.maturityValue, { decimals: 0 }) },
          ]}
        />
      </div>
    </div>
  );
}

const TAB_COMPONENTS = {
  sip: SIPCalculator,
  lumpsum: LumpSumCalculator,
  cagr: CAGRCalculator,
  goal: GoalCalculator,
  fd: FDCalculator,
  bond: BondCalculator,
};

export default function Calculators() {
  const [params, setParams] = useSearchParams();
  const activeTab = TAB_COMPONENTS[params.get("tab")] ? params.get("tab") : "sip";
  const ActiveComponent = TAB_COMPONENTS[activeTab];

  const setTab = (key) => setParams({ tab: key });

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Financial Calculators</h1>
          <p>Model SIPs, lump sums, goals, fixed deposits, and bond returns with live, editable inputs.</p>
        </div>
      </div>

      <div className="tab-row">
        {TABS.map((tab) => (
          <button key={tab.key} className={tab.key === activeTab ? "active" : ""} onClick={() => setTab(tab.key)}>
            {tab.label}
          </button>
        ))}
      </div>

      <ActiveComponent />
    </div>
  );
}
