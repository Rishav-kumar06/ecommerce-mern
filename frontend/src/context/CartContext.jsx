import { createContext, useContext, useState, useEffect } from "react";
import { LOCAL_STORAGE_KEYS } from "../utils/constants";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.CART);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCartItems([]);

  const isInCart = (productId) => cartItems.some((item) => item.id === productId);

  const getItemQuantity = (productId) => {
    const item = cartItems.find((i) => i.id === productId);
    return item ? item.quantity : 0;
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : subtotal > 0 ? 9.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        shipping,
        tax,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};

export default CartContext;
