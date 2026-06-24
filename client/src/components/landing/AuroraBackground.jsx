import React from 'react'

/**
 * Aurora-inspired animated background.
 * Uses multiple blurred gradient blobs that drift slowly,
 * creating a mesmerizing aurora effect.
 */
export default function AuroraBackground() {
  return (
    <div className="aurora-bg">
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />
      <div className="aurora-blob aurora-blob-4" />
      <div className="aurora-grid" />
      <div className="aurora-noise" />
    </div>
  )
}
