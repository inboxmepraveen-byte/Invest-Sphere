import { useMemo, useState } from "react";
import { Receipt } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { TRANSACTION_TYPES } from "../data/transactions";
import FilterBar, { CategoryPills, SelectField } from "../components/FilterBar";
import EmptyState from "../components/EmptyState";
import { formatCurrency, formatDate, formatNumber } from "../utils/formatting";

const TYPE_BADGE = {
  Buy: "badge-positive",
  SIP: "badge-neutral",
  Dividend: "badge-positive",
  Interest: "badge-positive",
  Deposit: "badge-neutral",
  Sell: "badge-negative",
  Withdrawal: "badge-negative",
};

export default function Transactions() {
  const { transactions } = usePortfolio();
  const [typeFilter, setTypeFilter] = useState("All");
  const [investmentFilter, setInvestmentFilter] = useState("All");

  const investments = useMemo(
    () => ["All", ...new Set(transactions.map((t) => t.investment))],
    [transactions]
  );

  const filtered = useMemo(() => {
    let list = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (typeFilter !== "All") list = list.filter((t) => t.type === typeFilter);
    if (investmentFilter !== "All") list = list.filter((t) => t.investment === investmentFilter);
    return list;
  }, [transactions, typeFilter, investmentFilter]);

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p>A full history of buys, sells, SIPs, dividends, interest, and cash movements.</p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <EmptyState icon={Receipt} title="No transactions yet" description="Your transaction history will appear here." />
      ) : (
        <>
          <FilterBar>
            <CategoryPills options={["All", ...TRANSACTION_TYPES]} value={typeFilter} onChange={setTypeFilter} />
            <SelectField
              label="Investment"
              value={investmentFilter}
              onChange={setInvestmentFilter}
              options={investments.map((i) => ({ value: i, label: i }))}
            />
          </FilterBar>

          {filtered.length === 0 ? (
            <EmptyState title="No matching transactions" description="Try a different filter." />
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Investment</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.id}>
                      <td className="text-secondary">{formatDate(t.date)}</td>
                      <td>
                        <span className={`badge ${TYPE_BADGE[t.type] || ""}`}>{t.type}</span>
                      </td>
                      <td>{t.investment}</td>
                      <td className="mono">{t.quantity ? formatNumber(t.quantity, 2) : "—"}</td>
                      <td className="mono">{formatCurrency(t.amount, { decimals: 0 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
