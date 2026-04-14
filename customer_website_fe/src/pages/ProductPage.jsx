import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';

// Mock data - replace with API call to your backend
const mockProducts = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    category: 'Electronics',
    rating: 4.5,
    inStock: true,
  },
  {
    id: 2,
    name: 'Smart Watch Series 5',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    category: 'Electronics',
    rating: 4.8,
    inStock: true,
  },
  {
    id: 3,
    name: 'Classic Leather Jacket',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    category: 'Fashion',
    rating: 4.3,
    inStock: true,
  },
  {
    id: 4,
    name: 'Running Shoes Pro',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    category: 'Sports',
    rating: 4.6,
    inStock: false,
  },
  {
    id: 5,
    name: 'Professional Camera',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop',
    category: 'Electronics',
    rating: 4.9,
    inStock: true,
  },
  {
    id: 6,
    name: 'Designer Sunglasses',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
    category: 'Fashion',
    rating: 4.4,
    inStock: true,
  },
  {
    id: 7,
    name: 'Laptop Backpack',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    category: 'Accessories',
    rating: 4.2,
    inStock: true,
  },
  {
    id: 8,
    name: 'Bluetooth Speaker',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    category: 'Electronics',
    rating: 4.5,
    inStock: true,
  },
];

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 500);
  }, []);

  const categories = ['All', ...new Set(mockProducts.map(p => p.category))];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="home-page">
      <Header />
      
      {/* <div className="hero-section">
        <div className="hero-content">
          <h1>Discover Amazing Products</h1>
          <p>Shop the latest trends with unbeatable prices</p>
          <button className="cta-button">Shop Now</button>
        </div>
      </div> */}

      <div className="container">
        <div className="category-filter">
          <h2>Welcome to Product Page</h2>
          <div className="category-buttons">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <>
            <div className="products-header">
              <h2>Featured Products</h2>
              <p>{filteredProducts.length} products found</p>
            </div>
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
