import React from 'react';
import Header from '../components/Header';

export default function ProfilePage() {
  return (
    <div className="profile-page">
      <Header />
      <div className="container">
        <div className="page-header">
          <h1>Account Profile</h1>
          <p>Update your personal information and preferences</p>
        </div>
        
        <div className="profile-grid">
          <div className="profile-sidebar">
            <div className="avatar-section">
              <div className="avatar">👤</div>
              <h3>John Doe</h3>
              <p>Member since Jan 2024</p>
            </div>
            <nav className="profile-nav">
              <button className="active">Personal Info</button>
              <button>Shipping Addresses</button>
              <button>Payment Methods</button>
              <button>Security Settings</button>
            </nav>
          </div>
          
          <div className="profile-main">
            <form className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" defaultValue="John Doe" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" defaultValue="john.doe@example.com" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" defaultValue="+1 234 567 890" />
              </div>
              <button type="submit" className="save-btn">Save Changes</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
