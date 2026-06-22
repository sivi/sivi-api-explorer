import { apiClient } from './client.js';

export const fontsApi = {
  getFonts: (params) => apiClient.post('/fonts/list', params),
  uploadFonts: (payload) => apiClient.post('/fonts/upload', payload),
};
