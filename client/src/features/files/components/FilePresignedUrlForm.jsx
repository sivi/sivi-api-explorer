import React, { useState, useMemo } from 'react';
import { message } from 'antd';
import {
  TextInput,
  SelectInput,
  NumberInput,
  Tabs,
} from '~/components/common/FormComponents';

const ASSET_TYPE_OPTIONS = [
  { label: 'Photo', value: 'photo' },
  { label: 'Logo', value: 'logo' },
  { label: 'Illustration', value: 'illustration' },
  { label: 'Screenshot', value: 'screenshot' },
  { label: 'Backdrop', value: 'backdrop' },
];

const FONT_TYPE_OPTIONS = [
  { label: 'Font', value: 'font' },
];

const ASSET_EXTENSION_OPTIONS = [
  { label: 'JPEG', value: 'jpeg' },
  { label: 'JPG', value: 'jpg' },
  { label: 'PNG', value: 'png' },
  { label: 'SVG', value: 'svg' },
  { label: 'WebP', value: 'webp' },
  { label: 'GIF', value: 'gif' },
  { label: 'BMP', value: 'bmp' },
  { label: 'TIFF', value: 'tiff' },
];

const FONT_EXTENSION_OPTIONS = [
  { label: 'TTF', value: 'ttf' },
];

const TAB_CONFIG = [
  { key: 'asset', label: 'Asset' },
  { key: 'font', label: 'Font' },
];

function getContentType(type, extension) {
  if (type === 'font' || extension === 'ttf') {
    return 'font/ttf';
  }
  if (extension === 'svg') {
    return 'image/svg+xml';
  }
  if (extension === 'jpg' || extension === 'jpeg') {
    return 'image/jpeg';
  }
  return `image/${extension}`;
}

function getTabFromType(type) {
  return type === 'font' ? 'font' : 'asset';
}

const FilePresignedUrlForm = ({ onSubmit, initialData }) => {
  const initialTab = getTabFromType(initialData?.type);
  const [activeTab, setActiveTab] = useState(initialTab || 'asset');

  const [formData, setFormData] = useState({
    type: initialData?.type || 'photo',
    extension: initialData?.extension || 'jpeg',
    bId: initialData?.bId || '',
    expiresIn: initialData?.expiresIn || 300,
    abstractUserId: initialData?.abstractUserId || '',
  });

  const [errors, setErrors] = useState({});

  const contentType = useMemo(
    () => getContentType(formData.type, formData.extension),
    [formData.type, formData.extension]
  );

  const typeOptions = activeTab === 'asset' ? ASSET_TYPE_OPTIONS : FONT_TYPE_OPTIONS;
  const extensionOptions = activeTab === 'asset' ? ASSET_EXTENSION_OPTIONS : FONT_EXTENSION_OPTIONS;

  const updateField = (path, value) => {
    setFormData((prev) => ({ ...prev, [path]: value }));
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setErrors({});
    if (tabKey === 'asset') {
      setFormData((prev) => ({ ...prev, type: 'photo', extension: 'jpeg' }));
    } else {
      setFormData((prev) => ({ ...prev, type: 'font', extension: 'ttf' }));
    }
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.type) {
      nextErrors.type = 'Type is required';
      message.error('Type is required');
    }
    if (!formData.extension) {
      nextErrors.extension = 'Extension is required';
      message.error('Extension is required');
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      type: formData.type,
      extension: formData.extension,
      contentType,
      ...(formData.bId && { bId: formData.bId }),
      ...(formData.expiresIn && { expiresIn: Number(formData.expiresIn) }),
      ...(formData.abstractUserId && { abstractUserId: formData.abstractUserId }),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="design-form">
      <h3 className="form-section-title">Get Presigned URL</h3>
      <p className="form-hint">Get a presigned upload URL for direct file upload to S3.</p>

      <Tabs tabs={TAB_CONFIG} activeKey={activeTab} onChange={handleTabChange} />

      <div className={errors.type ? 'required-field' : ''}>
        <SelectInput
          label="Type"
          value={formData.type}
          onChange={(v) => {
            updateField('type', v);
            if (errors.type) setErrors((prev) => ({ ...prev, type: undefined }));
          }}
          options={typeOptions}
        />
      </div>

      <div className={errors.extension ? 'required-field' : ''}>
        <SelectInput
          label="Extension"
          value={formData.extension}
          onChange={(v) => {
            updateField('extension', v);
            if (errors.extension) setErrors((prev) => ({ ...prev, extension: undefined }));
          }}
          options={extensionOptions}
        />
      </div>

      <div className="required-field">
        <TextInput
          label="Content Type"
          value={contentType}
          onChange={() => {}}
          placeholder="Auto-computed from type and extension"
          disabled
        />
      </div>

      <TextInput
        label="Brand ID (bId)"
        value={formData.bId}
        onChange={(v) => updateField('bId', v)}
        placeholder="e.g. b_s87vFxpfM0R"
      />

      <NumberInput
        label="Expires In (seconds)"
        value={formData.expiresIn}
        onChange={(v) => updateField('expiresIn', v)}
        placeholder="URL expiry time in seconds"
        min={60}
        max={3600}
      />

      <TextInput
        label="Abstract User ID (optional)"
        value={formData.abstractUserId}
        onChange={(v) => updateField('abstractUserId', v)}
        placeholder="e.g. user_123"
      />

      <button type="submit" className="submit-button">
        Get Presigned URL
      </button>
    </form>
  );
};

export default FilePresignedUrlForm;
