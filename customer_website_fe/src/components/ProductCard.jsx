import React from 'react';

export default function ProductCard({ product }) {
  const { name, price, image, rating, inStock } = product;

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img src={image} alt={name} className="product-image" />
        {!inStock && <div className="out-of-stock-badge">Out of Stock</div>}
      </div>
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <div className="product-rating">
          <span className="stars">{'⭐'.repeat(Math.floor(rating))}</span>
          <span className="rating-text">{rating}</span>
        </div>
        <div className="product-footer">
          <span className="product-price">${price.toFixed(2)}</span>
          <button 
            className="add-to-cart-btn" 
            disabled={!inStock}
          >
            {inStock ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
}
