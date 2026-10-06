import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { api } from '../lib/api.js';
import { estimateTotals } from '../lib/format.js';
import { OrderSummary } from './Cart.jsx';
import { LockIcon } from '../components/Icons.jsx';

const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia', 'Japan'];

const initial = {
  name: '',
  email: '',
  address: '',
  city: '',
  postalCode: '',
  country: 'United States',
  nameOnCard: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
};

const formatCard = (v) => v.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim();
const formatExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const totals = estimateTotals(subtotal);

  if (items.length === 0) {
    return (
      <div className="container page">
        <div className="empty empty--tall">
          <h1>Nothing to check out.</h1>
          <Link to="/shop" className="btn">Shop the collection</Link>
        </div>
      </div>
    );
  }

  const set = (field, transform) => (e) => setForm((f) => ({ ...f, [field]: transform ? transform(e.target.value) : e.target.value }));

  const fillTestCard = (number) =>
    setForm((f) => ({ ...f, cardNumber: formatCard(number), expiry: '12/30', cvc: '123', nameOnCard: f.nameOnCard || f.name || 'Test Customer' }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const order = await api.createOrder({
        items: items.map((l) => ({ productId: l.productId, quantity: l.quantity, color: l.color })),
        customer: { name: form.name, email: form.email },
        shipping: { address: form.address, city: form.city, postalCode: form.postalCode, country: form.country },
        payment: { nameOnCard: form.nameOnCard, cardNumber: form.cardNumber, expiry: form.expiry, cvc: form.cvc },
      });
      clear();
      navigate(`/order/${order.orderNumber}?email=${encodeURIComponent(order.customer.email)}`, { replace: true, state: { order } });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="container page">
      <header className="page__head">
        <h1>Checkout</h1>
      </header>

      <div className="split">
        <form className="checkout" onSubmit={onSubmit} noValidate={false}>
          {error && (
            <div className="alert" role="alert">
              {error}
            </div>
          )}

          <fieldset>
            <legend>Contact</legend>
            <div className="form-grid">
              <label className="field">
                <span className="field__label">Full name</span>
                <input className="input" required autoComplete="name" value={form.name} onChange={set('name')} />
              </label>
              <label className="field">
                <span className="field__label">Email</span>
                <input className="input" type="email" required autoComplete="email" value={form.email} onChange={set('email')} />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Shipping address</legend>
            <div className="form-grid">
              <label className="field field--full">
                <span className="field__label">Street address</span>
                <input className="input" required autoComplete="street-address" value={form.address} onChange={set('address')} />
              </label>
              <label className="field">
                <span className="field__label">City</span>
                <input className="input" required autoComplete="address-level2" value={form.city} onChange={set('city')} />
              </label>
              <label className="field">
                <span className="field__label">Postal code</span>
                <input className="input" required autoComplete="postal-code" value={form.postalCode} onChange={set('postalCode')} />
              </label>
              <label className="field field--full">
                <span className="field__label">Country</span>
                <select className="input" value={form.country} onChange={set('country')} autoComplete="country-name">
                  {COUNTRIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              Payment <span className="pill">Demo mode</span>
            </legend>
            <p className="muted small test-cards">
              No real charges are made. Use{' '}
              <button type="button" className="link-btn" onClick={() => fillTestCard('4242424242424242')}>4242 4242 4242 4242</button>{' '}
              to succeed or{' '}
              <button type="button" className="link-btn" onClick={() => fillTestCard('4000000000000002')}>4000 0000 0000 0002</button>{' '}
              to see a decline.
            </p>
            <div className="form-grid">
              <label className="field field--full">
                <span className="field__label">Name on card</span>
                <input className="input" required autoComplete="cc-name" value={form.nameOnCard} onChange={set('nameOnCard')} />
              </label>
              <label className="field field--full">
                <span className="field__label">Card number</span>
                <input className="input" required inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" value={form.cardNumber} onChange={set('cardNumber', formatCard)} />
              </label>
              <label className="field">
                <span className="field__label">Expiry</span>
                <input className="input" required inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" value={form.expiry} onChange={set('expiry', formatExpiry)} />
              </label>
              <label className="field">
                <span className="field__label">CVC</span>
                <input className="input" required inputMode="numeric" autoComplete="cc-csc" placeholder="123" maxLength={4} value={form.cvc} onChange={set('cvc', (v) => v.replace(/\D/g, ''))} />
              </label>
            </div>
          </fieldset>

          <button className="btn btn--block btn--lg" disabled={submitting}>
            <LockIcon width={18} height={18} />
            {submitting ? 'Processing…' : 'Place order'}
          </button>
        </form>

        <OrderSummary totals={totals} items={items} title="Order summary" />
      </div>
    </div>
  );
}
