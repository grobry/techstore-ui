import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAsync } from '../lib/useAsync.js';
import { formatPrice } from '../lib/format.js';
import ProductArt from '../components/ProductArt.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { Spinner, ErrorState } from '../components/ui.jsx';
import { ArrowRight, TruckIcon, ShieldIcon, ReturnIcon } from '../components/Icons.jsx';

const CATEGORY_SHAPES = {
  Phones: { shape: 'phone', accent: '#7c9cff' },
  Laptops: { shape: 'laptop', accent: '#a78bfa' },
  Audio: { shape: 'headphones', accent: '#fbbf24' },
  Wearables: { shape: 'watch', accent: '#fb923c' },
  Cameras: { shape: 'camera', accent: '#f87171' },
  Accessories: { shape: 'keyboard', accent: '#a3e635' },
};

export default function Home() {
  const featured = useAsync(() => api.getProducts({ featured: 'true' }), []);
  const categories = useAsync(() => api.getCategories(), []);

  const hero = featured.data?.find((p) => p.slug === 'slate-13-pro') || featured.data?.[0];

  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="eyebrow">New season · 2026 collection</p>
            <h1>
              Technology,
              <br />
              <span className="dim">considered.</span>
            </h1>
            <p className="lead">
              A tightly edited collection of phones, laptops, audio and cameras — chosen for craft, built to last.
            </p>
            <div className="hero__cta">
              <Link to="/shop" className="btn">
                Shop the collection <ArrowRight width={18} height={18} />
              </Link>
              {hero && (
                <Link to={`/product/${hero.slug}`} className="btn btn--ghost">
                  Explore {hero.name}
                </Link>
              )}
            </div>
          </div>
          <div className="hero__art">
            {hero ? (
              <Link to={`/product/${hero.slug}`} className="hero__product">
                <ProductArt product={hero} className="product-art--hero" />
                <div className="hero__caption">
                  <span>{hero.name}</span>
                  <span className="muted">From {formatPrice(hero.price)}</span>
                </div>
              </Link>
            ) : (
              <div className="hero__placeholder" />
            )}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section__head">
          <h2>Shop by category</h2>
        </div>
        <div className="cat-grid">
          {(categories.data || Object.keys(CATEGORY_SHAPES).map((name) => ({ name }))).map((c) => (
            <Link key={c.name} to={`/shop?category=${c.name}`} className="cat">
              <ProductArt product={{ name: c.name, ...CATEGORY_SHAPES[c.name] }} />
              <div className="cat__label">
                <span>{c.name}</span>
                {c.count !== undefined && <span className="muted small">{c.count} products</span>}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section__head">
          <h2>Featured</h2>
          <Link to="/shop" className="link-arrow">
            View all <ArrowRight width={16} height={16} />
          </Link>
        </div>
        {featured.loading ? (
          <Spinner />
        ) : featured.error ? (
          <ErrorState message="We couldn't load products. Is the API running?" onRetry={featured.retry} />
        ) : (
          <div className="grid">
            {featured.data.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="section container">
        <div className="perks">
          <div>
            <TruckIcon />
            <h3>Free express shipping</h3>
            <p className="muted">On every order over $500. Delivered in 1–3 business days.</p>
          </div>
          <div>
            <ShieldIcon />
            <h3>Two-year warranty</h3>
            <p className="muted">Every product is covered, parts and labor included.</p>
          </div>
          <div>
            <ReturnIcon />
            <h3>30-day returns</h3>
            <p className="muted">Changed your mind? Send it back, free of charge.</p>
          </div>
        </div>
      </section>
    </>
  );
}
