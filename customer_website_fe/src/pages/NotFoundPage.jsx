import React from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <Header />
      <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h1 style={{ fontSize: '72px', color: '#ff4757' }}>404</h1>
        <h2>Oops! Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="cta-button" style={{ display: 'inline-block', marginTop: '20px' }}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
