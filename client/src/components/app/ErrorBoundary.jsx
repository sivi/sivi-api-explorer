import React from 'react';
import './ErrorBoundary.css';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-card">
            <div className="error-boundary-icon">⚠</div>
            <h1 className="error-boundary-title">Something went wrong</h1>
            <p className="error-boundary-desc">
              The application encountered an unexpected error. You can try refreshing the page or reset the view.
            </p>

            <div className="error-boundary-actions">
              <button
                className="error-boundary-btn primary"
                onClick={this.handleReload}
              >
                Refresh Page
              </button>
              <button
                className="error-boundary-btn secondary"
                onClick={this.handleReset}
              >
                Try Again
              </button>
            </div>

            {/* <details className="error-boundary-details">
              <summary>Show error details</summary>
              <div className="error-boundary-stack">
                <p><strong>{error?.toString()}</strong></p>
                {errorInfo?.componentStack && (
                  <pre>{errorInfo.componentStack}</pre>
                )}
              </div>
            </details> */}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
