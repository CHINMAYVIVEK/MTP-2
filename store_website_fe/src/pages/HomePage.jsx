import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard'; 
import ProductModal from '../components/ProductModal';
import * as productService from '../services/productService'; 

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    productService.fetchProducts()
      .then(data => {
        setProducts(data);
      })
      .catch(err => {
        if (err.message === 'User not found. Please log in.') {
          navigate('/store/login');
        } else {
          setError(err.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleAddProduct = () => {
    setSelectedProduct(null); 
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = async (productData) => {

    if (productData.id) {
      const originalProduct = products.find(p => p.id === productData.id);
      if (!originalProduct) throw new Error("Product not found to update.");

      const patchData = {};
      
      if (productData.name !== originalProduct.name) patchData.name = productData.name;
      if (productData.description !== originalProduct.description) patchData.description = productData.description;
      if (productData.shortDescription !== originalProduct.shortDescription) patchData.shortDescription = productData.shortDescription;
      if (Number(productData.price) !== Number(originalProduct.price)) patchData.price = Number(productData.price);
      if (Number(productData.discountPrice) !== Number(originalProduct.discountPrice)) patchData.discountPrice = Number(productData.discountPrice);
      if (productData.currency !== originalProduct.currency) patchData.currency = productData.currency;
      if (Number(productData.quantity) !== Number(originalProduct.quantity)) patchData.quantity = Number(productData.quantity);
      if (productData.weight !== originalProduct.weight) patchData.weight = productData.weight;
      if (productData.category !== originalProduct.category) patchData.category = productData.category;
      if (JSON.stringify(productData.attributes) !== JSON.stringify(originalProduct.attributes || [])) patchData.attributes = productData.attributes;
      if (JSON.stringify(productData.images) !== JSON.stringify(originalProduct.images || [])) patchData.images = productData.images;
      
      if (Object.keys(patchData).length === 0) {
        throw new Error("You haven't made any changes.");
      }
      
      await productService.updateProduct(productData.id, patchData);

      const updatedProducts = products.map(p => 
        p.id === productData.id ? productData : p 
      );
      setProducts(updatedProducts);

    } else {
      const newProduct = await productService.createProduct(productData);
      setProducts(prevProducts => [...prevProducts, newProduct]);
    }
  };

  const handleDeleteProduct = async (productId) => {

    await productService.deleteProduct(productId);
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
  };

  if (loading) {
    return (
      <div className="store-app">
        <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <h2>Loading products...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="store-app">
        <div className="container" style={{ paddingTop: '4rem' }}>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="store-app">
      <div className="home-page">
        <div className="container">
          <div className="page-header">
            <h1>My Products</h1>
            <button className="add-product-btn" onClick={handleAddProduct}>
              + Add Product
            </button>
          </div>

          {products.length === 0 ? (
            <div className="empty-state">
              <h2>No Products Yet</h2>
              <p>Start by adding your first product to the store</p>
              <button className="add-product-btn" onClick={handleAddProduct}>
                Add Your First Product
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={handleProductClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <ProductModal
          product={selectedProduct} 
          onClose={handleCloseModal}
          onSave={handleSaveProduct}
          onDelete={handleDeleteProduct}
        />
      )}
    </div>
  );
};

export default HomePage;