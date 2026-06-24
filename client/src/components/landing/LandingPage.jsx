import React from 'react'
import AuroraBackground from './AuroraBackground.jsx'

const FEATURES = [
  {
    icon: '🎨',
    title: 'Design Generation',
    desc: 'Generate stunning designs from text prompts using Sivi\'s Large Design Model (LDM).',
  },
  {
    icon: '⚡',
    title: 'Real-time Monitoring',
    desc: 'View API responses, request logs, and performance metrics in real-time.',
  },
  {
    icon: '🔄',
    title: 'Design Variants',
    desc: 'Explore multiple variations of generated designs with a single click.',
  },
  {
    icon: '📊',
    title: 'Status Polling',
    desc: 'Monitor asynchronous design generation progress with live status updates.',
  },
  {
    icon: '🏷️',
    title: 'Brand Management',
    desc: 'Create, extract, and manage brands with full CRUD operations.',
  },
  {
    icon: '🎬',
    title: 'Media & Files',
    desc: 'Generate media, upload fonts, and manage files with presigned URLs.',
  },
]

const API_FLOWS = [
  { label: 'Designs from Prompt', group: 'Core' },
  { label: 'Designs from Content', group: 'Core' },
  { label: 'Content from Prompt', group: 'Core' },
  { label: 'Get Design Variants', group: 'Utilities' },
  { label: 'Request Status', group: 'Utilities' },
  { label: 'List Brands', group: 'Brand' },
  { label: 'Extract Brand', group: 'Brand' },
  { label: 'Generate Media', group: 'Media' },
  { label: 'Upload Fonts', group: 'Fonts' },
  { label: 'Get Presigned URL', group: 'Files' },
]

export default function LandingPage({ onLaunch }) {
  return (
    <div className="landing-page">
      <AuroraBackground />

      {/* Nav bar */}
      <nav className="landing-nav">
        <div className="landing-nav-logo">
          <img src="/sivi-logo.png" alt="Sivi AI" className="landing-nav-logo-img" />
          <span className="landing-nav-logo-text">Sivi API Explorer</span>
        </div>
        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#api-flows">API Flows</a>
          <a href="https://developer.sivi.ai/docs/sivi-api/overview" target="_blank" rel="noreferrer">
            Docs
          </a>
          <button className="landing-nav-cta" onClick={onLaunch}>
            Launch Explorer
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-badge">
          <span className="landing-hero-badge-dot" />
          Powered by Sivi Large Design Model
        </div>
        <h1 className="landing-hero-title">
          Explore the <span className="landing-hero-gradient-text">Sivi API</span>
          <br />
          in real-time
        </h1>
        <p className="landing-hero-subtitle">
          An interactive playground to test design generation, brand management, media processing,
          and more — all through a single elegant interface.
        </p>
        <div className="landing-hero-actions">
          <button className="landing-btn-primary" onClick={onLaunch}>
            <span>Launch API Explorer</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <a
            className="landing-btn-secondary"
            href="https://developer.sivi.ai/docs/sivi-api/overview"
            target="_blank"
            rel="noreferrer"
          >
            Read Documentation
          </a>
        </div>
        <div className="landing-hero-stats">
          <div className="landing-hero-stat">
            <span className="landing-hero-stat-value">20+</span>
            <span className="landing-hero-stat-label">API Endpoints</span>
          </div>
          <div className="landing-hero-stat-divider" />
          <div className="landing-hero-stat">
            <span className="landing-hero-stat-value">7</span>
            <span className="landing-hero-stat-label">Flow Categories</span>
          </div>
          <div className="landing-hero-stat-divider" />
          <div className="landing-hero-stat">
            <span className="landing-hero-stat-value">Real-time</span>
            <span className="landing-hero-stat-label">Monitoring</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features" id="features">
        <div className="landing-section-header">
          <h2>Everything you need to explore</h2>
          <p>A comprehensive toolkit for interacting with the Sivi AI platform</p>
        </div>
        <div className="landing-features-grid">
          {FEATURES.map((feature) => (
            <div className="landing-feature-card" key={feature.title}>
              <div className="landing-feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* API Flows */}
      <section className="landing-flows" id="api-flows">
        <div className="landing-section-header">
          <h2>Supported API Flows</h2>
          <p>Test every endpoint with preset templates and real-time responses</p>
        </div>
        <div className="landing-flows-grid">
          {API_FLOWS.map((flow) => (
            <div className="landing-flow-tag" key={flow.label}>
              <span className="landing-flow-tag-group">{flow.group}</span>
              <span className="landing-flow-tag-label">{flow.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="landing-cta-content">
          <h2>Ready to explore?</h2>
          <p>Jump right into the interactive API explorer and start generating designs.</p>
          <button className="landing-btn-primary landing-btn-lg" onClick={onLaunch}>
            <span>Launch API Explorer</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-content">
          <div className="landing-footer-brand">
            <img src="/sivi-logo.png" alt="Sivi AI" className="landing-footer-logo" />
            <span>Sivi API Explorer</span>
          </div>
          <div className="landing-footer-links">
            <a href="https://sivi.ai" target="_blank" rel="noreferrer">Sivi AI</a>
            <a href="https://developer.sivi.ai" target="_blank" rel="noreferrer">Developer Portal</a>
            <a href="https://developer.sivi.ai/docs/sivi-api/overview" target="_blank" rel="noreferrer">API Docs</a>
            <a href="https://support.sivi.ai" target="_blank" rel="noreferrer">Support</a>
          </div>
          <div className="landing-footer-copy">
            Built with ❤️ by the Sivi AI team
          </div>
        </div>
      </footer>
    </div>
  )
}
