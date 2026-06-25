import React, { useState } from 'react';
import { message } from 'antd';
import {
  TextInput,
} from '~/components/common/FormComponents';
import { mediaApi } from '~/api/media.js';

const TOUCH_POSITION_DEFAULT = { left: false, right: false, bottom: false, top: false, center: false };
const IMAGE_PREF_DEFAULT = { crop: null, removeBg: null, enhancement: null };

const formatHueRotations = (value) => {
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'string') return value;
  return '';
};

const parseHueRotations = (str) => {
  return str
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s !== '')
    .map(Number)
    .filter((n) => !isNaN(n));
};

const MediaUpdateForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    mId: initialData?.mId || '',
    touchPosition: initialData?.touchPosition || { ...TOUCH_POSITION_DEFAULT },
    imagePreference: initialData?.imagePreference || { ...IMAGE_PREF_DEFAULT },
    hueRotations: formatHueRotations(initialData?.hueRotations),
    abstractUserId: initialData?.abstractUserId || '',
  });

  const [errors, setErrors] = useState({});
  const [isFetching, setIsFetching] = useState(false);

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
    if (!formData.mId.trim()) {
      nextErrors.mId = 'Media ID is required';
      message.error('Media ID is required');
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      mId: formData.mId,
      touchPosition: formData.touchPosition,
      imagePreference: formData.imagePreference,
      hueRotations: parseHueRotations(formData.hueRotations),
      ...(formData.abstractUserId && { abstractUserId: formData.abstractUserId }),
    };

    onSubmit(payload);
  };

  const handleFetchMedia = async () => {
    if (!formData.mId.trim()) {
      message.error('Media ID is required');
      return;
    }
    setIsFetching(true);
    try {
      const response = await mediaApi.getMedia({ mId: formData.mId.trim() });
      const body = response.body ?? response;
      const result = body?.result ?? body;
      const media = result?.media?.[0] ?? result?.media;
      if (!media) {
        message.error('Media not found');
        return;
      }
      const meta = media.meta || {};
      setFormData({
        mId: media.mId || formData.mId,
        touchPosition: { ...TOUCH_POSITION_DEFAULT, ...(media.touchPosition || meta.touchPosition || {}) },
        imagePreference: { ...IMAGE_PREF_DEFAULT, ...(media.imagePreference || meta.imagePreference || {}) },
        hueRotations: formatHueRotations(media.hueRotations ?? meta.hueRotations),
        abstractUserId: media.abstractUserId || '',
      });
      message.success('Media details loaded');
    } catch (err) {
      message.error(`Failed to fetch media: ${err.message}`);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="design-form">
      <h3 className="form-section-title">Update Media</h3>
      <p className="form-hint">Update metadata of an existing media asset.</p>

      <div className="required-field">
        <TextInput
          label="Media ID (mId)"
          value={formData.mId}
          onChange={(v) => {
            updateField('mId', v);
            if (errors.mId) setErrors((prev) => ({ ...prev, mId: undefined }));
          }}
          placeholder="e.g. w_abc123----photo_001.jpeg"
        />
        <button
          type="button"
          className="add-button"
          onClick={handleFetchMedia}
          disabled={isFetching}
          style={{ marginTop: 8 }}
        >
          {isFetching ? 'Fetching...' : 'Fetch Media'}
        </button>
      </div>

      <div className="form-field">
        <label className="form-label">Touch Position</label>
        <div className="multi-select-list">
          {['left', 'right', 'bottom', 'top', 'center'].map((pos) => (
            <div key={pos} className="checkbox-item">
              <input
                type="checkbox"
                id={`update-touch-${pos}`}
                checked={!!formData.touchPosition[pos]}
                onChange={(e) => updateField(`touchPosition.${pos}`, e.target.checked)}
                className="checkbox-input"
              />
              <label htmlFor={`update-touch-${pos}`} className="checkbox-label">
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
                id={`update-pref-${key}`}
                checked={!!formData.imagePreference[key]}
                onChange={(e) => updateField(`imagePreference.${key}`, e.target.checked)}
                className="checkbox-input"
              />
              <label htmlFor={`update-pref-${key}`} className="checkbox-label">
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <TextInput
        label="Hue Rotations (comma-separated)"
        value={formData.hueRotations}
        onChange={(v) => updateField('hueRotations', v)}
        placeholder="e.g. 15, 45, 90"
      />

      <TextInput
        label="Abstract User ID (optional)"
        value={formData.abstractUserId}
        onChange={(v) => updateField('abstractUserId', v)}
        placeholder="e.g. user_123"
      />

      <button type="submit" className="submit-button">
        Update Media
      </button>
    </form>
  );
};

export default MediaUpdateForm;
