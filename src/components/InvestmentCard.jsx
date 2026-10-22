import { useNavigate } from "react-router-dom";
import { Trash2, ArrowRight } from "lucide-react";
import { getFundById } from "../data/mutualFunds";
import { getStockById } from "../data/stocks";
import { getBondById } from "../data/bonds";
import { formatPercent, formatCurrency } from "../utils/formatting";
import Button from "./Button";
import "./InvestmentCard.css";

const TYPE_PATH = { mutualFund: "mutual-funds", stock: "stocks", bond: "bonds" };
const TYPE_LABEL = { mutualFund: "Mutual Fund", stock: "Stock", bond: "Bond" };

function resolve(type, refId) {
  if (type === "mutualFund") return getFundById(refId);
  if (type === "stock") return getStockById(refId);
  if (type === "bond") return getBondById(refId);
  return null;
}

export default function InvestmentCard({ entry, onRemove, onCompareToggle, comparing }) {
  const navigate = useNavigate();
  const instrument = resolve(entry.type, entry.refId);
  if (!instrument) return null;

  const path = `/${TYPE_PATH[entry.type]}/${entry.refId}`;
  let keyStat = null;
  if (entry.type === "mutualFund") {
    keyStat = { label: "1Y Return", value: formatPercent(instrument.r1y), positive: instrument.r1y >= 0 };
  } else if (entry.type === "stock") {
    keyStat = { label: "Today", value: formatPercent(instrument.changePct), positive: instrument.changePct >= 0 };
  } else {
    keyStat = { label: "Yield", value: `${instrument.yield}%`, positive: true };
  }

  const priceLabel = entry.type === "stock" ? formatCurrency(instrument.price, { decimals: 2 }) : entry.type === "mutualFund" ? formatCurrency(instrument.nav, { decimals: 2 }) : formatCurrency(instrument.faceValue);

  return (
    <div className="investment-row">
      <div className="investment-row-main" onClick={() => navigate(path)}>
        <span className="type-chip">{TYPE_LABEL[entry.type]}</span>
        <div className="investment-row-name">
          <span className="name">{instrument.name}</span>
          <span className="sub">{instrument.symbol || instrument.category || instrument.issuer}</span>
        </div>
      </div>
      <div className="investment-row-price mono">{priceLabel}</div>
      <div className={keyStat.positive ? "investment-row-stat positive" : "investment-row-stat negative"}>
        {keyStat.value}
      </div>
      <div className="investment-row-actions">
        {entry.type === "mutualFund" && onCompareToggle && (
          <Button variant={comparing ? "outline" : "ghost"} size="sm" onClick={() => onCompareToggle(entry)}>
            {comparing ? "Comparing" : "Compare"}
          </Button>
        )}
        <Button variant="ghost" size="sm" icon={ArrowRight} onClick={() => navigate(path)} aria-label="View details" />
        {onRemove && (
          <Button variant="danger" size="sm" icon={Trash2} onClick={() => onRemove(entry)} aria-label="Remove" />
        )}
      </div>
    </div>
  );
}
