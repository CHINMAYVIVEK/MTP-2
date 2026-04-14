const getStoreId = () => {
  const storedUser = localStorage.getItem('storeUser');
  if (!storedUser) {
    throw new Error('User not found. Please log in.');
  }
  const userData = JSON.parse(storedUser);
  return userData.id;
};

const API_URL = 'http://127.0.0.1:8000/stores/products';

/**
 * Fetches all products for the current store.
 * @returns {Promise<Array>} A promise that resolves to an array of products.
 */
export const fetchProducts = async () => {
  const storeId = getStoreId();
  const url = `${API_URL}?store_id=${storeId}`;
  
  const response = await fetch(url, {
    headers: { 'accept': 'application/json' }
  });

  if (response.status === 204) {
    return []
  }
  if (response.ok) {
    return response.json();
  }

  const errorData = await response.json().catch(() => null);
  throw new Error(errorData?.detail || 'Failed to load products.');
};

/**
 * Creates a new product.
 * @param {Object} productData - The data from the modal form.
 * @returns {Promise<Object>} A promise that resolves to the newly created product.
 */
export const createProduct = async (productData) => {
  const storeId = getStoreId();
  
  const apiPayload = {
    ...productData,
    storeUserId: storeId,
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(apiPayload)
  });

  if (response.ok) {
    const apiResponse = await response.json();
    return { ...productData, id: apiResponse.id };
  }
  
  const errorData = await response.json().catch(() => null);
  throw new Error(errorData?.detail || 'Failed to create product.');
};

/**
 * Updates an existing product (sends only changed fields).
 * @param {string} productId - The ID of the product to update.
 * @param {Object} patchData - An object containing only the changed fields.
 * @returns {Promise<void>} A promise that resolves on success.
 */
export const updateProduct = async (productId, patchData) => {
  const response = await fetch(`${API_URL}/${productId}`, {
    method: 'PUT',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patchData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || 'Failed to update product.');
  }
};

/**
 * Deletes a product.
 * @param {string} productId - The ID of the product to delete.
 * @returns {Promise<void>} A promise that resolves on success.
 */
export const deleteProduct = async (productId) => {
  const response = await fetch(`${API_URL}/${productId}`, {
    method: 'DELETE',
    headers: {
      'accept': 'application/json',
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || 'Failed to delete product.');
  }
};