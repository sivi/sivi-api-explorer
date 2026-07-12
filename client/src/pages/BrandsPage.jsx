import React from 'react'
import { useNavigate } from 'react-router-dom'
import './brandsPage.css'

const BRANDS_JSON_URL = '/brands/brands.json'

function resolveLogo(brand) {
  return brand.logo || brand.brandLogo || (brand.brandLogos && brand.brandLogos[0]) || ''
}

function resolveColors(brand) {
  return brand.colors || brand.brandColors || []
}

function resolveColorValue(color) {
  if (typeof color === 'string') return color
  if (color && typeof color === 'object') return color.color || color.hex || color.primary || ''
  return String(color)
}

function BrandCard({ brand, onSelect, index }) {
  const logo = resolveLogo(brand)
  const colors = resolveColors(brand)
  const name = brand.brandName || brand.name || 'Brand'
  const description = brand.brandDescription || brand.description
  const logoBackground = brand.logoBackground || null

  return (
    <div
      className="brand-list-card"
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={() => onSelect(brand)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onSelect(brand)
      }}
    >
      <div className="brand-list-card-shine" />
      <div className="brand-list-card-top">
        {logo ? (
          <div className={logoBackground ? `brand-list-card-logo-bg brand-list-card-logo-bg-${logoBackground}` : ''}>
            <img src={logo} alt={`${name} logo`} className="brand-list-card-logo" />
          </div>
        ) : (
          <span className="brand-list-card-logo-placeholder">{name[0]}</span>
        )}
      </div>

      {colors.length > 0 && (
        <div className="brand-list-card-palette">
          {colors.map((color, colorIndex) => {
            const colorValue = resolveColorValue(color)
            return (
              <div
                key={colorIndex}
                className={`brand-list-card-color ${color && color.primary ? 'brand-list-card-color-primary' : ''}`}
                style={{ backgroundColor: colorValue }}
                title={colorValue}
              />
            )
          })}
        </div>
      )}

      <div className="brand-list-card-body">
        <h3 className="brand-list-card-name">{name}</h3>
        {description && (
          <p className="brand-list-card-description">{description}</p>
        )}
        <div className="brand-list-card-hint">
          <span>Click to explore</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default function BrandsPage() {
  const navigate = useNavigate()
  const [brands, setBrands] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  const [searchQuery, setSearchQuery] = React.useState('')

  React.useEffect(() => {
    let cancelled = false

    fetch(BRANDS_JSON_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load brands: ${response.status} ${response.statusText}`)
        }
        return response.json()
      })
      .then((data) => {
        if (cancelled) return
        const list = Object.values(data)
        setBrands(list)
        setIsLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const goHome = () => navigate('/')
  const goToExplorer = (brand) => navigate(`/explorer?bId=${brand.bId}`)

  const filteredBrands = React.useMemo(() => {
    if (!searchQuery.trim()) return brands
    const query = searchQuery.trim().toLowerCase()
    return brands.filter((brand) => {
      const name = (brand.brandName || brand.name || '').toLowerCase()
      const description = (brand.brandDescription || brand.description || '').toLowerCase()
      return name.includes(query) || description.includes(query)
    })
  }, [brands, searchQuery])

  return (
    <div className="brands-page">
      <div className="brands-page-aurora" />

      <nav className="brands-page-nav">
        <div className="brands-page-nav-brand" onClick={goHome}>
          <img src="/sivi-logo.png" alt="Sivi AI" className="brands-page-nav-logo" />
          <span className="brands-page-nav-title">Sivi API Explorer</span>
        </div>
        <div className="brands-page-nav-links">
          <button className="brands-page-nav-link" onClick={goHome}>
            Home
          </button>
        </div>
      </nav>

      <main className="brands-page-main">
        <div className="brands-page-header">
          <span className="brands-page-eyebrow">Choose a brand</span>
          <h1 className="brands-page-title">Explore sample brands</h1>
          <p className="brands-page-subtitle">
            Pick a brand profile to launch the API Explorer with its data pre-loaded.
          </p>
        </div>

        {!isLoading && !error && brands.length > 0 && (
          <div className="brands-page-search">
            <svg className="brands-page-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="brands-page-search-input"
              placeholder="Search brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="brands-page-search-clear" onClick={() => setSearchQuery('')}>
                ✕
              </button>
            )}
          </div>
        )}

        {isLoading && (
          <div className="brands-page-status">
            <div className="brands-page-spinner" />
            <span>Loading brands...</span>
          </div>
        )}

        {error && (
          <div className="brands-page-status brands-page-status-error">
            <span>{error}</span>
            <button className="brands-page-retry-btn" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && filteredBrands.length === 0 && (
          <div className="brands-page-status">
            <span>{searchQuery ? 'No brands match your search.' : 'No brands found.'}</span>
          </div>
        )}

        {!isLoading && !error && filteredBrands.length > 0 && (
          <div className="brands-page-grid">
            {filteredBrands.map((brand, index) => (
              <BrandCard brand={brand} key={brand.bId || brand.brandId || brand.name} index={index} onSelect={goToExplorer} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
