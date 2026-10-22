import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import { bonds, BOND_TYPES, BOND_RATINGS } from "../data/bonds";
import BondCard from "../components/BondCard";
import FilterBar, { CategoryPills, SelectField } from "../components/FilterBar";
import EmptyState from "../components/EmptyState";
import "./ListingPage.css";

const SORT_OPTIONS = [
  { value: "yield-desc", label: "Highest Yield" },
  { value: "yield-asc", label: "Lowest Yield" },
  { value: "maturity-asc", label: "Maturing Soonest" },
  { value: "az", label: "Name A-Z" },
];

export default function Bonds() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [rating, setRating] = useState("All");
  const [sort, setSort] = useState("yield-desc");

  const results = useMemo(() => {
    let list = bonds;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((b) => b.name.toLowerCase().includes(q) || b.issuer.toLowerCase().includes(q));
    }
    if (type !== "All") list = list.filter((b) => b.type === type);
    if (rating !== "All") list = list.filter((b) => b.rating === rating);

    const sorted = [...list];
    switch (sort) {
      case "yield-desc":
        sorted.sort((a, b) => b.yield - a.yield);
        break;
      case "yield-asc":
        sorted.sort((a, b) => a.yield - b.yield);
        break;
      case "maturity-asc":
        sorted.sort((a, b) => a.yearsToMaturity - b.yearsToMaturity);
        break;
      case "az":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return sorted;
  }, [query, type, rating, sort]);

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Bonds</h1>
          <p>Explore government, corporate, and tax-free bonds by yield, maturity, and credit rating.</p>
        </div>
      </div>

      <input
        className="input listing-search"
        placeholder="Search bonds by name or issuer…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <FilterBar>
        <CategoryPills options={BOND_TYPES} value={type} onChange={setType} />
        <div className="filter-bar-group">
          <SelectField label="Rating" value={rating} onChange={setRating} options={["All", ...BOND_RATINGS].map((r) => ({ value: r, label: r }))} />
          <SelectField label="Sort" value={sort} onChange={setSort} options={SORT_OPTIONS} />
        </div>
      </FilterBar>

      {results.length === 0 ? (
        <EmptyState icon={SearchX} title="No bonds match your filters" description="Try a different type or rating." />
      ) : (
        <div className="grid-cards">
          {results.map((bond) => (
            <BondCard key={bond.id} bond={bond} />
          ))}
        </div>
      )}
    </div>
  );
}
