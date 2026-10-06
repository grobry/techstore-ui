import { Link } from 'react-router-dom';
import ProductArt from './ProductArt.jsx';
import { formatPrice } from '../lib/format.js';

export default function ProductCard({ product }) {
  const soldOut = product.stock <= 0;
  return (
    <Link to={`/product/${product.slug}`} className="card">
      <div className="card__media">
        <ProductArt product={product} />
        {soldOut && <span className="tag">Sold out</span>}
        {!soldOut && product.compareAtPrice > product.price && <span className="tag tag--accent">Save {formatPrice(product.compareAtPrice - product.price)}</span>}
      </div>
      <div className="card__body">
        <div className="card__meta">
          <span>{product.brand}</span>
          {product.colors?.length > 1 && (
            <span className="swatches-mini" aria-label={`${product.colors.length} colors`}>
              {product.colors.slice(0, 4).map((c) => (
                <i key={c.name} style={{ background: c.hex }} />
              ))}
            </span>
          )}
        </div>
        <h3 className="card__title">{product.name}</h3>
        <p className="card__tagline">{product.tagline}</p>
        <div className="card__price">
          {formatPrice(product.price)}
          {product.compareAtPrice > product.price && <s>{formatPrice(product.compareAtPrice)}</s>}
        </div>
      </div>
    </Link>
  );
}
