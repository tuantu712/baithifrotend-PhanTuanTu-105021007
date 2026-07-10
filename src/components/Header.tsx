import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { ShoppingBag, Search, Menu, X, Heart, User, MapPin, Truck } from 'lucide-react';

export default function Header() {
  const { getTotalItems } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active-nav-link' : '';
  };

  return (
    <header className="main-header">
      {/* 1. TOPBAR SECTION */}
      <div className="topbar-section">
        <div className="topbar-container container">
          <div className="topbar-left">
            <p className="topbar-text">Free shipping for orders over $59 !</p>
          </div>
          <div className="topbar-right">
            <ul className="topbar-menu">
              <li>
                <a href="#location">
                  <MapPin size={12} className="inline mr-1" /> Store Location
                </a>
              </li>
              <li>
                <a href="#status">
                  <Truck size={12} className="inline mr-1" /> Order Status
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE HEADER ROW (Logo, Lang, Actions) */}
      <div className="header-middle-row">
        <div className="header-middle-container container">
          {/* Left: Language & Currency Selector Mock */}
          <div className="header-middle-left d-none d-xl-flex">
            <ul className="header-lan-curr">
              <li className="lan-item">
                <a href="#lang">English <span className="arrow-down"></span></a>
                <ul className="dropdown-sub">
                  <li><a href="#fr">Français</a></li>
                  <li><a href="#de">Deutsch</a></li>
                </ul>
              </li>
              <li className="curr-item">
                <a href="#curr">USD <span className="arrow-down"></span></a>
                <ul className="dropdown-sub">
                  <li><a href="#eur">EUR</a></li>
                  <li><a href="#gbp">GBP</a></li>
                </ul>
              </li>
            </ul>
          </div>

          {/* Center: Branding Logo */}
          <div className="header-logo-center">
            <Link to="/" className="logo-main">
              Learts
            </Link>
            <span className="logo-tagline">Handmade Shop</span>
          </div>

          {/* Right: Actions */}
          <div className="header-middle-right">
            {/* Search Form Desktop */}
            <form onSubmit={handleSearchSubmit} className="header-search-form d-none d-md-flex">
              <input
                type="text"
                placeholder="Tìm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn" aria-label="Search">
                <Search size={16} />
              </button>
            </form>

            <button className="icon-btn-tool d-none d-sm-flex" aria-label="Account">
              <User size={18} />
            </button>

            <button className="icon-btn-tool d-none d-sm-flex" aria-label="Wishlist">
              <Heart size={18} />
              <span className="wishlist-count-badge">3</span>
            </button>

            <Link to="/cart" className="icon-btn-tool cart-btn" aria-label="Shopping Cart">
              <ShoppingBag size={18} />
              {getTotalItems() > 0 ? (
                <span className="cart-count-badge animate-bounce">{getTotalItems()}</span>
              ) : (
                <span className="cart-count-badge">0</span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn d-xl-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. SITE NAVIGATION MENU (Centered) */}
      <div className="site-menu-row d-none d-xl-block">
        <div className="container">
          <nav className="site-menu-nav">
            <ul className="menu-list">
              <li className="menu-item">
                <Link to="/" className={`menu-link ${isActive('/')}`}>
                  Home
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/shop" className={`menu-link ${isActive('/shop')}`}>
                  Shop
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/cart" className={`menu-link ${isActive('/cart')}`}>
                  Cart
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/checkout" className={`menu-link ${isActive('/checkout')}`}>
                  Checkout
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar Navigation */}
      <div className={`mobile-nav-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header">
          <span className="mobile-logo">Learts</span>
          <button className="close-btn" onClick={() => setMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="mobile-search-wrapper">
          <form onSubmit={handleSearchSubmit} className="mobile-search-form">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit"><Search size={16} /></button>
          </form>
        </div>
        <ul className="mobile-menu-list">
          <li>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>
              Shop
            </Link>
          </li>
          <li>
            <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
              Cart
            </Link>
          </li>
          <li>
            <Link to="/checkout" onClick={() => setMobileMenuOpen(false)}>
              Checkout
            </Link>
          </li>
        </ul>
        <div className="mobile-nav-footer">
          <div className="mobile-social-links">
            <a href="https://facebook.com">FB</a>
            <a href="https://instagram.com">IG</a>
            <a href="https://twitter.com">TW</a>
          </div>
        </div>
      </div>
      {mobileMenuOpen && <div className="mobile-overlay-bg" onClick={() => setMobileMenuOpen(false)}></div>}
    </header>
  );
}
