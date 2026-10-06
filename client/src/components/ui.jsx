import { StarIcon } from './Icons.jsx';
import { MAX_QTY } from '../context/CartContext.jsx';

export function Rating({ value = 0, count }) {
  return (
    <span className="rating" aria-label={`Rated ${value} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <StarIcon key={i} filled={Math.max(0, Math.min(1, value - i))} />
      ))}
      <span className="rating__value">{value.toFixed(1)}</span>
      {count !== undefined && <span className="muted">({count.toLocaleString()})</span>}
    </span>
  );
}

export function QuantityStepper({ value, onChange, max = MAX_QTY, size = 'md' }) {
  const limit = Math.min(max, MAX_QTY);
  return (
    <div className={`stepper stepper--${size}`}>
      <button type="button" aria-label="Decrease quantity" disabled={value <= 1} onClick={() => onChange(value - 1)}>
        −
      </button>
      <span aria-live="polite">{value}</span>
      <button type="button" aria-label="Increase quantity" disabled={value >= limit} onClick={() => onChange(value + 1)}>
        +
      </button>
    </div>
  );
}

export function Spinner({ label = 'Loading' }) {
  return (
    <div className="spinner-wrap" role="status">
      <span className="spinner" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="empty">
      <p>{message || 'Something went wrong.'}</p>
      {onRetry && (
        <button className="btn btn--ghost" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function StockNote({ stock }) {
  if (stock <= 0) return <span className="stock stock--out">Sold out</span>;
  if (stock <= 5) return <span className="stock stock--low">Only {stock} left</span>;
  return <span className="stock stock--in">In stock</span>;
}
