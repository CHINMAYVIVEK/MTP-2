import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as profileService from '../services/profileService.js'; 

const newAddressTemplate = {
  addressLine: '',
  city: '',
  state: '',
  postalCode: ''
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    storeName: '',
    email: '',
    phone: '',
    img_url: '', 
    password: '', 
    addresses: [],
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('storeUser');
    if (!storedUser) {
      navigate('/login'); 
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);
    
    setFormData({
      firstName: userData.first_name || '',
      lastName: userData.last_name || '',
      storeName: userData.store_name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      img_url: userData.img_url || '', 
      password: '',
      addresses: userData.addresses || [], 
    });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    const newAddresses = formData.addresses.map((address, i) => {
      if (i === index) {
        return { ...address, [name]: value };
      }
      return address;
    });
    setFormData(prev => ({ ...prev, addresses: newAddresses }));
    setError('');
  };

  const addAddress = () => {
    setFormData(prev => ({
      ...prev,
      addresses: [...(prev.addresses || []), { ...newAddressTemplate }]
    }));
  };

  const removeAddress = (index) => {
    const newAddresses = (formData.addresses || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, addresses: newAddresses }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const patchData = {};
    if (formData.firstName !== (user.first_name || '')) patchData.first_name = formData.firstName;
    if (formData.lastName !== (user.last_name || '')) patchData.last_name = formData.lastName;
    if (formData.email !== (user.email || '')) patchData.email = formData.email;
    if (formData.storeName !== (user.store_name || '')) patchData.store_name = formData.storeName;
    if (formData.phone !== (user.phone || '')) patchData.phone = formData.phone;
    if (formData.img_url !== (user.img_url || '')) patchData.img_url = formData.img_url;
    if (formData.password) patchData.password = formData.password;
    if (JSON.stringify(formData.addresses) !== JSON.stringify(user.addresses || [])) {
      patchData.addresses = formData.addresses.filter(a => a.addressLine && a.city && a.state && a.postalCode);
    }

    if (Object.keys(patchData).length === 0) {
      setError("You haven't made any changes.");
      setLoading(false);
      return;
    }

    try {
      await profileService.updateUser(user.id, patchData);

      const updatedUser = {
        ...user,
        first_name: formData.firstName,
        last_name: formData.lastName,
        store_name: formData.storeName,
        email: formData.email,
        phone: formData.phone,
        img_url: formData.img_url,
        addresses: formData.addresses.filter(a => a.addressLine && a.city && a.state && a.postalCode),
        password: formData.password ? formData.password : user.password
      };

      localStorage.setItem('storeUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setFormData(prev => ({ ...prev, password: '' }));
      setIsEditing(false);

    } catch (err) {
      setError(err.message || 'An error occurred. Please check your data.');
      console.error('Update failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="store-app">
      <div className="profile-page">
        <div className="container">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-image-wrapper">
                <img 
                  src={user.img_url || 'https://via.placeholder.com/120?text=User'} 
                  alt={`${user.first_name} ${user.last_name}`}
                  className="profile-image"
                />
              </div>
              <h1>{user.first_name} {user.last_name}</h1>
              <p>{user.email}</p>
            </div>

            <div className="profile-body">
              {!isEditing ? (
                <>
                  {/* --- DISPLAY MODE --- */}
                  <div className="profile-info">
                    <div className="info-row">
                      <div className="info-item">
                        <span className="info-label">First Name</span>
                        <span className="info-value">{user.first_name}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Last Name</span>
                        <span className="info-value">{user.last_name}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Store Name</span>
                      <span className="info-value">{user.store_name}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Email</span>
                      <span className="info-value">{user.email}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Phone</span>
                      <span className="info-value">{user.phone || 'Not provided'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Addresses</span>
                      {user.addresses && user.addresses.length > 0 ? (
                        user.addresses.map((addr, index) => (
                          <div key={index} style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                            <span className="info-value" style={{ fontWeight: 600 }}>Address {index + 1}</span>
                            <span className="info-value" style={{ display: 'block', marginLeft: '1rem' }}>
                              {addr.addressLine}
                            </span>
                            <span className="info-value" style={{ display: 'block', marginLeft: '1rem' }}>
                              {addr.city}, {addr.state} {addr.postalCode}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="info-value">Not provided</span>
                      )}
                    </div>
                  </div>
                  <div className="profile-actions">
                    <button className="edit-profile-btn" onClick={() => setIsEditing(true)} disabled={loading}>
                      Edit Profile
                    </button>
                  </div>
                </>
              ) : (
                
                <form onSubmit={handleSubmit} className="auth-form">
                  {/* --- EDIT MODE --- */}
                  {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
                  
                  <div className="form-row">
                      <div className="form-group">
                        <label>First Name</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required disabled={loading} />
                      </div>
                      <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required disabled={loading} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Store Name</label>
                      <input type="text" name="storeName" value={formData.storeName} onChange={handleChange} required disabled={loading} />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required disabled={loading} />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" disabled={loading} />
                    </div>
                    <div className="form-group">
                      <label>Profile Image URL</label>
                      <input type="url" name="img_url" value={formData.img_url || ''} onChange={handleChange} placeholder="https://example.com/image.png" disabled={loading} />
                    </div>
                    <div className="form-group">
                      <label>New Password</label>
                      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to keep current password" minLength="6" disabled={loading} />
                    </div>


                  {/* --- Dynamic Address Form --- */}
                  <div className="form-group" style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                    <label style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Addresses</label>
                    
                    {(formData.addresses || []).map((address, index) => (
                      <div key={index} className="address-form-group" style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <h4 style={{ margin: 0 }}>Address {index + 1}</h4>
                          <button type="button" className="delete-btn" style={{ flex: '0', padding: '0.5rem 1rem' }} onClick={() => removeAddress(index)} disabled={loading}>
                            Remove
                          </button>
                        </div>
                        <div className="form-group">
                          <label>Address Line</label>
                          <input type="text" name="addressLine" value={address.addressLine} onChange={(e) => handleAddressChange(index, e)} placeholder="123 Main St" disabled={loading} />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>City</label>
                            <input type="text" name="city" value={address.city} onChange={(e) => handleAddressChange(index, e)} placeholder="Anytown" disabled={loading} />
                          </div>
                          <div className="form-group">
                            <label>State</label>
                            <input type="text" name="state" value={address.state} onChange={(e) => handleAddressChange(index, e)} placeholder="CA" disabled={loading} />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Postal Code</label>
                          <input type="text" name="postalCode" value={address.postalCode} onChange={(e) => handleAddressChange(index, e)} placeholder="12345" disabled={loading} />
                        </div>
                      </div>
                    ))}
                    
                    <button type="button" className="secondary-btn" onClick={addAddress} style={{ width: '100%' }} disabled={loading}>
                      + Add New Address
                    </button>
                  </div>
                  
                  <div className="profile-actions" style={{ marginTop: '2rem' }}>
                    <button type="button" className="secondary-btn" onClick={() => setIsEditing(false)} disabled={loading}>
                      Cancel
                    </button>
                    
                    <button 
                      type="submit" 
                      className="edit-profile-btn" 
                      disabled={loading}
                      style={{ position: 'relative', zIndex: 999 }} // z-index test
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;