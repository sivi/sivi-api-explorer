import React, { useState } from 'react';
import { message } from 'antd';
import {
  TextInput,
  UrlInput,
  SelectInput,
} from '~/components/common/FormComponents';

const TOUCH_POSITION_DEFAULT = { left: false, right: false, bottom: false, top: false, center: false };
const IMAGE_PREF_DEFAULT = { crop: null, removeBg: null, enhancement: null };

const MEDIA_TYPE_OPTIONS = [
  { value: 'photo', label: 'Photo' },
  { value: 'logo', label: 'Logo' },
  { value: 'illustration', label: 'Illustration' },
  { value: 'screenshot', label: 'Screenshot' },
  { value: 'backdrop', label: 'Backdrop' },
  { value: 'font', label: 'Font' },
];

const MediaCreateForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    type: initialData?.type || '',
    subType: initialData?.subType || '',
    url: initialData?.url || '',
    uploadUrl: initialData?.uploadUrl || '',
    bId: initialData?.bId || '',
    touchPosition: initialData?.touchPosition || { ...TOUCH_POSITION_DEFAULT },
    imagePreference: initialData?.imagePreference || { ...IMAGE_PREF_DEFAULT },
    hueRotations: initialData?.hueRotations || [],
    abstractUserId: initialData?.abstractUserId || '',
  });

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const updateField = (path, value) => {
    setFormData((prev) => {
      const keys = path.split('.');
      if (keys.length === 1) return { ...prev, [path]: value };
      const next = { ...prev };
      let curr = next;
      for (let i = 0; i < keys.length - 1; i++) {
        curr = curr[keys[i]] = { ...curr[keys[i]] };
      }
      curr[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.type.trim()) {
      nextErrors.type = 'Type is required';
      message.error('Type is required');
    }
    if (!file && !formData.url.trim() && !formData.uploadUrl.trim()) {
      nextErrors.url = 'Either URL, Upload URL, or a file is required';
      message.error('Either URL, Upload URL, or a file is required');
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      type: formData.type,
      ...(formData.subType.trim() && { subType: formData.subType.trim() }),
      ...(formData.url && { url: formData.url }),
      ...(formData.uploadUrl && { uploadUrl: formData.uploadUrl }),
      ...(formData.bId && { bId: formData.bId }),
      touchPosition: formData.touchPosition,
      imagePreference: formData.imagePreference,
      hueRotations: formData.hueRotations,
      ...(formData.abstractUserId && { abstractUserId: formData.abstractUserId }),
      ...(file && { file }),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="design-form">
      <h3 className="form-section-title">Create Media</h3>
      <p className="form-hint">Upload a new media asset to a workspace.</p>

      <div className={errors.type ? 'required-field' : ''}>
        <SelectInput
          label="Type"
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

      <div className={errors.url ? 'required-field' : ''}>
        <UrlInput
          label="Remote URL"
          value={formData.url}
          onChange={(v) => updateField('url', v)}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <TextInput
        label="Presigned Upload URL"
        value={formData.uploadUrl}
        onChange={(v) => updateField('uploadUrl', v)}
        placeholder="https://media.hellosivi.com/photos/..."
      />

      <div className="form-field">
        <label className="form-label">Upload File (optional)</label>
        <input
          type="file"
          accept="image/*,font/*"
          onChange={(e) => {
            const selected = e.target.files?.[0] || null;
            setFile(selected);
            if (selected) {
              // Clear URL fields when a file is selected
              setFormData((prev) => ({ ...prev, url: '', uploadUrl: '' }));
            }
            if (errors.url) setErrors((prev) => ({ ...prev, url: undefined }));
          }}
          className="file-input"
        />
        {file && (
          <p className="form-hint" style={{ marginTop: 4 }}>
            Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </p>
        )}
      </div>

      <TextInput
        label="Brand ID (bId)"
        value={formData.bId}
        onChange={(v) => updateField('bId', v)}
        placeholder="e.g. b_s87vFxpfM0R"
      />

      <div className="form-field">
        <label className="form-label">Touch Position</label>
        <div className="multi-select-list">
          {['left', 'right', 'bottom', 'top', 'center'].map((pos) => (
            <div key={pos} className="checkbox-item">
              <input
                type="checkbox"
                id={`touch-${pos}`}
                checked={!!formData.touchPosition[pos]}
                onChange={(e) => updateField(`touchPosition.${pos}`, e.target.checked)}
                className="checkbox-input"
              />
              <label htmlFor={`touch-${pos}`} className="checkbox-label">
                {pos.charAt(0).toUpperCase() + pos.slice(1)}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="form-field">
        <label className="form-label">Image Preference</label>
        <div className="multi-select-list">
          {[
            { key: 'crop', label: 'Crop' },
            { key: 'removeBg', label: 'Remove Background' },
            { key: 'enhancement', label: 'Enhancement' },
          ].map(({ key, label }) => (
            <div key={key} className="checkbox-item">
              <input
                type="checkbox"
                id={`pref-${key}`}
                checked={!!formData.imagePreference[key]}
                onChange={(e) => updateField(`imagePreference.${key}`, e.target.checked)}
                className="checkbox-input"
              />
              <label htmlFor={`pref-${key}`} className="checkbox-label">
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <TextInput
        label="Abstract User ID (optional)"
        value={formData.abstractUserId}
        onChange={(v) => updateField('abstractUserId', v)}
        placeholder="e.g. user_123"
      />

      <button type="submit" className="submit-button">
        Create Media
      </button>
    </form>
  );
};

export default MediaCreateForm;
