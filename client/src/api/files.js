import { apiClient } from './client.js';

export const filesApi = {
  getPresignedUrl: (payload) => apiClient.post('/files/presigned-url', payload),
};
