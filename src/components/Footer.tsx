export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer1-section section section-padding">
      <div className="container">
        <div className="footer1-content-wrapper text-center">
          
          {/* 1. Centered Logo */}
          <div className="footer1-logo">
            <span className="logo-main">Learts</span>
            <span className="logo-tagline">Handmade Shop</span>
          </div>

          {/* 2. Centered Menu Links */}
          <div className="footer1-menu">
            <ul className="widget-menu justify-content-center">
              <li><a href="#about">About us</a></li>
              <li><a href="#location">Store location</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#support">Support</a></li>
              <li><a href="#policy">Policy</a></li>
              <li><a href="#faqs">FAQs</a></li>
            </ul>
          </div>

          {/* 3. Centered Newsletter Subscribe */}
          <div className="footer1-subscribe d-flex flex-column align-items-center">
            <form onSubmit={(e) => e.preventDefault()} className="mc-form widget-subscribe justify-content-center">
              <input
                type="email"
                placeholder="Enter your e-mail address"
                required
                className="subscribe-input"
              />
              <button type="submit" className="btn btn-dark subscribe-btn">
                subscribe
              </button>
            </form>
          </div>

          {/* 4. Centered Social Links (Inline SVGs for brand icon compatibility) */}
          <div className="footer1-social">
            <ul className="widget-social justify-content-center">
              <li className="hintT-top" data-hint="Twitter">
                <a href="https://twitter.com" aria-label="Twitter">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </li>
              <li className="hintT-top" data-hint="Facebook">
                <a href="https://facebook.com" aria-label="Facebook">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </a>
              </li>
              <li className="hintT-top" data-hint="Instagram">
                <a href="https://instagram.com" aria-label="Instagram">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
              </li>
              <li className="hintT-top" data-hint="Youtube">
                <a href="https://youtube.com" aria-label="Youtube">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 00-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 002.11 2.107c1.883.511 9.388.511 9.388.511s7.505 0 9.388-.511a3.002 3.002 0 002.11-2.107c.502-1.89.502-5.837.502-5.837s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          {/* 5. Centered Copyright Info */}
          <div className="footer1-copyright">
            <p className="copyright">
              &copy; {currentYear} <strong>Learts Ceramics</strong>. All Rights Reserved | 
              Bài thi thực hành: <strong>Phan Tuấn Tú - 105021007</strong> | 
              <a href="mailto:contact@learts.com"> contact@learts.com</a>
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
