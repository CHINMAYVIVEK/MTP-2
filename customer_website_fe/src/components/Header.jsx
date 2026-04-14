import React from 'react';

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>🛍️ ShopHub</h1>
        </div>
        <nav className="nav">
          <a href="/" className="nav-link active">Home</a>
          <a href="/products" className="nav-link">Products</a>
          <a href="/cart" className="nav-link">Cart</a>
          <a href="/orders" className="nav-link">Orders</a>
          <a href="/profile" className="nav-link">Profile</a>
        </nav>
        <div className="header-actions">
          <button className="icon-btn">🔔</button>
          <button className="icon-btn cart-btn">
            🛒
            <span className="badge">3</span>
          </button>
          <button className="login-btn">Login</button>
        </div>
      </div>
    </header>
  );
}
