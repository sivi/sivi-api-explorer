import React, { useState } from 'react';
import { message } from 'antd';
import {
  TextInput,
} from '~/components/common/FormComponents';

const MediaDeleteForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    mIds: initialData?.mIds?.join(', ') || '',
    abstractUserId: initialData?.abstractUserId || '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    const ids = formData.mIds.split(',').map((s) => s.trim()).filter(Boolean);
    if (ids.length === 0) {
      nextErrors.mIds = 'At least one Media ID is required';
      message.error('At least one Media ID is required');
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      mIds: formData.mIds.split(',').map((s) => s.trim()).filter(Boolean),
      ...(formData.abstractUserId && { abstractUserId: formData.abstractUserId }),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="design-form">
      <h3 className="form-section-title">Delete Media</h3>
      <p className="form-hint">Delete media assets from a workspace.</p>

      <div className={errors.mIds ? 'required-field' : ''}>
        <TextInput
          label="Media IDs (comma-separated)"
          value={formData.mIds}
          onChange={(v) => {
            setFormData((prev) => ({ ...prev, mIds: v }));
            if (errors.mIds) setErrors((prev) => ({ ...prev, mIds: undefined }));
          }}
          placeholder="e.g. w_abc123----photo_001.jpeg, w_abc123----photo_002.jpeg"
        />
      </div>

      <TextInput
        label="Abstract User ID (optional)"
        value={formData.abstractUserId}
        onChange={(v) => setFormData((prev) => ({ ...prev, abstractUserId: v }))}
        placeholder="e.g. user_123"
      />

      <button type="submit" className="submit-button">
        Delete Media
      </button>
    </form>
  );
};

export default MediaDeleteForm;
