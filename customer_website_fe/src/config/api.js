// API Configuration
// Replace these URLs with your actual backend endpoints

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  // Products
  PRODUCTS: `${API_BASE_URL}/products`,
  PRODUCT_DETAIL: (id) => `${API_BASE_URL}/products/${id}`,
  
  // Cart
  CART: `${API_BASE_URL}/cart`,
  ADD_TO_CART: `${API_BASE_URL}/cart/add`,
  REMOVE_FROM_CART: (itemId) => `${API_BASE_URL}/cart/remove/${itemId}`,
  UPDATE_CART: (itemId) => `${API_BASE_URL}/cart/update/${itemId}`,
  
  // Orders
  ORDERS: `${API_BASE_URL}/orders`,
  ORDER_DETAIL: (id) => `${API_BASE_URL}/orders/${id}`,
  CREATE_ORDER: `${API_BASE_URL}/orders/create`,
  
  // User
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  PROFILE: `${API_BASE_URL}/user/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/user/profile/update`,
  
  // Notifications
  NOTIFICATIONS: `${API_BASE_URL}/notifications`,
  MARK_READ: (id) => `${API_BASE_URL}/notifications/${id}/read`,
};

// Helper function for API calls
export const apiCall = async (url, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
};

export default API_ENDPOINTS;
