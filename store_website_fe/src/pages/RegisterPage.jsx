import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as registerService from '../services/registerService.js'; // <-- Import service

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    storeName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 

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

    const apiRequestBody = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      store_name: formData.storeName,
      email: formData.email,
      password: formData.password
    };

    try {
      await registerService.register(apiRequestBody);

      localStorage.setItem('registeredEmail', formData.email);
      localStorage.setItem('registeredPassword', formData.password);
      navigate('/store/login');

    } catch (err) {
      setError(err.message || 'An unknown error occurred.');
      console.error('Registration failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate('/store/login');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Register for a new store account</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                required
                disabled={loading} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                required
                disabled={loading} 
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="storeName">Store Name</label>
            <input
              type="text"
              id="storeName"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              placeholder="Your store's name"
              required
              disabled={loading} 
            />
          </div>
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
              placeholder="Create a password"
              required
              minLength="6"
              disabled={loading} 
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
          <button type="button" className="secondary-btn" onClick={handleLoginClick} disabled={loading}>
            Already have an account? Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;