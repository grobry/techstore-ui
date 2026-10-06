import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { BagIcon, SearchIcon, MenuIcon, CloseIcon } from './Icons.jsx';

const CATEGORIES = ['Phones', 'Laptops', 'Audio', 'Wearables', 'Cameras', 'Accessories'];

export default function Navbar() {
  const { count, openDrawer } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop');
  };

  const activeCategory = new URLSearchParams(location.search).get('category');

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner container">
        <button className="icon-btn nav__menu" aria-label="Menu" onClick={() => setMenuOpen((o) => !o)}>
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <Link to="/" className="logo" aria-label="Nocturne home">
          <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true">
            <path d="M20.5 7.5a9 9 0 1 0 4 15.2A8 8 0 0 1 20.5 7.5Z" fill="currentColor" />
          </svg>
          <span>Nocturne</span>
        </Link>

        <nav className={`nav__links ${menuOpen ? 'is-open' : ''}`}>
          <NavLink to="/shop" end className={() => (location.pathname === '/shop' && !activeCategory ? 'active' : '')}>
            All
          </NavLink>
          {CATEGORIES.map((c) => (
            <NavLink key={c} to={`/shop?category=${c}`} className={() => (activeCategory === c ? 'active' : '')}>
              {c}
            </NavLink>
          ))}
        </nav>

        <div className="nav__actions">
          <form className={`nav__search ${searchOpen ? 'is-open' : ''}`} onSubmit={submitSearch} role="search">
            <input
              type="search"
              placeholder="Search products"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products"
            />
          </form>
          <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen((o) => !o)}>
            <SearchIcon />
          </button>
          <button className="icon-btn bag-btn" aria-label={`Cart, ${count} items`} onClick={openDrawer}>
            <BagIcon />
            {count > 0 && <span className="badge">{count}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
