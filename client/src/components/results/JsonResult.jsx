import React from 'react';

export default function JsonResult({ apiResponse }) {
  if (!apiResponse) {
    return (
      <div className="variant-empty-state">
        <p>Results will appear here after API call</p>
      </div>
    );
  }

  const status = apiResponse?.status ?? apiResponse?.body?.status ?? 'unknown';

  return (
    <div className="json-result">
      <div className="status-badge">
        <span className="status-label">Status</span>
        <span className={`status-value status-${String(status).toLowerCase()}`}>
          {String(status)}
        </span>
      </div>
      <pre className="json-pre">
        {JSON.stringify(apiResponse, null, 2)}
      </pre>
    </div>
  );
}
