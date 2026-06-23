import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import {
  TextAreaInput,
  SelectInput,
  NumberInput,
  Tabs,
} from '~/components/common/FormComponents';
import {
  designTypes,
  getSubtypesForType,
  getDimensionsForSubtype,
  requiresCustomDimensions,
} from '~/features/designs/data/designTypes';

const SIVI_MIN_DIMENSION = 150;
const SIVI_MAX_DIMENSION = 2000;

const ContentFromPromptForm = ({ onSubmit, initialData }) => {
  const defaultFormData = {
    dimensionMode: 'standard',
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
    if (formData.dimensionMode === 'standard' && !requiresCustomDimensions(formData.type, formData.subtype)) {
      const dims = getDimensionsForSubtype(formData.type, formData.subtype);
      if (dims && dims.width && dims.height) {
        setFormData((prev) => ({
          ...prev,
          dimension: { width: dims.width, height: dims.height },
        }));
      }
    }
  }, [formData.type, formData.subtype, formData.dimensionMode]);

  const handleDimensionModeChange = (mode) => {
    if (mode === 'standard') {
      const subtypes = getSubtypesForType('displayAds');
      const firstSubtype = Object.keys(subtypes)[0] || '';
      const dims = getDimensionsForSubtype('displayAds', firstSubtype);
      setFormData((prev) => ({
        ...prev,
        dimensionMode: 'standard',
        type: 'displayAds',
        subtype: firstSubtype,
        dimension: dims ? { width: dims.width, height: dims.height } : { width: 300, height: 600 },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        dimensionMode: 'custom',
        type: 'custom',
        subtype: 'custom',
        dimension: { width: 600, height: 600 },
      }));
    }
  };

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
    if (formData.dimensionMode === 'custom') {
      const w = formData.dimension.width;
      const h = formData.dimension.height;
      if (!w || w < SIVI_MIN_DIMENSION || w > SIVI_MAX_DIMENSION) {
        message.error(`Width must be between ${SIVI_MIN_DIMENSION} and ${SIVI_MAX_DIMENSION}`);
        return;
      }
      if (!h || h < SIVI_MIN_DIMENSION || h > SIVI_MAX_DIMENSION) {
        message.error(`Height must be between ${SIVI_MIN_DIMENSION} and ${SIVI_MAX_DIMENSION}`);
        return;
      }
    }
    onSubmit(formData);
  };

  const typeOptions = Object.entries(designTypes)
    .filter(([key]) => key !== 'custom')
    .map(([key, type]) => ({
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

      <Tabs
        tabs={[
          { key: 'standard', label: 'Standard' },
          { key: 'custom', label: 'Custom' },
        ]}
        activeKey={formData.dimensionMode}
        onChange={handleDimensionModeChange}
      />
      {formData.dimensionMode === 'standard' && (
        <>
          <div className="required-field">
            <SelectInput
              label="Type"
              value={formData.type}
              onChange={handleTypeChange}
              options={typeOptions}
            />
          </div>
          <div className="required-field">
            <SelectInput
              label="Subtype"
              value={formData.subtype}
              onChange={(v) => setFormData((prev) => ({ ...prev, subtype: v }))}
              options={subtypeOptions}
            />
          </div>
        </>
      )}
      {formData.dimensionMode === 'custom' && (
        <div className="dimension-row">
          <div className="required-field">
            <NumberInput
              label="Width"
              value={formData.dimension.width}
              onChange={(v) => setFormData((prev) => ({ ...prev, dimension: { ...prev.dimension, width: v } }))}
              min={SIVI_MIN_DIMENSION}
              max={SIVI_MAX_DIMENSION}
            />
          </div>
          <div className="required-field">
            <NumberInput
              label="Height"
              value={formData.dimension.height}
              onChange={(v) => setFormData((prev) => ({ ...prev, dimension: { ...prev.dimension, height: v } }))}
              min={SIVI_MIN_DIMENSION}
              max={SIVI_MAX_DIMENSION}
            />
          </div>
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
