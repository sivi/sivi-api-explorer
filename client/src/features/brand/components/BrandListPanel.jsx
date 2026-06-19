import React, { useState } from 'react';
import { message } from 'antd';
import { TextInput } from '../../../components/common/FormComponents';
import '../../../components/common/FormComponents.css';

const TABS = [
  { key: 'multi', label: 'Multi Brand' },
  { key: 'single', label: 'Single Brand' },
];

const BrandListPanel = ({ onSubmit, initialData }) => {
  const [activeTab, setActiveTab] = useState(initialData?.bId ? 'single' : 'multi');
  const [workspaceId, setWorkspaceId] = useState(initialData?.workspaceId || '');
  const [brandId, setBrandId] = useState(initialData?.bId || '');
  const [abstractUserId, setAbstractUserId] = useState(initialData?.abstractUserId || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {};
    if (activeTab === 'single') {
      if (!brandId.trim()) {
        message.error('Brand ID is required for single brand fetch');
        return;
      }
      payload.bId = brandId.trim();
    }
    if (workspaceId.trim()) payload.workspaceId = workspaceId.trim();
    if (abstractUserId.trim()) payload.abstractUserId = abstractUserId.trim();
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="design-form">
      <h3 className="form-section-title">Brands</h3>
      <p className="form-hint">
        Fetch brand(s) from your Sivi workspace.
      </p>

      <div className="form-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`form-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <TextInput
        label="Workspace ID"
        value={workspaceId}
        onChange={setWorkspaceId}
        placeholder="e.g. dc6a1c20-1e94-11f0-abff-a1489713342b"
      />
      <TextInput
        label="Abstract User ID (optional)"
        value={abstractUserId}
        onChange={setAbstractUserId}
        placeholder="e.g. user_123"
      />

      {activeTab === 'single' && (
        <div className="required-field">
          <TextInput
            label="Brand ID"
            value={brandId}
            onChange={setBrandId}
            placeholder="e.g. b_s87vFxpfM0R"
          />
        </div>
      )}

      <button type="submit" className="submit-button">
        {activeTab === 'multi' ? 'Fetch Brands' : 'Fetch Brand'}
      </button>
    </form>
  );
};

export default BrandListPanel;
