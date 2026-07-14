import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import {
  TextInput,
  TextAreaInput,
  NumberInput,
  SelectInput,
  ColorInput,
  UrlInput,
  Tabs
} from '~/components/common/FormComponents';
import { designTypes, imagineDesignTypes, composeModels, imagineModels, getSubtypesForType, getFilteredSubtypesForModel, getDimensionsForSubtype, requiresCustomDimensions, isImagineType } from '../data/designTypes';
import { getLanguageOptions } from '~/utils/languages';
import {
  CONTENT_CATEGORIES,
  DEFAULT_CONTENT,
  getAvailableBlocksForCategory,
  getBlockMeta,
  isBlockAlwaysPresent,
} from '../data/contentBlockTypes';

const normalizeAssets = (assets) => {
  if (!assets || typeof assets !== 'object') return { images: [], logos: [] };
  return {
    images: Array.isArray(assets.images) ? assets.images : [],
    logos: Array.isArray(assets.logos) ? assets.logos : [],
  };
};

const DesignsFromContentForm = ({ onSubmit, initialData, selectedBId }) => {
  const SIVI_MIN_DIMENSION = 150;
  const SIVI_MAX_DIMENSION = 2000;

  const defaultFormData = {
    type: 'displayAds',
    subtype: 'displayAds-half-page-ad',
    dimension: { width: 300, height: 600 },
    content: { ...DEFAULT_CONTENT },
    language: 'english',
    numOfVariants: 4,
    outputFormat: ['jpg'],
    assets: {
      images: [],
      logos: []
    },
    settings: {
      mode: 'custom',
      currentbId: '',
      genMode: 'compose',
      designModel: 'sivi-gen-3h',
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
  const [showOptionalContent, setShowOptionalContent] = useState(false);

  const normalizeColors = (colors) => {
    if (!Array.isArray(colors)) return [];
    return colors.map(c => (typeof c === 'string' ? c : c?.color)).filter(Boolean);
  };

  useEffect(() => {
    setAvailableSubtypes(getSubtypesForType(formData.type));
  }, [formData.type]);

  useEffect(() => {
    if (formData.settings?.genMode === 'compose' && formData.type === 'custom') {
      setFormData(prev => ({
        ...prev,
        type: 'custom',
        subtype: 'custom',
        dimension: prev.dimension
      }));
    }
  }, [formData.settings?.genMode, formData.type]);

  useEffect(() => {
    if (selectedBId && selectedBId !== 'auto') {
      setFormData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          currentbId: selectedBId,
        },
      }));
    }
  }, [selectedBId]);

  useEffect(() => {
    if (initialData) {
      const loadedType = initialData.type || '';
      const isImagine = isImagineType(loadedType);
      const inferredGenMode = initialData.settings?.genMode || initialData.dimensionMode || (isImagine ? 'imagine' : 'compose');
      const inferredDesignModel = initialData.settings?.designModel || (isImagine
        ? Object.keys(imagineModels).find(key => imagineModels[key].types.includes(loadedType)) || Object.keys(imagineModels)[0]
        : 'sivi-gen-3h');
      const loadedColors = initialData.settings?.colorsPreference?.customColors;
      setFormData(prev => ({
        ...prev,
        ...initialData,
        content: initialData.content && typeof initialData.content === 'object'
          ? { ...DEFAULT_CONTENT, ...initialData.content }
          : { ...DEFAULT_CONTENT },
        dimension: initialData.dimension || prev.dimension,
        settings: {
          ...prev.settings,
          ...(initialData.settings || {}),
          genMode: inferredGenMode,
          designModel: inferredDesignModel,
          colorsPreference: {
            ...prev.settings.colorsPreference,
            ...(initialData.settings?.colorsPreference || {}),
            customColors: normalizeColors(loadedColors),
          },
          fontGroupPreference: {
            ...prev.settings.fontGroupPreference,
            ...(initialData.settings?.fontGroupPreference || {}),
          },
        },
        assets: normalizeAssets(initialData.assets),
      }));
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
  }, [formData.type, formData.subtype, formData.settings?.genMode]);

  const _isComposeMode = formData.settings?.genMode === 'compose';
  const isImagineMode = formData.settings?.genMode === 'imagine';
  const isCustomDimension = formData.type === 'custom';

  const _handleDimensionModeChange = (mode) => {
    if (mode === 'compose') {
      const subtypes = getSubtypesForType('displayAds');
      const firstSubtype = Object.keys(subtypes)[0] || '';
      const dims = getDimensionsForSubtype('displayAds', firstSubtype);
      setFormData(prev => ({
        ...prev,
        type: 'displayAds',
        subtype: firstSubtype,
        dimension: dims ? { width: dims.width, height: dims.height } : { width: 300, height: 600 },
        settings: { ...prev.settings, genMode: 'compose', designModel: 'sivi-gen-3h' }
      }));
    } else {
      const firstModel = Object.keys(imagineModels)[0];
      const firstType = imagineModels[firstModel].types[0];
      const subtypes = getFilteredSubtypesForModel(firstModel, firstType);
      const firstSubtype = Object.keys(subtypes)[0] || '';
      const dims = getDimensionsForSubtype(firstType, firstSubtype);
      setFormData(prev => ({
        ...prev,
        type: firstType,
        subtype: firstSubtype,
        dimension: dims ? { width: dims.width, height: dims.height } : { width: 1024, height: 1024 },
        settings: { ...prev.settings, genMode: 'imagine', designModel: firstModel }
      }));
    }
  };

  const handleModelChange = (model) => {
    if (isImagineMode) {
      const modelTypes = imagineModels[model]?.types || [];
      const firstType = modelTypes[0] || '';
      const subtypes = getFilteredSubtypesForModel(model, firstType);
      const firstSubtype = Object.keys(subtypes)[0] || '';
      const dims = getDimensionsForSubtype(firstType, firstSubtype);
      setFormData(prev => ({
        ...prev,
        type: firstType,
        subtype: firstSubtype,
        dimension: dims ? { width: dims.width, height: dims.height } : prev.dimension,
        settings: { ...prev.settings, designModel: model }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        settings: { ...prev.settings, designModel: model }
      }));
    }
  };

  const handleTypeChange = (type) => {
    const modelKey = formData.settings?.designModel;
    const subtypes = isImagineMode
      ? getFilteredSubtypesForModel(modelKey, type)
      : getSubtypesForType(type);
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

  const addContentBlock = (categoryKey, blockKey) => {
    if (formData.content[blockKey] !== undefined) return;
    const blockMeta = getBlockMeta(categoryKey, blockKey);
    const initialValue = blockMeta?.inputType === 'list' ? [] : '';
    setFormData(prev => ({
      ...prev,
      content: { ...prev.content, [blockKey]: initialValue }
    }));
  };

  const removeContentBlock = (categoryKey, blockKey) => {
    if (isBlockAlwaysPresent(categoryKey, blockKey)) return;
    setFormData(prev => {
      const newContent = { ...prev.content };
      delete newContent[blockKey];
      return { ...prev, content: newContent };
    });
  };

  const handleListItemChange = (blockKey, index, value) => {
    setFormData(prev => {
      const newList = [...(prev.content[blockKey] || [])];
      newList[index] = value;
      return { ...prev, content: { ...prev.content, [blockKey]: newList } };
    });
  };

  const addListItem = (blockKey) => {
    setFormData(prev => ({
      ...prev,
      content: { ...prev.content, [blockKey]: [...(prev.content[blockKey] || []), ''] }
    }));
  };

  const removeListItem = (blockKey, index) => {
    setFormData(prev => ({
      ...prev,
      content: { ...prev.content, [blockKey]: (prev.content[blockKey] || []).filter((_, i) => i !== index) }
    }));
  };

  const handleColorChange = (index, value) => {
    const newColors = [...(formData.settings?.colorsPreference?.customColors || [])];
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
    const newLogos = [...(formData.assets?.logos || [])];
    const existing = newLogos[index];
    newLogos[index] = typeof existing === 'object' && existing !== null
      ? { ...existing, url: value }
      : value;
    setFormData(prev => ({ ...prev, assets: { ...prev.assets, logos: newLogos } }));
  };

  const addLogo = () => {
    setFormData(prev => ({
      ...prev,
      assets: { ...prev.assets, logos: [...(prev.assets?.logos || []), ''] }
    }));
  };

  const removeLogo = (index) => {
    setFormData(prev => ({
      ...prev,
      assets: { ...prev.assets, logos: (prev.assets?.logos || []).filter((_, i) => i !== index) }
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...(formData.assets?.images || [])];
    const existing = newImages[index];
    newImages[index] = typeof existing === 'object' && existing !== null
      ? { ...existing, url: value }
      : value;
    setFormData(prev => ({ ...prev, assets: { ...prev.assets, images: newImages } }));
  };

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      assets: { ...prev.assets, images: [...(prev.assets?.images || []), ''] }
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      assets: { ...prev.assets, images: (prev.assets?.images || []).filter((_, i) => i !== index) }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const textBlockKeys = Object.keys(CONTENT_CATEGORIES.text.blocks);
    const hasTextContent = textBlockKeys.some(key => {
      const val = formData.content[key];
      return typeof val === 'string' && val.trim();
    });
    if (!hasTextContent) {
      message.error('At least one text-based content block with content is required');
      return;
    }
    if (formData.settings?.genMode === 'compose' && formData.type === 'custom') {
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
    const cleanedContent = Object.entries(formData.content).reduce((acc, [key, val]) => {
      if (Array.isArray(val)) {
        const filtered = val.filter(item => item && item.trim());
        if (filtered.length) acc[key] = filtered;
      } else if (typeof val === 'string' && val.trim()) {
        acc[key] = val.trim();
      }
      return acc;
    }, {});

    const { colorsPreference, fontGroupPreference, ...restSettings } = formData.settings;
    const apiSettings = {
      ...restSettings,
      colors: colorsPreference.customColors.filter(c => typeof c === 'string' && c.trim()),
      fontGroups: fontGroupPreference.fontGroups || [],
    };

    const apiAssets = {
      images: formData.assets?.images || [],
      logos: (formData.assets?.logos || []).map(url => typeof url === 'string' ? { url, logoStyles: ['direct', 'neutral'] } : url),
    };

    onSubmit({ ...formData, content: cleanedContent, settings: apiSettings, assets: apiAssets });
  };

  const composeTypeOptions = Object.entries(designTypes)
    .map(([key, type]) => ({ value: key, label: type.label }));
  const _imagineTypeOptions = (imagineModels[formData.settings?.designModel]?.types || Object.keys(imagineDesignTypes))
    .map((typeKey) => ({ value: typeKey, label: imagineDesignTypes[typeKey]?.label || typeKey }));
  const imagineSubtypeOptions = Object.entries(
    getFilteredSubtypesForModel(formData.settings?.designModel, formData.type)
  ).map(([key, subtype]) => ({ value: key, label: subtype.label }));
  const subtypeOptions = isImagineMode
    ? imagineSubtypeOptions
    : Object.entries(availableSubtypes).map(([key, subtype]) => ({ value: key, label: subtype.label }));

  return (
    <form onSubmit={handleSubmit} className="design-form">
      <h3 className="form-section-title">Design Settings</h3>
      {/* <Tabs
        tabs={[
          { key: 'compose', label: 'Compose' },
          { key: 'imagine', label: 'Imagine' },
        ]}
        activeKey={formData.settings?.genMode}
        onChange={handleDimensionModeChange}
      /> */}
      {/* {isComposeMode && ( */}
        <>
        <div className="required-field">
          <SelectInput
            label="Design Model"
            value={formData.settings?.designModel ?? 'sivi-gen-3h'}
            onChange={handleModelChange}
            options={Object.entries(composeModels).map(([key, model]) => ({
              value: key,
              label: model.label
            }))}
          />
        </div>
        <div className="required-field">
          <SelectInput
            label="Type"
            value={formData.type}
            onChange={handleTypeChange}
            options={composeTypeOptions}
          />
        </div>
          {!isCustomDimension && (
            <div className="required-field">
              <SelectInput
                label="Subtype"
                value={formData.subtype}
                onChange={(v) => setFormData(prev => ({ ...prev, subtype: v }))}
                options={subtypeOptions}
              />
            </div>
          )}
          {isCustomDimension && (
            <div className="dimension-row">
              <div className="required-field">
                <NumberInput
                  label="Width"
                  value={formData.dimension.width}
                  onChange={(v) => setFormData(prev => ({ ...prev, dimension: { ...prev.dimension, width: v } }))}
                  min={SIVI_MIN_DIMENSION}
                  max={SIVI_MAX_DIMENSION}
                />
              </div>
              <div className="required-field">
                <NumberInput
                  label="Height"
                  value={formData.dimension.height}
                  onChange={(v) => setFormData(prev => ({ ...prev, dimension: { ...prev.dimension, height: v } }))}
                  min={SIVI_MIN_DIMENSION}
                  max={SIVI_MAX_DIMENSION}
                />
              </div>
              <small className="dimension-hint">Min: {SIVI_MIN_DIMENSION}px, Max: {SIVI_MAX_DIMENSION}px</small>
            </div>
          )}
        </>
      {/* )} */}
      {/* {isImagineMode && (
        <>
        <div className="required-field">
          <SelectInput
            label="Design Model"
            value={formData.settings?.designModel ?? 'gpt-image-1:low'}
            onChange={handleModelChange}
            options={Object.entries(imagineModels).map(([key, model]) => ({
              value: key,
              label: model.label
            }))}
          />
        </div>
        <div className="required-field">
          <SelectInput
            label="Type"
            value={formData.type}
            onChange={handleTypeChange}
            options={imagineTypeOptions}
          />
        </div>
        <div className="required-field">
          <SelectInput
            label="Subtype"
            value={formData.subtype}
            onChange={(v) => setFormData(prev => ({ ...prev, subtype: v }))}
            options={subtypeOptions}
          />
        </div>
        </>
      )} */}

      <h3 className="form-section-title">Content</h3>
      {Object.entries(CONTENT_CATEGORIES).filter(([, cat]) => cat?.required).map(([categoryKey, category]) => {
        if (!category) return null;
        const addedBlocks = Object.keys(category.blocks || {}).filter(key => formData.content?.[key] !== undefined);
        const availableToAdd = getAvailableBlocksForCategory(categoryKey).filter(
          opt => formData.content?.[opt.value] === undefined
        );
        return (
          <div key={categoryKey} className="content-subsection">
            <h4 className="content-subsection-title">
              {category.label}
              <span className="required-asterisk"> *</span>
            </h4>
            {addedBlocks.map(blockKey => {
              const blockMeta = getBlockMeta(categoryKey, blockKey);
              if (!blockMeta) return null;
              const canRemove = !isBlockAlwaysPresent(categoryKey, blockKey);
              if (blockMeta.inputType === 'list') {
                const items = formData.content[blockKey] || [];
                return (
                  <div key={blockKey} className="content-block-field">
                    <div className="content-block-header">
                      <span className="content-block-label">{blockMeta.label}</span>
                      {canRemove && (
                        <button type="button" className="asset-remove" title="Remove" onClick={() => removeContentBlock(categoryKey, blockKey)}>×</button>
                      )}
                    </div>
                    {items.map((item, idx) => (
                      <div key={idx} className="list-item-row">
                        <input
                          type="text"
                          className="form-input"
                          value={item}
                          onChange={(e) => handleListItemChange(blockKey, idx, e.target.value)}
                          placeholder={blockMeta.placeholder}
                        />
                        <button type="button" className="color-remove" title="Remove" onClick={() => removeListItem(blockKey, idx)}>×</button>
                      </div>
                    ))}
                    <button type="button" className="add-btn" onClick={() => addListItem(blockKey)}>Add Item</button>
                  </div>
                );
              }
              return (
                <div key={blockKey} className="content-block-field">
                  <div className="content-block-inline">
                    <div className="form-field content-block-input">
                      <label className="form-label">{blockMeta.label}</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.content[blockKey] || ''}
                        onChange={(e) => handleContentChange(blockKey, e.target.value)}
                        placeholder={blockMeta.placeholder}
                      />
                    </div>
                    {canRemove && (
                      <button type="button" className="color-remove" title="Remove" onClick={() => removeContentBlock(categoryKey, blockKey)}>×</button>
                    )}
                  </div>
                </div>
              );
            })}
            {availableToAdd.length > 0 && (
              <div className="content-add-block">
                <SelectInput
                  label="Add content block"
                  value=""
                  onChange={(v) => v && addContentBlock(categoryKey, v)}
                  options={availableToAdd}
                  placeholder="Select to add..."
                />
              </div>
            )}
          </div>
        );
      })}
      {!showOptionalContent && (
        <button type="button" className="toggle-optional-btn" onClick={() => setShowOptionalContent(true)}>
          View More
        </button>
      )}
      {showOptionalContent && (
        <>
          {Object.entries(CONTENT_CATEGORIES).filter(([, cat]) => !cat?.required).map(([categoryKey, category]) => {
            if (!category) return null;
            const addedBlocks = Object.keys(category.blocks || {}).filter(key => formData.content?.[key] !== undefined);
            const availableToAdd = getAvailableBlocksForCategory(categoryKey).filter(
              opt => formData.content?.[opt.value] === undefined
            );
            return (
              <div key={categoryKey} className="content-subsection">
                <h4 className="content-subsection-title">{category.label}</h4>
                {addedBlocks.map(blockKey => {
                  const blockMeta = getBlockMeta(categoryKey, blockKey);
                  if (!blockMeta) return null;
                  const canRemove = !isBlockAlwaysPresent(categoryKey, blockKey);
                  if (blockMeta.inputType === 'list') {
                    const items = formData.content[blockKey] || [];
                    return (
                      <div key={blockKey} className="content-block-field">
                        <div className="content-block-header">
                          <span className="content-block-label">{blockMeta.label}</span>
                          {canRemove && (
                            <button type="button" className="asset-remove" title="Remove" onClick={() => removeContentBlock(categoryKey, blockKey)}>×</button>
                          )}
                        </div>
                        {items.map((item, idx) => (
                          <div key={idx} className="list-item-row">
                            <input
                              type="text"
                              className="form-input"
                              value={item}
                              onChange={(e) => handleListItemChange(blockKey, idx, e.target.value)}
                              placeholder={blockMeta.placeholder}
                            />
                            <button type="button" className="color-remove" title="Remove" onClick={() => removeListItem(blockKey, idx)}>×</button>
                          </div>
                        ))}
                        <button type="button" className="add-btn" onClick={() => addListItem(blockKey)}>Add Item</button>
                      </div>
                    );
                  }
                  return (
                    <div key={blockKey} className="content-block-field">
                      <div className="content-block-inline">
                        <div className="form-field content-block-input">
                          <label className="form-label">{blockMeta.label}</label>
                          <input
                            type="text"
                            className="form-input"
                            value={formData.content[blockKey] || ''}
                            onChange={(e) => handleContentChange(blockKey, e.target.value)}
                            placeholder={blockMeta.placeholder}
                          />
                        </div>
                        {canRemove && (
                          <button type="button" className="color-remove" title="Remove" onClick={() => removeContentBlock(categoryKey, blockKey)}>×</button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {availableToAdd.length > 0 && (
                  <div className="content-add-block">
                    <SelectInput
                      label="Add content block"
                      value=""
                      onChange={(v) => v && addContentBlock(categoryKey, v)}
                      options={availableToAdd}
                      placeholder="Select to add..."
                    />
                  </div>
                )}
              </div>
            );
          })}
          <button type="button" className="toggle-optional-btn" onClick={() => setShowOptionalContent(false)}>
            View Less
          </button>
        </>
      )}

      <h3 className="form-section-title">Preferences</h3>
      <SelectInput
        label="Language"
        value={formData.language}
        onChange={(v) => setFormData(prev => ({ ...prev, language: v }))}
        options={getLanguageOptions()}
      />
      <NumberInput
        label="Number of Variants"
        value={formData.numOfVariants}
        onChange={(v) => setFormData(prev => ({ ...prev, numOfVariants: v }))}
        min={1}
        max={10}
      />

      <h3 className="form-section-title">Mode</h3>
      <SelectInput
        label="Mode"
        value={formData.settings?.mode ?? 'custom'}
        onChange={(value) => setFormData(prev => ({ ...prev, settings: { ...prev.settings, mode: value } }))}
        options={[
          { value: 'auto', label: 'Auto' },
          { value: 'brand', label: 'Brand' },
          { value: 'custom', label: 'Custom' },
        ]}
      />
      {formData.settings?.mode === 'brand' && (
        <div className="required-field">
          <TextInput
            label="Brand ID"
            value={formData.settings.currentbId || ''}
            onChange={(value) => setFormData(prev => ({ ...prev, settings: { ...prev.settings, currentbId: value } }))}
            placeholder="Enter brand ID"
          />
        </div>
      )}

      <h3 className="form-section-title">Colors</h3>
      {(formData.settings?.colorsPreference?.customColors || []).map((color, index) => (
        <div key={index} className="color-row">
          <ColorInput
            label={`Color ${index + 1}`}
            value={color}
            onChange={(v) => handleColorChange(index, v)}
          />
          <button type="button" className="color-remove" title="Remove color" onClick={() => removeColor(index)}>×</button>
        </div>
      ))}
      <button type="button" className="add-btn" onClick={addColor}>Add Color</button>

      <h3 className="form-section-title">Images</h3>
      {(formData.assets?.images || []).map((image, index) => (
        <div key={index} className="logo-row">
          <UrlInput
            label={`Image URL ${index + 1}`}
            value={typeof image === 'string' ? image : image?.url || ''}
            onChange={(v) => handleImageChange(index, v)}
            placeholder="https://example.com/image.png"
          />
          <button type="button" className="asset-remove" title="Remove" onClick={() => removeImage(index)}>×</button>
        </div>
      ))}
      <button type="button" className="add-btn" onClick={addImage}>Add Image</button>

      <h3 className="form-section-title">Logos</h3>
      {(formData.assets?.logos || []).map((logo, index) => (
        <div key={index} className="logo-row">
          <UrlInput
            label={`Logo URL ${index + 1}`}
            value={typeof logo === 'string' ? logo : logo?.url || ''}
            onChange={(v) => handleLogoChange(index, v)}
            placeholder="https://example.com/logo.png"
          />
          <button type="button" className="asset-remove" title="Remove" onClick={() => removeLogo(index)}>×</button>
        </div>
      ))}
      <button type="button" className="add-btn" onClick={addLogo}>Add Logo</button>

      <div className="form-sticky-footer">
        <button type="submit" className="submit-button">Generate Designs</button>
      </div>
    </form>
  );
};

export default DesignsFromContentForm;
