import React, { useState } from 'react';
import { message } from 'antd';
import {
  TextInput,
  SelectInput,
  NumberInput,
} from '~/components/common/FormComponents';

const TYPE_OPTIONS = [
  { label: 'Photo', value: 'photo' },
  { label: 'Logo', value: 'logo' },
  { label: 'Illustration', value: 'illustration' },
  { label: 'Screenshot', value: 'screenshot' },
  { label: 'Backdrop', value: 'backdrop' },
  { label: 'Font', value: 'font' },
];

const EXTENSION_OPTIONS = [
  { label: 'JPEG', value: 'jpeg' },
  { label: 'JPG', value: 'jpg' },
  { label: 'PNG', value: 'png' },
  { label: 'SVG', value: 'svg' },
  { label: 'WebP', value: 'webp' },
  { label: 'GIF', value: 'gif' },
  { label: 'BMP', value: 'bmp' },
  { label: 'TIFF', value: 'tiff' },
  { label: 'TTF', value: 'ttf' },
];

const FilePresignedUrlForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    type: initialData?.type || 'photo',
    extension: initialData?.extension || 'jpeg',
    contentType: initialData?.contentType || 'image/jpeg',
    bId: initialData?.bId || '',
    expiresIn: initialData?.expiresIn || 300,
    abstractUserId: initialData?.abstractUserId || '',
  });

  const [errors, setErrors] = useState({});

  const updateField = (path, value) => {
    setFormData((prev) => ({ ...prev, [path]: value }));
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
    if (!formData.contentType.trim()) {
      nextErrors.contentType = 'Content type is required';
      message.error('Content type is required');
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
      contentType: formData.contentType,
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

      <div className={errors.type ? 'required-field' : ''}>
        <SelectInput
          label="Type"
          value={formData.type}
          onChange={(v) => {
            updateField('type', v);
            if (errors.type) setErrors((prev) => ({ ...prev, type: undefined }));
          }}
          options={TYPE_OPTIONS}
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
          options={EXTENSION_OPTIONS}
        />
      </div>

      <div className={errors.contentType ? 'required-field' : ''}>
        <TextInput
          label="Content Type"
          value={formData.contentType}
          onChange={(v) => {
            updateField('contentType', v);
            if (errors.contentType) setErrors((prev) => ({ ...prev, contentType: undefined }));
          }}
          placeholder="e.g. image/jpeg or font/ttf"
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
