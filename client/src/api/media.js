import { apiClient } from './client.js';

export const mediaApi = {
  getMedia: (params) => apiClient.post('/media/list', params),
  createMedia: (payload) => apiClient.post('/media/create', payload),
  updateMedia: (payload) => apiClient.post('/media/update', payload),
  deleteMedia: (payload) => apiClient.post('/media/delete', payload),
  generateMedia: (payload) => apiClient.post('/media/generate', payload),
};
