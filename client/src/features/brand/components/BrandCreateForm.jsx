import React, { useState } from 'react';
import { message } from 'antd';
import {
  TextInput,
  TextAreaInput,
  ColorInput,
} from '~/components/common/FormComponents';

const parseList = (str) => str.split(',').map((s) => s.trim()).filter(Boolean);

const BrandCreateForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    brandName: initialData?.brandName || '',
    brandDescription: initialData?.brandDescription || '',
    brandUrl: initialData?.brandUrl || '',
    brandLogo: initialData?.brandLogo || '',
    brandColors: initialData?.brandColors || ['#5662EC'],
    brandFonts: initialData?.brandFonts || [],
    brandPersona: {
      emotions: initialData?.brandPersona?.emotions || [],
      industry: initialData?.brandPersona?.industry || '',
      audience: initialData?.brandPersona?.audience || [],
      designTags: initialData?.brandPersona?.designTags || [],
    },
    abstractUserId: initialData?.abstractUserId || '',
  });

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
    if (!formData.brandName.trim()) {
      nextErrors.brandName = 'Brand name is required';
    }
    if (!formData.brandDescription.trim()) {
      nextErrors.brandDescription = 'Brand description is required';
    }
    if (Object.keys(nextErrors).length > 0) {
      message.error('Please fill in all required fields');
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      brandName: formData.brandName,
      ...(formData.brandDescription && { brandDescription: formData.brandDescription }),
      ...(formData.brandUrl && { brandUrl: formData.brandUrl }),
      ...(formData.brandLogo && { brandLogo: formData.brandLogo }),
      brandColors: formData.brandColors,
      brandFonts: formData.brandFonts,
      brandPersona: {
        ...(formData.brandPersona.emotions.length > 0 && { emotions: formData.brandPersona.emotions }),
        ...(formData.brandPersona.industry && { industry: formData.brandPersona.industry }),
        ...(formData.brandPersona.audience.length > 0 && { audience: formData.brandPersona.audience }),
        ...(formData.brandPersona.designTags.length > 0 && { designTags: formData.brandPersona.designTags }),
      },
      ...(formData.abstractUserId && { abstractUserId: formData.abstractUserId }),
    };

    // Remove empty brandPersona if all fields are empty
    if (Object.keys(payload.brandPersona).length === 0) {
      delete payload.brandPersona;
    }

    onSubmit(payload);
  };

  const addColor = () => {
    setFormData((prev) => ({ ...prev, brandColors: [...prev.brandColors, '#000000'] }));
  };

  const updateColor = (index, value) => {
    const next = [...formData.brandColors];
    next[index] = value;
    setFormData((prev) => ({ ...prev, brandColors: next }));
  };

  const removeColor = (index) => {
    setFormData((prev) => ({ ...prev, brandColors: prev.brandColors.filter((_, i) => i !== index) }));
  };

  return (
    <form onSubmit={handleSubmit} className="design-form">
      <h3 className="form-section-title">Create Brand</h3>
      <p className="form-hint">Create a new brand identity for your workspace.</p>

      <div className={errors.brandName ? 'required-field' : ''}>
        <TextInput
          label="Brand Name"
          value={formData.brandName}
          onChange={(v) => {
            updateField('brandName', v);
            if (errors.brandName) setErrors((prev) => ({ ...prev, brandName: undefined }));
          }}
          placeholder="e.g. Sivi"
        />
      </div>

      <div className={errors.brandDescription ? 'required-field' : ''}>
        <TextAreaInput
          label="Brand Description"
          value={formData.brandDescription}
          onChange={(v) => {
            updateField('brandDescription', v);
            if (errors.brandDescription) setErrors((prev) => ({ ...prev, brandDescription: undefined }));
          }}
          placeholder="Brief brand description"
          rows={3}
        />
      </div>
      <TextInput
        label="Brand Website URL"
        value={formData.brandUrl}
        onChange={(v) => updateField('brandUrl', v)}
        placeholder="https://example.com"
        type="url"
      />
      <TextInput
        label="Brand Logo URL"
        value={formData.brandLogo}
        onChange={(v) => updateField('brandLogo', v)}
        placeholder="https://example.com/logo.png"
        type="url"
      />

      <div className="form-field">
        <label className="form-label">Brand Colors</label>
        <div className="color-list">
          {formData.brandColors.map((color, index) => (
            <div key={index} className="color-list-item">
              <ColorInput label="" value={color} onChange={(v) => updateColor(index, v)} />
              {formData.brandColors.length > 1 && (
                <button type="button" className="remove-button" onClick={() => removeColor(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" className="add-button" onClick={addColor}>
            Add Color
          </button>
        </div>
      </div>

      <TextInput
        label="Brand Fonts (comma-separated)"
        value={formData.brandFonts.join(', ')}
        onChange={(v) => updateField('brandFonts', parseList(v))}
        placeholder="e.g. Inter, Roboto"
      />

      <h3 className="form-section-title">Brand Persona</h3>
      <TextInput
        label="Industry"
        value={formData.brandPersona.industry}
        onChange={(v) => updateField('brandPersona.industry', v)}
        placeholder="e.g. technology, retail, finance"
      />
      <TextInput
        label="Emotions (comma-separated)"
        value={formData.brandPersona.emotions.join(', ')}
        onChange={(v) => updateField('brandPersona.emotions', parseList(v))}
        placeholder="e.g. happy, excited, innovative"
      />
      <TextInput
        label="Audience (comma-separated)"
        value={formData.brandPersona.audience.join(', ')}
        onChange={(v) => updateField('brandPersona.audience', parseList(v))}
        placeholder="e.g. working mom, working dad"
      />
      <TextInput
        label="Design Tags (comma-separated)"
        value={formData.brandPersona.designTags.join(', ')}
        onChange={(v) => updateField('brandPersona.designTags', parseList(v))}
        placeholder="e.g. minimal, productivity, health"
      />

      <TextInput
        label="Abstract User ID (optional)"
        value={formData.abstractUserId}
        onChange={(v) => updateField('abstractUserId', v)}
        placeholder="e.g. user_123"
      />

      <button type="submit" className="submit-button">
        Create Brand
      </button>
    </form>
  );
};

export default BrandCreateForm;
