import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { usePortfolio } from "../context/PortfolioContext";
import { useToast } from "../context/ToastContext";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import { formatCurrency } from "../utils/formatting";
import "./Cart.css";

const TYPE_LABEL = { mutualFund: "Mutual Fund", stock: "Stock", bond: "Bond" };

export default function Cart() {
  const { items, updateAmount, removeFromCart, clearCart, totalAmount } = useCart();
  const { addInvestment } = usePortfolio();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [reviewing, setReviewing] = useState(!!location.state?.review);

  const step = (item, delta) => {
    const unit = item.price || 100;
    updateAmount(item.id, Math.max(unit, item.amount + delta * unit));
  };

  const confirmInvestment = () => {
    items.forEach((item) => {
      addInvestment({
        type: item.type,
        refId: item.refId,
        name: item.name,
        amount: item.amount,
        quantity: item.price ? item.amount / item.price : item.quantity,
        purchasePrice: item.price,
        date: new Date().toISOString().slice(0, 10),
        transactionType: "Buy",
        silent: true,
      });
    });
    clearCart();
    showToast(`${items.length} investment${items.length > 1 ? "s" : ""} confirmed`);
    navigate("/portfolio");
  };

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="page-header">
          <div>
            <h1>Investment Cart</h1>
          </div>
        </div>
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Add investments from a fund, stock, or bond page to get started."
          action={
            <Button variant="primary" onClick={() => navigate("/dashboard")}>
              Explore Investments
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>{reviewing ? "Review Investment" : "Investment Cart"}</h1>
          <p>{reviewing ? "Confirm the details below. This is a simulation — no real payment is made." : "Adjust amounts before reviewing your investment."}</p>
        </div>
        {!reviewing && (
          <div className="page-header-actions">
            <Button variant="ghost" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        )}
      </div>

      <div className="cart-list">
        {items.map((item) => (
          <div className="cart-row" key={item.id}>
            <div className="cart-row-main">
              <span className="type-chip">{TYPE_LABEL[item.type]}</span>
              <div>
                <div className="cart-row-name">{item.name}</div>
                <div className="cart-row-sub">≈ {(item.price ? item.amount / item.price : item.quantity).toFixed(2)} units at {formatCurrency(item.price, { decimals: 2 })}</div>
              </div>
            </div>
            {!reviewing ? (
              <div className="cart-row-controls">
                <button onClick={() => step(item, -1)} aria-label="Decrease amount">
                  <Minus size={14} />
                </button>
                <span className="mono">{formatCurrency(item.amount, { decimals: 0 })}</span>
                <button onClick={() => step(item, 1)} aria-label="Increase amount">
                  <Plus size={14} />
                </button>
                <button className="cart-remove" onClick={() => removeFromCart(item.id, item.name)} aria-label="Remove">
                  <Trash2 size={14} />
                </button>
              </div>
            ) : (
              <span className="mono cart-review-amount">{formatCurrency(item.amount, { decimals: 0 })}</span>
            )}
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <span>Total Investment</span>
        <span className="mono cart-total">{formatCurrency(totalAmount, { decimals: 0 })}</span>
      </div>

      <div className="cart-actions">
        {reviewing ? (
          <>
            <Button variant="secondary" onClick={() => setReviewing(false)}>
              Back to Cart
            </Button>
            <Button variant="primary" onClick={confirmInvestment}>
              Confirm Investment
            </Button>
          </>
        ) : (
          <Button variant="primary" className="btn-block" onClick={() => setReviewing(true)}>
            Review Investment
          </Button>
        )}
      </div>
    </div>
  );
}
