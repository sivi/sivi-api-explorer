import React from 'react';
import ShowMoreButton from '~/components/common/ShowMoreButton.jsx';

function getFontImageURL(font) {
  if ((font.addedBy === 'user' || font.source === 'user') && font.wId) {
    return `https://media.hellosivi.com/user-data/${font.wId}/fonts/images/${font.id}.png`;
  }
  return `https://media.hellosivi.com/system/fonts/images/${font.id}.png`;
}

function resolveColorValue(color) {
  if (typeof color === 'string') return color;
  if (color && typeof color === 'object') {
    return color.primary || color.color || color.hex || JSON.stringify(color);
  }
  return String(color);
}

function resolveColorStyle(color) {
  if (typeof color === 'string') return color;
  if (color && typeof color === 'object') {
    return color.primary || color.color || color.hex || '#cccccc';
  }
  return String(color);
}

function renderBrandCard(brand, key) {
  const name = brand.brandName || brand.name || 'Brand';
  const colors = brand.brandColors || brand.colors || [];
  const logos = brand.brandLogos || brand.logos || (brand.brandLogo ? [brand.brandLogo] : []);
  const images = brand.brandImages || brand.images || [];
  const fonts = brand.brandFonts || brand.fonts || [];
  const persona = brand.brandPersona || brand.persona;

  const id = brand.bId || brand.brandId;
  const description = brand.brandDescription || brand.description;

  return (
    <div key={key} className="brand-card">
      {/* Full-width color palette bar */}
      {colors.length > 0 && (
        <div className="brand-color-palette">
          {colors.map((color, i) => (
            <div
              key={i}
              className="brand-color-bar"
              style={{ backgroundColor: resolveColorStyle(color) }}
              title={resolveColorValue(color)}
            />
          ))}
        </div>
      )}

      <div className="brand-card-body">
        {/* Header */}
        <div className="brand-header">
          <div className="brand-title-row">
            <div className="brand-title-info">
              <h4>{name}</h4>
              {id && <span className="brand-id">{id}</span>}
            </div>
          </div>
          {description && <p className="brand-description">{description}</p>}
          {brand.brandUrl && (
            <a
              className="brand-url-link"
              href={brand.brandUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {brand.brandUrl}
            </a>
          )}
        </div>

        {/* Color swatches with hex values */}
        {colors.length > 0 && (
          <div className="brand-colors-section">
            <span className="brand-section-label">Palette</span>
            <div className="brand-color-swatches">
              {colors.map((color, i) => (
                <div key={i} className="brand-color-swatch-item">
                  <span
                    className="color-swatch"
                    style={{ backgroundColor: resolveColorStyle(color) }}
                  />
                  <span className="color-value">{resolveColorValue(color)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logos */}
        {logos.length > 0 && (
          <div className="brand-images-section">
            <span className="brand-section-label">Logos</span>
            <div className="brand-images-row">
              {logos.map((logo, i) => (
                <img
                  key={i}
                  src={logo}
                  alt={`${name} logo ${i + 1}`}
                  className="brand-image"
                  style={{ objectFit: 'contain', padding: '8px', background: '#fff' }}
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        )}

        {/* Images */}
        {images.length > 0 && (
          <div className="brand-images-section">
            <span className="brand-section-label">Images</span>
            <div className="brand-images-row">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${name} reference ${i + 1}`}
                  className="brand-image"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        )}

        {/* Fonts */}
        {fonts.length > 0 && (
          <div className="brand-fonts-section">
            <span className="brand-section-label">Typography</span>
            <div className="brand-fonts-list">
              {fonts.map((font, i) => (
                <div key={i} className="brand-font">
                  <img
                    src={getFontImageURL(font)}
                    alt={font.name || font.id || 'Font preview'}
                    className="brand-font-preview"
                    loading="lazy"
                  />
                  <span className="brand-font-name">{font.name || font.id}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Persona */}
        {persona && (
          <div className="brand-persona">
            {persona.industry && (
              <div className="persona-row">
                <span className="persona-label">Industry</span>
                <span className="persona-tag">{persona.industry}</span>
              </div>
            )}
            {persona.emotions?.length > 0 && (
              <div className="persona-row">
                <span className="persona-label">Emotions</span>
                {persona.emotions.map((e, i) => (
                  <span key={i} className="persona-tag emotion">{e}</span>
                ))}
              </div>
            )}
            {persona.audience?.length > 0 && (
              <div className="persona-row">
                <span className="persona-label">Audience</span>
                {persona.audience.map((a, i) => (
                  <span key={i} className="persona-tag audience">{a}</span>
                ))}
              </div>
            )}
            {persona.designTags?.length > 0 && (
              <div className="persona-row">
                <span className="persona-label">Design Tags</span>
                {persona.designTags.map((t, i) => (
                  <span key={i} className="persona-tag design">{t}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function renderSuccessMessage(data) {
  const message =
    data.body?.message ?? data.body?.result?.message ?? 'Operation completed successfully';
  return (
    <div className="brand-card brand-card-single">
      <h4>Success</h4>
      <p>{message}</p>
    </div>
  );
}

export default function BrandResult({ apiResponse, onLoadMore, hasMore, isLoadingMore }) {
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

  // Extract-brand response: result.brandDetails is an array
  const brandDetails = result?.brandDetails;
  if (Array.isArray(brandDetails) && brandDetails.length > 0) {
    return (
      <div className="brand-results">
        {brandDetails.map((brand, index) => renderBrandCard(brand, index))}
      </div>
    );
  }
  if (brandDetails && typeof brandDetails === 'object') {
    return <div className="brand-results">{renderBrandCard(brandDetails, 'extracted')}</div>;
  }

  // List brands response: result.brands or body.brands
  const brands = result?.brands ?? body?.brands;
  if (brands?.length) {
    return (
      <>
        <div className="brand-results">
          {brands.map((brand, index) => renderBrandCard(brand, index))}
        </div>
        {hasMore && onLoadMore && <ShowMoreButton onClick={onLoadMore} isLoading={isLoadingMore} />}
      </>
    );
  }

  // Single brand response
  const singleBrand = result?.brand ?? body?.brand;
  if (singleBrand) {
    return <div className="brand-results">{renderBrandCard(singleBrand, 'single')}</div>;
  }

  // Generic success response (set-default, archive, etc.)
  const success = result?.success ?? body?.success;
  if (success === true || success === 'true') {
    return renderSuccessMessage(apiResponse);
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
