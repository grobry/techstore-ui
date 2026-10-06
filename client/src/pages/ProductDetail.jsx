import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAsync } from '../lib/useAsync.js';
import { formatPrice } from '../lib/format.js';
import { useCart } from '../context/CartContext.jsx';
import ProductArt from '../components/ProductArt.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { Rating, QuantityStepper, Spinner, ErrorState, StockNote } from '../components/ui.jsx';
import { TruckIcon, ShieldIcon, ReturnIcon } from '../components/Icons.jsx';

export default function ProductDetail() {
  const { slug } = useParams();
  const { data, error, loading, retry } = useAsync(() => api.getProduct(slug), [slug]);
  const { addItem, items } = useCart();
  const [color, setColor] = useState('');
  const [qty, setQty] = useState(1);

  const product = data?.product;

  useEffect(() => {
    setColor(product?.colors?.[0]?.name || '');
    setQty(1);
    window.scrollTo(0, 0);
  }, [product?._id]);

  if (loading) return <div className="container page"><Spinner /></div>;
  if (error) {
    return (
      <div className="container page">
        {error.status === 404 ? (
          <div className="empty">
            <p>We couldn't find that product.</p>
            <Link className="btn btn--ghost" to="/shop">Back to shop</Link>
          </div>
        ) : (
          <ErrorState message={error.message} onRetry={retry} />
        )}
      </div>
    );
  }

  const inCart = items.filter((l) => l.productId === product._id).reduce((n, l) => n + l.quantity, 0);
  const available = Math.max(0, product.stock - inCart);
  const soldOut = product.stock <= 0;

  return (
    <div className="container page">
      <nav className="crumbs muted small" aria-label="Breadcrumb">
        <Link to="/shop">Shop</Link> <span>/</span>
        <Link to={`/shop?category=${product.category}`}>{product.category}</Link> <span>/</span>
        <span>{product.name}</span>
      </nav>

      <div className="pdp">
        <div className="pdp__media">
          <ProductArt product={product} className="product-art--large" />
        </div>

        <div className="pdp__info">
          <p className="eyebrow">{product.brand}</p>
          <h1>{product.name}</h1>
          <p className="lead">{product.tagline}</p>
          <Rating value={product.rating} count={product.reviewCount} />

          <div className="pdp__price">
            {formatPrice(product.price)}
            {product.compareAtPrice > product.price && <s>{formatPrice(product.compareAtPrice)}</s>}
          </div>

          {product.colors?.length > 0 && (
            <div className="field">
              <span className="field__label">
                Color <span className="muted">— {color}</span>
              </span>
              <div className="swatches">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    className={`swatch ${color === c.name ? 'is-active' : ''}`}
                    style={{ '--swatch': c.hex }}
                    onClick={() => setColor(c.name)}
                    aria-label={c.name}
                    aria-pressed={color === c.name}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="pdp__buy">
            {!soldOut && <QuantityStepper value={Math.min(qty, Math.max(available, 1))} max={Math.max(available, 1)} onChange={setQty} />}
            <button
              className="btn btn--lg"
              disabled={soldOut || available <= 0}
              onClick={() => addItem(product, { color, quantity: Math.min(qty, available) })}
            >
              {soldOut ? 'Sold out' : available <= 0 ? 'Max in bag' : `Add to bag — ${formatPrice(product.price * Math.min(qty, available))}`}
            </button>
          </div>
          <StockNote stock={product.stock} />

          <ul className="assurances muted small">
            <li><TruckIcon width={18} height={18} /> Free express shipping over $500</li>
            <li><ShieldIcon width={18} height={18} /> Two-year warranty included</li>
            <li><ReturnIcon width={18} height={18} /> Free 30-day returns</li>
          </ul>

          <p className="pdp__desc">{product.description}</p>
        </div>
      </div>

      {product.specs?.length > 0 && (
        <section className="section">
          <h2>Tech specs</h2>
          <dl className="specs">
            {product.specs.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {data.related?.length > 0 && (
        <section className="section">
          <h2>You may also like</h2>
          <div className="grid">
            {data.related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
