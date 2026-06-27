/**
 * Storage utilities — localStorage helpers
 */
import config from '../config/config.js';

export const getToken = () => localStorage.getItem(config.TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(config.TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(config.TOKEN_KEY);

export const getUser = () => {
  try {
    const user = localStorage.getItem(config.USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const setUser = (user) => {
  localStorage.setItem(config.USER_KEY, JSON.stringify(user));
};

export const removeUser = () => localStorage.removeItem(config.USER_KEY);

export const getTheme = () => localStorage.getItem(config.THEME_KEY) || 'light';
export const setTheme = (theme) => localStorage.setItem(config.THEME_KEY, theme);

export const getRecentlyViewed = () => {
  try {
    return JSON.parse(localStorage.getItem(config.RECENTLY_VIEWED_KEY)) || [];
  } catch {
    return [];
  }
};

export const addRecentlyViewed = (productId) => {
  let items = getRecentlyViewed();
  items = items.filter((id) => id !== productId);
  items.unshift(productId);
  if (items.length > config.MAX_RECENTLY_VIEWED) {
    items = items.slice(0, config.MAX_RECENTLY_VIEWED);
  }
  localStorage.setItem(config.RECENTLY_VIEWED_KEY, JSON.stringify(items));
};

export const getWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem(config.WISHLIST_KEY)) || [];
  } catch {
    return [];
  }
};

export const toggleWishlistItem = (productId) => {
  let items = getWishlist();
  if (items.includes(productId)) {
    items = items.filter((id) => id !== productId);
  } else {
    items.push(productId);
  }
  localStorage.setItem(config.WISHLIST_KEY, JSON.stringify(items));
  return items;
};

export const isInWishlist = (productId) => getWishlist().includes(productId);
