/**
 * Cart module — handles cart operations for both guest and authenticated users
 */
import apiClient from '../api/client.js';
import config from '../config/config.js';
import { isAuthenticated } from '../auth/auth.js';
import { showToast } from '../utils/toast.js';
import { formatPrice, getImageUrl } from '../utils/helpers.js';

/**
 * Get local cart
 */
const getLocalCart = () => {
  try {
    return JSON.parse(localStorage.getItem(config.CART_KEY)) || [];
  } catch {
    return [];
  }
};

const saveLocalCart = (items) => {
  localStorage.setItem(config.CART_KEY, JSON.stringify(items));
  updateCartCount();
};

/**
 * Get cart items
 */
export const getCart = async () => {
  if (isAuthenticated()) {
    try {
      const data = await apiClient.get('/cart');
      return data.data.cart;
    } catch {
      return { products: [] };
    }
  }
  return { products: getLocalCart() };
};

/**
 * Add to cart
 */
export const addToCart = async (productId, quantity = 1) => {
  if (isAuthenticated()) {
    try {
      const data = await apiClient.post('/cart', { productId, quantity });
      showToast('Added to cart!', 'success');
      updateCartCount();
      return data.data.cart;
    } catch (error) {
      showToast(error.message || 'Failed to add to cart', 'error');
      throw error;
    }
  } else {
    // Guest cart — store locally
    const cart = getLocalCart();
    const existing = cart.find((item) => item.product === productId || item.product?._id === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ product: productId, quantity });
    }
    saveLocalCart(cart);
    showToast('Added to cart!', 'success');
    return { products: cart };
  }
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (productId, quantity) => {
  if (isAuthenticated()) {
    try {
      const data = await apiClient.put(`/cart/${productId}`, { quantity });
      updateCartCount();
      return data.data.cart;
    } catch (error) {
      showToast(error.message || 'Failed to update cart', 'error');
      throw error;
    }
  } else {
    const cart = getLocalCart();
    const item = cart.find((i) => (i.product === productId || i.product?._id === productId));
    if (item) {
      if (quantity <= 0) {
        return removeFromCart(productId);
      }
      item.quantity = quantity;
    }
    saveLocalCart(cart);
    return { products: cart };
  }
};

/**
 * Remove from cart
 */
export const removeFromCart = async (productId) => {
  if (isAuthenticated()) {
    try {
      const data = await apiClient.delete(`/cart/${productId}`);
      showToast('Removed from cart', 'success');
      updateCartCount();
      return data.data.cart;
    } catch (error) {
      showToast(error.message || 'Failed to remove item', 'error');
      throw error;
    }
  } else {
    let cart = getLocalCart();
    cart = cart.filter((i) => i.product !== productId && i.product?._id !== productId);
    saveLocalCart(cart);
    showToast('Removed from cart', 'success');
    return { products: cart };
  }
};

/**
 * Clear cart
 */
export const clearCart = async () => {
  if (isAuthenticated()) {
    try {
      await apiClient.delete('/cart/clear');
      updateCartCount();
    } catch {
      // ignore
    }
  }
  localStorage.removeItem(config.CART_KEY);
  updateCartCount();
};

/**
 * Get cart item count
 */
export const getCartCount = async () => {
  if (isAuthenticated()) {
    try {
      const data = await apiClient.get('/cart');
      const cart = data.data.cart;
      return cart.products ? cart.products.reduce((sum, item) => sum + item.quantity, 0) : 0;
    } catch {
      return 0;
    }
  }
  const cart = getLocalCart();
  return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
};

/**
 * Update cart badge in navigation
 */
export const updateCartCount = async () => {
  const badge = document.getElementById('cart-count');
  if (!badge) return;

  const count = await getCartCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
};

/**
 * Calculate cart total
 */
export const calculateCartTotal = (cartProducts) => {
  if (!cartProducts) return 0;
  return cartProducts.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * item.quantity;
  }, 0);
};

export default {
  getCart, addToCart, updateCartItem, removeFromCart, clearCart,
  getCartCount, updateCartCount, calculateCartTotal,
};
