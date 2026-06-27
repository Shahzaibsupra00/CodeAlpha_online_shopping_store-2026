/**
 * Order module — handles placing and viewing orders
 */
import apiClient from '../api/client.js';

export const createOrder = async (orderData) => {
  return apiClient.post('/orders', orderData);
};

export const getMyOrders = async (page = 1) => {
  return apiClient.get(`/orders/my-orders?page=${page}`);
};

export const getOrderById = async (id) => {
  return apiClient.get(`/orders/${id}`);
};

export default { createOrder, getMyOrders, getOrderById };
