import React from 'react';

const ProductCard = ({ product, onClick }) => {
  let imageUrl = 'https://via.placeholder.com/280x200?text=No+Image';
  let imageAlt = product.name || 'Product Image';

  if (product.images && product.images.length > 0) {
    const primaryImageObject = product.images.find(img => img.primary);
    
    if (primaryImageObject) {
      imageUrl = primaryImageObject.url;
      imageAlt = primaryImageObject.alt_text || product.name;
    } else {
      imageUrl = product.images[0].url;
      imageAlt = product.images[0].alt_text || product.name;
    }
  }


  return (
    <div className="product-card" onClick={() => onClick(product)}>
      <div className="product-image-wrapper">
        <img 
          src={imageUrl} 
          alt={imageAlt}
          className="product-image"
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>

        <p className="product-description">{product.shortDescription}</p>

        <div className="product-price">
          {product.discountPrice > 0 ? (
            <>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ff4757', marginRight: '0.5rem' }}>
                {product.currency} {product.discountPrice}
              </span>
              <span style={{ fontSize: '1rem', textDecoration: 'line-through', color: '#666' }}>
                {product.currency} {product.price}
              </span>
            </>
          ) : (
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#667eea' }}>
              {product.currency} {product.price}
            </span>
          )}
        </div>

        <div className="product-actions">
          <button className="edit-btn">View Details</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;