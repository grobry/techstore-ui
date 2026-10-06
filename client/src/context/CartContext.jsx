import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'nocturne-cart-v1';
const MAX_QTY = 10;

const lineKey = (productId, color) => `${productId}|${color || ''}`;

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function clampQty(qty, stock) {
  return Math.max(1, Math.min(qty, MAX_QTY, stock ?? MAX_QTY));
}

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { product, color, quantity } = action;
      const key = lineKey(product._id, color);
      const existing = state.find((l) => l.key === key);
      if (existing) {
        return state.map((l) => (l.key === key ? { ...l, quantity: clampQty(l.quantity + quantity, product.stock) } : l));
      }
      return [
        ...state,
        {
          key,
          productId: product._id,
          slug: product.slug,
          name: product.name,
          brand: product.brand,
          price: product.price,
          shape: product.shape,
          accent: product.accent,
          image: product.image,
          stock: product.stock,
          color,
          quantity: clampQty(quantity, product.stock),
        },
      ];
    }
    case 'setQty':
      return state.map((l) => (l.key === action.key ? { ...l, quantity: clampQty(action.quantity, l.stock) } : l));
    case 'remove':
      return state.filter((l) => l.key !== action.key);
    case 'clear':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, undefined, loadCart);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable — cart still works for this session */
    }
  }, [items]);

  const value = useMemo(() => {
    const count = items.reduce((n, l) => n + l.quantity, 0);
    const subtotal = items.reduce((sum, l) => sum + l.price * l.quantity, 0);
    return {
      items,
      count,
      subtotal,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      addItem: (product, { color = '', quantity = 1 } = {}) => {
        dispatch({ type: 'add', product, color, quantity });
        setDrawerOpen(true);
      },
      setQuantity: (key, quantity) => dispatch({ type: 'setQty', key, quantity }),
      removeItem: (key) => dispatch({ type: 'remove', key }),
      clear: () => dispatch({ type: 'clear' }),
    };
  }, [items, drawerOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}

export { MAX_QTY };
