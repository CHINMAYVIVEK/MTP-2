import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import './styles.css';

const RootComponent = () => {
  return (
    <Router>
      <div className="store-app">
        <Header />
        <Routes>
          <Route path="/store" element={<Navigate to="/store/login" replace />} />
          <Route path="/store/login" element={<LoginPage />} />
          <Route path="/store/register" element={<RegisterPage />} />
          <Route path="/store/home" element={<HomePage />} />
          <Route path="/store/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default RootComponent;
