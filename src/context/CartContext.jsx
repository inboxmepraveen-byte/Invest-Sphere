import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadState, saveState, STORAGE_KEYS } from "../utils/storage";
import { useToast } from "./ToastContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => loadState(STORAGE_KEYS.cart, []));
  const { showToast } = useToast();

  useEffect(() => {
    saveState(STORAGE_KEYS.cart, items);
  }, [items]);

  const addToCart = (entry) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.type === entry.type && i.refId === entry.refId);
      if (existing) {
        return prev.map((i) => (i.id === existing.id ? { ...i, amount: i.amount + entry.amount } : i));
      }
      return [...prev, { ...entry, id: `cart-${Date.now()}` }];
    });
    showToast(`${entry.name} added to cart`);
  };

  const updateAmount = (id, amount) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, amount: Math.max(0, amount) } : i)));
  };

  const removeFromCart = (id, name) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (name) showToast(`Removed ${name} from cart`);
  };

  const clearCart = () => setItems([]);

  const totalAmount = useMemo(() => items.reduce((sum, i) => sum + i.amount, 0), [items]);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateAmount, removeFromCart, clearCart, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
