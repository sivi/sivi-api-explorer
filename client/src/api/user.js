import { apiClient } from './client.js';

export const userApi = {
  loginUser: (payload) => apiClient.post('/user/login', payload),
  deleteUser: (payload) => apiClient.post('/user/delete', payload),
  setUserCreditLimit: (payload) => apiClient.post('/user/credit-limit', payload),
};
