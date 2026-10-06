import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import ProductArt from './ProductArt.jsx';
import { QuantityStepper } from './ui.jsx';
import { CloseIcon } from './Icons.jsx';
import { formatPrice, FREE_SHIPPING_THRESHOLD } from '../lib/format.js';

export default function CartDrawer() {
  const { items, subtotal, drawerOpen, closeDrawer, setQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e) => e.key === 'Escape' && closeDrawer();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [drawerOpen, closeDrawer]);

  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const go = (path) => {
    closeDrawer();
    navigate(path);
  };

  return (
    <>
      <div className={`scrim ${drawerOpen ? 'is-open' : ''}`} onClick={closeDrawer} aria-hidden="true" />
      <aside className={`drawer ${drawerOpen ? 'is-open' : ''}`} aria-label="Shopping bag" aria-hidden={!drawerOpen}>
        <div className="drawer__head">
          <h2>Your bag</h2>
          <button className="icon-btn" onClick={closeDrawer} aria-label="Close bag">
            <CloseIcon />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="drawer__empty">
            <p>Your bag is empty.</p>
            <button className="btn" onClick={() => go('/shop')}>
              Browse the collection
            </button>
          </div>
        ) : (
          <>
            {subtotal > 0 && (
              <div className="ship-progress">
                <p>{remaining > 0 ? <>You're {formatPrice(remaining)} away from free shipping.</> : <>You've unlocked free shipping.</>}</p>
                <div className="bar"><span style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }} /></div>
              </div>
            )}
            <ul className="drawer__list">
              {items.map((l) => (
                <li key={l.key} className="line">
                  <Link to={`/product/${l.slug}`} onClick={closeDrawer} className="line__media">
                    <ProductArt product={l} glow={false} />
                  </Link>
                  <div className="line__info">
                    <div className="line__top">
                      <Link to={`/product/${l.slug}`} onClick={closeDrawer} className="line__name">{l.name}</Link>
                      <span>{formatPrice(l.price * l.quantity)}</span>
                    </div>
                    {l.color && <span className="muted small">{l.color}</span>}
                    <div className="line__bottom">
                      <QuantityStepper size="sm" value={l.quantity} max={l.stock} onChange={(q) => setQuantity(l.key, q)} />
                      <button className="link-btn" onClick={() => removeItem(l.key)}>Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="drawer__foot">
              <div className="row-between">
                <span className="muted">Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <p className="muted small">Shipping and taxes calculated at checkout.</p>
              <button className="btn btn--block" onClick={() => go('/checkout')}>Checkout</button>
              <button className="btn btn--ghost btn--block" onClick={() => go('/cart')}>View bag</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
