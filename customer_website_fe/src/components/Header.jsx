import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1>🛍️ ShopHub</h1>
          </Link>
        </div>
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/cart" className="nav-link">Cart</Link>
          <Link to="/orders" className="nav-link" >Orders</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
        </nav>
        <div className="header-actions">
          <button className="icon-btn">🔔</button>
          <Link to="/cart" className="icon-btn cart-btn" style={{ textDecoration: 'none' }}>
            🛒
            <span className="badge">3</span>
          </Link>
          <Link to="/store/login" className="login-btn" style={{ textDecoration: 'none' }}>Login</Link>
        </div>
      </div>
    </header>
  );
}
