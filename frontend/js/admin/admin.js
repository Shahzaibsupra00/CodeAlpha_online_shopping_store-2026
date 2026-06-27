/**
 * Admin module — dashboard, CRUD operations
 */
import apiClient from '../api/client.js';

// Dashboard
export const getDashboard = () => apiClient.get('/admin/dashboard');

// Products
export const adminGetProducts = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiClient.get(`/products?${query}`);
};

export const adminCreateProduct = (formData) => {
  return apiClient.upload('/products', formData, 'POST');
};

export const adminUpdateProduct = (id, formData) => {
  return apiClient.upload(`/products/${id}`, formData, 'PUT');
};

export const adminDeleteProduct = (id) => apiClient.delete(`/products/${id}`);

// Categories
export const adminGetCategories = () => apiClient.get('/categories');
export const adminCreateCategory = (formData) => apiClient.upload('/categories', formData, 'POST');
export const adminUpdateCategory = (id, formData) => apiClient.upload(`/categories/${id}`, formData, 'PUT');
export const adminDeleteCategory = (id) => apiClient.delete(`/categories/${id}`);

// Users
export const adminGetUsers = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiClient.get(`/users?${query}`);
};
export const adminUpdateUser = (id, data) => apiClient.put(`/users/${id}`, data);
export const adminDeleteUser = (id) => apiClient.delete(`/users/${id}`);

// Orders
export const adminGetOrders = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiClient.get(`/orders?${query}`);
};
export const adminUpdateOrder = (id, data) => apiClient.put(`/orders/${id}`, data);
export const adminDeleteOrder = (id) => apiClient.delete(`/orders/${id}`);

export default {
  getDashboard, adminGetProducts, adminCreateProduct, adminUpdateProduct,
  adminDeleteProduct, adminGetCategories, adminCreateCategory, adminUpdateCategory,
  adminDeleteCategory, adminGetUsers, adminUpdateUser, adminDeleteUser,
  adminGetOrders, adminUpdateOrder, adminDeleteOrder,
};
