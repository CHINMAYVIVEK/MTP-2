import React from 'react';
import Header from '../components/Header';

export default function OrdersPage() {
  const orders = [
    { id: 'ORD-123', date: '2026-04-10', status: 'Delivered', total: 450.00 },
    { id: 'ORD-456', date: '2026-04-12', status: 'Processing', total: 120.50 },
    { id: 'ORD-789', date: '2026-04-14', status: 'Shipped', total: 89.99 },
  ];

  return (
    <div className="orders-page">
      <Header />
      <div className="container">
        <div className="page-header">
          <h1>Track Your Orders</h1>
          <p>Manage and view your order history</p>
        </div>
        
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-info">
                <div>
                  <span className="label">Order ID</span>
                  <span className="value">{order.id}</span>
                </div>
                <div>
                  <span className="label">Date</span>
                  <span className="value">{order.date}</span>
                </div>
                <div>
                  <span className="label">Total</span>
                  <span className="value">${order.total.toFixed(2)}</span>
                </div>
                <div>
                  <span className="status-badge" data-status={order.status.toLowerCase()}>
                    {order.status}
                  </span>
                </div>
              </div>
              <button className="view-details-btn">View Details</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
