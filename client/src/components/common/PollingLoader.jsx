import React from 'react';

/**
 * Compact loader shown below the JobPendingCard while the async job
 * is being processed via polling or webhook delivery.
 */
export default function PollingLoader({ flowLabel, isPolling, webhookEnabled }) {
  const message = isPolling
    ? `${flowLabel} is being processed — checking for status updates...`
    : webhookEnabled
      ? `${flowLabel} submitted — waiting for webhook delivery...`
      : `${flowLabel} is being processed, please wait...`;

  return (
    <div className="polling-loader">
      <div className="dots-loader">
        <span />
        <span />
        <span />
      </div>
      <p className="polling-loader-msg">{message}</p>
    </div>
  );
}
