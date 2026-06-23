import React, { useState, useEffect } from 'react';
import { coreApi } from '~/api/core.js';
import './index.css';

const WEBHOOK_URL_KEY = 'webhookUrl';

const WebhookModal = ({ onClose, onSaved }) => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(WEBHOOK_URL_KEY);
    if (stored) {
      setWebhookUrl(stored);
    }
  }, []);

  const handleSave = async () => {
    setError('');
    setSuccess('');

    if (!webhookUrl.trim()) {
      setError('Webhook URL is required.');
      return;
    }

    setIsSaving(true);
    try {
      const data = await coreApi.updateWebhook(webhookUrl.trim());
      if (data.error) {
        setError(data.error);
      } else {
        localStorage.setItem(WEBHOOK_URL_KEY, webhookUrl.trim());
        setSuccess('Webhook URL saved successfully.');
        if (onSaved) onSaved(webhookUrl.trim());
      }
    } catch (err) {
      setError(err.data?.error || err.message || 'Failed to update webhook URL.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = () => {
    setWebhookUrl('');
    localStorage.removeItem(WEBHOOK_URL_KEY);
    setSuccess('Webhook URL cleared.');
    setError('');
    if (onSaved) onSaved('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Configure Webhook</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            Enter a webhook URL to receive design generation results. When enabled, polling will be replaced by webhook delivery.
          </p>

          <div className="modal-field">
            <label className="modal-label">Webhook URL</label>
            <input
              type="url"
              className="modal-input"
              placeholder="https://your-server.com/webhook"
              value={webhookUrl}
              onChange={(e) => {
                setWebhookUrl(e.target.value);
                setError('');
                setSuccess('');
              }}
            />
          </div>

          {error && <p className="modal-error">{error}</p>}
          {success && <p className="modal-success">{success}</p>}
        </div>

        <div className="modal-footer">
          <button className="modal-btn modal-btn-secondary" onClick={handleClear} disabled={isSaving}>
            Clear
          </button>
          <button className="modal-btn modal-btn-primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Webhook'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebhookModal;
