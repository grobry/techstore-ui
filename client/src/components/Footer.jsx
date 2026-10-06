import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <Link to="/" className="logo">
            <svg viewBox="0 0 32 32" width="20" height="20" aria-hidden="true">
              <path d="M20.5 7.5a9 9 0 1 0 4 15.2A8 8 0 0 1 20.5 7.5Z" fill="currentColor" />
            </svg>
            <span>Nocturne</span>
          </Link>
          <p className="muted small footer__blurb">Considered technology for people who care about the details.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <Link to="/shop?category=Phones">Phones</Link>
          <Link to="/shop?category=Laptops">Laptops</Link>
          <Link to="/shop?category=Audio">Audio</Link>
          <Link to="/shop?category=Wearables">Wearables</Link>
        </div>
        <div>
          <h4>Support</h4>
          <span>Shipping &amp; returns</span>
          <span>Warranty</span>
          <span>Contact</span>
        </div>
        <div>
          <h4>Company</h4>
          <span>About</span>
          <span>Careers</span>
          <span>Privacy</span>
        </div>
      </div>
      <div className="container footer__base muted small">
        <span>© {new Date().getFullYear()} Nocturne. Demo store — no real payments are processed.</span>
      </div>
    </footer>
  );
}
