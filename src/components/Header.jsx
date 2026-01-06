import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Header = ({ cartItems }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();
  
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Jangan tampilkan header untuk admin dashboard
  const isAdminDashboard = location.pathname.startsWith('/admin-dashboard');
  if (isAdminDashboard) {
    return null; // Header tidak ditampilkan di admin dashboard
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/" className="logo-link">
              <span className="logo-icon">🛒</span>
              <span className="logo-text">NindyaMart</span>
            </Link>
          </div>
          
          <button 
            className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Beranda
            </Link>
            <Link 
              to="/products" 
              className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Produk
            </Link>
            <Link 
              to="/cart" 
              className={`nav-link cart-link ${location.pathname === '/cart' ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="cart-icon">🛒</span>
              Keranjang
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </Link>
            {user ? (
              <>
                {/* HAPUS LINK ADMIN DASHBOARD DARI SINI */}
                <button 
                  className="nav-link logout-btn" 
                  onClick={() => { logout(); setIsMenuOpen(false); }}
                >
                  Logout ({user.username})
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;