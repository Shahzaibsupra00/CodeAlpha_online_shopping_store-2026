/**
 * Auth module — handles login, register, logout, profile
 */
import apiClient from '../api/client.js';
import { setToken, setUser, removeToken, removeUser, getToken, getUser } from '../utils/storage.js';
import { showToast } from '../utils/toast.js';
import { setButtonLoading } from '../utils/loader.js';
import { validateEmail, validatePassword, clearFieldErrors } from '../utils/validator.js';

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => !!getToken();

/**
 * Check if user is admin
 */
export const isAdmin = () => {
  const user = getUser();
  return user && user.role === 'admin';
};

/**
 * Get current user
 */
export const getCurrentUser = () => getUser();

/**
 * Register new user
 */
export const register = async (name, email, password) => {
  const data = await apiClient.post('/auth/register', { name, email, password });
  setToken(data.data.token);
  setUser(data.data.user);
  return data;
};

/**
 * Login
 */
export const login = async (email, password) => {
  const data = await apiClient.post('/auth/login', { email, password });
  setToken(data.data.token);
  setUser(data.data.user);
  return data;
};

/**
 * Logout
 */
export const logout = () => {
  removeToken();
  removeUser();
  showToast('Logged out successfully', 'success');
  window.location.href = '/pages/login.html';
};

/**
 * Get profile
 */
export const getProfile = async () => {
  const data = await apiClient.get('/auth/profile');
  setUser(data.data.user);
  return data.data.user;
};

/**
 * Update profile
 */
export const updateProfile = async (profileData) => {
  const data = await apiClient.put('/auth/profile', profileData);
  setUser(data.data.user);
  return data.data.user;
};

/**
 * Change password
 */
export const changePassword = async (currentPassword, newPassword) => {
  return apiClient.put('/auth/password', { currentPassword, newPassword });
};

/**
 * Init login page
 */
export const initLoginPage = () => {
  const form = document.getElementById('login-form');
  if (!form) return;

  // Check remember me
  const savedEmail = localStorage.getItem('remember_email');
  if (savedEmail) {
    form.querySelector('#email').value = savedEmail;
    const rememberEl = form.querySelector('#remember');
    if (rememberEl) rememberEl.checked = true;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFieldErrors(form);

    const email = form.querySelector('#email').value.trim();
    const password = form.querySelector('#password').value;
    const remember = form.querySelector('#remember')?.checked;

    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showToast('Please enter a valid email', 'error');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    setButtonLoading(btn, true);

    try {
      await login(email, password);

      if (remember) {
        localStorage.setItem('remember_email', email);
      } else {
        localStorage.removeItem('remember_email');
      }

      showToast('Login successful!', 'success');

      const user = getUser();
      setTimeout(() => {
        if (user && user.role === 'admin') {
          window.location.href = '/pages/admin/dashboard.html';
        } else {
          window.location.href = '/';
        }
      }, 500);
    } catch (error) {
      showToast(error.message || 'Login failed', 'error');
    } finally {
      setButtonLoading(btn, false);
    }
  });
};

/**
 * Init register page
 */
export const initRegisterPage = () => {
  const form = document.getElementById('register-form');
  if (!form) return;

  // Password strength indicator
  const passwordInput = form.querySelector('#password');
  const strengthBar = form.querySelector('.password-strength-fill');
  const strengthText = form.querySelector('.password-strength-text');

  if (passwordInput && strengthBar) {
    passwordInput.addEventListener('input', () => {
      const result = validatePassword(passwordInput.value);
      strengthBar.className = `password-strength-fill ${result.strength}`;
      if (strengthText) strengthText.textContent = result.message;
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFieldErrors(form);

    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const password = form.querySelector('#password').value;
    const confirmPassword = form.querySelector('#confirm-password').value;

    if (!name || !email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showToast('Please enter a valid email', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    setButtonLoading(btn, true);

    try {
      await register(name, email, password);
      showToast('Registration successful!', 'success');
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } catch (error) {
      showToast(error.message || 'Registration failed', 'error');
    } finally {
      setButtonLoading(btn, false);
    }
  });
};

export default {
  isAuthenticated, isAdmin, getCurrentUser, register, login, logout,
  getProfile, updateProfile, changePassword, initLoginPage, initRegisterPage,
};
