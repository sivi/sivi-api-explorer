import React, { useState } from 'react';
import { message } from 'antd';
import {
  TextInput,
  SelectInput,
  NumberInput,
  MultiSelectList,
} from '~/components/common/FormComponents';

const SOURCE_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'System', value: 'system' },
  { label: 'User', value: 'user' },
];

const CLASSIFICATION_OPTIONS = [
  { label: 'Serif', value: 'serif' },
  { label: 'Sans-serif', value: 'sans-serif' },
  { label: 'Display', value: 'display' },
  { label: 'Handwriting', value: 'handwriting' },
  { label: 'Monospace', value: 'monospace' },
];

const FontListPanel = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    classification: initialData?.classification || CLASSIFICATION_OPTIONS.map((o) => o.value),
    name: initialData?.name || '',
    source: initialData?.source || 'all',
    limit: initialData?.limit ?? 20,
    abstractUserId: initialData?.abstractUserId || '',
  });

  const [errors, setErrors] = useState({});

  const updateField = (path, value) => {
    setFormData((prev) => ({ ...prev, [path]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.source) {
      nextErrors.source = 'Source is required';
      message.error('Source is required');
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (!formData.limit || Number(formData.limit) < 1) {
      message.error('Limit is required and must be at least 1');
      return;
    }

    const payload = {
      ...(formData.classification?.length && { classification: formData.classification }),
      ...(formData.name && { name: formData.name }),
      ...(formData.source !== 'all' && { source: formData.source }),
      limit: Number(formData.limit),
      cursor: null,
      ...(formData.abstractUserId && { abstractUserId: formData.abstractUserId }),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="design-form">
      <h3 className="form-section-title">Get Fonts</h3>
      <p className="form-hint">Retrieve fonts from a workspace.</p>

      <MultiSelectList
        label="Classification"
        values={formData.classification}
        onChange={(v) => updateField('classification', v)}
        options={CLASSIFICATION_OPTIONS}
      />

      <TextInput
        label="Font Name"
        value={formData.name}
        onChange={(v) => updateField('name', v)}
        placeholder="e.g. Roboto"
      />

      <div className={'form-field'}>
        <SelectInput
          label="Source"
          value={formData.source}
          onChange={(v) => {
            updateField('source', v);
            if (errors.source) setErrors((prev) => ({ ...prev, source: undefined }));
          }}
          options={SOURCE_OPTIONS}
        />
      </div>

      <div className={'required-field'}>
        <NumberInput
          label="Limit"
          value={formData.limit}
          onChange={(v) => updateField('limit', v)}
          placeholder="Number of fonts to fetch"
          min={1}
          max={100}
        />
      </div>

      <TextInput
        label="Abstract User ID (optional)"
        value={formData.abstractUserId}
        onChange={(v) => updateField('abstractUserId', v)}
        placeholder="e.g. user_123"
      />

      <button type="submit" className="submit-button">
        Get Fonts
      </button>
    </form>
  );
};

export default FontListPanel;
