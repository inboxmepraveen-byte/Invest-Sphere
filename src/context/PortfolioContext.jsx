import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadState, saveState, STORAGE_KEYS } from "../utils/storage";
import { SEED_HOLDINGS, summarizePortfolio } from "../data/portfolio";
import { SEED_TRANSACTIONS } from "../data/transactions";
import { useToast } from "./ToastContext";

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [holdings, setHoldings] = useState(() => loadState(STORAGE_KEYS.portfolio, SEED_HOLDINGS));
  const [transactions, setTransactions] = useState(() =>
    loadState(STORAGE_KEYS.transactions, SEED_TRANSACTIONS)
  );
  const { showToast } = useToast();

  useEffect(() => {
    saveState(STORAGE_KEYS.portfolio, holdings);
  }, [holdings]);

  useEffect(() => {
    saveState(STORAGE_KEYS.transactions, transactions);
  }, [transactions]);

  const addInvestment = ({ type, refId, name, amount, quantity, purchasePrice, date, transactionType, silent }) => {
    const holdingId = `hold-${Date.now()}`;
    setHoldings((prev) => {
      const existing = prev.find((h) => h.type === type && h.refId === refId);
      if (existing) {
        const totalQty = existing.quantity + quantity;
        const totalCost = existing.quantity * existing.avgPrice + quantity * purchasePrice;
        return prev.map((h) =>
          h.id === existing.id ? { ...h, quantity: totalQty, avgPrice: totalCost / totalQty } : h
        );
      }
      return [...prev, { id: holdingId, type, refId, quantity, avgPrice: purchasePrice, date }];
    });

    setTransactions((prev) => [
      {
        id: `txn-${Date.now()}`,
        type: transactionType || "Buy",
        investment: name,
        investmentType: type,
        amount,
        quantity,
        date,
      },
      ...prev,
    ]);

    if (!silent) showToast(`Investment added: ${name}`);
  };

  const summary = useMemo(() => summarizePortfolio(holdings), [holdings]);

  return (
    <PortfolioContext.Provider value={{ holdings, transactions, addInvestment, ...summary }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioProvider");
  return ctx;
}
