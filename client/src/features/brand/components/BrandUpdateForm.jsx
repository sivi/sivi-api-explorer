import React, { useState } from 'react';
import { message } from 'antd';
import {
  TextInput,
  TextAreaInput,
  ColorInput,
} from '~/components/common/FormComponents';
import { brandApi } from '~/api/brand.js';

const normalizeColor = (color) => {
  if (typeof color === 'string') return color;
  if (color && typeof color === 'object') {
    return color.primary || color.color || color.hex || '#000000';
  }
  return String(color);
};

const formatList = (value) => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map((item) => (typeof item === 'string' ? item : (item?.name || item?.id || String(item)))).filter(Boolean).join(', ');
  return '';
};

const parseList = (str) => str.split(',').map((s) => s.trim()).filter(Boolean);

const BrandUpdateForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    bId: initialData?.bId || '',
    brandName: initialData?.brandName || '',
    brandDescription: initialData?.brandDescription || '',
    brandUrl: initialData?.brandUrl || '',
    brandLogo: initialData?.brandLogo || '',
    brandColors: initialData?.brandColors?.map(normalizeColor) || [],
    brandFonts: formatList(initialData?.brandFonts),
    brandPersona: {
      emotions: formatList(initialData?.brandPersona?.emotions),
      industry: initialData?.brandPersona?.industry || '',
      audience: formatList(initialData?.brandPersona?.audience),
      designTags: formatList(initialData?.brandPersona?.designTags),
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

  const [isFetching, setIsFetching] = useState(false);

  const handleFetchBrand = async () => {
    if (!formData.bId.trim()) {
      message.error('Brand ID is required');
      return;
    }
    setIsFetching(true);
    try {
      const response = await brandApi.getBrands({ bId: formData.bId.trim() });
      const body = response.body ?? response;
      const result = body?.result ?? body;
      const brand = result?.brand ?? result?.brands?.[0];
      if (!brand) {
        message.error('Brand not found');
        return;
      }
      setFormData({
        bId: brand.bId || brand.brandId || formData.bId,
        brandName: brand.brandName || brand.name || '',
        brandDescription: brand.brandDescription || brand.description || '',
        brandUrl: brand.brandUrl || '',
        brandLogo: brand.brandLogo || (brand.brandLogos?.[0]) || (brand.logos?.[0]) || '',
        brandColors: (brand.brandColors || brand.colors || []).map(normalizeColor),
        brandFonts: formatList(brand.brandFonts || brand.fonts || []),
        brandPersona: {
          emotions: formatList(brand.brandPersona?.emotions || brand.persona?.emotions || []),
          industry: brand.brandPersona?.industry || brand.persona?.industry || '',
          audience: formatList(brand.brandPersona?.audience || brand.persona?.audience || []),
          designTags: formatList(brand.brandPersona?.designTags || brand.persona?.designTags || []),
        },
        imageGenPreference: { model: brand.imageGenPreference?.model || '' },
        textGenPreference: { model: brand.textGenPreference?.model || '' },
        genModePreference: {
          compose: {
            type: brand.genModePreference?.compose?.type || '',
            model: brand.genModePreference?.compose?.model || '',
            sizeType: brand.genModePreference?.compose?.sizeType || '',
          },
        },
        abstractUserId: brand.abstractUserId || '',
      });
      message.success('Brand details loaded');
    } catch (err) {
      message.error(`Failed to fetch brand: ${err.message}`);
    } finally {
      setIsFetching(false);
    }
  };

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
    if (formData.brandFonts.trim()) payload.brandFonts = parseList(formData.brandFonts);

    const persona = {};
    if (parseList(formData.brandPersona.emotions).length) persona.emotions = parseList(formData.brandPersona.emotions);
    if (formData.brandPersona.industry) persona.industry = formData.brandPersona.industry;
    if (parseList(formData.brandPersona.audience).length) persona.audience = parseList(formData.brandPersona.audience);
    if (parseList(formData.brandPersona.designTags).length) persona.designTags = parseList(formData.brandPersona.designTags);
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
        <button
          type="button"
          className="add-button"
          onClick={handleFetchBrand}
          disabled={isFetching}
          style={{ marginTop: 8 }}
        >
          {isFetching ? 'Fetching...' : 'Fetch Brand'}
        </button>
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
              <button
                type="button"
                className="color-remove"
                onClick={() => removeColor(index)}
                title="Remove color"
              >
                ×
              </button>
            </div>
          ))}
          <button type="button" className="add-button" onClick={addColor}>
            Add Color
          </button>
        </div>
      </div>

      <TextInput
        label="Brand Fonts (comma-separated)"
        value={formData.brandFonts}
        onChange={(v) => setFormData((prev) => ({ ...prev, brandFonts: v }))}
        placeholder="e.g. Inter, Roboto"
      />
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
        value={formData.brandPersona.emotions}
        onChange={(v) =>
          setFormData((prev) => ({
            ...prev,
            brandPersona: { ...prev.brandPersona, emotions: v },
          }))
        }
        placeholder="e.g. excited, happy"
      />
      <TextInput
        label="Audience (comma-separated)"
        value={formData.brandPersona.audience}
        onChange={(v) =>
          setFormData((prev) => ({
            ...prev,
            brandPersona: { ...prev.brandPersona, audience: v },
          }))
        }
        placeholder="e.g. tech enthusiasts, working moms"
      />
      <TextInput
        label="Design Tags (comma-separated)"
        value={formData.brandPersona.designTags}
        onChange={(v) =>
          setFormData((prev) => ({
            ...prev,
            brandPersona: { ...prev.brandPersona, designTags: v },
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
