import React from 'react';

export default function LoginUserResult({ apiResponse }) {
  if (!apiResponse) {
    return (
      <div className="variant-empty-state">
        <p>Results will appear here after API call</p>
      </div>
    );
  }

  const body = apiResponse?.body ?? apiResponse;
  const status = apiResponse?.status ?? body?.status ?? 'unknown';

  return (
    <div className="status-result">
      <div className="status-badge">
        <span className="status-label">Status</span>
        <span className={`status-value status-${String(status).toLowerCase()}`}>
          {String(status)}
        </span>
      </div>

      {body?.workspaceId && (
        <div className="login-field">
          <span className="login-field-label">Workspace ID</span>
          <span className="login-field-value">{body.workspaceId}</span>
        </div>
      )}

      {body?.accessToken && (
        <div className="login-field">
          <span className="login-field-label">Access Token</span>
          <code className="login-token">{body.accessToken}</code>
        </div>
      )}

      {body?.refreshToken && (
        <div className="login-field">
          <span className="login-field-label">Refresh Token</span>
          <code className="login-token">{body.refreshToken}</code>
        </div>
      )}

      <details className="login-raw">
        <summary>Raw response</summary>
        <pre className="status-json">
          {JSON.stringify(apiResponse, null, 2)}
        </pre>
      </details>
    </div>
  );
}
