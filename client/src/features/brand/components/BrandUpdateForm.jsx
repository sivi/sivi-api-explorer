import React, { useState } from 'react';
import { message } from 'antd';
import {
  TextInput,
  TextAreaInput,
  ColorInput,
} from '~/components/common/FormComponents';

const BrandUpdateForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    bId: initialData?.bId || '',
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
    imageGenPreference: { model: initialData?.imageGenPreference?.model || '' },
    textGenPreference: { model: initialData?.textGenPreference?.model || '' },
    genModePreference: {
      compose: {
        type: initialData?.genModePreference?.compose?.type || '',
        model: initialData?.genModePreference?.compose?.model || '',
        sizeType: initialData?.genModePreference?.compose?.sizeType || '',
      },
    },
    abstractUserId: initialData?.abstractUserId || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.bId.trim()) {
      message.error('Brand ID is required');
      return;
    }

    const payload = { bId: formData.bId };
    if (formData.brandName.trim()) payload.brandName = formData.brandName.trim();
    if (formData.brandDescription.trim()) payload.brandDescription = formData.brandDescription.trim();
    if (formData.brandUrl.trim()) payload.brandUrl = formData.brandUrl.trim();
    if (formData.brandLogo.trim()) payload.brandLogo = formData.brandLogo.trim();
    if (formData.brandColors.length) payload.brandColors = formData.brandColors;
    if (formData.brandFonts.length) payload.brandFonts = formData.brandFonts;

    const persona = {};
    if (formData.brandPersona.emotions.length) persona.emotions = formData.brandPersona.emotions;
    if (formData.brandPersona.industry) persona.industry = formData.brandPersona.industry;
    if (formData.brandPersona.audience.length) persona.audience = formData.brandPersona.audience;
    if (formData.brandPersona.designTags.length) persona.designTags = formData.brandPersona.designTags;
    if (Object.keys(persona).length) payload.brandPersona = persona;

    if (formData.imageGenPreference.model.trim()) {
      payload.imageGenPreference = { model: formData.imageGenPreference.model.trim() };
    }
    if (formData.textGenPreference.model.trim()) {
      payload.textGenPreference = { model: formData.textGenPreference.model.trim() };
    }
    if (formData.genModePreference.compose.type.trim() || formData.genModePreference.compose.model.trim()) {
      payload.genModePreference = {
        compose: {
          ...(formData.genModePreference.compose.type && { type: formData.genModePreference.compose.type }),
          ...(formData.genModePreference.compose.model && { model: formData.genModePreference.compose.model }),
          ...(formData.genModePreference.compose.sizeType && { sizeType: formData.genModePreference.compose.sizeType }),
        },
      };
    }
    if (formData.abstractUserId.trim()) payload.abstractUserId = formData.abstractUserId.trim();

    onSubmit(payload);
  };

  const updateColor = (index, value) => {
    const newColors = [...formData.brandColors];
    newColors[index] = value;
    setFormData((prev) => ({ ...prev, brandColors: newColors }));
  };

  const addColor = () => {
    setFormData((prev) => ({ ...prev, brandColors: [...prev.brandColors, '#000000'] }));
  };

  const removeColor = (index) => {
    setFormData((prev) => ({
      ...prev,
      brandColors: prev.brandColors.filter((_, i) => i !== index),
    }));
  };

  const parseList = (str) => str.split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <form onSubmit={handleSubmit} className="design-form">
      <h3 className="form-section-title">Update Brand</h3>
      <p className="form-hint">Update an existing brand identity.</p>

      <div className="required-field">
        <TextInput
          label="Brand ID"
          value={formData.bId}
          onChange={(v) => setFormData((prev) => ({ ...prev, bId: v }))}
          placeholder="e.g. b_s87vFxpfM0R"
        />
      </div>
      <TextInput
        label="Brand Name"
        value={formData.brandName}
        onChange={(v) => setFormData((prev) => ({ ...prev, brandName: v }))}
        placeholder="e.g. Sivi"
      />
      <TextAreaInput
        label="Brand Description"
        value={formData.brandDescription}
        onChange={(v) => setFormData((prev) => ({ ...prev, brandDescription: v }))}
        placeholder="Brief brand description"
        rows={3}
      />
      <TextInput
        label="Brand Website URL"
        value={formData.brandUrl}
        onChange={(v) => setFormData((prev) => ({ ...prev, brandUrl: v }))}
        placeholder="https://example.com"
        type="url"
      />
      <TextInput
        label="Brand Logo URL"
        value={formData.brandLogo}
        onChange={(v) => setFormData((prev) => ({ ...prev, brandLogo: v }))}
        placeholder="https://example.com/logo.png"
        type="url"
      />

      <div className="form-field">
        <label className="form-label">Brand Colors</label>
        <div className="color-list">
          {formData.brandColors.map((color, index) => (
            <div key={index} className="color-list-item">
              <ColorInput
                label={``}
                value={color}
                onChange={(v) => updateColor(index, v)}
              />
              {formData.brandColors.length > 1 && (
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeColor(index)}
                >
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
        label="Industry"
        value={formData.brandPersona.industry}
        onChange={(v) =>
          setFormData((prev) => ({
            ...prev,
            brandPersona: { ...prev.brandPersona, industry: v },
          }))
        }
        placeholder="e.g. technology, retail"
      />
      <TextInput
        label="Emotions (comma-separated)"
        value={formData.brandPersona.emotions.join(', ')}
        onChange={(v) =>
          setFormData((prev) => ({
            ...prev,
            brandPersona: { ...prev.brandPersona, emotions: parseList(v) },
          }))
        }
        placeholder="e.g. excited, happy"
      />
      <TextInput
        label="Audience (comma-separated)"
        value={formData.brandPersona.audience.join(', ')}
        onChange={(v) =>
          setFormData((prev) => ({
            ...prev,
            brandPersona: { ...prev.brandPersona, audience: parseList(v) },
          }))
        }
        placeholder="e.g. tech enthusiasts, working moms"
      />
      <TextInput
        label="Design Tags (comma-separated)"
        value={formData.brandPersona.designTags.join(', ')}
        onChange={(v) =>
          setFormData((prev) => ({
            ...prev,
            brandPersona: { ...prev.brandPersona, designTags: parseList(v) },
          }))
        }
        placeholder="e.g. minimal, innovative"
      />

      <h3 className="form-section-title">Generation Preferences</h3>
      <TextInput
        label="Image Generation Model"
        value={formData.imageGenPreference.model}
        onChange={(v) =>
          setFormData((prev) => ({
            ...prev,
            imageGenPreference: { ...prev.imageGenPreference, model: v },
          }))
        }
        placeholder="e.g. flux-1.1-pro"
      />
      <TextInput
        label="Text Generation Model"
        value={formData.textGenPreference.model}
        onChange={(v) =>
          setFormData((prev) => ({
            ...prev,
            textGenPreference: { ...prev.textGenPreference, model: v },
          }))
        }
        placeholder="e.g. gpt-4o"
      />
      <TextInput
        label="Gen Mode Compose Type"
        value={formData.genModePreference.compose.type}
        onChange={(v) =>
          setFormData((prev) => ({
            ...prev,
            genModePreference: {
              ...prev.genModePreference,
              compose: { ...prev.genModePreference.compose, type: v },
            },
          }))
        }
        placeholder="e.g. design"
      />
      <TextInput
        label="Gen Mode Compose Model"
        value={formData.genModePreference.compose.model}
        onChange={(v) =>
          setFormData((prev) => ({
            ...prev,
            genModePreference: {
              ...prev.genModePreference,
              compose: { ...prev.genModePreference.compose, model: v },
            },
          }))
        }
        placeholder="e.g. auto"
      />
      <TextInput
        label="Gen Mode Compose Size Type"
        value={formData.genModePreference.compose.sizeType}
        onChange={(v) =>
          setFormData((prev) => ({
            ...prev,
            genModePreference: {
              ...prev.genModePreference,
              compose: { ...prev.genModePreference.compose, sizeType: v },
            },
          }))
        }
        placeholder="e.g. instagram-post"
      />

      <TextInput
        label="Abstract User ID (optional)"
        value={formData.abstractUserId}
        onChange={(v) => setFormData((prev) => ({ ...prev, abstractUserId: v }))}
        placeholder="e.g. user_123"
      />

      <button type="submit" className="submit-button">
        Update Brand
      </button>
    </form>
  );
};

export default BrandUpdateForm;
