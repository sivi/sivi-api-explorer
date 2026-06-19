import React from 'react';

function renderBrandCard(brand, key) {
  const name = brand.brandName || brand.name || 'Brand';
  const colors = brand.brandColors || brand.colors || [];
  const logos = brand.brandLogos || brand.logos || (brand.brandLogo ? [brand.brandLogo] : []);
  const persona = brand.brandPersona || brand.persona;

  return (
    <div key={key} className="brand-card">
      <h4>{name}</h4>
      {brand.brandDescription && <p>{brand.brandDescription}</p>}
      {brand.description && <p>{brand.description}</p>}
      {brand.bId && <p className="brand-meta">ID: {brand.bId}</p>}
      {brand.brandId && <p className="brand-meta">ID: {brand.brandId}</p>}

      {logos.length > 0 && (
        <div className="brand-logos">
          {logos.map((logo, i) => (
            <img key={i} src={logo} alt={`${name} logo`} className="brand-logo" loading="lazy" />
          ))}
        </div>
      )}

      {colors.length > 0 && (
        <div className="brand-colors">
          {colors.map((color, i) => (
            <div key={i} className="brand-color">
              <span className="color-swatch" style={{ backgroundColor: color }} />
              <span className="color-value">{color}</span>
            </div>
          ))}
        </div>
      )}

      {persona && (
        <div className="brand-persona">
          {persona.industry && <span className="persona-tag">{persona.industry}</span>}
          {persona.emotions?.map((e, i) => (
            <span key={i} className="persona-tag emotion">{e}</span>
          ))}
          {persona.audience?.map((a, i) => (
            <span key={i} className="persona-tag audience">{a}</span>
          ))}
          {persona.designTags?.map((t, i) => (
            <span key={i} className="persona-tag design">{t}</span>
          ))}
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

export default function BrandResult({ apiResponse }) {
  if (!apiResponse) return null;

  const body = apiResponse.body ?? apiResponse;
  const result = body?.result ?? body;

  // Extract-brand response: result.brandDetails
  const brandDetails = result?.brandDetails;
  if (brandDetails) {
    return <div className="brand-results">{renderBrandCard(brandDetails, 'extracted')}</div>;
  }

  // List brands response: result.brands or body.brands
  const brands = result?.brands ?? body?.brands;
  if (brands?.length) {
    return (
      <div className="brand-results">
        {brands.map((brand, index) => renderBrandCard(brand, index))}
      </div>
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
