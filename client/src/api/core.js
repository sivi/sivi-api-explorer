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

  getDesignVariants: (designId) =>
    apiClient.get(`/get-design-variants?designId=${encodeURIComponent(designId)}`),

  updateWebhook: (webhookUrl) =>
    apiClient.post('/update-webhook', { webhookUrl }),
};
