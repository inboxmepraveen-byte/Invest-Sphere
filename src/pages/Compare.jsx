import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { X, GitCompare } from "lucide-react";
import { mutualFunds } from "../data/mutualFunds";
import EmptyState from "../components/EmptyState";
import { formatCurrency, formatPercent } from "../utils/formatting";
import "./Compare.css";

const ROWS = [
  { key: "category", label: "Category" },
  { key: "risk", label: "Risk" },
  { key: "nav", label: "NAV", format: (v) => formatCurrency(v, { decimals: 2 }) },
  { key: "r1y", label: "1Y Return", format: (v) => formatPercent(v), tone: true },
  { key: "r3y", label: "3Y Return", format: (v) => formatPercent(v), tone: true },
  { key: "r5y", label: "5Y Return", format: (v) => formatPercent(v), tone: true },
  { key: "expenseRatio", label: "Expense Ratio", format: (v) => `${v}%` },
  { key: "aum", label: "AUM", format: (v) => formatCurrency(v * 1e5, { compact: true }) },
  { key: "minLumpsum", label: "Min. Investment", format: (v) => formatCurrency(v) },
];

export default function Compare() {
  const [params, setParams] = useSearchParams();
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const addId = params.get("add");
    if (addId && !selectedIds.includes(addId)) {
      setSelectedIds((prev) => (prev.length >= 3 ? prev : [...prev, addId]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const selectedFunds = selectedIds.map((id) => mutualFunds.find((f) => f.id === id)).filter(Boolean);
  const available = mutualFunds.filter((f) => !selectedIds.includes(f.id));

  const addFund = (id) => {
    if (!id || selectedIds.length >= 3) return;
    setSelectedIds((prev) => [...prev, id]);
  };

  const removeFund = (id) => {
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    const next = new URLSearchParams(params);
    if (next.get("add") === id) next.delete("add");
    setParams(next);
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Compare Mutual Funds</h1>
          <p>Select 2–3 funds to compare side by side. No fund is labeled "best" — review the numbers yourself.</p>
        </div>
      </div>

      {selectedFunds.length < 3 && (
        <div className="compare-add-row">
          <select
            className="select"
            value=""
            onChange={(e) => addFund(e.target.value)}
            disabled={available.length === 0}
          >
            <option value="" disabled>
              + Add a fund to compare ({selectedFunds.length}/3)
            </option>
            {available.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedFunds.length === 0 ? (
        <EmptyState
          icon={GitCompare}
          title="No funds selected"
          description="Add at least two funds above to see a side-by-side comparison."
        />
      ) : (
        <div className="table-wrap">
          <table className="table compare-table">
            <thead>
              <tr>
                <th>Metric</th>
                {selectedFunds.map((f) => (
                  <th key={f.id}>
                    <div className="compare-col-head">
                      <span>{f.name}</span>
                      <button onClick={() => removeFund(f.id)} aria-label={`Remove ${f.name}`}>
                        <X size={13} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.key}>
                  <td className="text-secondary">{row.label}</td>
                  {selectedFunds.map((f) => {
                    const raw = f[row.key];
                    const display = row.format ? row.format(raw) : raw;
                    const toneClass = row.tone ? (raw >= 0 ? "positive" : "negative") : "";
                    return (
                      <td key={f.id} className={toneClass}>
                        {display}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
