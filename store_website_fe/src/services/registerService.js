// --- Base URL for your User API ---
import { API_ENDPOINTS } from '../config/api.js';

/**
 * Registers a new user.
 * @param {Object} userData - The user data from the registration form.
 * @returns {Promise<Object>} The API response (e.g., { message, id }).
 */
export const register = async (userData) => {
  const response = await fetch(API_ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  if (response.status === 201 || response.ok) {
    return response.json();
  }
  
  // Handle errors
  const errorData = await response.json().catch(() => null);
  let errorMessage = 'Registration failed. Please check your details.';
  if (errorData?.detail) {
    if (Array.isArray(errorData.detail) && errorData.detail.length > 0) {
      errorMessage = errorData.detail[0].msg; 
    } else if (typeof errorData.detail === 'string') {
      errorMessage = errorData.detail;
    }
  }
  throw new Error(errorMessage);
};