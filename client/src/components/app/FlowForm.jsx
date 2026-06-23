import React from 'react';
import DesignForm from '~/features/designs/components/DesignForm';
import DesignsFromContentForm from '~/features/designs/components/DesignsFromContentForm';
import ContentFromPromptForm from '~/features/content/components/ContentFromPromptForm';
import UtilityForm from '~/features/utilities/components/UtilityForm';
import BrandCreateForm from '~/features/brand/components/BrandCreateForm';
import BrandListPanel from '~/features/brand/components/BrandListPanel';
import BrandExtractForm from '~/features/brand/components/BrandExtractForm';
import BrandSetDefaultForm from '~/features/brand/components/BrandSetDefaultForm';
import BrandArchiveForm from '~/features/brand/components/BrandArchiveForm';
import BrandUpdateForm from '~/features/brand/components/BrandUpdateForm';
import UserManagementForm from '~/features/user/components/UserManagementForm';
import MediaListPanel from '~/features/media/components/MediaListPanel';
import MediaCreateForm from '~/features/media/components/MediaCreateForm';
import MediaUpdateForm from '~/features/media/components/MediaUpdateForm';
import MediaDeleteForm from '~/features/media/components/MediaDeleteForm';
import MediaGenerateForm from '~/features/media/components/MediaGenerateForm';
import FilePresignedUrlForm from '~/features/files/components/FilePresignedUrlForm';
import FontListPanel from '~/features/fonts/components/FontListPanel';
import FontUploadForm from '~/features/fonts/components/FontUploadForm';
import { FLOW_KEY_MAP } from '~/config/flows.js';

export default function FlowForm({ activeFlow, formKey, onSubmit, initialFormData }) {
  switch (activeFlow) {
    case 'designs-from-prompt':
      return (
        <DesignForm
          key={formKey}
          onSubmit={onSubmit}
          initialData={initialFormData}
        />
      );
    case 'designs-from-content':
      return (
        <DesignsFromContentForm
          key={formKey}
          onSubmit={onSubmit}
          initialData={initialFormData}
        />
      );
    case 'content-from-prompt':
      return (
        <ContentFromPromptForm
          key={formKey}
          onSubmit={onSubmit}
          initialData={initialFormData}
        />
      );
    case 'get-design-variants':
      return <UtilityForm flowKey="get-design-variants" onSubmit={onSubmit} initialData={initialFormData} />;
    case 'request-status':
      return <UtilityForm flowKey="request-status" onSubmit={onSubmit} initialData={initialFormData} />;
    case 'list-brands':
      return <BrandListPanel onSubmit={onSubmit} initialData={initialFormData} />;
    case 'create-brand':
      return <BrandCreateForm onSubmit={onSubmit} initialData={initialFormData} />;
    case 'extract-brand':
      return <BrandExtractForm onSubmit={onSubmit} initialData={initialFormData} />;
    case 'set-default-brand':
      return <BrandSetDefaultForm onSubmit={onSubmit} initialData={initialFormData} />;
    case 'archive-brand':
      return <BrandArchiveForm onSubmit={onSubmit} initialData={initialFormData} />;
    case 'update-brand':
      return <BrandUpdateForm onSubmit={onSubmit} initialData={initialFormData} />;
    case 'get-media':
      return <MediaListPanel onSubmit={onSubmit} initialData={initialFormData} />;
    case 'create-media':
      return <MediaCreateForm onSubmit={onSubmit} initialData={initialFormData} />;
    case 'update-media':
      return <MediaUpdateForm onSubmit={onSubmit} initialData={initialFormData} />;
    case 'delete-media':
      return <MediaDeleteForm onSubmit={onSubmit} initialData={initialFormData} />;
    case 'generate-media':
      return <MediaGenerateForm onSubmit={onSubmit} initialData={initialFormData} />;
    case 'get-presigned-url':
      return <FilePresignedUrlForm onSubmit={onSubmit} initialData={initialFormData} />;
    case 'get-fonts':
      return <FontListPanel onSubmit={onSubmit} initialData={initialFormData} />;
    case 'upload-fonts':
      return <FontUploadForm onSubmit={onSubmit} initialData={initialFormData} />;
    case 'login-user':
    case 'delete-user':
    case 'set-user-credit-limit':
      return (
        <UserManagementForm
          key={formKey}
          flowKey={activeFlow}
          onSubmit={onSubmit}
          initialData={initialFormData}
        />
      );
    default:
      return (
        <div className="placeholder-flow">
          <p>Flow &quot;{FLOW_KEY_MAP[activeFlow] || activeFlow}&quot; is not yet implemented.</p>
          <p>Select another flow from the dropdown above.</p>
        </div>
      );
  }
}
