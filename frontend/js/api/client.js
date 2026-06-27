/**
 * API Client — centralized Fetch wrapper
 */
import config from '../config/config.js';
import { getToken } from '../utils/storage.js';
import { showToast } from '../utils/toast.js';

const apiClient = {
  /**
   * Make an API request
   */
  async request(endpoint, options = {}) {
    const url = `${config.API_URL}${endpoint}`;
    const token = getToken();

    const headers = {};
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const fetchOptions = {
      ...options,
      headers: { ...headers, ...options.headers },
    };

    // Convert body to JSON if not FormData
    if (options.body && !(options.body instanceof FormData)) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, fetchOptions);
      const data = await response.json();

      if (!response.ok) {
        // Handle 401 — auto logout
        if (response.status === 401) {
          localStorage.removeItem(config.TOKEN_KEY);
          localStorage.removeItem(config.USER_KEY);
          if (!window.location.pathname.includes('login')) {
            showToast('Session expired. Please login again.', 'error');
            setTimeout(() => {
              window.location.href = '/pages/login.html';
            }, 1500);
          }
        }
        throw { status: response.status, ...data };
      }

      return data;
    } catch (error) {
      if (error.status) throw error;
      console.error('API Error:', error);
      throw { success: false, message: 'Network error. Please check your connection.' };
    }
  },

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body });
  },

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  /**
   * Upload with FormData
   */
  upload(endpoint, formData, method = 'POST') {
    return this.request(endpoint, { method, body: formData });
  },
};

export default apiClient;
