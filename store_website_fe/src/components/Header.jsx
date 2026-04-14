import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('storeUser');

  const handleLogout = () => {
    localStorage.removeItem('storeUser');
    localStorage.removeItem('storeUserEmail');
    navigate('/store/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>Store Manager</h1>
        </div>
        <nav className="nav">
          <Link 
            to="/store/home" 
            className={`nav-link ${location.pathname === '/store/home' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/store/profile" 
            className={`nav-link ${location.pathname === '/store/profile' ? 'active' : ''}`}
          >
            Profile
          </Link>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
