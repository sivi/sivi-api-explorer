import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ExplorerHistoryDropdown from '~/components/common/ExplorerHistoryDropdown';

const BRANDS_JSON_URL = '/brands/brands.json';
const EXAMPLES_JSON_URL = '/examples/examples.json';

const AUTO_OPTION = { label: 'Auto', value: 'auto' };

const EXPLORER_FLOWS = [
  { label: 'Designs from Prompt', value: 'designs-from-prompt' },
  { label: 'Designs from Content', value: 'designs-from-content' },
  { label: 'Content from Prompt', value: 'content-from-prompt' },
];

export default function ExplorerHeader({
  activeFlow,
  selectedBId,
  selectedExample,
  selectedHistoryId,
  history,
  formatHistoryLabel,
  onBIdChange,
  onFlowChange,
  onExampleChange,
  onHistorySelect,
  onHistoryUpdate,
  onHistoryDelete,
  webhookUrl,
  webhookEnabled,
  onOpenWebhookModal,
  onToggleWebhook,
}) {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [examples, setExamples] = useState({});
  const [webhookPopoverOpen, setWebhookPopoverOpen] = useState(false);
  const webhookBtnRef = useRef(null);
  const webhookPopoverRef = useRef(null);

  useEffect(() => {
    fetch(BRANDS_JSON_URL)
      .then((res) => res.json())
      .then((data) => setBrands(Object.values(data)))
      .catch((err) => console.error('Failed to load brands:', err));
  }, []);

  useEffect(() => {
    fetch(EXAMPLES_JSON_URL)
      .then((res) => res.json())
      .then((data) => setExamples(data))
      .catch((err) => console.error('Failed to load examples:', err));
  }, []);

  const goHome = () => navigate('/');

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        webhookPopoverOpen &&
        webhookBtnRef.current &&
        !webhookBtnRef.current.contains(e.target) &&
        webhookPopoverRef.current &&
        !webhookPopoverRef.current.contains(e.target)
      ) {
        setWebhookPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [webhookPopoverOpen]);

  const brandOptions = useMemo(() => {
    return [
      AUTO_OPTION,
      ...brands.map((b) => ({ label: b.brandName, value: b.bId })),
    ];
  }, [brands]);

  const availableExamples = useMemo(() => {
    const bId = selectedBId || 'auto';
    const flowKey = activeFlow || 'auto';

    const brandExamples = examples[bId] || {};
    if (flowKey === 'auto') {
      // Show all examples for this brand across all flows
      const all = [];
      Object.entries(brandExamples).forEach(([flow, list]) => {
        (list || []).forEach((ex) => all.push({ ...ex, flowKey: flow }));
      });
      return all;
    }
    return (brandExamples[flowKey] || []).map((ex) => ({ ...ex, flowKey }));
  }, [examples, selectedBId, activeFlow]);

  return (
    <header className="app-header">
      <div className="app-header-brand" onClick={goHome} title="Back to Home">
        <img src="/sivi-logo.png" alt="Sivi AI" className="app-header-logo" />
        <div className="app-header-titles">
          <span className="app-header-title-main">Sivi Explorer</span>
          <span className="app-header-title-sub">Brand-based API Explorer</span>
        </div>
      </div>
      <div className="header-controls">
        <div className="brand-selector">
          <label className="preset-label">Brand:</label>
          <select
            value={selectedBId || 'auto'}
            onChange={(e) => onBIdChange(e.target.value)}
            className="preset-dropdown"
          >
            {brandOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flow-selector">
          <label className="preset-label">Flow:</label>
          <select
            value={activeFlow}
            onChange={(e) => onFlowChange(e.target.value)}
            className="preset-dropdown"
          >
            {EXPLORER_FLOWS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div className="preset-selector">
          {/* <label className="preset-label">Load Example:</label> */}
          <select
            value={selectedExample}
            onChange={(e) => {
              const value = e.target.value;
              if (!value) {
                onExampleChange('', null);
                return;
              }
              const [flowKey, idxStr] = value.split('::');
              const idx = parseInt(idxStr, 10);
              const ex = availableExamples.find(
                (item, i) => item.flowKey === flowKey && i === idx
              );
              onExampleChange(value, ex ? ex.data : null, flowKey);
            }}
            className="preset-dropdown"
          >
            <option value="">Select an example...</option>
            {availableExamples.map((ex, idx) => (
              <option key={`${ex.flowKey}-${idx}`} value={`${ex.flowKey}::${idx}`}>
                {ex.name}
              </option>
            ))}
          </select>
        </div>

        <div className="history-selector">
          <ExplorerHistoryDropdown
            history={history}
            selectedHistoryId={selectedHistoryId}
            formatHistoryLabel={formatHistoryLabel}
            onSelect={onHistorySelect}
            onUpdate={onHistoryUpdate}
            onDelete={onHistoryDelete}
            filterBId={selectedBId || 'auto'}
            filterFlowKey={activeFlow || 'auto'}
          />
        </div>

        <div className="webhook-controls">
          <div className="webhook-popover-wrapper">
            <button
              ref={webhookBtnRef}
              className={`webhook-icon-btn${webhookEnabled ? ' active' : ''}`}
              onClick={() => setWebhookPopoverOpen((o) => !o)}
              title="Webhook settings"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 010 8h-1" />
                <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
              </svg>
            </button>
            {webhookPopoverOpen && (
              <div className="webhook-popover" ref={webhookPopoverRef}>
                <div className="webhook-popover-header">
                  <span>Webhook</span>
                  <label className="webhook-popover-toggle">
                    <input
                      type="checkbox"
                      checked={webhookEnabled}
                      onChange={(e) => onToggleWebhook(e.target.checked)}
                    />
                    <span className="webhook-popover-slider" />
                  </label>
                </div>
                <div className="webhook-popover-body">
                  {webhookUrl ? (
                    <span className="webhook-popover-url" title={webhookUrl}>{webhookUrl}</span>
                  ) : (
                    <span className="webhook-popover-url empty">No webhook URL set</span>
                  )}
                  <button className="webhook-popover-config-btn" onClick={() => { setWebhookPopoverOpen(false); onOpenWebhookModal(); }}>
                    Configure
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            className="home-btn"
            onClick={goHome}
            title="Back to Home"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
