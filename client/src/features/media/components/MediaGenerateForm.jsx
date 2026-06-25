import React, { useState, useMemo } from 'react';
import { message } from 'antd';
import {
  TextInput,
  TextAreaInput,
  SelectInput,
} from '~/components/common/FormComponents';
import {
  getDimensionsForModel,
  getModelsForMode,
  formatDimensionValue,
  parseDimensionValue,
} from '~/features/media/config/mediaGenerateModels.js';

const MediaGenerateForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    prompt: initialData?.prompt || '',
    negativePrompt: initialData?.negativePrompt || '',
    dimension: initialData?.dimensions
      ? formatDimensionValue(initialData.dimensions.width, initialData.dimensions.height)
      : '1024x1024',
    bId: initialData?.bId || '',
    model: initialData?.model || 'z-image-turbo',
    siviAssets: initialData?.siviAssets?.map((a) => a.mId).join(', ') || '',
    photoUrls: initialData?.assets?.photo?.map((a) => a.url).join(', ') || '',
    abstractUserId: initialData?.abstractUserId || '',
  });

  const [errors, setErrors] = useState({});
  const [enhance, setEnhance] = useState(
    !!(initialData?.siviAssets?.length || initialData?.assets?.photo?.length)
  );

  const modelOptions = useMemo(
    () => getModelsForMode(enhance).map((m) => ({
      value: m.value,
      label: `${m.label}${m.premium ? ' 👑' : ''} ( ${m.credits} 💎 )`,
    })),
    [enhance]
  );

  const dimensionOptions = useMemo(
    () => getDimensionsForModel(formData.model),
    [formData.model]
  );

  const handleModelChange = (value) => {
    setFormData((prev) => {
      const dims = getDimensionsForModel(value);
      const currentDimExists = dims.some((d) => d.value === prev.dimension);
      return {
        ...prev,
        model: value,
        dimension: currentDimExists ? prev.dimension : '1024x1024',
      };
    });
    if (errors.model) setErrors((prev) => ({ ...prev, model: undefined }));
  };

  const handleEnhanceChange = (checked) => {
    setEnhance(checked);
    const availableModels = getModelsForMode(checked);
    const currentModelSupported = availableModels.some((m) => m.value === formData.model);
    if (!currentModelSupported) {
      setFormData((prev) => ({ ...prev, model: availableModels[0]?.value || 'auto' }));
    }
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.prompt.trim()) {
      nextErrors.prompt = 'Prompt is required';
      message.error('Prompt is required');
    }
    if (!formData.model.trim()) {
      nextErrors.model = 'Model is required';
      message.error('Model is required');
    }
    if (!formData.bId.trim()) {
      nextErrors.bId = 'Brand ID (bId) is required';
      message.error('Brand ID (bId) is required');
    }
    if (!formData.dimension) {
      nextErrors.dimension = 'Dimensions are required';
      message.error('Dimensions are required');
    }
    if (enhance) {
      const siviAssetCount = formData.siviAssets.split(',').map((s) => s.trim()).filter(Boolean).length;
      const photoUrlCount = formData.photoUrls.split(',').map((s) => s.trim()).filter(Boolean).length;
      if (siviAssetCount + photoUrlCount > 4) {
        nextErrors.siviAssets = 'Maximum of 4 image assets total (siviAssets + assets)';
        message.error('Maximum of 4 image assets total (siviAssets + assets)');
      }
      if (siviAssetCount + photoUrlCount === 0) {
        nextErrors.siviAssets = 'At least one asset is required when Enhance is enabled';
        message.error('At least one asset is required when Enhance is enabled');
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const { width, height } = parseDimensionValue(formData.dimension);
    const payload = {
      prompt: formData.prompt,
      dimensions: { width, height },
      bId: formData.bId,
      model: formData.model,
      ...(formData.negativePrompt && { negativePrompt: formData.negativePrompt }),
      ...(enhance && formData.siviAssets && {
        siviAssets: formData.siviAssets.split(',').map((s) => s.trim()).filter(Boolean).map((mId) => ({ mId })),
      }),
      ...(enhance && formData.photoUrls && {
        assets: {
          photo: formData.photoUrls.split(',').map((s) => s.trim()).filter(Boolean).map((url) => ({ url })),
        },
      }),
      ...(formData.abstractUserId && { abstractUserId: formData.abstractUserId }),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="design-form">
      <h3 className="form-section-title">Generate Media</h3>
      <p className="form-hint">Generate or enhance images using AI.</p>

      <div className="required-field">
        <TextAreaInput
          label="Prompt"
          value={formData.prompt}
          onChange={(v) => {
            setFormData((prev) => ({ ...prev, prompt: v }));
            if (errors.prompt) setErrors((prev) => ({ ...prev, prompt: undefined }));
          }}
          placeholder="Describe the image you want to generate..."
          rows={3}
        />
      </div>

      <TextAreaInput
        label="Negative Prompt"
        value={formData.negativePrompt}
        onChange={(v) => setFormData((prev) => ({ ...prev, negativePrompt: v }))}
        placeholder="Things to avoid in the image..."
        rows={2}
      />

      <div className="required-field">
        <SelectInput
          label="Model"
          value={formData.model}
          onChange={handleModelChange}
          options={modelOptions}
        />
      </div>

      <div className="required-field">
        <SelectInput
          label="Dimensions"
          value={formData.dimension}
          onChange={(v) => {
            setFormData((prev) => ({ ...prev, dimension: v }));
            if (errors.dimension) setErrors((prev) => ({ ...prev, dimension: undefined }));
          }}
          options={dimensionOptions}
        />
      </div>

      <div className="required-field">
        <TextInput
          label="Brand ID (bId)"
          value={formData.bId}
          onChange={(v) => {
            setFormData((prev) => ({ ...prev, bId: v }));
            if (errors.bId) setErrors((prev) => ({ ...prev, bId: undefined }));
          }}
          placeholder="e.g. b_s87vFxpfM0R"
        />
      </div>

      <div className="form-field">
        <label className="form-label">
          <input
            type="checkbox"
            checked={enhance}
            onChange={(e) => handleEnhanceChange(e.target.checked)}
            style={{ marginRight: 8 }}
          />
          Enhance (use reference assets)
        </label>
        <p className="form-hint" style={{ marginTop: 4 }}>
          When enabled, provide siviAssets and/or reference photo URLs to enhance existing images instead of generating from scratch.
        </p>
      </div>

      {enhance && (
        <>
          <TextInput
            label="Sivi Asset IDs (comma-separated)"
            value={formData.siviAssets}
            onChange={(v) => {
              setFormData((prev) => ({ ...prev, siviAssets: v }));
              if (errors.siviAssets) setErrors((prev) => ({ ...prev, siviAssets: undefined }));
            }}
            placeholder="e.g. w_abc123----photo_001.jpeg"
          />

          <TextInput
            label="Reference Photo URLs (comma-separated)"
            value={formData.photoUrls}
            onChange={(v) => {
              setFormData((prev) => ({ ...prev, photoUrls: v }));
              if (errors.siviAssets) setErrors((prev) => ({ ...prev, siviAssets: undefined }));
            }}
            placeholder="e.g. https://example.com/reference.jpg"
          />
          <p className="form-hint">
            Maximum of 4 image assets total (combined siviAssets + assets).
          </p>
        </>
      )}

      <TextInput
        label="Abstract User ID (optional)"
        value={formData.abstractUserId}
        onChange={(v) => setFormData((prev) => ({ ...prev, abstractUserId: v }))}
        placeholder="e.g. user_123"
      />

      <button type="submit" className="submit-button">
        Generate Media
      </button>
    </form>
  );
};

export default MediaGenerateForm;
