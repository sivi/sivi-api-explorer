import React, { useState } from 'react';
import { message } from 'antd';
import {
  TextInput,
  TextAreaInput,
  NumberInput,
} from '~/components/common/FormComponents';

const MediaGenerateForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    prompt: initialData?.prompt || '',
    negativePrompt: initialData?.negativePrompt || '',
    width: initialData?.dimensions?.width || 1024,
    height: initialData?.dimensions?.height || 1024,
    bId: initialData?.bId || '',
    model: initialData?.model || 'z-image-turbo',
    siviAssets: initialData?.siviAssets?.map((a) => a.mId).join(', ') || '',
    photoUrls: initialData?.assets?.photo?.map((a) => a.url).join(', ') || '',
    abstractUserId: initialData?.abstractUserId || '',
  });

  const [errors, setErrors] = useState({});

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
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      prompt: formData.prompt,
      dimensions: {
        width: Number(formData.width),
        height: Number(formData.height),
      },
      ...(formData.bId && { bId: formData.bId }),
      model: formData.model,
      ...(formData.negativePrompt && { negativePrompt: formData.negativePrompt }),
      ...(formData.siviAssets && {
        siviAssets: formData.siviAssets.split(',').map((s) => s.trim()).filter(Boolean).map((mId) => ({ mId })),
      }),
      ...(formData.photoUrls && {
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

      <div className={errors.prompt ? 'required-field' : ''}>
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

      <div className="form-field">
        <label className="form-label">Dimensions</label>
        <div className="dimension-inputs">
          <NumberInput
            label="Width"
            value={formData.width}
            onChange={(v) => setFormData((prev) => ({ ...prev, width: v }))}
            placeholder="1024"
            min={64}
            max={2048}
          />
          <NumberInput
            label="Height"
            value={formData.height}
            onChange={(v) => setFormData((prev) => ({ ...prev, height: v }))}
            placeholder="1024"
            min={64}
            max={2048}
          />
        </div>
      </div>

      <TextInput
        label="Brand ID (bId)"
        value={formData.bId}
        onChange={(v) => setFormData((prev) => ({ ...prev, bId: v }))}
        placeholder="e.g. b_s87vFxpfM0R"
      />

      <div className={errors.model ? 'required-field' : ''}>
        <TextInput
          label="Model"
          value={formData.model}
          onChange={(v) => {
            setFormData((prev) => ({ ...prev, model: v }));
            if (errors.model) setErrors((prev) => ({ ...prev, model: undefined }));
          }}
          placeholder="e.g. z-image-turbo, nano-banana:1k"
        />
      </div>

      <TextInput
        label="Sivi Asset IDs (comma-separated)"
        value={formData.siviAssets}
        onChange={(v) => setFormData((prev) => ({ ...prev, siviAssets: v }))}
        placeholder="e.g. w_abc123----photo_001.jpeg"
      />

      <TextInput
        label="Reference Photo URLs (comma-separated)"
        value={formData.photoUrls}
        onChange={(v) => setFormData((prev) => ({ ...prev, photoUrls: v }))}
        placeholder="e.g. https://example.com/reference.jpg"
      />

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
