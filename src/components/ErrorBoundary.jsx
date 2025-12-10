import { createSignal, onError } from 'solid-js';

/**
 * Error Boundary Component for Solid.js
 * Catches JavaScript errors anywhere in the child component tree
 */
export default function ErrorBoundary(props) {
  const [error, setError] = createSignal(null);

  // Solid's error handling mechanism
  onError((err) => {
    console.error('Error caught by boundary:', err);
    setError(err);
  });

  // Reset function to clear error state
  const resetError = () => {
    setError(null);
  };

  if (error()) {
    return (
      <div class="error-boundary">
        <div class="error-container">
          <div class="error-icon">⚠️</div>
          <h2 class="error-title">Something went wrong</h2>
          <p class="error-message">
            {error().message || 'An unexpected error occurred'}
          </p>
          <div class="error-actions">
            <button class="error-btn" onClick={resetError}>
              Try Again
            </button>
            <button class="error-btn secondary" onClick={() => window.location.reload()}>
              Reload Page
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <details class="error-details">
              <summary>Error Details</summary>
              <pre class="error-stack">
                {error().stack || 'No stack trace available'}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  return props.children;
}
