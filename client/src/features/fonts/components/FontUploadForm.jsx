import React, { useState } from 'react';
import { message } from 'antd';
import {
  TextInput,
} from '~/components/common/FormComponents';

const FontUploadForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    uploadedURL: initialData?.uploadedURL || '',
    abstractUserId: initialData?.abstractUserId || '',
  });

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const updateField = (path, value) => {
    setFormData((prev) => ({ ...prev, [path]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!file && !formData.uploadedURL.trim()) {
      nextErrors.uploadedURL = 'Upload URL is required when no font file is selected';
      message.error('Upload URL is required when no font file is selected');
    }
    if (formData.uploadedURL.trim()) {
      try {
        const url = new URL(formData.uploadedURL.trim());
        if (!['http:', 'https:'].includes(url.protocol)) {
          throw new Error('Invalid protocol');
        }
      } catch {
        nextErrors.uploadedURL = 'Please enter a valid HTTP/HTTPS URL';
        message.error('Please enter a valid HTTP/HTTPS URL');
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...(file && { file }),
      ...(formData.uploadedURL && { uploadedURL: formData.uploadedURL }),
      ...(formData.abstractUserId && { abstractUserId: formData.abstractUserId }),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="design-form">
      <h3 className="form-section-title">Upload Fonts</h3>
      <p className="form-hint">
        Upload a custom font file. The app will get a presigned URL, upload to S3, then process the font.
      </p>

      <div className={`form-field ${errors.uploadedURL ? 'required-field' : ''}`}>
        <label className="form-label">Font File</label>
        <input
          type="file"
          accept=".ttf,.otf,.woff,.woff2,font/*"
          onChange={(e) => {
            const selected = e.target.files?.[0] || null;
            setFile(selected);
            if (errors.uploadedURL) setErrors((prev) => ({ ...prev, uploadedURL: undefined }));
          }}
          className="file-input"
        />
        {file && (
          <p className="form-hint" style={{ marginTop: 4 }}>
            Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </p>
        )}
      </div>

      <div className={'required-field'}>
        <TextInput
          label="Upload URL"
          value={formData.uploadedURL}
          onChange={(v) => {
            updateField('uploadedURL', v);
            if (errors.uploadedURL) setErrors((prev) => ({ ...prev, uploadedURL: undefined }));
          }}
          placeholder="Paste an already-uploaded S3 URL"
        />
      </div>

      <TextInput
        label="Abstract User ID (optional)"
        value={formData.abstractUserId}
        onChange={(v) => updateField('abstractUserId', v)}
        placeholder="e.g. user_123"
      />

      <button type="submit" className="submit-button">
        Upload Fonts
      </button>
    </form>
  );
};

export default FontUploadForm;
