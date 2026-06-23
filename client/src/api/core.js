import { apiClient } from './client.js';

export const coreApi = {
  designsFromPrompt: (payload) =>
    apiClient.post('/designs-from-prompt', payload),

  designsFromContent: (payload) =>
    apiClient.post('/designs-from-content', payload),

  contentFromPrompt: (payload) =>
    apiClient.post('/content-from-prompt', payload),

  getRequestStatus: (requestId) =>
    apiClient.get(`/get-request-status?requestId=${encodeURIComponent(requestId)}`),

  getDesignVariants: (params) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value != null && value !== '') query.append(key, String(value));
    });
    const queryString = query.toString();
    return apiClient.get(`/get-design-variants${queryString ? `?${queryString}` : ''}`);
  },

  updateWebhook: (webhookUrl) =>
    apiClient.post('/update-webhook', { webhookUrl }),
};
