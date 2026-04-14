const API_URL = 'http://127.0.0.1:8000/stores/users/login';

/**
 * Logs in a user.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} The user object from the API.
 * @throws {Error} If the login fails (network, 404, or other error).
 */
export const login = async (email, password) => {
  const params = new URLSearchParams({ email, password });
  const url = `${API_URL}?${params.toString()}`;

  let response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    });
  } catch (err) {
    console.error('Login failed (network):', err);
    throw new Error('Network error. Please try again later.');
  }
  if (response.ok) {
    return response.json();
  }
  if (response.status === 404) {
    throw new Error('Invalid email or password');
  }
  const errorData = await response.json().catch(() => null);
  const errorMessage = errorData?.detail || `An error occurred (Status: ${response.status})`;
  throw new Error(errorMessage);
};