import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchX } from "lucide-react";
import { mutualFunds, FUND_CATEGORIES, FUND_COLLECTIONS } from "../data/mutualFunds";
import FundCard from "../components/FundCard";
import FilterBar, { CategoryPills, SelectField } from "../components/FilterBar";
import EmptyState from "../components/EmptyState";
import "./ListingPage.css";

const RISK_OPTIONS = ["All", "Low", "Moderate", "High", "Very High"];
const SORT_OPTIONS = [
  { value: "return-desc", label: "Highest Return (3Y)" },
  { value: "return-asc", label: "Lowest Return (3Y)" },
  { value: "az", label: "Name A-Z" },
  { value: "expense-asc", label: "Lowest Expense Ratio" },
  { value: "risk-asc", label: "Lowest Risk" },
];

const RISK_RANK = { Low: 1, Moderate: 2, High: 3, "Very High": 4 };

export default function MutualFunds() {
  const [params, setParams] = useSearchParams();
  const collectionKey = params.get("collection");
  const collection = collectionKey ? FUND_COLLECTIONS[collectionKey] : null;

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [risk, setRisk] = useState("All");
  const [minReturn, setMinReturn] = useState(0);
  const [sort, setSort] = useState("return-desc");

  const results = useMemo(() => {
    let list = mutualFunds;
    if (collection) list = list.filter(collection.filter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((f) => f.name.toLowerCase().includes(q) || f.amc.toLowerCase().includes(q));
    }
    if (category !== "All") list = list.filter((f) => f.category === category);
    if (risk !== "All") list = list.filter((f) => f.risk === risk);
    if (minReturn > 0) list = list.filter((f) => f.r3y >= minReturn);

    const sorted = [...list];
    switch (sort) {
      case "return-desc":
        sorted.sort((a, b) => b.r3y - a.r3y);
        break;
      case "return-asc":
        sorted.sort((a, b) => a.r3y - b.r3y);
        break;
      case "az":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "expense-asc":
        sorted.sort((a, b) => a.expenseRatio - b.expenseRatio);
        break;
      case "risk-asc":
        sorted.sort((a, b) => RISK_RANK[a.risk] - RISK_RANK[b.risk]);
        break;
      default:
        break;
    }
    return sorted;
  }, [collection, query, category, risk, minReturn, sort]);

  const clearCollection = () => {
    const next = new URLSearchParams(params);
    next.delete("collection");
    setParams(next);
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Mutual Funds</h1>
          <p>Browse and compare {mutualFunds.length} mutual funds across categories and risk levels.</p>
        </div>
      </div>

      {collection && (
        <div className="active-collection">
          Showing collection: <strong>{collection.label}</strong>
          <button onClick={clearCollection}>Clear</button>
        </div>
      )}

      <input
        className="input listing-search"
        placeholder="Search funds by name or AMC…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <FilterBar>
        <CategoryPills options={FUND_CATEGORIES} value={category} onChange={setCategory} />
        <div className="filter-bar-group">
          <SelectField label="Risk" value={risk} onChange={setRisk} options={RISK_OPTIONS.map((r) => ({ value: r, label: r }))} />
          <SelectField
            label="Min 3Y Return"
            value={String(minReturn)}
            onChange={(v) => setMinReturn(Number(v))}
            options={[0, 10, 15, 20, 25].map((v) => ({ value: String(v), label: v === 0 ? "Any" : `${v}%+` }))}
          />
          <SelectField label="Sort" value={sort} onChange={setSort} options={SORT_OPTIONS} />
        </div>
      </FilterBar>

      {results.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No funds match your filters"
          description="Try adjusting the category, risk, or return filters."
        />
      ) : (
        <div className="grid-cards">
          {results.map((fund) => (
            <FundCard key={fund.id} fund={fund} />
          ))}
        </div>
      )}
    </div>
  );
}
