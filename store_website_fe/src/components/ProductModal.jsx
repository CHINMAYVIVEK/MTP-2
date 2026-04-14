import React, { useState } from 'react';

const newAttributeTemplate = { attrName: '', attrValue: '' };
const newImageTemplate = { alt_text: '', primary: false, url: '' };

const ProductModal = ({ product, onClose, onSave, onDelete }) => {
  const [isAdding, setIsAdding] = useState(!product); 
  
  const [loading, setLoading] = useState(false); 
  const [deleteLoading, setDeleteLoading] = useState(false); 
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); 
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    shortDescription: product?.shortDescription || '',
    price: product?.price || 0,
    discountPrice: product?.discountPrice || 0,
    currency: product?.currency || 'INR',
    quantity: product?.quantity || 1,
    weight: product?.weight || '',
    category: product?.category || '',
    attributes: product?.attributes || [],
    images: product?.images || [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setError(''); 
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = { ...formData, id: product ? product.id : undefined };
      await onSave(payload); 
      onClose(); 
    } catch (err) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    setError('');
    try {
      await onDelete(product.id); 
      onClose();
    } catch (err) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      if (error) setDeleteLoading(false);
    }
  };

  const handleAttributeChange = (index, e) => {
    const { name, value } = e.target;
    const newAttributes = formData.attributes.map((attr, i) => 
      i === index ? { ...attr, [name]: value } : attr
    );
    setFormData(prev => ({ ...prev, attributes: newAttributes }));
  };

  const addAttribute = () => {
    setFormData(prev => ({
      ...prev,
      attributes: [...prev.attributes, { ...newAttributeTemplate }]
    }));
  };

  const removeAttribute = (index) => {
    const newAttributes = formData.attributes.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, attributes: newAttributes }));
  };

  const handleImageChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const newImages = formData.images.map((img, i) => 
      i === index ? { ...img, [name]: type === 'checkbox' ? checked : value } : img
    );
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const setPrimaryImage = (indexToSet) => {
    const newImages = formData.images.map((img, i) => ({
      ...img,
      primary: i === indexToSet
    }));
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { ...newImageTemplate }]
    }));
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };
  
  const isDisabled = loading || deleteLoading;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isAdding ? 'Add New Product' : 'Edit Product'}</h2>
          <button className="close-btn" onClick={onClose} disabled={isDisabled}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            <div className="auth-form">
              
              {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}

              {/* ... (name, shortDescription, description, pricing fields) ... */}
              <div className="form-group">
                <label>Product Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required disabled={isDisabled} />
              </div>
              <div className="form-group">
                <label>Short Description</label>
                <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} disabled={isDisabled} />
              </div>
              <div className="form-group">
                <label>Full Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} disabled={isDisabled} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" required disabled={isDisabled} />
                </div>
                <div className="form-group">
                  <label>Discount Price</label>
                  <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} step="0.01" disabled={isDisabled} />
                </div>
                <div className="form-group">
                  <label>Currency *</label>
                  <input type="text" name="currency" value={formData.currency} onChange={handleChange} required disabled={isDisabled} />
                </div>
              </div>
              
              {/* --- Inventory & Details --- */}
              <div className="form-row">
                <div className="form-group">
                  <label>Quantity *</label>
                  <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required disabled={isDisabled} />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input type="text" name="category" value={formData.category} onChange={handleChange} disabled={isDisabled} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Weight (e.g., "500g")</label>
                  <input type="text" name="weight" value={formData.weight} onChange={handleChange} disabled={isDisabled} />
                </div>
              </div>

              {/* --- Dynamic Attributes --- */}
              <div className="form-group" style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                <label style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Attributes</label>
                {formData.attributes.map((attr, index) => (
                  <div key={index} className="form-row" style={{ alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                    <div className="form-group" style={{ flex: 3 }}>
                      <input type="text" name="attrName" value={attr.attrName} onChange={(e) => handleAttributeChange(index, e)} placeholder="Attribute Name (e.g., Color)" disabled={isDisabled} />
                    </div>
                    <div className="form-group" style={{ flex: 3 }}>
                      <input type="text" name="attrValue" value={attr.attrValue} onChange={(e) => handleAttributeChange(index, e)} placeholder="Attribute Value (e.g., Red)" disabled={isDisabled} />
                    </div>
                    <button type="button" className="delete-btn" style={{ flex: 1, padding: '0.6rem' }} onClick={() => removeAttribute(index)} disabled={isDisabled}>Remove</button>
                  </div>
                ))}
                <button type="button" className="secondary-btn" onClick={addAttribute} style={{ width: '100%' }} disabled={isDisabled}>+ Add Attribute</button>
              </div>

              {/* --- Dynamic Images --- */}
              <div className="form-group" style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                <label style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>Images</label>
                {formData.images.map((img, index) => (
                  <div key={index} className="address-form-group" style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
                    <div className="form-group">
                      <label>Image URL *</label>
                      <input type="url" name="url" value={img.url} onChange={(e) => handleImageChange(index, e)} placeholder="https://example.com/image.jpg" required disabled={isDisabled} />
                    </div>
                    <div className="form-group">
                      <label>Alt Text</label>
                      <input type="text" name="alt_text" value={img.alt_text} onChange={(e) => handleImageChange(index, e)} placeholder="Description of image" disabled={isDisabled} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="checkbox" name="primary" checked={img.primary} onChange={() => setPrimaryImage(index)} id={`primary_${index}`} style={{ width: 'auto' }} disabled={isDisabled} />
                        <label htmlFor={`primary_${index}`} style={{ fontWeight: 500, margin: 0 }}>Set as Primary</label>
                      </div>
                      <button type="button" className="delete-btn" style={{ flex: '0', padding: '0.5rem 1rem' }} onClick={() => removeImage(index)} disabled={isDisabled}>Remove</button>
                    </div>
                  </div>
                ))}
                <button type="button" className="secondary-btn" onClick={addImage} style={{ width: '100%' }} disabled={isDisabled}>+ Add Image</button>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            {!showDeleteConfirm ? (
              <>
                {product && (
                  <button type="button" className="delete-btn" style={{ marginRight: 'auto' }} onClick={() => { setShowDeleteConfirm(true); setError(''); }} disabled={loading}>
                    Delete Product
                  </button>
                )}
                <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>Cancel</button>
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? 'Saving...' : (product ? 'Save Changes' : 'Add Product')}
                </button>
              </>
            ) : (
              <div style={{ width: '100%', textAlign: 'center' }}>
                <span style={{ color: '#d32f2f', fontWeight: 600 }}>Are you sure you want to delete this product?</span>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button type="button" className="secondary-btn" onClick={() => setShowDeleteConfirm(false)} disabled={deleteLoading}>
                    No, Cancel
                  </button>
                  <button type="button" className="delete-btn" onClick={handleDelete} disabled={deleteLoading}>
                    {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;