import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAsync } from '../lib/useAsync.js';
import { OrderSummary } from './Cart.jsx';
import { Spinner } from '../components/ui.jsx';
import { CheckIcon } from '../components/Icons.jsx';

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const [params] = useSearchParams();
  const location = useLocation();
  const passed = location.state?.order;

  const { data, error, loading } = useAsync(
    () => (passed ? Promise.resolve(passed) : api.getOrder(orderNumber, params.get('email') || '')),
    [orderNumber]
  );

  if (loading) return <div className="container page"><Spinner /></div>;
  if (error) {
    return (
      <div className="container page">
        <div className="empty empty--tall">
          <h1>Order not found.</h1>
          <Link to="/shop" className="btn">Continue shopping</Link>
        </div>
      </div>
    );
  }

  const order = data;
  return (
    <div className="container page">
      <div className="confirm">
        <div className="confirm__icon"><CheckIcon width={28} height={28} /></div>
        <p className="eyebrow">Order {order.orderNumber}</p>
        <h1>Thank you, {order.customer.name.split(' ')[0]}.</h1>
        <p className="lead">
          Your order is confirmed. A receipt would be sent to <strong>{order.customer.email}</strong> in a live store.
        </p>
      </div>

      <div className="split">
        <div className="confirm__details">
          <section>
            <h2>Shipping to</h2>
            <p className="muted">
              {order.customer.name}<br />
              {order.shipping.address}<br />
              {order.shipping.city}, {order.shipping.postalCode}<br />
              {order.shipping.country}
            </p>
          </section>
          <section>
            <h2>Payment</h2>
            <p className="muted">
              {order.payment.brand} ending in {order.payment.last4}<br />
              <span className="small">Ref. {order.payment.transactionId}</span>
            </p>
          </section>
          <section>
            <h2>Status</h2>
            <p className="muted" style={{ textTransform: 'capitalize' }}>{order.status} · placed {new Date(order.createdAt).toLocaleString()}</p>
          </section>
          <Link to="/shop" className="btn btn--ghost">Continue shopping</Link>
        </div>
        <OrderSummary totals={order} items={order.items} title="Your order" />
      </div>
    </div>
  );
}
