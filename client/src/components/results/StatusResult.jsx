import React from 'react';

export default function StatusResult({ apiResponse }) {
  const status = apiResponse?.body?.status ?? apiResponse?.status ?? 'unknown';
  const body = apiResponse?.body ?? apiResponse;

  return (
    <div className="status-result">
      <div className="status-badge">
        <span className="status-label">Status</span>
        <span className={`status-value status-${String(status).toLowerCase()}`}>
          {String(status)}
        </span>
      </div>
      {body?.result && (
        <pre className="status-json">
          {JSON.stringify(body.result, null, 2)}
        </pre>
      )}
      {body?.requestId && (
        <p className="status-meta">Request ID: {body.requestId}</p>
      )}
      {body?.queueWaitTime !== undefined && (
        <p className="status-meta">Queue wait: {body.queueWaitTime}s</p>
      )}
    </div>
  );
}
