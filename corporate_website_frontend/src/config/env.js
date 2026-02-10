/**
 * Environment helpers for CRA + optional runtime injection.
 *
 * This supports:
 * - build-time env: process.env.REACT_APP_API_BASE / REACT_APP_BACKEND_URL
 * - runtime env: window.env.REACT_APP_API_BASE / window.env.REACT_APP_BACKEND_URL
 *
 * The runtime option is useful when deploying a single build artifact across environments.
 */

/* eslint-disable no-underscore-dangle */

const getWindowEnv = () => {
  if (typeof window === 'undefined') return {};
  // Common pattern: window.env = { ... }
  return window.env && typeof window.env === 'object' ? window.env : {};
};

const normalizeBaseUrl = (value) => {
  const v = (value || '').trim();
  if (!v) return '';
  // Remove trailing slash to avoid double-slashes when joining paths.
  return v.endsWith('/') ? v.slice(0, -1) : v;
};

/**
 * Determine backend base URL.
 * Priority:
 * 1) window.env.REACT_APP_API_BASE
 * 2) window.env.REACT_APP_BACKEND_URL
 * 3) process.env.REACT_APP_API_BASE
 * 4) process.env.REACT_APP_BACKEND_URL
 * 5) default http://localhost:3001
 */
// PUBLIC_INTERFACE
export const getApiBaseUrl = () => {
  const wenv = getWindowEnv();
  const candidate =
    normalizeBaseUrl(wenv.REACT_APP_API_BASE) ||
    normalizeBaseUrl(wenv.REACT_APP_BACKEND_URL) ||
    normalizeBaseUrl(process.env.REACT_APP_API_BASE) ||
    normalizeBaseUrl(process.env.REACT_APP_BACKEND_URL);

  return candidate || 'http://localhost:3001';
};
