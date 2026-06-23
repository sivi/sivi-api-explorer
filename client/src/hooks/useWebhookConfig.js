import { useState, useEffect, useCallback } from 'react';

const WEBHOOK_URL_KEY = 'webhookUrl';

export function useWebhookConfig() {
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [webhookEnabled, setWebhookEnabled] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(WEBHOOK_URL_KEY);
    if (stored) setWebhookUrl(stored);
  }, []);

  const handleWebhookSaved = useCallback((url) => {
    setWebhookUrl(url);
    if (!url) setWebhookEnabled(false);
  }, []);

  return {
    showWebhookModal,
    setShowWebhookModal,
    webhookEnabled,
    setWebhookEnabled,
    webhookUrl,
    handleWebhookSaved,
  };
}
