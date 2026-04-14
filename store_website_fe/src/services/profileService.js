// --- Base URL for your User API ---
import { API_ENDPOINTS } from '../config/api.js';

/**
 * Updates an existing user (sends only changed fields).
 * Your API uses PUT but expects only changed data (like PATCH).
 * @param {string} userId - The ID of the user to update.
 * @param {Object} patchData - An object containing only the changed fields.
 * @returns {Promise<Object>} A promise that resolves to the API response (e.g., { message, id }).
 */
export const updateUser = async (userId, patchData) => {
  const response = await fetch(`${API_ENDPOINTS.PROFILE}/${userId}`, {
    method: 'PUT', // Using PUT as specified
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      // 'Authorization': 'Bearer YOUR_TOKEN' // <-- Add auth if needed
    },
    body: JSON.stringify(patchData)
  });

  if (response.status === 201 || response.ok) {
    // API returns { message, id }, so just return that
    return response.json(); 
  }

  // Handle errors
  const errorData = await response.json().catch(() => null);
  throw new Error(errorData?.detail || 'Failed to update profile.');
};