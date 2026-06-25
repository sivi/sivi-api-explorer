import React from 'react';
import { FLOW_TITLES } from '~/config/flowTitles.js';
import DesignVariantsResult from '~/components/results/DesignVariantsResult.jsx';
import ContentResult from '~/components/results/ContentResult.jsx';
import BrandResult from '~/components/results/BrandResult.jsx';
import MediaResult from '~/components/results/MediaResult.jsx';
import FontResult from '~/components/results/FontResult.jsx';
import StatusResult from '~/components/results/StatusResult.jsx';
import PresignedUrlResult from '~/components/results/PresignedUrlResult.jsx';
import JsonResult from '~/components/results/JsonResult.jsx';
import LoginUserResult from '~/components/results/LoginUserResult.jsx';
import EmptyResult from '~/components/common/EmptyResult.jsx';

const DESIGN_FLOWS = new Set(['designs-from-prompt', 'designs-from-content', 'get-design-variants']);
const BRAND_FLOWS = new Set(['list-brands', 'create-brand', 'extract-brand', 'set-default-brand', 'archive-brand', 'update-brand']);
const MEDIA_FLOWS = new Set(['get-media', 'create-media', 'update-media', 'delete-media', 'generate-media']);

function hasResultData(flowKey, { apiResponse, designVariants }) {
  if (DESIGN_FLOWS.has(flowKey)) {
    return !!designVariants?.length;
  }
  if (flowKey === 'content-from-prompt') {
    const body = apiResponse?.body;
    const content = body?.content ?? body?.result?.content ?? body?.result?.contentSuggestions;
    const assets = body?.result?.assetSuggestions ?? body?.assetSuggestions;
    return !!(content?.length || assets?.length);
  }
  // All other flows need apiResponse
  return !!apiResponse;
}

function getResultComponent(flowKey, { apiResponse, designVariants, apiInput, onLoadMore, hasMore, isLoadingMore }) {
  switch (flowKey) {
    case 'designs-from-prompt':
    case 'designs-from-content':
    case 'get-design-variants':
      return <DesignVariantsResult variants={designVariants} apiInput={apiInput} onLoadMore={onLoadMore} hasMore={hasMore} isLoadingMore={isLoadingMore} />;
    case 'content-from-prompt':
      return <ContentResult apiResponse={apiResponse} />;
    case 'list-brands':
    case 'create-brand':
    case 'extract-brand':
    case 'set-default-brand':
    case 'archive-brand':
    case 'update-brand':
      return <BrandResult apiResponse={apiResponse} onLoadMore={onLoadMore} hasMore={hasMore} isLoadingMore={isLoadingMore} />;
    case 'request-status':
      return <StatusResult apiResponse={apiResponse} />;
    case 'get-media':
    case 'create-media':
    case 'update-media':
    case 'delete-media':
    case 'generate-media':
      return <MediaResult apiResponse={apiResponse} onLoadMore={onLoadMore} hasMore={hasMore} isLoadingMore={isLoadingMore} />;
    case 'get-presigned-url':
      return <PresignedUrlResult apiResponse={apiResponse} />;
    case 'get-fonts':
      return <FontResult apiResponse={apiResponse} onLoadMore={onLoadMore} hasMore={hasMore} isLoadingMore={isLoadingMore} />;
    case 'upload-fonts':
      return <StatusResult apiResponse={apiResponse} />;
    case 'login-user':
      return <LoginUserResult apiResponse={apiResponse} />;
    case 'delete-user':
    case 'set-user-credit-limit':
      return <JsonResult apiResponse={apiResponse} />;
    default:
      return null;
  }
}

export default function ResultView({
  activeFlow,
  isLoading,
  isFlowPolling,
  apiResponse,
  designVariants,
  apiInput,
  webhookEnabled,
  webhookUrl,
  onLoadMore,
  hasMore,
  isLoadingMore,
}) {
  // isFlowPolling is a per-flow function so switching flows doesn't
  // show a loader for unrelated background jobs.
  const flowIsPolling = isFlowPolling ? isFlowPolling(activeFlow) : false;
  if (isLoading || flowIsPolling) {
    const flowLabel = FLOW_TITLES[activeFlow] || 'Request';
    return (
      <div className="loading-state">
        <div className="spinner" />
        {flowIsPolling ? (
          <p>{flowLabel} is being processed, please wait... (Checking for status)</p>
        ) : isLoading && webhookEnabled && webhookUrl ? (
          <p>{flowLabel} submitted — results will be delivered via webhook.</p>
        ) : (
          <p>Processing {flowLabel.toLowerCase()}...</p>
        )}
      </div>
    );
  }

  if (!hasResultData(activeFlow, { apiResponse, designVariants })) {
    return <EmptyResult />;
  }

  const resultEl = getResultComponent(activeFlow, { apiResponse, designVariants, apiInput, onLoadMore, hasMore, isLoadingMore });
  const flowLabel = FLOW_TITLES[activeFlow] || 'Result';
  return (
    <>
      <h2 className="result-section-heading">{flowLabel}</h2>
      {resultEl}
    </>
  );
}
