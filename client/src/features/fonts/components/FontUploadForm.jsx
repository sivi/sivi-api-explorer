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
      nextErrors.file = 'Either a font file or an uploaded URL is required';
      message.error('Either a font file or an uploaded URL is required');
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

      <div className={errors.file ? 'required-field' : ''}>
        <label className="form-label">Font File</label>
        <input
          type="file"
          accept=".ttf,.otf,.woff,.woff2,font/*"
          onChange={(e) => {
            const selected = e.target.files?.[0] || null;
            setFile(selected);
            if (selected) {
              setFormData((prev) => ({ ...prev, uploadedURL: '' }));
            }
            if (errors.file) setErrors((prev) => ({ ...prev, file: undefined }));
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
        label="Uploaded URL (optional)"
        value={formData.uploadedURL}
        onChange={(v) => {
          updateField('uploadedURL', v);
          if (errors.file) setErrors((prev) => ({ ...prev, file: undefined }));
        }}
        placeholder="Or paste an already-uploaded S3 URL"
      />

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
