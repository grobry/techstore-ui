import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAsync } from '../lib/useAsync.js';
import ProductCard from '../components/ProductCard.jsx';
import { Spinner, ErrorState } from '../components/ui.jsx';

const CATEGORIES = ['All', 'Phones', 'Laptops', 'Audio', 'Wearables', 'Cameras', 'Accessories'];
const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
];
const PRICE_RANGES = [
  { value: '', label: 'Any price' },
  { value: '0-300', label: 'Under $300' },
  { value: '300-1000', label: '$300 – $1,000' },
  { value: '1000-2000', label: '$1,000 – $2,000' },
  { value: '2000-', label: '$2,000+' },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || 'All';
  const q = params.get('q') || '';
  const sort = params.get('sort') || 'featured';
  const price = params.get('price') || '';
  const [minPrice, maxPrice] = price.split('-');

  const [search, setSearch] = useState(q);
  useEffect(() => {
    setSearch(q);
  }, [q]);

  const update = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v && v !== 'All' && !(k === 'sort' && v === 'featured') ? next.set(k, v) : next.delete(k)));
    setParams(next, { replace: true });
  };

  // Debounce the search box into the URL.
  useEffect(() => {
    if (search === q) return;
    const t = setTimeout(() => update({ q: search.trim() }), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const { data, error, loading, retry } = useAsync(
    () => api.getProducts({ category: category === 'All' ? undefined : category, q, sort, minPrice, maxPrice }),
    [category, q, sort, minPrice, maxPrice]
  );

  const title = q ? `Results for “${q}”` : category === 'All' ? 'All products' : category;

  return (
    <div className="container page">
      <header className="page__head">
        <h1>{title}</h1>
        {data && <p className="muted">{data.length} {data.length === 1 ? 'product' : 'products'}</p>}
      </header>

      <div className="filters">
        <div className="chips" role="tablist" aria-label="Category">
          {CATEGORIES.map((c) => (
            <button key={c} role="tab" aria-selected={category === c} className={`chip ${category === c ? 'is-active' : ''}`} onClick={() => update({ category: c })}>
              {c}
            </button>
          ))}
        </div>
        <div className="filters__right">
          <input className="input input--sm" type="search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search products" />
          <select className="input input--sm" value={price} onChange={(e) => update({ price: e.target.value })} aria-label="Price range">
            {PRICE_RANGES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          <select className="input input--sm" value={sort} onChange={(e) => update({ sort: e.target.value })} aria-label="Sort by">
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && !data ? (
        <Spinner />
      ) : error ? (
        <ErrorState message={error.message} onRetry={retry} />
      ) : data.length === 0 ? (
        <div className="empty">
          <p>No products match those filters.</p>
          <button className="btn btn--ghost" onClick={() => setParams({}, { replace: true })}>Clear filters</button>
        </div>
      ) : (
        <div className={`grid ${loading ? 'is-loading' : ''}`}>
          {data.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
