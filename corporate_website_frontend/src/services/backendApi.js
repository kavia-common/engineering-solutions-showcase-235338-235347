import { apiGet, apiPost } from './apiClient';

/**
 * Content endpoints (per backend OpenAPI):
 * - GET /api/services
 * - GET /api/testimonials
 * - GET /api/case-studies (preferred)
 * - GET /api/case_studies (legacy alias)
 */

// PUBLIC_INTERFACE
export const fetchServices = async () => {
  return apiGet('/api/services');
};

// PUBLIC_INTERFACE
export const fetchTestimonials = async () => {
  return apiGet('/api/testimonials');
};

// PUBLIC_INTERFACE
export const fetchCaseStudies = async () => {
  // Prefer the kebab-case endpoint, but fallback to legacy alias if needed.
  try {
    return await apiGet('/api/case-studies');
  } catch (err) {
    return apiGet('/api/case_studies');
  }
};

/**
 * Contact endpoint:
 * - POST /api/contact
 *
 * Schema (ContactCreateIn):
 * { name, email, message, company?, phone?, service_slug?, source?, honeypot? }
 */

// PUBLIC_INTERFACE
export const submitContactLead = async ({
  name,
  email,
  company,
  message,
  phone,
  serviceSlug,
  source,
  honeypot,
}) => {
  return apiPost('/api/contact', {
    name,
    email,
    company: company || null,
    phone: phone || null,
    service_slug: serviceSlug || null,
    message,
    source: source || 'website',
    honeypot: honeypot || null,
  });
};
