import React from 'react';

export default function EmptyResult({ message = 'Submit the form to see results' }) {
  return (
    <div className="empty-result-placeholder">
      <div className="empty-result-glow" />
      <div className="empty-result-card">
        <svg
          className="empty-result-icon"
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="empty-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#818cf8" />
              <stop offset="0.5" stopColor="#c084fc" />
              <stop offset="1" stopColor="#f472b6" />
            </linearGradient>
          </defs>
          <rect x="10" y="10" width="44" height="44" rx="12" stroke="url(#empty-grad)" strokeWidth="2" opacity="0.5" />
          <path d="M20 24h24M20 32h24M20 40h16" stroke="url(#empty-grad)" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          <circle cx="48" cy="44" r="8" fill="rgba(255,255,255,0.04)" stroke="url(#empty-grad)" strokeWidth="2" />
          <path d="M44.5 40.5 L44.5 47.5 L51.5 44 Z" fill="url(#empty-grad)" />
        </svg>
        <p className="empty-result-text">{message}</p>
      </div>
    </div>
  );
}
