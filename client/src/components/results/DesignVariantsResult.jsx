import React from 'react';
import ShowMoreButton from '~/components/common/ShowMoreButton.jsx';
import DesignVariantCard from './DesignVariantCard.jsx';
import { UI_CONFIG } from '~/config/ui.js';

export default function DesignVariantsResult({ variants, apiResponse, apiInput, onLoadMore, hasMore, isLoadingMore }) {
  if (!variants?.length) return null;

  const dimensions = apiInput?.dimension || { width: 300, height: 300 };

  // Use the full response variations so each option set is available for swapping.
  const fullVariations =
    apiResponse?.body?.result?.variations ??
    apiResponse?.result?.variations ??
    apiResponse?.body?.variations ??
    [];

  // Preserve the variant order and fall back to the mapped variant if the raw response shape differs.
  const items = variants.map((mapped, index) => fullVariations[index] || mapped);

  return (
    <div className="variants-masonry-wrapper" style={{ maxWidth: UI_CONFIG.VARIANTS_MAX_WIDTH }}>
      <div className="variants-masonry">
        {items.map((variation, index) => (
          <DesignVariantCard
            key={index}
            variation={variation}
            index={index}
            dimensions={dimensions}
          />
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
