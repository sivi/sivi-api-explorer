import React, { useState } from 'react';
import { message } from 'antd';
import { TextInput } from '../../../components/common/FormComponents';
import '../../../components/common/FormComponents.css';

const BrandExtractForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    brandUrl: initialData?.brandUrl || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.brandUrl.trim()) {
      message.error('Website URL is required');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="design-form">
      <h3 className="form-section-title">Extract Brand</h3>
      <p className="form-hint">
        Provide a website URL to automatically extract brand assets, colors,
        fonts, and persona details.
      </p>
      <div className="required-field">
        <TextInput
          label="Website URL"
          value={formData.brandUrl}
          onChange={(v) => setFormData((prev) => ({ ...prev, brandUrl: v }))}
          placeholder="https://example.com"
          type="url"
        />
      </div>
      <button type="submit" className="submit-button">
        Extract Brand
      </button>
    </form>
  );
};

export default BrandExtractForm;
