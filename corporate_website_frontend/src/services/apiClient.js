import { getApiBaseUrl } from '../config/env';

/**
 * Safely parse JSON responses, even when the body is empty.
 */
const safeJson = async (res) => {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const buildUrl = (path) => {
  const base = getApiBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
};

/**
 * Standardized API error to show meaningful messages in UI.
 */
class ApiError extends Error {
  constructor(message, { status, details } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Basic fetch wrapper with timeouts and JSON parsing.
 */
const request = async (path, { method = 'GET', body, headers } = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(buildUrl(path), {
      method,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(headers || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const payload = await safeJson(res);

    if (!res.ok) {
      // Try to extract FastAPI validation errors if present
      const detail = payload && payload.detail ? payload.detail : payload;
      const message =
        (payload && payload.message) ||
        (Array.isArray(detail) && detail[0]?.msg) ||
        `Request failed (${res.status})`;
      throw new ApiError(message, { status: res.status, details: detail });
    }

    return payload;
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new ApiError('Request timed out. Please try again.', { status: 0 });
    }
    if (err instanceof ApiError) throw err;
    throw new ApiError(err?.message || 'Network error. Please try again.', { status: 0 });
  } finally {
    clearTimeout(timeout);
  }
};

// PUBLIC_INTERFACE
export const apiGet = (path) => request(path);

// PUBLIC_INTERFACE
export const apiPost = (path, body) => request(path, { method: 'POST', body });
