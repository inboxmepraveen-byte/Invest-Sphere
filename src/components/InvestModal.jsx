import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import Button from "./Button";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatting";

export default function InvestModal({ open, onClose, type, refId, name, price, minAmount = 500, unitLabel = "units" }) {
  const [amount, setAmount] = useState(String(minAmount));
  const [error, setError] = useState("");
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const quantity = useMemo(() => {
    const amt = Number(amount);
    if (!amt || !price) return 0;
    return amt / price;
  }, [amount, price]);

  const handleAdd = (goToCart) => {
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      setError("Enter an amount greater than 0.");
      return;
    }
    if (amt < minAmount) {
      setError(`Minimum investment is ${formatCurrency(minAmount)}.`);
      return;
    }
    addToCart({ type, refId, name, amount: amt, quantity, price });
    onClose();
    if (goToCart) navigate("/cart", { state: { review: true } });
  };

  return (
    <Modal open={open} onClose={onClose} title={`Invest in ${name}`} width={420}>
      <div className="form-group">
        <label>Amount (₹)</label>
        <input
          className={error ? "input error" : "input"}
          type="number"
          min={0}
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError("");
          }}
        />
        {error ? <div className="field-error">{error}</div> : <div className="field-hint">Minimum investment {formatCurrency(minAmount)}</div>}
      </div>
      {quantity > 0 && (
        <div className="field-hint" style={{ marginBottom: 16 }}>
          You will receive approximately <strong>{quantity.toFixed(4)}</strong> {unitLabel} at {formatCurrency(price, { decimals: 2 })} each.
        </div>
      )}
      <div style={{ display: "flex", gap: 10 }}>
        <Button variant="secondary" className="btn-block" onClick={() => handleAdd(false)}>
          Add to Cart
        </Button>
        <Button variant="primary" className="btn-block" onClick={() => handleAdd(true)}>
          Add & Review
        </Button>
      </div>
    </Modal>
  );
}
