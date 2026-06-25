import React, { useState } from 'react';

/**
 * Extracts requestId from various response shapes.
 */
function getRequestId(apiResponse) {
  const body = apiResponse?.body ?? apiResponse;
  return (
    body?.requestId ??
    apiResponse?.requestId ??
    apiResponse?.data?.requestId ??
    body?.result?.requestId
  );
}

/**
 * Card that displays the initial REST API response for async job flows.
 * Shows status badge, requestId, queueWaitTime, and optional raw JSON.
 */
export default function JobPendingCard({ apiResponse }) {
  const [showRaw, setShowRaw] = useState(false);

  if (!apiResponse) return null;

  if (apiResponse.error) {
    return (
      <div className="job-pending-card job-pending-card--error">
        <div className="job-pending-header">
          <span className="job-pending-status-badge job-pending-status--error">
            Error
          </span>
        </div>
        <p className="job-pending-error-msg">{apiResponse.error}</p>
      </div>
    );
  }

  const body = apiResponse?.body ?? apiResponse;
  const requestId = getRequestId(apiResponse);
  const status = body?.status ?? apiResponse?.status ?? 'queued';
  const queueWaitTime = body?.queueWaitTime ?? apiResponse?.queueWaitTime;

  return (
    <div className="job-pending-card">
      <div className="job-pending-header">
        <span className={`job-pending-status-badge job-pending-status--${String(status).toLowerCase()}`}>
          {String(status)}
        </span>
        <button
          type="button"
          className="job-pending-toggle"
          onClick={() => setShowRaw((v) => !v)}
        >
          {showRaw ? 'Hide' : 'Show'} raw response
        </button>
      </div>

      {requestId && (
        <div className="job-pending-field">
          <span className="job-pending-field-label">Request ID</span>
          <code className="job-pending-field-value">{requestId}</code>
        </div>
      )}

      {queueWaitTime !== undefined && queueWaitTime !== null && (
        <div className="job-pending-field">
          <span className="job-pending-field-label">Queue wait</span>
          <span className="job-pending-field-value">
            {Math.round(queueWaitTime / 1000)}s
          </span>
        </div>
      )}

      {showRaw && (
        <pre className="job-pending-raw">
          {JSON.stringify(apiResponse, null, 2)}
        </pre>
      )}
    </div>
  );
}
