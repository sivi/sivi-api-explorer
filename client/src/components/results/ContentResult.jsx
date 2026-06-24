import React from 'react';
import CopyJsonButton from '~/components/common/CopyJsonButton.jsx';

const IMAGE_KEYS = ['url', 'imageUrl', 'mediaUrl', 'src', 'icon', 'logo', 'thumbnail'];
const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?|$)/i;

function isImageField(key, value) {
  if (typeof value !== 'string') return false;
  const lowerKey = key.toLowerCase();
  if (IMAGE_KEYS.some((ik) => lowerKey.includes(ik))) return true;
  if (value.match(/^https?:\/\//i) && value.match(IMAGE_EXTENSIONS)) return true;
  return false;
}

function renderField(key, value) {
  if (value == null) return null;

  if (typeof value === 'boolean') {
    return (
      <div key={key} className="content-field">
        <span className="content-field-key">{key}</span>
        <span className="content-field-value">{value ? 'Yes' : 'No'}</span>
      </div>
    );
  }

  if (isImageField(key, value)) {
    return (
      <div key={key} className="content-field content-field-image">
        <span className="content-field-key">{key}</span>
        <img src={value} alt={key} loading="lazy" />
      </div>
    );
  }

  if (typeof value === 'string') {
    return (
      <div key={key} className="content-field">
        <span className="content-field-key">{key}</span>
        <span className="content-field-value">{value}</span>
      </div>
    );
  }

  return (
    <div key={key} className="content-field">
      <span className="content-field-key">{key}</span>
      <pre className="content-field-raw">{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
}

export default function ContentResult({ apiResponse }) {
  const content =
    apiResponse?.body?.content ??
    apiResponse?.body?.result?.content ??
    apiResponse?.body?.result?.contentSuggestions;
  const assets =
    apiResponse?.body?.result?.assetSuggestions ??
    apiResponse?.body?.assetSuggestions;

  const hasContent = content?.length > 0;
  const hasAssets = assets?.length > 0;

  if (!hasContent && !hasAssets) return null;

  return (
    <div className="content-results-wrapper">

      {hasContent && (
        <div className="content-section">
          {hasAssets && <h4 className="section-title">Content Suggestions</h4>}
          <div className="content-results">
            {content.map((item, index) => (
              <div key={index} className="content-card">
              <CopyJsonButton data={item} />
              <span className="content-index">{index + 1}</span>
                {typeof item === 'string' ? (
                  <p className="content-text">{item}</p>
                ) : (
                  <div className="content-fields">
                    {Object.entries(item).map(([key, value]) => renderField(key, value))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

        {hasAssets && (
        <div className="asset-section">
          <h4 className="section-title">Asset Suggestions</h4>
          <div className="asset-grid">
            {assets.map((asset, index) => (
              <div key={index} className="asset-card">
                <CopyJsonButton data={asset} />
                <img src={asset.url} alt={asset.name || `Asset ${index + 1}`} loading="lazy" />
                {asset.name && <span className="asset-name">{asset.name}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
