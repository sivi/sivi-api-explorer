import React from 'react';
import ShowMoreButton from '~/components/common/ShowMoreButton.jsx';
import CopyJsonButton from '~/components/common/CopyJsonButton.jsx';

function BrandCarousel({ children }) {
  const rowRef = React.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const updateScrollState = React.useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 1);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  React.useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState, children]);

  const scrollBy = (direction) => {
    const el = rowRef.current;
    if (!el) return;
    const itemWidth = 130;
    el.scrollBy({ left: direction * itemWidth * 3, behavior: 'smooth' });
  };

  return (
    <div className="brand-carousel">
      {canScrollLeft && (
        <button
          type="button"
          className="brand-carousel-arrow brand-carousel-arrow--left"
          onClick={() => scrollBy(-1)}
          aria-label="Scroll left"
        />
      )}
      <div className="brand-images-row" ref={rowRef}>
        {children}
      </div>
      {canScrollRight && (
        <button
          type="button"
          className="brand-carousel-arrow brand-carousel-arrow--right"
          onClick={() => scrollBy(1)}
          aria-label="Scroll right"
        />
      )}
    </div>
  );
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

function renderBrandCard(brand, key, extraClass = '') {
  const name = brand.brandName || brand.name || 'Brand';
  const colors = brand.brandColors || brand.colors || [];
  const logos = brand.brandLogos || brand.logos || (brand.brandLogo ? [brand.brandLogo] : []);
  const images = brand.brandImages || brand.images || [];
  const rawFontGroups = brand.brandFonts || brand.fonts || [];
  const fontGroups = rawFontGroups.every((item) => Array.isArray(item))
    ? rawFontGroups.filter((group) => group.length > 0)
    : rawFontGroups.length > 0
      ? [rawFontGroups]
      : [];
  const persona = brand.brandPersona || brand.persona;

  const id = brand.bId || brand.brandId;
  const description = brand.brandDescription || brand.description;

  return (
    <div key={key} className={`brand-card ${extraClass}`.trim()}>
      <CopyJsonButton data={brand} />
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
            <BrandCarousel>
              {logos.map((logo, i) => (
                <img
                  key={i}
                  src={logo}
                  alt={`${name} logo ${i + 1}`}
                  className="brand-image"
                  style={{ objectFit: 'contain', padding: '8px' }}
                  loading="lazy"
                />
              ))}
            </BrandCarousel>
          </div>
        )}

        {/* Images */}
        {images.length > 0 && (
          <div className="brand-images-section">
            <span className="brand-section-label">Images</span>
            <BrandCarousel>
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${name} reference ${i + 1}`}
                  className="brand-image"
                  loading="lazy"
                />
              ))}
            </BrandCarousel>
          </div>
        )}

        {/* Fonts */}
        {fontGroups.length > 0 && (
          <div className="brand-fonts-section">
            <span className="brand-section-label">Typography</span>
            <div className="brand-font-groups">
              {fontGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="brand-font-group">
                  <div className="brand-fonts-list">
                    {group.map((font, i) => (
                      <React.Fragment key={font.id || i}>
                        <img
                          src={font.imageUrl}
                          alt={font.name || font.id || 'Font preview'}
                          className="brand-font-preview"
                          loading="lazy"
                        />
                        {i < group.length - 1 && (
                          <span className="brand-font-divider" aria-hidden="true" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
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
      <CopyJsonButton data={data} />
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
        {brandDetails.map((brand, index) => renderBrandCard(brand, index, 'brand-card--listing'))}
      </div>
    );
  }
  if (brandDetails && typeof brandDetails === 'object') {
    return <div className="brand-results">{renderBrandCard(brandDetails, 'extracted', 'brand-card--listing')}</div>;
  }

  // List brands response: result.brands or body.brands
  const brands = result?.brands ?? body?.brands;
  if (brands?.length) {
    return (
      <>
        <div className="brand-results">
          {brands.map((brand, index) => renderBrandCard(brand, index, 'brand-card--listing'))}
        </div>
        {hasMore && onLoadMore && <ShowMoreButton onClick={onLoadMore} isLoading={isLoadingMore} />}
      </>
    );
  }

  // Single brand response (brand, brandDetail)
  const singleBrand = result?.brand ?? body?.brand ?? result?.brandDetail ?? body?.brandDetail;
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
        <pre className="brand-raw">{JSON.stringify(body, null, 2)}</pre>
      </div>
    );
  }

  return null;
}
