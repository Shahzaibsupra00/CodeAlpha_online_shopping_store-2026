/**
 * User module — profile management
 */
import apiClient from '../api/client.js';

export const getUsers = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiClient.get(`/users?${query}`);
};

export const getUserById = async (id) => apiClient.get(`/users/${id}`);
export const updateUser = async (id, data) => apiClient.put(`/users/${id}`, data);
export const deleteUser = async (id) => apiClient.delete(`/users/${id}`);

export default { getUsers, getUserById, updateUser, deleteUser };
