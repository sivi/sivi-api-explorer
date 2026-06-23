import React, { useMemo } from 'react';
import { Cascader } from 'antd';
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
  const activeFlowPath = useMemo(() => findFlowPath(activeFlow), [activeFlow]);

  return (
    <header className="app-header">
      <h1>Sivi API Explorer</h1>
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
