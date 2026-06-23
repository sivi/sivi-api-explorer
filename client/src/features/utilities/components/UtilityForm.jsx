import React, { useState } from 'react';
import { message } from 'antd';
import { TextInput, SelectInput, NumberInput } from '~/components/common/FormComponents';

const UtilityForm = ({ flowKey, onSubmit, initialData }) => {
  if (flowKey === 'get-design-variants') {
    return <DesignVariantsForm onSubmit={onSubmit} initialData={initialData} />;
  }
  if (flowKey === 'request-status') {
    return <RequestStatusForm onSubmit={onSubmit} initialData={initialData} />;
  }
  return <div className="placeholder-flow">Unknown utility flow: {flowKey}</div>;
};

const TYPE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'generated', label: 'Generated' },
  { value: 'edited', label: 'Edited' },
];

const DesignVariantsForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    designId: initialData?.designId || '',
    workspaceId: initialData?.workspaceId || '',
    ideaId: initialData?.ideaId || '',
    type: initialData?.type || 'all',
    limit: initialData?.limit ?? 20,
    cursor: initialData?.cursor || null,

  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.limit || Number(formData.limit) < 1) {
      message.error('Limit is required and must be at least 1');
      return;
    }

    const payload = {};
    if (formData.designId.trim()) payload.designId = formData.designId.trim();
    if (formData.workspaceId.trim()) payload.workspaceId = formData.workspaceId.trim();
    if (formData.ideaId.trim()) payload.ideaId = formData.ideaId.trim();
    if (formData.type) payload.type = formData.type;
    payload.limit = Number(formData.limit);
    // payload.cursor = null;

    if (!payload.designId && !payload.workspaceId && !payload.ideaId) {
      message.error('At least one of Design ID, Workspace ID, or Idea ID is required');
      return;
    }
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="design-form">
      <h3 className="form-section-title">Get Design Variants</h3>
      <p className="form-hint">Provide at least one of the following identifiers.</p>
      <div className="required-field">
        <TextInput
          label="Design ID"
          value={formData.designId}
          onChange={(v) => setFormData((prev) => ({ ...prev, designId: v }))}
          placeholder="e.g. d_s87vFxpfM0R"
        />
      </div>
      <div className="required-field">
        <TextInput
          label="Workspace ID"
          value={formData.workspaceId}
          onChange={(v) => setFormData((prev) => ({ ...prev, workspaceId: v }))}
          placeholder="e.g. dc6a1c20-1e94-11f0-abff-a1489713342b"
        />
      </div>
      <div className="required-field">
        <TextInput
          label="Idea ID"
          value={formData.ideaId}
          onChange={(v) => setFormData((prev) => ({ ...prev, ideaId: v }))}
          placeholder="e.g. i_s87vFxpfM0R"
        />
      </div>
      <hr className="form-divider" />
      <SelectInput
        label="Type"
        value={formData.type}
        onChange={(v) => setFormData((prev) => ({ ...prev, type: v }))}
        options={TYPE_OPTIONS}
      />
      <div className="required-field">
        <NumberInput
          label="Limit"
          value={formData.limit}
          onChange={(v) => setFormData((prev) => ({ ...prev, limit: v }))}
          placeholder="Number of variants per page (1-100)"
          min={1}
          max={100}
        />
      </div>
      <button type="submit" className="submit-button">
        Get Variants
      </button>
    </form>
  );
};

const RequestStatusForm = ({ onSubmit, initialData }) => {
  const [value, setValue] = useState(initialData?.requestId || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) {
      message.error('Request ID is required');
      return;
    }
    onSubmit({ requestId: value.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="design-form">
      <h3 className="form-section-title">Check Status</h3>
      <div className="required-field">
        <TextInput
          label="Request ID"
          value={value}
          onChange={setValue}
          placeholder="Enter request ID..."
        />
      </div>
      <button type="submit" className="submit-button">
        Check Status
      </button>
    </form>
  );
};

export default UtilityForm;
