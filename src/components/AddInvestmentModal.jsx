import { useMemo, useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import { mutualFunds } from "../data/mutualFunds";
import { stocks } from "../data/stocks";
import { bonds } from "../data/bonds";
import { usePortfolio } from "../context/PortfolioContext";

const TYPE_OPTIONS = [
  { value: "mutualFund", label: "Mutual Fund", list: mutualFunds, priceKey: "nav" },
  { value: "stock", label: "Stock", list: stocks, priceKey: "price" },
  { value: "bond", label: "Bond", list: bonds, priceKey: "faceValue" },
];

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function AddInvestmentModal({ open, onClose }) {
  const { addInvestment } = usePortfolio();
  const [type, setType] = useState("mutualFund");
  const [refId, setRefId] = useState("");
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [date, setDate] = useState(todayISO());
  const [errors, setErrors] = useState({});

  const typeConfig = TYPE_OPTIONS.find((t) => t.value === type);
  const instrument = typeConfig.list.find((i) => i.id === refId);

  const reset = () => {
    setType("mutualFund");
    setRefId("");
    setAmount("");
    setQuantity("");
    setPurchasePrice("");
    setDate(todayISO());
    setErrors({});
  };

  const close = () => {
    reset();
    onClose();
  };

  const validate = () => {
    const errs = {};
    if (!refId) errs.refId = "Select an investment.";
    const amt = Number(amount);
    const qty = Number(quantity);
    const price = Number(purchasePrice);
    if (!amount || amt <= 0) errs.amount = "Amount must be greater than 0.";
    if (!quantity || qty <= 0) errs.quantity = "Quantity must be greater than 0.";
    if (!purchasePrice || price <= 0) errs.purchasePrice = "Purchase price must be greater than 0.";
    if (!date) errs.date = "Select a purchase date.";
    else if (new Date(date) > new Date()) errs.date = "Date cannot be in the future.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    addInvestment({
      type,
      refId,
      name: instrument.name,
      amount: Number(amount),
      quantity: Number(quantity),
      purchasePrice: Number(purchasePrice),
      date,
    });
    close();
  };

  const autoFillPrice = (id) => {
    const inst = typeConfig.list.find((i) => i.id === id);
    if (inst) setPurchasePrice(String(inst[typeConfig.priceKey]));
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Add Investment"
      width={480}
      footer={
        <>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Add Investment
          </Button>
        </>
      }
    >
      <div className="form-group">
        <label>Investment Type</label>
        <select
          className="select"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setRefId("");
          }}
        >
          {TYPE_OPTIONS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Investment Name</label>
        <select
          className={errors.refId ? "select error" : "select"}
          value={refId}
          onChange={(e) => {
            setRefId(e.target.value);
            autoFillPrice(e.target.value);
            setErrors((prev) => ({ ...prev, refId: undefined }));
          }}
        >
          <option value="">Select {typeConfig.label.toLowerCase()}…</option>
          {typeConfig.list.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          ))}
        </select>
        {errors.refId && <div className="field-error">{errors.refId}</div>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Quantity</label>
          <input
            className={errors.quantity ? "input error" : "input"}
            type="number"
            min="0"
            step="any"
            value={quantity}
            onChange={(e) => {
              const q = e.target.value;
              setQuantity(q);
              if (purchasePrice) setAmount((Number(q) * Number(purchasePrice)).toFixed(2));
            }}
          />
          {errors.quantity && <div className="field-error">{errors.quantity}</div>}
        </div>
        <div className="form-group">
          <label>Purchase Price (₹)</label>
          <input
            className={errors.purchasePrice ? "input error" : "input"}
            type="number"
            min="0"
            step="any"
            value={purchasePrice}
            onChange={(e) => {
              const p = e.target.value;
              setPurchasePrice(p);
              if (quantity) setAmount((Number(quantity) * Number(p)).toFixed(2));
            }}
          />
          {errors.purchasePrice && <div className="field-error">{errors.purchasePrice}</div>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Amount (₹)</label>
          <input
            className={errors.amount ? "input error" : "input"}
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {errors.amount && <div className="field-error">{errors.amount}</div>}
        </div>
        <div className="form-group">
          <label>Investment Date</label>
          <input
            className={errors.date ? "input error" : "input"}
            type="date"
            max={todayISO()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {errors.date && <div className="field-error">{errors.date}</div>}
        </div>
      </div>
    </Modal>
  );
}
