import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, TrendingUp, Landmark, Receipt } from "lucide-react";
import { mutualFunds } from "../data/mutualFunds";
import { stocks } from "../data/stocks";
import { bonds } from "../data/bonds";
import { formatPercent } from "../utils/formatting";
import "./SearchBar.css";

const GROUPS = [
  { key: "mutualFunds", label: "Mutual Funds", icon: TrendingUp, path: "/mutual-funds" },
  { key: "stocks", label: "Stocks", icon: Landmark, path: "/stocks" },
  { key: "bonds", label: "Bonds", icon: Receipt, path: "/bonds" },
];

function search(query) {
  const q = query.trim().toLowerCase();
  if (!q) return { mutualFunds: [], stocks: [], bonds: [] };
  return {
    mutualFunds: mutualFunds.filter((f) => f.name.toLowerCase().includes(q) || f.amc.toLowerCase().includes(q)).slice(0, 5),
    stocks: stocks.filter((s) => s.name.toLowerCase().includes(q) || s.symbol.toLowerCase().includes(q)).slice(0, 5),
    bonds: bonds.filter((b) => b.name.toLowerCase().includes(q) || b.issuer.toLowerCase().includes(q)).slice(0, 5),
  };
}

export default function SearchBar({ variant = "nav", autoFocus = false, onNavigate }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  const [results, setResults] = useState({ mutualFunds: [], stocks: [], bonds: [] });

  useEffect(() => {
    if (!query.trim()) {
      setResults({ mutualFunds: [], stocks: [], bonds: [] });
      setLoading(false);
      return;
    }
    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setResults(search(query));
      setLoading(false);
    }, 150);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  useEffect(() => {
    function onClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const flatResults = useMemo(() => {
    const flat = [];
    GROUPS.forEach((g) => {
      (results[g.key] || []).forEach((item) => flat.push({ group: g, item }));
    });
    return flat;
  }, [results]);

  const hasQuery = query.trim().length > 0;
  const hasResults = flatResults.length > 0;

  const goTo = (group, item) => {
    setOpen(false);
    setQuery("");
    navigate(`${group.path}/${item.id}`);
    onNavigate?.();
  };

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && flatResults[activeIndex]) {
        const { group, item } = flatResults[activeIndex];
        goTo(group, item);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className={`search-bar search-bar-${variant}`} ref={containerRef}>
      <div className="search-input-wrap">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search mutual funds, stocks, bonds…"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          aria-label="Search investments"
        />
        {query && (
          <button className="search-clear" onClick={() => { setQuery(""); setActiveIndex(-1); }} aria-label="Clear search">
            <X size={14} />
          </button>
        )}
      </div>

      {open && hasQuery && (
        <div className="search-dropdown">
          {loading && <div className="search-loading">Searching…</div>}
          {!loading && !hasResults && (
            <div className="search-empty">
              <p>No results for "{query}"</p>
              <span>Try another name or symbol.</span>
            </div>
          )}
          {!loading &&
            hasResults &&
            GROUPS.map((g) => {
              const items = results[g.key];
              if (!items || items.length === 0) return null;
              return (
                <div className="search-group" key={g.key}>
                  <div className="search-group-label">
                    <g.icon size={13} />
                    {g.label}
                  </div>
                  {items.map((item) => {
                    const flatIdx = flatResults.findIndex((f) => f.item.id === item.id);
                    const isActive = flatIdx === activeIndex;
                    return (
                      <button
                        key={item.id}
                        className={isActive ? "search-result active" : "search-result"}
                        onMouseEnter={() => setActiveIndex(flatIdx)}
                        onClick={() => goTo(g, item)}
                      >
                        <div className="search-result-main">
                          <span className="search-result-name">{item.name}</span>
                          <span className="search-result-meta">
                            {item.symbol || item.category || item.type}
                          </span>
                        </div>
                        {"r1y" in item && <span className="positive">{formatPercent(item.r1y)}</span>}
                        {"changePct" in item && (
                          <span className={item.changePct >= 0 ? "positive" : "negative"}>
                            {formatPercent(item.changePct)}
                          </span>
                        )}
                        {"yield" in item && <span className="text-secondary">{item.yield}% yield</span>}
                      </button>
                    );
                  })}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
