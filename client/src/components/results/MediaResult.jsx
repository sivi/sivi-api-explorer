import React from 'react';
import ShowMoreButton from '~/components/common/ShowMoreButton.jsx';
import CopyJsonButton from '~/components/common/CopyJsonButton.jsx';

function formatDate(ts) {
  if (!ts) return '';
  const d = new Date(ts * 1000);
  return d.toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  }) + ' ' + d.toLocaleTimeString(undefined, {
    hour: '2-digit', minute: '2-digit',
  });
}

function renderMediaCard(media, key) {
  const mId = media.mId || 'Unknown';
  const type = (media.type || '').toUpperCase();
  const subType = (media.subType || '').toUpperCase();
  const url = media.url || '';
  const system = (media.system || '').toUpperCase();
  const createdOn = media.createdOn;
  const meta = media.meta || {};
  const remoteUrl = media.remoteUrl || '';

  return (
    <div key={key} className="brand-card media-card" title={mId}>
      <CopyJsonButton data={media} />
      <div className="media-card-visual">
        {(url || remoteUrl) ? (
          <img src={remoteUrl || url} alt={mId} className="media-preview-img" loading="lazy" />
        ) : (
          <div className="media-card-no-image">No Preview</div>
        )}
      </div>

      <div className="media-card-details">
        {type && (
          <div className="media-card-row">
            <span className="media-card-label">TYPE</span>
            <span className="media-card-value">{type}{subType ? ` / ${subType}` : ''}</span>
          </div>
        )}
        {system && (
          <div className="media-card-row">
            <span className="media-card-label">SYSTEM</span>
            <span className="media-card-value">{system}</span>
          </div>
        )}
        {createdOn && (
          <div className="media-card-row">
            <span className="media-card-label">CREATED</span>
            <span className="media-card-value">{formatDate(createdOn)}</span>
          </div>
        )}

        {meta.touchPosition && (
          <div className="media-card-row">
            <span className="media-card-label">TOUCH</span>
            <div className="media-card-tags">
              {Object.entries(meta.touchPosition)
                .filter(([, v]) => v)
                .map(([k]) => (
                  <span key={k} className="persona-tag design">{k}</span>
                ))}
            </div>
          </div>
        )}

        {meta.imagePreference && (
          <div className="media-card-row">
            <span className="media-card-label">PREFS</span>
            <div className="media-card-tags">
              {Object.entries(meta.imagePreference)
                .filter(([, v]) => v)
                .map(([k]) => (
                  <span key={k} className="persona-tag emotion">{k}</span>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MediaResult({ apiResponse, onLoadMore, hasMore, isLoadingMore }) {
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
      <>
        <div className="brand-results media-results">
          {mediaList.length > 0 ? (
            mediaList.map((media, index) => renderMediaCard(media, index))
          ) : (
            <div className="brand-card brand-card-single">
              <h4>No Media Found</h4>
            </div>
          )}
        </div>
        {hasMore && onLoadMore && <ShowMoreButton onClick={onLoadMore} isLoading={isLoadingMore} />}
      </>
    );
  }

  // Single media response (object, not array)
  const singleMedia = result?.media ?? body?.media;
  if (singleMedia && typeof singleMedia === 'object') {
    return <div className="brand-results media-results">{renderMediaCard(singleMedia, 'single')}</div>;
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
      <div className="brand-results media-results">
        {images.map((img, index) => (
          <div key={index} className="brand-card media-card" title={img.mId || `Generated ${index + 1}`}>
            <CopyJsonButton data={img} />
            <div className="media-card-visual">
              {img.remoteUrl ? (
                <img src={img.remoteUrl} alt={`Generated ${index + 1}`} className="media-preview-img" loading="lazy" />
              ) : (
                <div className="media-card-no-image">No Preview</div>
              )}
            </div>
            <div className="media-card-details">
              <div className="media-card-row">
                <span className="media-card-label">TYPE</span>
                <span className="media-card-value">GENERATED</span>
              </div>
              {img.mId && (
                <div className="media-card-row">
                  <span className="media-card-label">MEDIA ID</span>
                  <span className="media-card-value">{img.mId}</span>
                </div>
              )}
              {img.remoteUrl && (
                <div className="media-card-row">
                  <span className="media-card-label">URL</span>
                  <span className="media-card-value media-card-url">{img.remoteUrl}</span>
                </div>
              )}
            </div>
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
