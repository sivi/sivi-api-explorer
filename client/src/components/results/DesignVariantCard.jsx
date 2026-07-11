import React, { useState, useMemo } from 'react';
import CopyJsonButton from '~/components/common/CopyJsonButton.jsx';

function getOptionDisplayUrl(option) {
  return option?.variantImageUrl ?? option?.url ?? '';
}

function getOptionEditLink(option) {
  return option?.variantEditLink ?? option?.editLink ?? '';
}

function getOptionId(option) {
  return option?.variantId ?? option?.id ?? '';
}

export default function DesignVariantCard({ variation, index, dimensions }) {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);

  const choices = useMemo(() => {
    const options = variation?.options ?? [];
    return [variation, ...options];
  }, [variation]);

  const selectedOption = choices[selectedOptionIndex] ?? variation ?? {};
  const selectedUrl = getOptionDisplayUrl(selectedOption);
  const selectedEditLink = getOptionEditLink(selectedOption);
  const aspectRatio = dimensions?.width / dimensions?.height || 1;

  const hasOptions = choices.length > 1;

  return (
    <div className="variant-card">
      <CopyJsonButton data={selectedOption} />
      <div className="variant-card-main" style={{ aspectRatio }}>
        <img
          src={selectedUrl}
          alt={`Variant ${index + 1} option ${selectedOptionIndex + 1}`}
          loading="lazy"
        />
        {selectedEditLink && (
          <a
            href={selectedEditLink}
            target="_blank"
            rel="noreferrer"
            className="variant-edit-link"
            title="Open in Studio"
          >
            Edit
          </a>
        )}
      </div>
      <div className="variant-card-info">
        <span className="variant-card-label">Variant {index + 1}</span>
        <span className="variant-card-size">
          {dimensions?.width ?? selectedOption?.variantWidth ?? '-'} × {dimensions?.height ?? selectedOption?.variantHeight ?? '-'}
        </span>
      </div>
      {hasOptions && (
        <div className="variant-options">
          {choices.map((option, optionIndex) => {
            const url = getOptionDisplayUrl(option);
            const optionId = getOptionId(option);
            return (
              <button
                key={optionId || optionIndex}
                type="button"
                className={`variant-option-thumb${selectedOptionIndex === optionIndex ? ' selected' : ''}`}
                onClick={() => setSelectedOptionIndex(optionIndex)}
                title={`Option ${optionIndex + 1}`}
              >
                <img src={url} alt={`Option ${optionIndex + 1}`} loading="lazy" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
