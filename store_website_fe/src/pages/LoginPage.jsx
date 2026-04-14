import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as loginService from '../services/loginService.js';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('storeUser');
    if (isAuthenticated) {
      navigate('/store/home');
      return; 
    }
    const registeredEmail = localStorage.getItem('registeredEmail');
    const registeredPassword = localStorage.getItem('registeredPassword');
    if (registeredEmail && registeredPassword) {
      setFormData({
        email: registeredEmail,
        password: registeredPassword
      });
      localStorage.removeItem('registeredEmail');
      localStorage.removeItem('registeredPassword');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await loginService.login(formData.email, formData.password);
      localStorage.setItem('storeUser', JSON.stringify(user));
      localStorage.setItem('storeUserEmail', user.email);
      
      navigate('/store/home');

    } catch (err) {
      setError(err.message);
      console.error('Login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate('/store/register');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Login to your store account</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={loading} 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={loading} 
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'} 
          </button>

          <button type="button" className="secondary-btn" onClick={handleRegisterClick} disabled={loading}>
            Create New Account
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? Click "Create New Account" above</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;