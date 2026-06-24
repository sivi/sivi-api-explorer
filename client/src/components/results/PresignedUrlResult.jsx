import React, { useState, useCallback } from 'react';
import CopyJsonButton from '~/components/common/CopyJsonButton.jsx';

function CopyTextButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    try {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }, [text]);

  return (
    <button
      className="copy-url-btn"
      onClick={handleCopy}
      title={copied ? 'Copied!' : label}
      type="button"
    >
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
      <span>{copied ? 'Copied' : label}</span>
    </button>
  );
}

export default function PresignedUrlResult({ apiResponse }) {
  if (!apiResponse) {
    return (
      <div className="variant-empty-state">
        <p>Results will appear here after API call</p>
      </div>
    );
  }

  if (apiResponse.error) {
    return (
      <div className="brand-card brand-card-single">
        <h4>Something Went Wrong</h4>
        <p>{apiResponse.error}</p>
      </div>
    );
  }

  const body = apiResponse.body ?? apiResponse;
  const result = body?.result ?? body;

  const uploadUrl = result?.uploadUrl;
  const method = result?.method ?? 'PUT';
  const headers = result?.headers ?? {};
  const expiresIn = result?.expiresIn;
  const fileName = result?.fileName;

  // If no structured presigned URL data, fall back to raw JSON
  if (!uploadUrl) {
    return (
      <div className="json-result">
        <div className="status-badge">
          <span className="status-label">Status</span>
          <span className={`status-value status-${String(body?.status ?? 'unknown').toLowerCase()}`}>
            {String(body?.status ?? 'unknown')}
          </span>
        </div>
        <pre className="json-pre">
          {JSON.stringify(apiResponse, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="brand-card brand-card-single presigned-url-result">
      <CopyJsonButton data={result} />

      <h4>Presigned URL Generated</h4>

      <div className="presigned-url-section">
        <div className="presigned-url-header">
          <span className="presigned-url-label">UPLOAD URL</span>
          <CopyTextButton text={uploadUrl} label="Copy URL" />
        </div>
        <div className="presigned-url-scroll-wrapper">
          <code className="presigned-url-value">{uploadUrl}</code>
        </div>
      </div>

      <div className="presigned-url-grid">
        <div className="presigned-url-section">
          <span className="presigned-url-label">METHOD</span>
          <span className="presigned-url-badge">{method}</span>
        </div>

        {expiresIn !== undefined && (
          <div className="presigned-url-section">
            <span className="presigned-url-label">EXPIRES IN</span>
            <span className="presigned-url-badge">{expiresIn}s</span>
          </div>
        )}

        {fileName && (
          <div className="presigned-url-section">
            <span className="presigned-url-label">FILE NAME</span>
            <span className="presigned-url-text">{fileName}</span>
          </div>
        )}
      </div>

      {Object.keys(headers).length > 0 && (
        <div className="presigned-url-section">
          <span className="presigned-url-label">HEADERS</span>
          <div className="presigned-url-headers">
            {Object.entries(headers).map(([key, value]) => (
              <div key={key} className="presigned-url-header-row">
                <span className="presigned-url-header-key">{key}</span>
                <span className="presigned-url-header-value">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
