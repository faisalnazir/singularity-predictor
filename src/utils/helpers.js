/**
 * Utility functions for the application
 */

/**
 * Throttle function calls to prevent excessive execution
 * @param {Function} func - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;
  return function (...args) {
    const currentTime = Date.now();
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Format number with fixed decimal places
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 */
export function formatNumber(num, decimals = 1) {
  return Number(num.toFixed(decimals));
}

/**
 * Safe division with fallback
 * @param {number} numerator - Numerator
 * @param {number} denominator - Denominator
 * @param {number} fallback - Fallback value if division by zero
 * @returns {number} Result of division or fallback
 */
export function safeDivide(numerator, denominator, fallback = 0) {
  if (denominator === 0 || isNaN(denominator)) {
    return fallback;
  }
  return numerator / denominator;
}

/**
 * Create a memoized selector function
 * @param {Function} selector - Selector function
 * @param {Function} equalityFn - Optional equality check function
 * @returns {Function} Memoized selector
 */
export function createMemoSelector(selector, equalityFn) {
  let cache = null;
  let hasCache = false;
  return (value) => {
    if (!hasCache || !equalityFn(cache, value)) {
      cache = selector(value);
      hasCache = true;
    }
    return cache;
  };
}
