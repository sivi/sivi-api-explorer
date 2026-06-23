import React, { useState } from 'react';
import {
  TextInput,
  SelectInput,
  NumberInput,
} from '~/components/common/FormComponents';

const SORT_OPTIONS = [
  { label: 'Descending', value: 'DESC' },
  { label: 'Ascending', value: 'ASC' },
];

const MEDIA_TYPE_OPTIONS = [
  { value: 'photo', label: 'Photo' },
  { value: 'logo', label: 'Logo' },
  { value: 'illustration', label: 'Illustration' },
  { value: 'screenshot', label: 'Screenshot' },
  { value: 'backdrop', label: 'Backdrop' },
  { value: 'font', label: 'Font' },
];

const MediaGetForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    type: initialData?.type || '',
    subType: initialData?.subType || '',
    mId: initialData?.mId || '',
    bId: initialData?.bId || '',
    limit: initialData?.limit || 10,
    cursor: initialData?.cursor || '',
    sort: initialData?.sort || 'DESC',
    abstractUserId: initialData?.abstractUserId || '',
  });

  const [errors, setErrors] = useState({});

  const updateField = (path, value) => {
    setFormData((prev) => ({ ...prev, [path]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...(formData.type.trim() && { type: formData.type.trim() }),
      ...(formData.subType.trim() && { subType: formData.subType.trim() }),
      ...(formData.mId && { mId: formData.mId }),
      ...(formData.bId && { bId: formData.bId }),
      ...(formData.limit && { limit: Number(formData.limit) }),
      ...(formData.cursor && { cursor: formData.cursor }),
      sort: formData.sort || 'DESC',
      ...(formData.abstractUserId && { abstractUserId: formData.abstractUserId }),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="design-form">
      <h3 className="form-section-title">Get Media</h3>
      <p className="form-hint">Retrieve media assets from a workspace.</p>

      <div>
        <SelectInput
          label="Type (optional)"
          value={formData.type}
          onChange={(v) => {
            updateField('type', v);
            if (errors.type) setErrors((prev) => ({ ...prev, type: undefined }));
          }}
          options={MEDIA_TYPE_OPTIONS}
          placeholder="Select media type"
        />
      </div>

      <div>
        <TextInput
          label="SubType (optional)"
          value={formData.subType}
          onChange={(v) => {
            updateField('subType', v);
            if (errors.subType) setErrors((prev) => ({ ...prev, subType: undefined }));
          }}
          placeholder="e.g. photograph, logo, backgroundImage"
        />
      </div>

      <TextInput
        label="Media ID (mId)"
        value={formData.mId}
        onChange={(v) => updateField('mId', v)}
        placeholder="e.g. w_abc123----photo_001.jpeg"
      />

      <TextInput
        label="Brand ID (bId)"
        value={formData.bId}
        onChange={(v) => updateField('bId', v)}
        placeholder="e.g. b_s87vFxpfM0R"
      />

      <NumberInput
        label="Limit"
        value={formData.limit}
        onChange={(v) => updateField('limit', v)}
        placeholder="Number of items to fetch"
        min={1}
        max={100}
      />

      <TextInput
        label="Cursor"
        value={formData.cursor}
        onChange={(v) => updateField('cursor', v)}
        placeholder="Pagination cursor"
      />

      <SelectInput
        label="Sort"
        value={formData.sort}
        onChange={(v) => updateField('sort', v)}
        options={SORT_OPTIONS}
      />

      <TextInput
        label="Abstract User ID (optional)"
        value={formData.abstractUserId}
        onChange={(v) => updateField('abstractUserId', v)}
        placeholder="e.g. user_123"
      />

      <button type="submit" className="submit-button">
        Get Media
      </button>
    </form>
  );
};

export default MediaGetForm;
