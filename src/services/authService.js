import apiClient from "./apiService";

/**
 * Login user
 * @param {Object} credentials - { email, password }
 * @returns {Promise}
 */
export const login = async (credentials) => {
  const response = await apiClient.post("/auth/loginnew", credentials);
  return response.data;
};

/**
 * Logout user
 * @returns {Promise}
 */
export const logout = async () => {
  const response = await apiClient.post("/auth/logout");
  return response.data;
};

/**
 * Register a new primary parent account
 * @param {Object} userData - { email, password, familyName }
 * @returns {Promise}
 */
export const register = async (userData) => {
  const response = await apiClient.post("/auth/registernew", userData);
  return response.data;
};

/**
 * Get current user profile
 * @returns {Promise}
 */
export const getCurrentUser = async () => {
  const response = await apiClient.get("/auth/me");
  return response.data;
};

/**
 * Refresh access token
 * @param {String} refreshToken
 * @returns {Promise}
 */
export const refreshToken = async (refreshToken) => {
  const response = await apiClient.post("/auth/refresh", { refreshToken });
  return response.data;
};
