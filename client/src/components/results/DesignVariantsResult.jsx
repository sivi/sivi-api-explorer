import React from 'react';

export default function DesignVariantsResult({ variants, apiInput }) {
  if (!variants?.length) return null;
  const dimensions = apiInput?.dimension || { width: 300, height: 300 };
  const maxHeight = 400;
  const aspectRatio = dimensions.width / dimensions.height;
  let displayWidth = dimensions.width;
  let displayHeight = dimensions.height;
  if (displayHeight > maxHeight) {
    displayHeight = maxHeight;
    displayWidth = maxHeight * aspectRatio;
  }

  return (
    <div className="variants-list">
      {variants.map((variant, index) => (
        <div key={index} className="variant-row">
          <div className="variant-image">
            <img
              src={variant.url}
              alt={`Variant ${index + 1}`}
              style={{
                width: `${displayWidth}px`,
                height: `${displayHeight}px`,
                objectFit: 'contain',
              }}
            />
          </div>
          <div className="variant-details">
            <span className="variant-label">Variant {index + 1}</span>
            <span className="variant-size">
              {dimensions.width} × {dimensions.height}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
