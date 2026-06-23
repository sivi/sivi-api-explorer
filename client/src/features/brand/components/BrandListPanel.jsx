import React, { useState } from 'react';
import { message } from 'antd';
import { TextInput, NumberInput, Tabs } from '~/components/common/FormComponents';

const TABS = [
  { key: 'multi', label: 'Multi Brand' },
  { key: 'single', label: 'Single Brand' },
];

const BrandListPanel = ({ onSubmit, initialData }) => {
  const [activeTab, setActiveTab] = useState(initialData?.bId ? 'single' : 'multi');
  const [brandId, setBrandId] = useState(initialData?.bId || '');
  const [limit, setLimit] = useState(initialData?.limit ?? 20);
  const [abstractUserId, setAbstractUserId] = useState(initialData?.abstractUserId || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'multi' && (!limit || Number(limit) < 1)) {
      message.error('Limit is required and must be at least 1');
      return;
    }
    const payload = {};
    if (activeTab === 'single') {
      if (!brandId.trim()) {
        message.error('Brand ID is required for single brand fetch');
        return;
      }
      payload.bId = brandId.trim();
    } else {
      payload.limit = Number(limit);
      payload.cursor = null;
    }
    if (abstractUserId.trim()) payload.abstractUserId = abstractUserId.trim();
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="design-form">
      <h3 className="form-section-title">Brands</h3>
      <p className="form-hint">
        Fetch brand(s) from your Sivi workspace.
      </p>

      <Tabs tabs={TABS} activeKey={activeTab} onChange={setActiveTab} />

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

      {activeTab === 'multi' && (
        <NumberInput
          label="Limit *"
          value={limit}
          onChange={setLimit}
          placeholder="Number of brands per page"
          min={1}
          max={100}
        />
      )}

      <button type="submit" className="submit-button">
        {activeTab === 'multi' ? 'Fetch Brands' : 'Fetch Brand'}
      </button>
    </form>
  );
};

export default BrandListPanel;
