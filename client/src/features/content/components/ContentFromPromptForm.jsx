import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import {
  TextAreaInput,
  SelectInput,
} from '../../../components/common/FormComponents';
import '../../../components/common/FormComponents.css';
import {
  designTypes,
  getSubtypesForType,
  getDimensionsForSubtype,
  requiresCustomDimensions,
} from '../../designs/data/designTypes';

const ContentFromPromptForm = ({ onSubmit, initialData }) => {
  const defaultFormData = {
    type: 'displayAds',
    subtype: 'displayAds-half-page-ad',
    dimension: { width: 300, height: 600 },
    prompt: '',
    language: 'english',
  };

  const [formData, setFormData] = useState(initialData || defaultFormData);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  useEffect(() => {
    if (!requiresCustomDimensions(formData.type, formData.subtype)) {
      const dims = getDimensionsForSubtype(formData.type, formData.subtype);
      if (dims && dims.width && dims.height) {
        setFormData((prev) => ({
          ...prev,
          dimension: { width: dims.width, height: dims.height },
        }));
      }
    }
  }, [formData.type, formData.subtype]);

  const handleTypeChange = (type) => {
    const subtypes = getSubtypesForType(type);
    const firstSubtype = Object.keys(subtypes)[0] || '';
    const dims = getDimensionsForSubtype(type, firstSubtype);
    setFormData((prev) => ({
      ...prev,
      type,
      subtype: firstSubtype,
      dimension: dims ? { width: dims.width, height: dims.height } : prev.dimension,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.prompt.trim()) {
      message.error('Prompt is required');
      return;
    }
    onSubmit(formData);
  };

  const typeOptions = Object.entries(designTypes).map(([key, type]) => ({
    value: key,
    label: type.label,
  }));

  const subtypeOptions = Object.entries(
    getSubtypesForType(formData.type)
  ).map(([key, subtype]) => ({ value: key, label: subtype.label }));

  return (
    <form onSubmit={handleSubmit} className="design-form">
      <h3 className="form-section-title">Content from Prompt</h3>
      <p className="form-hint">
        Provide a design context and prompt to generate content (headlines,
        descriptions, etc.) for that design.
      </p>

      <SelectInput
        label="Type"
        value={formData.type}
        onChange={handleTypeChange}
        options={typeOptions}
      />
      <SelectInput
        label="Subtype"
        value={formData.subtype}
        onChange={(v) => setFormData((prev) => ({ ...prev, subtype: v }))}
        options={subtypeOptions}
      />
      {requiresCustomDimensions(formData.type, formData.subtype) && (
        <div className="dimension-row">
          <label className="form-label">Width</label>
          <input
            type="number"
            className="form-input"
            value={formData.dimension.width}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                dimension: { ...prev.dimension, width: Number(e.target.value) },
              }))
            }
          />
          <label className="form-label">Height</label>
          <input
            type="number"
            className="form-input"
            value={formData.dimension.height}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                dimension: { ...prev.dimension, height: Number(e.target.value) },
              }))
            }
          />
        </div>
      )}
      <div className="required-field">
        <TextAreaInput
          label="Prompt"
          value={formData.prompt}
          onChange={(v) => setFormData((prev) => ({ ...prev, prompt: v }))}
          placeholder="e.g. generate a design for my t-shirt shop for summer campaign with 20% off"
          rows={4}
        />
      </div>
      <SelectInput
        label="Language"
        value={formData.language}
        onChange={(v) => setFormData((prev) => ({ ...prev, language: v }))}
        options={[
          { value: 'english', label: 'English' },
          { value: 'spanish', label: 'Spanish' },
          { value: 'french', label: 'French' },
          { value: 'german', label: 'German' },
        ]}
      />
      <button type="submit" className="submit-button">
        Generate Content
      </button>
    </form>
  );
};

export default ContentFromPromptForm;
