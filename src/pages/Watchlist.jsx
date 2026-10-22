import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, GitCompare } from "lucide-react";
import { useWatchlist } from "../context/WatchlistContext";
import { getFundById } from "../data/mutualFunds";
import { getStockById } from "../data/stocks";
import { getBondById } from "../data/bonds";
import InvestmentCard from "../components/InvestmentCard";
import FilterBar, { CategoryPills, SelectField } from "../components/FilterBar";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import "./ListingPage.css";

const TYPE_FILTERS = ["All", "Mutual Funds", "Stocks", "Bonds"];
const TYPE_MAP = { "Mutual Funds": "mutualFund", Stocks: "stock", Bonds: "bond" };

function resolveSortValue(entry) {
  if (entry.type === "mutualFund") return getFundById(entry.refId)?.r1y ?? 0;
  if (entry.type === "stock") return getStockById(entry.refId)?.changePct ?? 0;
  return getBondById(entry.refId)?.yield ?? 0;
}

export default function Watchlist() {
  const { items, removeFromWatchlist } = useWatchlist();
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState("All");
  const [sort, setSort] = useState("recent");
  const [compareIds, setCompareIds] = useState([]);

  const filtered = useMemo(() => {
    let list = items;
    if (typeFilter !== "All") list = list.filter((i) => i.type === TYPE_MAP[typeFilter]);
    const sorted = [...list];
    if (sort === "recent") sorted.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    else if (sort === "az") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "performance") sorted.sort((a, b) => resolveSortValue(b) - resolveSortValue(a));
    return sorted;
  }, [items, typeFilter, sort]);

  const toggleCompare = (entry) => {
    setCompareIds((prev) =>
      prev.includes(entry.refId) ? prev.filter((id) => id !== entry.refId) : prev.length >= 3 ? prev : [...prev, entry.refId]
    );
  };

  const goCompare = () => {
    if (compareIds.length === 0) return;
    navigate(`/compare?add=${compareIds[0]}`);
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Watchlist</h1>
          <p>Investments you're tracking. Saved locally, so it stays with you between visits.</p>
        </div>
        {compareIds.length > 0 && (
          <div className="page-header-actions">
            <Button variant="primary" icon={GitCompare} onClick={goCompare}>
              Compare {compareIds.length} selected
            </Button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Eye}
          title="No watchlist items"
          description="Start adding investments to track them here."
          action={
            <Button variant="primary" onClick={() => navigate("/mutual-funds")}>
              Explore Mutual Funds
            </Button>
          }
        />
      ) : (
        <>
          <FilterBar>
            <CategoryPills options={TYPE_FILTERS} value={typeFilter} onChange={setTypeFilter} />
            <SelectField
              label="Sort"
              value={sort}
              onChange={setSort}
              options={[
                { value: "recent", label: "Recently Added" },
                { value: "az", label: "Name A-Z" },
                { value: "performance", label: "Performance" },
              ]}
            />
          </FilterBar>

          {filtered.length === 0 ? (
            <EmptyState title="No items in this filter" description="Try a different type filter." />
          ) : (
            <div>
              {filtered.map((entry) => (
                <InvestmentCard
                  key={`${entry.type}-${entry.refId}`}
                  entry={entry}
                  onRemove={(e) => removeFromWatchlist(e.type, e.refId, e.name)}
                  onCompareToggle={entry.type === "mutualFund" ? toggleCompare : undefined}
                  comparing={compareIds.includes(entry.refId)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
