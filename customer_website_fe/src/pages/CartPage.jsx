import React from 'react';
import Header from '../components/Header';

export default function CartPage() {
  return (
    <div className="cart-page">
      <Header />
      <div className="container">
        <div className="page-header">
          <h1>Your Shopping Cart</h1>
          <p>You have 3 items in your cart</p>
        </div>
        
        <div className="cart-content">
          <div className="cart-items">
            {/* Mock cart items */}
            {[1, 2, 3].map(item => (
              <div key={item} className="cart-item-card">
                <div className="item-image">🛍️</div>
                <div className="item-details">
                  <h3>Product Item {item}</h3>
                  <p className="item-price">$99.99</p>
                  <div className="item-actions">
                    <button className="quantity-btn">-</button>
                    <span>1</span>
                    <button className="quantity-btn">+</button>
                    <button className="remove-btn">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>$299.97</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <hr />
            <div className="summary-row total">
              <span>Total</span>
              <span>$299.97</span>
            </div>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
