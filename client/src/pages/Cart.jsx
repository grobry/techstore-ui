import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import ProductArt from '../components/ProductArt.jsx';
import { QuantityStepper } from '../components/ui.jsx';
import { formatPrice, estimateTotals } from '../lib/format.js';

export default function Cart() {
  const { items, subtotal, setQuantity, removeItem } = useCart();
  const totals = estimateTotals(subtotal);

  if (items.length === 0) {
    return (
      <div className="container page">
        <div className="empty empty--tall">
          <h1>Your bag is empty.</h1>
          <p className="muted">Find something you'll love.</p>
          <Link to="/shop" className="btn">Shop the collection</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <header className="page__head">
        <h1>Your bag</h1>
      </header>
      <div className="split">
        <ul className="cart-list">
          {items.map((l) => (
            <li key={l.key} className="line line--lg">
              <Link to={`/product/${l.slug}`} className="line__media">
                <ProductArt product={l} glow={false} />
              </Link>
              <div className="line__info">
                <div className="line__top">
                  <div>
                    <Link to={`/product/${l.slug}`} className="line__name">{l.name}</Link>
                    <div className="muted small">{[l.brand, l.color].filter(Boolean).join(' · ')}</div>
                  </div>
                  <strong>{formatPrice(l.price * l.quantity)}</strong>
                </div>
                <div className="line__bottom">
                  <QuantityStepper value={l.quantity} max={l.stock} onChange={(q) => setQuantity(l.key, q)} />
                  <button className="link-btn" onClick={() => removeItem(l.key)}>Remove</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <OrderSummary totals={totals}>
          <Link to="/checkout" className="btn btn--block btn--lg">Checkout</Link>
          <Link to="/shop" className="btn btn--ghost btn--block">Continue shopping</Link>
        </OrderSummary>
      </div>
    </div>
  );
}

export function OrderSummary({ totals, children, title = 'Summary', items }) {
  return (
    <aside className="summary">
      <h2>{title}</h2>
      {items && (
        <ul className="summary__items">
          {items.map((l) => (
            <li key={l.key || `${l.slug}-${l.color}`}>
              <div className="summary__thumb">
                <ProductArt product={l} glow={false} />
                <span className="badge">{l.quantity}</span>
              </div>
              <div className="summary__name">
                <span>{l.name}</span>
                {l.color && <span className="muted small">{l.color}</span>}
              </div>
              <span>{formatPrice(l.price * l.quantity)}</span>
            </li>
          ))}
        </ul>
      )}
      <dl>
        <div><dt>Subtotal</dt><dd>{formatPrice(totals.subtotal)}</dd></div>
        <div><dt>Shipping</dt><dd>{totals.shippingCost === 0 ? 'Free' : formatPrice(totals.shippingCost)}</dd></div>
        <div><dt>Estimated tax</dt><dd>{formatPrice(totals.tax)}</dd></div>
        <div className="summary__total"><dt>Total</dt><dd>{formatPrice(totals.total)}</dd></div>
      </dl>
      {children && <div className="summary__actions">{children}</div>}
    </aside>
  );
}
