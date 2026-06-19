import React, { useState } from 'react';
import { message } from 'antd';
import { TextInput } from '../../../components/common/FormComponents';
import '../../../components/common/FormComponents.css';

const BrandSetDefaultForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    bId: initialData?.bId || '',
    abstractUserId: initialData?.abstractUserId || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.bId.trim()) {
      message.error('Brand ID is required');
      return;
    }
    const payload = { bId: formData.bId };
    if (formData.abstractUserId.trim()) payload.abstractUserId = formData.abstractUserId.trim();
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="design-form">
      <h3 className="form-section-title">Set Default Brand</h3>
      <p className="form-hint">
        Set a brand as the default for your workspace.
      </p>
      <div className="required-field">
        <TextInput
          label="Brand ID"
          value={formData.bId}
          onChange={(v) => setFormData((prev) => ({ ...prev, bId: v }))}
          placeholder="e.g. b_s87vFxpfM0R"
        />
      </div>
      <TextInput
        label="Abstract User ID (optional)"
        value={formData.abstractUserId}
        onChange={(v) => setFormData((prev) => ({ ...prev, abstractUserId: v }))}
        placeholder="e.g. user_123"
      />
      <button type="submit" className="submit-button">
        Set as Default
      </button>
    </form>
  );
};

export default BrandSetDefaultForm;
