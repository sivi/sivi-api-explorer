import React from 'react';

function renderMediaCard(media, key) {
  const mId = media.mId || 'Unknown';
  const type = media.type || '';
  const subType = media.subType || '';
  const url = media.url || '';
  const system = media.system || '';
  const createdOn = media.createdOn;
  const meta = media.meta || {};

  return (
    <div key={key} className="brand-card">
      <h4>{mId}</h4>
      {type && <p className="brand-meta">Type: {type} / {subType}</p>}
      {system && <p className="brand-meta">System: {system}</p>}
      {createdOn && <p className="brand-meta">Created: {new Date(createdOn * 1000).toLocaleString()}</p>}

      {url && (
        <div className="media-preview">
          <img src={url} alt={mId} className="media-preview-img" loading="lazy" />
        </div>
      )}

      {meta.touchPosition && (
        <div className="brand-persona">
          <div className="persona-row">
            <span className="persona-label">Touch:</span>
            {Object.entries(meta.touchPosition)
              .filter(([, v]) => v)
              .map(([k]) => (
                <span key={k} className="persona-tag design">{k}</span>
              ))}
          </div>
        </div>
      )}

      {meta.imagePreference && (
        <div className="brand-persona">
          <div className="persona-row">
            <span className="persona-label">Prefs:</span>
            {Object.entries(meta.imagePreference)
              .filter(([, v]) => v)
              .map(([k]) => (
                <span key={k} className="persona-tag emotion">{k}</span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MediaResult({ apiResponse }) {
  if (!apiResponse) return null;

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

  // List media response (array)
  const mediaList = result?.media ?? body?.media;
  if (Array.isArray(mediaList)) {
    return (
      <div className="brand-results">
        {mediaList.length > 0 ? (
          mediaList.map((media, index) => renderMediaCard(media, index))
        ) : (
          <div className="brand-card brand-card-single">
            <h4>No Media Found</h4>
          </div>
        )}
        {result?.cursor && <p className="brand-meta">Cursor: {result.cursor}</p>}
      </div>
    );
  }

  // Single media response (object, not array)
  const singleMedia = result?.media ?? body?.media;
  if (singleMedia && typeof singleMedia === 'object') {
    return <div className="brand-results">{renderMediaCard(singleMedia, 'single')}</div>;
  }

  // Delete response
  const deletedCount = result?.deletedCount ?? body?.deletedCount;
  if (deletedCount !== undefined) {
    return (
      <div className="brand-card brand-card-single">
        <h4>Deleted</h4>
        <p>{deletedCount} media asset(s) deleted.</p>
      </div>
    );
  }

  // Generate-media completed response (images array)
  const images = result?.images ?? body?.images;
  if (Array.isArray(images) && images.length > 0) {
    return (
      <div className="brand-results">
        {images.map((img, index) => (
          <div key={index} className="brand-card">
            <h4>Generated Image {index + 1}</h4>
            {img.remoteUrl && (
              <div className="media-preview">
                <img src={img.remoteUrl} alt={`Generated ${index + 1}`} className="media-preview-img" loading="lazy" />
              </div>
            )}
            {img.remoteUrl && (
              <p className="brand-meta">Remote URL: {img.remoteUrl}</p>
            )}
            {img.mId && <p className="brand-meta">Media ID: {img.mId}</p>}
          </div>
        ))}
      </div>
    );
  }

  // Generic success / requestId (only show queued if no images yet)
  const requestId = result?.requestId ?? body?.requestId;
  if (requestId) {
    return (
      <div className="brand-card brand-card-single">
        <h4>Job Queued</h4>
        <p>Request ID: {requestId}</p>
      </div>
    );
  }

  // Show raw response if nothing matched
  if (Object.keys(body || {}).length > 0) {
    return (
      <div className="brand-card brand-card-single">
        <h4>Response</h4>
        <pre className="brand-raw">{JSON.stringify(body, null, 2)}</pre>
      </div>
    );
  }

  return null;
}
