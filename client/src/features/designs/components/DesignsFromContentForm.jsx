import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import '../../../components/common/FormComponents.css';
import {
  TextInput,
  TextAreaInput,
  NumberInput,
  SelectInput,
  ColorInput,
  UrlInput
} from '../../../components/common/FormComponents';
import { designTypes, getSubtypesForType, getDimensionsForSubtype, requiresCustomDimensions } from '../data/designTypes';

const DesignsFromContentForm = ({ onSubmit, initialData }) => {
  const defaultFormData = {
    type: 'displayAds',
    subtype: 'displayAds-half-page-ad',
    dimension: { width: 300, height: 600 },
    content: {
      headline: '',
      description: '',
      cta: '',
      tagline: ''
    },
    language: 'english',
    numOfVariants: 4,
    outputFormat: ['jpg'],
    assets: {
      images: [],
      logos: []
    },
    settings: {
      mode: 'custom',
      colorsPreference: {
        mode: 'custom',
        customColors: [],
        paletteStyle: []
      },
      fontGroupPreference: {
        mode: 'custom',
        fontGroups: []
      },
      theme: [],
      frameStyle: [],
      backdropStyle: [],
      focus: [],
      imageStyle: [],
    }
  };

  const [formData, setFormData] = useState(initialData || defaultFormData);
  const [availableSubtypes, setAvailableSubtypes] = useState({});

  useEffect(() => {
    setAvailableSubtypes(getSubtypesForType(formData.type));
  }, [formData.type]);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  useEffect(() => {
    if (!requiresCustomDimensions(formData.type, formData.subtype)) {
      const dims = getDimensionsForSubtype(formData.type, formData.subtype);
      if (dims && dims.width && dims.height) {
        setFormData(prev => ({
          ...prev,
          dimension: { width: dims.width, height: dims.height }
        }));
      }
    }
  }, [formData.type, formData.subtype]);

  const handleTypeChange = (type) => {
    const subtypes = getSubtypesForType(type);
    const firstSubtype = Object.keys(subtypes)[0] || '';
    const dims = getDimensionsForSubtype(type, firstSubtype);
    setFormData(prev => ({
      ...prev,
      type,
      subtype: firstSubtype,
      dimension: dims ? { width: dims.width, height: dims.height } : prev.dimension
    }));
  };

  const handleContentChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      content: { ...prev.content, [field]: value }
    }));
  };

  const handleColorChange = (index, value) => {
    const newColors = [...formData.settings.colorsPreference.customColors];
    newColors[index] = value;
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        colorsPreference: { ...prev.settings.colorsPreference, customColors: newColors }
      }
    }));
  };

  const addColor = () => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        colorsPreference: {
          ...prev.settings.colorsPreference,
          customColors: [...prev.settings.colorsPreference.customColors, '#000000']
        }
      }
    }));
  };

  const removeColor = (index) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        colorsPreference: {
          ...prev.settings.colorsPreference,
          customColors: prev.settings.colorsPreference.customColors.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const handleLogoChange = (index, value) => {
    const newLogos = [...formData.assets.logos];
    newLogos[index] = value;
    setFormData(prev => ({ ...prev, assets: { ...prev.assets, logos: newLogos } }));
  };

  const addLogo = () => {
    setFormData(prev => ({
      ...prev,
      assets: { ...prev.assets, logos: [...prev.assets.logos, ''] }
    }));
  };

  const removeLogo = (index) => {
    setFormData(prev => ({
      ...prev,
      assets: { ...prev.assets, logos: prev.assets.logos.filter((_, i) => i !== index) }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasContent = formData.content.headline.trim() || formData.content.description.trim() || formData.content.cta.trim() || formData.content.tagline.trim();
    if (!hasContent) {
      message.error('At least one content field (Headline, Description, CTA, or Tagline) is required');
      return;
    }
    onSubmit(formData);
  };

  const typeOptions = Object.entries(designTypes).map(([key, type]) => ({ value: key, label: type.label }));
  const subtypeOptions = Object.entries(availableSubtypes).map(([key, subtype]) => ({ value: key, label: subtype.label }));

  return (
    <form onSubmit={handleSubmit} className="design-form">
      <h3 className="form-section-title">Design Settings</h3>
      <SelectInput
        label="Type"
        value={formData.type}
        onChange={handleTypeChange}
        options={typeOptions}
      />
      <SelectInput
        label="Subtype"
        value={formData.subtype}
        onChange={(v) => setFormData(prev => ({ ...prev, subtype: v }))}
        options={subtypeOptions}
      />
      <div className="dimension-row">
        <NumberInput
          label="Width"
          value={formData.dimension.width}
          onChange={(v) => setFormData(prev => ({ ...prev, dimension: { ...prev.dimension, width: v } }))}
        />
        <NumberInput
          label="Height"
          value={formData.dimension.height}
          onChange={(v) => setFormData(prev => ({ ...prev, dimension: { ...prev.dimension, height: v } }))}
        />
      </div>

      <h3 className="form-section-title">Content</h3>
      <TextInput
        label="Headline"
        value={formData.content.headline}
        onChange={(v) => handleContentChange('headline', v)}
        placeholder="Enter headline"
      />
      <TextAreaInput
        label="Description"
        value={formData.content.description}
        onChange={(v) => handleContentChange('description', v)}
        placeholder="Enter description"
        rows={3}
      />
      <TextInput
        label="CTA"
        value={formData.content.cta}
        onChange={(v) => handleContentChange('cta', v)}
        placeholder="e.g. Shop Now"
      />
      <TextInput
        label="Tagline"
        value={formData.content.tagline}
        onChange={(v) => handleContentChange('tagline', v)}
        placeholder="Enter tagline"
      />

      <h3 className="form-section-title">Preferences</h3>
      <SelectInput
        label="Language"
        value={formData.language}
        onChange={(v) => setFormData(prev => ({ ...prev, language: v }))}
        options={[
          { value: 'english', label: 'English' },
          { value: 'spanish', label: 'Spanish' },
          { value: 'french', label: 'French' },
          { value: 'german', label: 'German' },
        ]}
      />
      <NumberInput
        label="Number of Variants"
        value={formData.numOfVariants}
        onChange={(v) => setFormData(prev => ({ ...prev, numOfVariants: v }))}
        min={1}
        max={10}
      />

      <h3 className="form-section-title">Colors</h3>
      {formData.settings.colorsPreference.customColors.map((color, index) => (
        <div key={index} className="color-row">
          <ColorInput
            label={`Color ${index + 1}`}
            value={color}
            onChange={(v) => handleColorChange(index, v)}
          />
          <button type="button" className="remove-btn" onClick={() => removeColor(index)}>Remove</button>
        </div>
      ))}
      <button type="button" className="add-btn" onClick={addColor}>Add Color</button>

      <h3 className="form-section-title">Logos</h3>
      {formData.assets.logos.map((logo, index) => (
        <div key={index} className="logo-row">
          <UrlInput
            label={`Logo URL ${index + 1}`}
            value={logo}
            onChange={(v) => handleLogoChange(index, v)}
            placeholder="https://example.com/logo.png"
          />
          <button type="button" className="remove-btn" onClick={() => removeLogo(index)}>Remove</button>
        </div>
      ))}
      <button type="button" className="add-btn" onClick={addLogo}>Add Logo</button>

      <button type="submit" className="submit-button">Generate Designs</button>
    </form>
  );
};

export default DesignsFromContentForm;
