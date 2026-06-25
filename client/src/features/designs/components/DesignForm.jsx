import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import {
  TextInput,
  TextAreaInput,
  NumberInput,
  SelectInput,
  MultiSelectList,
  UrlInput,
  Tabs
} from '~/components/common/FormComponents';
import { designTypes, getSubtypesForType, getDimensionsForSubtype, requiresCustomDimensions } from '../data/designTypes';
import { getLanguageOptions } from '~/utils/languages';

const DesignForm = ({ onSubmit, initialData }) => {
  const SIVI_MIN_DIMENSION = 150;
  const SIVI_MAX_DIMENSION = 2000;

  const defaultFormData = {
    dimensionMode: 'standard',
    type: 'displayAds',
    subtype: 'displayAds-half-page-ad',
    dimension: {
      width: 300,
      height: 600
    },
    prompt: '',
    assets: {
      images: [],
      logos: []
    },
    language: 'english',
    numOfVariants: 4,
    outputFormat: ['jpg'],
    settings: {
      mode: 'custom',
      currentbId: '',
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

  // Update form data when initialData changes (for history loading)
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        settings: {
          ...prev.settings,
          ...(initialData.settings || {}),
          colorsPreference: {
            ...prev.settings.colorsPreference,
            ...(initialData.settings?.colorsPreference || {}),
          },
          fontGroupPreference: {
            ...prev.settings.fontGroupPreference,
            ...(initialData.settings?.fontGroupPreference || {}),
          },
        },
      }));
    }
  }, [initialData]);

  // Update dimensions when type/subtype changes
  useEffect(() => {
    if (formData.dimensionMode === 'standard' && !requiresCustomDimensions(formData.type, formData.subtype)) {
      const dimensions = getDimensionsForSubtype(formData.type, formData.subtype);
      if (dimensions && dimensions.width && dimensions.height) {
        setFormData(prev => ({
          ...prev,
          dimension: {
            width: dimensions.width,
            height: dimensions.height
          }
        }));
      }
    }
  }, [formData.type, formData.subtype, formData.dimensionMode]);

  const isCustomMode = formData.settings?.mode === 'custom';
  const isBrandMode = formData.settings?.mode === 'brand';
  const isCustomDimension = formData.dimensionMode === 'custom';

  const updateField = (path, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;

      return newData;
    });
  };

  const addColor = () => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        colorsPreference: {
          ...prev.settings.colorsPreference,
          customColors: [...prev.settings.colorsPreference.customColors, { primary: false, color: '#bb3df5', addedBy: 'user' }],
        }
      }
    }));
  };

  const updateColor = (index, color) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        colorsPreference: {
          ...prev.settings.colorsPreference,
          customColors: prev.settings.colorsPreference.customColors.map((c, i) => i === index ? { ...c, color } : c),
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
          customColors: prev.settings.colorsPreference.customColors.filter((_, i) => i !== index),
        }
      }
    }));
  };

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      assets: {
        ...prev.assets,
        images: [...prev.assets.images, { url: '', imagePreference: { crop: false, removeBg: false } }]
      }
    }));
  };

  const updateImage = (index, newImage) => {
    setFormData(prev => ({
      ...prev,
      assets: {
        ...prev.assets,
        images: prev.assets.images.map((img, i) => i === index ? newImage : img)
      }
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      assets: {
        ...prev.assets,
        images: prev.assets.images.filter((_, i) => i !== index)
      }
    }));
  };

  const addLogo = () => {
    setFormData(prev => ({
      ...prev,
      assets: {
        ...prev.assets,
        logos: [...prev.assets.logos, { url: '', logoStyles: [] }]
      }
    }));
  };

  const updateLogo = (index, newLogo) => {
    setFormData(prev => ({
      ...prev,
      assets: {
        ...prev.assets,
        logos: prev.assets.logos.map((logo, i) => i === index ? newLogo : logo)
      }
    }));
  };

  const removeLogo = (index) => {
    setFormData(prev => ({
      ...prev,
      assets: {
        ...prev.assets,
        logos: prev.assets.logos.filter((_, i) => i !== index)
      }
    }));
  };

  const handleDimensionModeChange = (mode) => {
    if (mode === 'standard') {
      const subtypes = getSubtypesForType('displayAds');
      const firstSubtype = Object.keys(subtypes)[0] || '';
      const dims = getDimensionsForSubtype('displayAds', firstSubtype);
      setFormData(prev => ({
        ...prev,
        dimensionMode: 'standard',
        type: 'displayAds',
        subtype: firstSubtype,
        dimension: dims ? { width: dims.width, height: dims.height } : { width: 300, height: 600 }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        dimensionMode: 'custom',
        type: 'custom',
        subtype: 'custom',
        dimension: { width: 600, height: 600 }
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.prompt.trim()) {
      message.error('Prompt is required');
      return;
    }
    if (isBrandMode && !(formData.settings?.currentbId ?? '').trim()) {
      message.error('Brand ID is required when Mode is Brand');
      return;
    }
    if (formData.numOfVariants < 1 || formData.numOfVariants > 10) {
      message.error('Number of variants must be between 1 and 10');
      return;
    }
    if (isCustomDimension) {
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
    const { colorsPreference, fontGroupPreference, ...restSettings } = formData.settings;
    const apiSettings = {
      ...restSettings,
      colors: colorsPreference.customColors
        .map(c => typeof c === 'object' && c?.color ? c.color : c)
        .filter(c => typeof c === 'string' && c.trim()),
      fontGroups: fontGroupPreference.fontGroups || [],
    };

    const apiAssets = {
      images: formData.assets.images,
      logos: formData.assets.logos.map(url => typeof url === 'string' ? { url, logoStyles: ['direct', 'neutral'] } : url),
    };

    onSubmit({ ...formData, settings: apiSettings, assets: apiAssets });
  };

  return (
    <form onSubmit={handleSubmit} className="design-form">
      <h3 className="form-section-title">Design Settings</h3>
      <Tabs
        tabs={[
          { key: 'standard', label: 'Standard' },
          { key: 'custom', label: 'Custom' },
        ]}
        activeKey={formData.dimensionMode}
        onChange={handleDimensionModeChange}
      />
      {!isCustomDimension && (
        <>
          <div className="required-field">
            <SelectInput
              label="Type"
              value={formData.type}
              onChange={(value) => updateField('type', value)}
              options={Object.entries(designTypes).filter(([key]) => key !== 'custom').map(([key, type]) => ({
                value: key,
                label: type.label
              }))}
            />
          </div>
          <div className="required-field">
            <SelectInput
              label="Subtype"
              value={formData.subtype}
              onChange={(value) => updateField('subtype', value)}
              options={Object.entries(getSubtypesForType(formData.type)).map(([key, subtype]) => ({
                value: key,
                label: subtype.label
              }))}
            />
          </div>
        </>
      )}
      {isCustomDimension && (
        <div className="dimension-row">
          <div className="required-field">
            <NumberInput
              label="Width"
              value={formData.dimension.width}
              onChange={(value) => updateField('dimension.width', value)}
              min={SIVI_MIN_DIMENSION}
              max={SIVI_MAX_DIMENSION}
            />
          </div>
          <div className="required-field">
            <NumberInput
              label="Height"
              value={formData.dimension.height}
              onChange={(value) => updateField('dimension.height', value)}
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
          onChange={(value) => updateField('prompt', value)}
          placeholder="Describe your design requirements..."
          rows={6}
        />
      </div>

      <div className="form-field">
        <label className="form-label">Images</label>
        <div className="asset-list">
          {formData.assets.images.map((image, index) => (
            <div key={index} className="asset-card">
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="asset-remove"
                title="Remove"
              >
                ×
              </button>
              <UrlInput
                label="Image URL"
                value={image.url || ''}
                onChange={(url) => updateImage(index, { ...image, url })}
                placeholder="https://example.com/image.jpg"
              />
              <div className="image-preferences">
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`img-crop-${index}`}
                    checked={image.imagePreference?.crop || false}
                    onChange={(e) => updateImage(index, {
                      ...image,
                      imagePreference: { ...image.imagePreference, crop: e.target.checked }
                    })}
                  />
                  <label htmlFor={`img-crop-${index}`}>Crop</label>
                </div>
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`img-rm-${index}`}
                    checked={image.imagePreference?.removeBg || false}
                    onChange={(e) => updateImage(index, {
                      ...image,
                      imagePreference: { ...image.imagePreference, removeBg: e.target.checked }
                    })}
                  />
                  <label htmlFor={`img-rm-${index}`}>Remove Background</label>
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={addImage} className="add-button">
            Add Image
          </button>
        </div>
      </div>

      <div className="form-field">
        <label className="form-label">Logos</label>
        <div className="asset-list">
          {formData.assets.logos.map((logo, index) => (
            <div key={index} className="asset-card">
              <button
                type="button"
                onClick={() => removeLogo(index)}
                className="asset-remove"
                title="Remove"
              >
                ×
              </button>
              <UrlInput
                label="Logo URL"
                value={logo.url || ''}
                onChange={(url) => updateLogo(index, { ...logo, url })}
                placeholder="https://example.com/logo.png"
              />
            </div>
          ))}
          <button type="button" onClick={addLogo} className="add-button">
            Add Logo
          </button>
        </div>
      </div>

      <div className="required-field">
        <SelectInput
          label="Mode"
          value={formData.settings?.mode ?? 'custom'}
          onChange={(value) => updateField('settings.mode', value)}
          options={[
            { value: 'auto', label: 'Auto' },
            { value: 'brand', label: 'Brand' },
            { value: 'custom', label: 'Custom' },
          ]}
        />
      </div>

      {isBrandMode && (
        <div className="required-field">
          <TextInput
            label="Brand ID"
            value={formData.settings.currentbId || ''}
            onChange={(value) => updateField('settings.currentbId', value)}
            placeholder="Enter brand ID"
          />
        </div>
      )}

      {isCustomMode && (
        <>
          <div className="form-field">
            <label className="form-label">Colors</label>
            <div className="colors-list">
              {(formData.settings?.colorsPreference?.customColors || []).map((colorObj, index) => (
                <div key={index} className="color-row">
                  <input
                    type="color"
                    value={colorObj.color}
                    onChange={(e) => updateColor(index, e.target.value)}
                    className="color-input"
                  />
                  <input
                    type="text"
                    value={colorObj.color}
                    onChange={(e) => updateColor(index, e.target.value)}
                    placeholder="#000000"
                    className="color-text-input"
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="color-remove"
                    title="Remove color"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button type="button" onClick={addColor} className="add-button">
                Add Color
              </button>
            </div>
          </div>

          <MultiSelectList
            label="Theme"
            values={formData.settings?.theme || []}
            onChange={(value) => updateField('settings.theme', value)}
            options={[
              { label: 'Light', value: 'light' },
              { label: 'Dark', value: 'dark' },
              { label: 'Colorful', value: 'colorful' },
            ]}
          />

          <MultiSelectList
            label="FrameStyle"
            values={formData.settings?.frameStyle || []}
            onChange={(value) => updateField('settings.frameStyle', value)}
            options={[
              { label: 'Plain Fill', value: 'Plain Fill', internalName: 'None' },
              { label: 'Inset Frame', value: 'Inset Frame', internalName: 'Box' },
              { label: 'Inset Outline', value: 'Inset Outline', internalName: 'Simple' },
              { label: 'Patterned Boundary', value: 'Patterned Boundary', internalName: 'Ornate' },
              { label: 'Stroked Outline', value: 'Stroked Outline', internalName: 'Stroke' },
              { label: 'Corner Accent', value: 'Corner Accent', internalName: 'Diagonal' },
              { label: 'Bar Accent', value: 'Bar Accent', internalName: 'Bar' },
            ]}
          />

          <MultiSelectList
            label="BackdropStyle"
            values={formData.settings?.backdropStyle || []}
            onChange={(value) => updateField('settings.backdropStyle', value)}
            options={[
              { label: 'Minimalist', value: 'minimalist' },
              { label: 'Imagery', value: 'imagery' },
              { label: 'Artistic', value: 'artistic' },
            ]}
          />

          <MultiSelectList
            label="Focus"
            values={formData.settings?.focus || []}
            onChange={(value) => updateField('settings.focus', value)}
            options={[
              { label: 'Text', value: 'text' },
              { label: 'Image', value: 'image' },
              { label: 'Neutral', value: 'neutral' },
            ]}
          />

          <MultiSelectList
            label="ImageStyle"
            values={formData.settings?.imageStyle || []}
            onChange={(value) => updateField('settings.imageStyle', value)}
            options={[
              { label: 'Cover', value: 'cover' },
              { label: 'Cover With Linear Gradient', value: 'cover-with-linear-gradient' },
              { label: 'Cover With Overlay', value: 'cover-with-overlay' },
              { label: 'Container', value: 'container' },
              { label: 'Section', value: 'section' },
              { label: 'Section with Container', value: 'section-with-container' },
              { label: 'Mask', value: 'mask' },
              { label: 'Cutout', value: 'cutout' },
              { label: 'Cutout with vectors', value: 'cutout-with-vectors' },
              { label: 'Content Free Form', value: 'content-free-form' },
            ]}
          />
        </>
      )}

      <SelectInput
        label="Language"
        value={formData.language}
        onChange={(value) => updateField('language', value)}
        options={getLanguageOptions()}
      />

      <div className="required-field">
        <NumberInput
          label="Number of Variants"
          value={formData.numOfVariants}
          onChange={(value) => updateField('numOfVariants', value)}
          min={1}
          max={10}
        />
      </div>

      <button type="submit" className="ai-studio-button">
        Generate Designs
      </button>
    </form>
  );
};

export default DesignForm;
