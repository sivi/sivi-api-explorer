import React, { useState } from 'react';
import { message } from 'antd';
import { TextInput } from '~/components/common/FormComponents';

const UtilityForm = ({ flowKey, onSubmit, initialData }) => {
  if (flowKey === 'get-design-variants') {
    return <DesignVariantsForm onSubmit={onSubmit} initialData={initialData} />;
  }
  if (flowKey === 'request-status') {
    return <RequestStatusForm onSubmit={onSubmit} initialData={initialData} />;
  }
  return <div className="placeholder-flow">Unknown utility flow: {flowKey}</div>;
};

const DesignVariantsForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    designId: initialData?.designId || '',
    workspaceId: initialData?.workspaceId || '',
    ideaId: initialData?.ideaId || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {};
    if (formData.designId.trim()) payload.designId = formData.designId.trim();
    if (formData.workspaceId.trim()) payload.workspaceId = formData.workspaceId.trim();
    if (formData.ideaId.trim()) payload.ideaId = formData.ideaId.trim();

    if (Object.keys(payload).length === 0) {
      message.error('At least one of Design ID, Workspace ID, or Idea ID is required');
      return;
    }
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="design-form">
      <h3 className="form-section-title">Get Design Variants</h3>
      <p className="form-hint">Provide at least one of the following identifiers.</p>
      <TextInput
        label="Design ID"
        value={formData.designId}
        onChange={(v) => setFormData((prev) => ({ ...prev, designId: v }))}
        placeholder="e.g. d_s87vFxpfM0R"
      />
      <TextInput
        label="Workspace ID"
        value={formData.workspaceId}
        onChange={(v) => setFormData((prev) => ({ ...prev, workspaceId: v }))}
        placeholder="e.g. dc6a1c20-1e94-11f0-abff-a1489713342b"
      />
      <TextInput
        label="Idea ID"
        value={formData.ideaId}
        onChange={(v) => setFormData((prev) => ({ ...prev, ideaId: v }))}
        placeholder="e.g. i_s87vFxpfM0R"
      />
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
