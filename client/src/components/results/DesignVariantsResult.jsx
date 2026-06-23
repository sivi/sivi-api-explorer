import React from 'react';
import ShowMoreButton from '~/components/common/ShowMoreButton.jsx';
import { UI_CONFIG } from '~/config/ui.js';

export default function DesignVariantsResult({ variants, apiInput, onLoadMore, hasMore, isLoadingMore }) {
  if (!variants?.length) return null;
  const dimensions = apiInput?.dimension || { width: 300, height: 300 };
  const aspectRatio = dimensions.width / dimensions.height;

  return (
    <div className="variants-masonry-wrapper" style={{ maxWidth: UI_CONFIG.VARIANTS_MAX_WIDTH }}>
      <div className="variants-masonry">
        {variants.map((variant, index) => (
          <div key={index} className="variant-card">
            <div className="variant-card-image" style={{ aspectRatio }}>
              <img
                src={variant.url}
                alt={`Variant ${index + 1}`}
                loading="lazy"
              />
            </div>
            <div className="variant-card-info">
              <span className="variant-card-size">
                {dimensions.width} × {dimensions.height}
              </span>
            </div>
          </div>
        ))}
      </div>
      {hasMore && onLoadMore && (
        <div className="show-more-wrapper">
          <ShowMoreButton onClick={onLoadMore} isLoading={isLoadingMore} />
        </div>
      )}
    </div>
  );
}
