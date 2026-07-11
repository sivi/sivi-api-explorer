import React from 'react';
import ShowMoreButton from '~/components/common/ShowMoreButton.jsx';
import CopyJsonButton from '~/components/common/CopyJsonButton.jsx';

function renderFontCard(font, key) {
  const id = font.id || 'Unknown';
  const name = font.name || id;
  const classification = font.classification || [];
  const previewImage = font.previewImage

  return (
    <div key={key} className="brand-card font-result-card">
      <CopyJsonButton data={font} />
      <div className="brand-font">
        <img
          src={previewImage}
          alt={name}
          className="brand-font-preview"
          loading="lazy"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="brand-font-info">
          <h4 className="brand-font-name">{name}</h4>
          {classification.length > 0 && (
            <p className="brand-meta">
              {classification.join(', ')}
            </p>
          )}
          <p className="brand-meta font-id">ID: {id}</p>
        </div>
      </div>
    </div>
  );
}

export default function FontResult({ apiResponse, onLoadMore, hasMore, isLoadingMore }) {
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
  const fonts = body?.data ?? body?.fonts ?? body?.result?.data;

  if (Array.isArray(fonts)) {
    return (
      <>
        <div className="brand-results">
          {fonts.length > 0 ? (
            fonts.map((font, index) => renderFontCard(font, index))
          ) : (
            <div className="brand-card brand-card-single">
              <h4>No Fonts Found</h4>
            </div>
          )}
        </div>
        {hasMore && onLoadMore && <ShowMoreButton onClick={onLoadMore} isLoading={isLoadingMore} />}
      </>
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
