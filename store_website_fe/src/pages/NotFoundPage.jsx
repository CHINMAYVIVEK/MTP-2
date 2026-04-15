import React from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="store-app">
      <Header />
      <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h1 style={{ fontSize: '72px', color: '#2ed573' }}>404</h1>
        <h2>Merchant Support: Page Not Found</h2>
        <p>We couldn't find the management tool you were looking for.</p>
        <Link to="/home" className="submit-btn" style={{ display: 'inline-block', marginTop: '20px', textDecoration: 'none' }}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
