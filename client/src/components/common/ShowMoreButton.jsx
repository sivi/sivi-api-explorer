import React from 'react';

export default function ShowMoreButton({ onClick, isLoading }) {
  if (isLoading) {
    return (
      <div className="show-more-container">
        <div className="dots-loader">
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }

  return (
    <div className="show-more-container">
      <button
        type="button"
        className="show-more-button"
        onClick={onClick}
      >
        Show More
      </button>
    </div>
  );
}
