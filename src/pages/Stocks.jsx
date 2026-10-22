import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import { stocks, STOCK_SECTORS } from "../data/stocks";
import StockCard from "../components/StockCard";
import FilterBar, { CategoryPills, SelectField } from "../components/FilterBar";
import EmptyState from "../components/EmptyState";
import "./ListingPage.css";

const SORT_OPTIONS = [
  { value: "change-desc", label: "Top Gainers" },
  { value: "change-asc", label: "Top Losers" },
  { value: "az", label: "Name A-Z" },
  { value: "marketcap-desc", label: "Market Cap (High to Low)" },
  { value: "pe-asc", label: "Lowest P/E" },
];

export default function Stocks() {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("All");
  const [sort, setSort] = useState("change-desc");

  const results = useMemo(() => {
    let list = stocks;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.symbol.toLowerCase().includes(q));
    }
    if (sector !== "All") list = list.filter((s) => s.sector === sector);

    const sorted = [...list];
    switch (sort) {
      case "change-desc":
        sorted.sort((a, b) => b.changePct - a.changePct);
        break;
      case "change-asc":
        sorted.sort((a, b) => a.changePct - b.changePct);
        break;
      case "az":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "marketcap-desc":
        sorted.sort((a, b) => b.marketCap - a.marketCap);
        break;
      case "pe-asc":
        sorted.sort((a, b) => a.pe - b.pe);
        break;
      default:
        break;
    }
    return sorted;
  }, [query, sector, sort]);

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Stocks</h1>
          <p>Track {stocks.length} stocks across sectors, simulate portfolio positions, and follow price moves.</p>
        </div>
      </div>

      <input
        className="input listing-search"
        placeholder="Search stocks by name or symbol…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <FilterBar>
        <CategoryPills options={STOCK_SECTORS} value={sector} onChange={setSector} />
        <SelectField label="Sort" value={sort} onChange={setSort} options={SORT_OPTIONS} />
      </FilterBar>

      {results.length === 0 ? (
        <EmptyState icon={SearchX} title="No stocks match your filters" description="Try a different sector or search term." />
      ) : (
        <div className="grid-cards">
          {results.map((stock) => (
            <StockCard key={stock.id} stock={stock} />
          ))}
        </div>
      )}
    </div>
  );
}
