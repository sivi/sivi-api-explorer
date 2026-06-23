import React from 'react';
import ShowMoreButton from '~/components/common/ShowMoreButton.jsx';

function getFontImageURL(font) {
  if ((font.addedBy === 'user' || font.source === 'user') && font.wId) {
    return `https://media.hellosivi.com/user-data/${font.wId}/fonts/images/${font.id}.png`;
  }
  return `https://media.hellosivi.com/system/fonts/images/${font.id}.png`;
}

function renderBrandCard(brand, key) {
  const name = brand.brandName || brand.name || 'Brand';
  const colors = brand.brandColors || brand.colors || [];
  const logos = brand.brandLogos || brand.logos || (brand.brandLogo ? [brand.brandLogo] : []);
  const images = brand.brandImages || brand.images || [];
  const fonts = brand.brandFonts || brand.fonts || [];
  const persona = brand.brandPersona || brand.persona;

  const resolveColor = (color) => {
    if (typeof color === 'string') return color;
    if (color && typeof color === 'object') {
      return color.primary || color.color || color.hex || JSON.stringify(color);
    }
    return String(color);
  };

  const resolveColorStyle = (color) => {
    if (typeof color === 'string') return color;
    if (color && typeof color === 'object') {
      return color.primary || color.color || color.hex || '#cccccc';
    }
    return String(color);
  };

  return (
    <div key={key} className="brand-card">
      <h4>{name}</h4>
      {brand.brandDescription && <p>{brand.brandDescription}</p>}
      {brand.description && <p>{brand.description}</p>}
      {brand.bId && <p className="brand-meta">ID: {brand.bId}</p>}
      {brand.brandId && <p className="brand-meta">ID: {brand.brandId}</p>}

      {brand.brandUrl && (
        <p className="brand-url">
          <a href={brand.brandUrl} target="_blank" rel="noopener noreferrer">
            {brand.brandUrl}
          </a>
        </p>
      )}

      {logos.length > 0 && (
        <div className="brand-logos-row">
          {logos.map((logo, i) => (
            <img
              key={i}
              src={logo}
              alt={`${name} logo ${i + 1}`}
              className="brand-logo"
              loading="lazy"
            />
          ))}
        </div>
      )}

      {colors.length > 0 && (
        <div className="brand-colors">
          {colors.map((color, i) => (
            <div key={i} className="brand-color">
              <span className="color-swatch" style={{ backgroundColor: resolveColorStyle(color) }} />
              <span className="color-value">{resolveColor(color)}</span>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
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
      )}

      {fonts.length > 0 && (
        <div className="brand-fonts">
          <h5>Fonts</h5>
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

      {persona && (
        <div className="brand-persona">
          {persona.industry && (
            <div className="persona-row">
              <span className="persona-label">Industry:</span>
              <span className="persona-tag">{persona.industry}</span>
            </div>
          )}
          {persona.emotions?.length > 0 && (
            <div className="persona-row">
              <span className="persona-label">Emotions:</span>
              {persona.emotions.map((e, i) => (
                <span key={i} className="persona-tag emotion">{e}</span>
              ))}
            </div>
          )}
          {persona.audience?.length > 0 && (
            <div className="persona-row">
              <span className="persona-label">Audience:</span>
              {persona.audience.map((a, i) => (
                <span key={i} className="persona-tag audience">{a}</span>
              ))}
            </div>
          )}
          {persona.designTags?.length > 0 && (
            <div className="persona-row">
              <span className="persona-label">Design tags:</span>
              {persona.designTags.map((t, i) => (
                <span key={i} className="persona-tag design">{t}</span>
              ))}
            </div>
          )}
        </div>
      )}
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
