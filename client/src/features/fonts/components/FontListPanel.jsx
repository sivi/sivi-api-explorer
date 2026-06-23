import React, { useState } from 'react';
import { message } from 'antd';
import {
  TextInput,
  SelectInput,
  NumberInput,
  MultiSelectList,
} from '~/components/common/FormComponents';

const SOURCE_OPTIONS = [
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
    classification: initialData?.classification || [],
    name: initialData?.name || '',
    source: initialData?.source || 'system',
    limit: initialData?.limit || 20,
    cursor: initialData?.cursor || '',
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

    const payload = {
      ...(formData.classification?.length && { classification: formData.classification }),
      ...(formData.name && { name: formData.name }),
      source: formData.source,
      ...(formData.limit && { limit: Number(formData.limit) }),
      ...(formData.cursor && { cursor: formData.cursor }),
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

      <div className={errors.source ? 'required-field' : ''}>
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

      <NumberInput
        label="Limit"
        value={formData.limit}
        onChange={(v) => updateField('limit', v)}
        placeholder="Number of fonts to fetch"
        min={1}
        max={100}
      />

      <TextInput
        label="Cursor"
        value={formData.cursor}
        onChange={(v) => updateField('cursor', v)}
        placeholder="Pagination cursor"
      />

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
