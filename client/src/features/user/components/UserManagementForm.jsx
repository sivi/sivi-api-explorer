import React, { useState } from 'react';
import { message } from 'antd';
import {
  TextInput,
  TextAreaInput,
  NumberInput,
  ColorInput,
} from '~/components/common/FormComponents';

const formatList = (value) => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map((item) => (typeof item === 'string' ? item : (item?.name || item?.id || String(item)))).filter(Boolean).join(', ');
  return '';
};

const parseList = (str) => str.split(',').map((s) => s.trim()).filter(Boolean);

const UserManagementForm = ({ flowKey, onSubmit, initialData }) => {
  if (flowKey === 'login-user') {
    return <LoginUserForm onSubmit={onSubmit} initialData={initialData} />;
  }
  if (flowKey === 'delete-user') {
    return <DeleteUserForm onSubmit={onSubmit} initialData={initialData} />;
  }
  if (flowKey === 'set-user-credit-limit') {
    return <SetUserCreditLimitForm onSubmit={onSubmit} initialData={initialData} />;
  }
  return <div className="placeholder-flow">Unknown user flow: {flowKey}</div>;
};

/* ---------- Login User Form ---------- */
const LoginUserForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    abstractUserId: initialData?.abstractUserId || '',
    planId: initialData?.planId || '',
    brand: {
      brandName: initialData?.brand?.brandName || '',
      brandDescription: initialData?.brand?.brandDescription || '',
      brandUrl: initialData?.brand?.brandUrl || '',
      brandLogo: initialData?.brand?.brandLogo || '',
      brandColors: initialData?.brand?.brandColors || [],
      brandFonts: formatList(initialData?.brand?.brandFonts),
      brandPersona: {
        emotions: formatList(initialData?.brand?.brandPersona?.emotions),
        industry: initialData?.brand?.brandPersona?.industry || '',
        audience: formatList(initialData?.brand?.brandPersona?.audience),
        designTags: formatList(initialData?.brand?.brandPersona?.designTags),
      },
    },
    showBrand: false,
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
    if (!formData.abstractUserId.trim()) {
      nextErrors.abstractUserId = 'Abstract User ID is required';
      message.error('Abstract User ID is required');
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      abstractUserId: formData.abstractUserId.trim(),
      ...(formData.planId.trim() && { planId: formData.planId.trim() }),
    };

    if (formData.showBrand) {
      const brand = {
        ...(formData.brand.brandName.trim() && { brandName: formData.brand.brandName.trim() }),
        ...(formData.brand.brandDescription.trim() && { brandDescription: formData.brand.brandDescription.trim() }),
        ...(formData.brand.brandUrl.trim() && { brandUrl: formData.brand.brandUrl.trim() }),
        ...(formData.brand.brandLogo.trim() && { brandLogo: formData.brand.brandLogo.trim() }),
        ...(formData.brand.brandColors.length > 0 && { brandColors: formData.brand.brandColors }),
        ...(formData.brand.brandFonts.trim() && { brandFonts: parseList(formData.brand.brandFonts) }),
        brandPersona: {
          ...(parseList(formData.brand.brandPersona.emotions).length > 0 && { emotions: parseList(formData.brand.brandPersona.emotions) }),
          ...(formData.brand.brandPersona.industry.trim() && { industry: formData.brand.brandPersona.industry.trim() }),
          ...(parseList(formData.brand.brandPersona.audience).length > 0 && { audience: parseList(formData.brand.brandPersona.audience) }),
          ...(parseList(formData.brand.brandPersona.designTags).length > 0 && { designTags: parseList(formData.brand.brandPersona.designTags) }),
        },
      };
      if (Object.keys(brand.brandPersona).length === 0) {
        delete brand.brandPersona;
      }
      if (Object.keys(brand).length > 0) {
        payload.brand = brand;
      }
    }

    onSubmit(payload);
  };

  const addColor = () => {
    setFormData((prev) => ({ ...prev, brand: { ...prev.brand, brandColors: [...prev.brand.brandColors, '#000000'] } }));
  };

  const updateColor = (index, value) => {
    const next = [...formData.brand.brandColors];
    next[index] = value;
    setFormData((prev) => ({ ...prev, brand: { ...prev.brand, brandColors: next } }));
  };

  const removeColor = (index) => {
    setFormData((prev) => ({
      ...prev,
      brand: { ...prev.brand, brandColors: prev.brand.brandColors.filter((_, i) => i !== index) },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="design-form">
      <h3 className="form-section-title">Login User</h3>
      <p className="form-hint">Log in an existing user or create a new user.</p>

      <div className="required-field">
        <TextInput
          label="Abstract User ID"
          value={formData.abstractUserId}
          onChange={(v) => {
            updateField('abstractUserId', v);
            if (errors.abstractUserId) setErrors((prev) => ({ ...prev, abstractUserId: undefined }));
          }}
          placeholder="e.g. user-12345"
        />
      </div>

      <TextInput
        label="Plan ID"
        value={formData.planId}
        onChange={(v) => updateField('planId', v)}
        placeholder="e.g. sp-01"
      />

      <div className="form-field">
        <label className="form-label">
          <input
            type="checkbox"
            checked={formData.showBrand}
            onChange={(e) => updateField('showBrand', e.target.checked)}
            style={{ marginRight: 8 }}
          />
          Include Brand (optional)
        </label>
      </div>

      {formData.showBrand && (
        <>
          <h4 className="form-section-title">Brand</h4>
          <TextInput
            label="Brand Name"
            value={formData.brand.brandName}
            onChange={(v) => updateField('brand.brandName', v)}
            placeholder="e.g. Sivi"
          />
          <TextAreaInput
            label="Brand Description"
            value={formData.brand.brandDescription}
            onChange={(v) => updateField('brand.brandDescription', v)}
            placeholder="Brief brand description"
            rows={3}
          />
          <TextInput
            label="Brand Website URL"
            value={formData.brand.brandUrl}
            onChange={(v) => updateField('brand.brandUrl', v)}
            placeholder="https://example.com"
            type="url"
          />
          <TextInput
            label="Brand Logo URL"
            value={formData.brand.brandLogo}
            onChange={(v) => updateField('brand.brandLogo', v)}
            placeholder="https://example.com/logo.png"
            type="url"
          />

          <div className="form-field">
            <label className="form-label">Brand Colors</label>
            <div className="color-list">
              {formData.brand.brandColors.map((color, index) => (
                <div key={index} className="color-list-item">
                  <ColorInput label="" value={color} onChange={(v) => updateColor(index, v)} />
                  <button type="button" className="color-remove" onClick={() => removeColor(index)} title="Remove color">
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
            value={formData.brand.brandFonts}
            onChange={(v) => updateField('brand.brandFonts', v)}
            placeholder="e.g. Inter, Roboto"
          />

          <h4 className="form-section-title">Brand Persona</h4>
          <TextInput
            label="Industry"
            value={formData.brand.brandPersona.industry}
            onChange={(v) => updateField('brand.brandPersona.industry', v)}
            placeholder="e.g. technology, retail, finance"
          />
          <TextInput
            label="Emotions (comma-separated)"
            value={formData.brand.brandPersona.emotions}
            onChange={(v) => updateField('brand.brandPersona.emotions', v)}
            placeholder="e.g. happy, excited, innovative"
          />
          <TextInput
            label="Audience (comma-separated)"
            value={formData.brand.brandPersona.audience}
            onChange={(v) => updateField('brand.brandPersona.audience', v)}
            placeholder="e.g. working mom, working dad"
          />
          <TextInput
            label="Design Tags (comma-separated)"
            value={formData.brand.brandPersona.designTags}
            onChange={(v) => updateField('brand.brandPersona.designTags', v)}
            placeholder="e.g. minimal, productivity, health"
          />
        </>
      )}

      <button type="submit" className="submit-button">
        Login / Create User
      </button>
    </form>
  );
};

/* ---------- Delete User Form ---------- */
const DeleteUserForm = ({ onSubmit, initialData }) => {
  const [abstractUserId, setAbstractUserId] = useState(initialData?.abstractUserId || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!abstractUserId.trim()) {
      setError('Abstract User ID is required');
      message.error('Abstract User ID is required');
      return;
    }
    setError('');
    onSubmit({ abstractUserId: abstractUserId.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="design-form">
      <h3 className="form-section-title">Delete User</h3>
      <p className="form-hint">Delete a user and their associated workspace.</p>

      <div className="required-field">
        <TextInput
          label="Abstract User ID"
          value={abstractUserId}
          onChange={(v) => {
            setAbstractUserId(v);
            if (error) setError('');
          }}
          placeholder="e.g. 281743-2322-34i44sd3-dkfjgdkjf292"
        />
      </div>

      <button type="submit" className="submit-button">
        Delete User
      </button>
    </form>
  );
};

/* ---------- Set User Credit Limit Form ---------- */
const SetUserCreditLimitForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    abstractUserId: initialData?.abstractUserId || '',
    creditLimit: initialData?.creditLimit ?? 0,
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!formData.abstractUserId.trim()) {
      nextErrors.abstractUserId = 'Abstract User ID is required';
    }
    if (formData.creditLimit === '' || Number.isNaN(Number(formData.creditLimit))) {
      nextErrors.creditLimit = 'Credit Limit is required and must be a number';
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      message.error(Object.values(nextErrors)[0]);
      return;
    }
    setErrors({});
    onSubmit({
      abstractUserId: formData.abstractUserId.trim(),
      creditLimit: Number(formData.creditLimit),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="design-form">
      <h3 className="form-section-title">Set User Credit Limit</h3>
      <p className="form-hint">Set a user&apos;s credit usage limit for the current billing cycle.</p>

      <div className="required-field">
        <TextInput
          label="Abstract User ID"
          value={formData.abstractUserId}
          onChange={(v) => {
            setFormData((prev) => ({ ...prev, abstractUserId: v }));
            if (errors.abstractUserId) setErrors((prev) => ({ ...prev, abstractUserId: undefined }));
          }}
          placeholder="e.g. 281743-2322-34i44sd3-dkfjgdkjf292"
        />
      </div>

      <div className="required-field">
        <NumberInput
          label="Credit Limit"
          value={formData.creditLimit}
          onChange={(v) => {
            setFormData((prev) => ({ ...prev, creditLimit: v }));
            if (errors.creditLimit) setErrors((prev) => ({ ...prev, creditLimit: undefined }));
          }}
          placeholder="e.g. -1 for unlimited, 100"
        />
      </div>

      <button type="submit" className="submit-button">
        Set Credit Limit
      </button>
    </form>
  );
};

export default UserManagementForm;
