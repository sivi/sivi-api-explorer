import { apiClient } from './client.js';

export const brandApi = {
  getBrands: (params) => apiClient.post('/brands/list', params),
  createBrand: (payload) => apiClient.post('/brands', payload),
  extractBrand: (payload) => apiClient.post('/brand/extract', payload),
  setDefaultBrand: (payload) => apiClient.post('/brand/set-default', payload),
  archiveBrand: (payload) => apiClient.post('/brand/archive', payload),
  updateBrand: (payload) => apiClient.post('/brand/update', payload),
};
