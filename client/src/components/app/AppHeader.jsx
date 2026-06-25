import React, { useMemo } from 'react';
import { Cascader } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FLOW_GROUPS, findFlowPath } from '~/config/flows.js';
import { designPresets } from '~/features/designs/data/designPresets';
import HistoryDropdown from '~/components/common/HistoryDropdown';

const PRESET_FLOWS = [
  'designs-from-prompt',
  'designs-from-content',
  'content-from-prompt',
  'extract-brand',
  'generate-media',
  'upload-fonts',
];

export default function AppHeader({
  activeFlow,
  selectedPreset,
  selectedHistoryId,
  history,
  formatHistoryLabel,
  webhookUrl,
  webhookEnabled,
  onFlowChange,
  onPresetChange,
  onHistorySelect,
  onHistoryUpdate,
  onHistoryDelete,
  onOpenWebhookModal,
  onToggleWebhook,
}) {
  const navigate = useNavigate();
  const goHome = () => navigate('/');
  const activeFlowPath = useMemo(() => findFlowPath(activeFlow), [activeFlow]);

  return (
    <header className="app-header">
      <div className="app-header-brand" onClick={goHome} title="Back to Home">
        <img src="/sivi-logo.png" alt="Sivi AI" className="app-header-logo" />
        <div className="app-header-titles">
          <span className="app-header-title-main">Sivi API Explorer</span>
          <span className="app-header-title-sub">Powered by Large Design Model</span>
        </div>
      </div>
      <div className="header-controls">
        <div className="flow-selector">
          <label className="preset-label">Flow:</label>
          <Cascader
            className="flow-cascader"
            options={FLOW_GROUPS}
            value={activeFlowPath}
            onChange={(value) => {
              if (value && value.length >= 2) {
                onFlowChange(value[value.length - 1]);
              }
            }}
            placeholder="Select a flow"
            allowClear={false}
            popupClassName="flow-cascader-popup"
          />
        </div>

        {PRESET_FLOWS.includes(activeFlow) && (
          <div className="preset-selector">
            <label htmlFor="preset-dropdown" className="preset-label">
              Load Example:
            </label>
            <select
              id="preset-dropdown"
              value={selectedPreset}
              onChange={(e) => onPresetChange(e.target.value)}
              className="preset-dropdown"
            >
              <option value="">Select a preset...</option>
              {Object.entries(designPresets)
                .filter(([, preset]) => preset.flows?.includes(activeFlow))
                .map(([key, preset]) => (
                  <option key={key} value={key}>
                    {preset.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div className="history-selector">
          <HistoryDropdown
            history={history}
            selectedHistoryId={selectedHistoryId}
            formatHistoryLabel={formatHistoryLabel}
            onSelect={onHistorySelect}
            onUpdate={onHistoryUpdate}
            onDelete={onHistoryDelete}
          />
        </div>

        <div className="webhook-controls">
          <button
            className="home-btn"
            onClick={goHome}
            title="Back to Home"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span>Home</span>
          </button>
          <button
            className="webhook-config-btn"
            onClick={onOpenWebhookModal}
            title="Configure webhook URL"
          >
            Webhook
          </button>
          <label
            className="webhook-toggle-label"
            title={webhookUrl ? '' : 'Set a webhook URL first'}
          >
            <input
              type="checkbox"
              className="webhook-toggle-input"
              checked={webhookEnabled}
              disabled={!webhookUrl}
              onChange={(e) => onToggleWebhook(e.target.checked)}
            />
            <span
              className={`webhook-toggle-text ${webhookEnabled ? 'enabled' : ''}`}
            >
              {webhookEnabled ? 'Webhook ON' : 'Webhook OFF'}
            </span>
          </label>
        </div>
      </div>
    </header>
  );
}
