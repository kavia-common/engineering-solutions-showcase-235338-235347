import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { useApiData } from './hooks/useApiData';
import { fetchCaseStudies, fetchServices, fetchTestimonials, submitContactLead } from './services/backendApi';

/**
 * Keep static technologies local (not part of backend content in this iteration).
 */
const TECHNOLOGIES = [
  'C / C++',
  'Linux',
  'Yocto / Buildroot',
  'Device Drivers',
  'TCP/IP',
  'Wi‑Fi',
  'DOCSIS',
  'TR‑069 / USP',
  'RDK‑B',
  'OpenWRT',
  'prplOS',
  'CI/CD',
  'Python',
  'QA Automation',
];

const mapServicesToCards = (services) => {
  if (!Array.isArray(services)) return [];
  return services
    .filter((s) => s && s.is_active)
    .map((s) => ({
      id: s.id,
      slug: s.slug,
      title: s.title,
      description: s.short_desc,
    }));
};

const mapTestimonials = (testimonials) => {
  if (!Array.isArray(testimonials)) return [];
  return testimonials.map((t) => ({
    id: t.id,
    quote: t.quote,
    name: t.client_name,
    company: t.company || t.client_title || '',
  }));
};

const mapCaseStudies = (caseStudies) => {
  if (!Array.isArray(caseStudies)) return [];
  return caseStudies
    .filter((cs) => cs && cs.is_published)
    .map((cs) => {
      // Convert long-form content into bullets/tags that match existing UI.
      const highlights = [];
      if (cs.challenge) highlights.push(`Challenge: ${cs.challenge}`);
      if (cs.solution) highlights.push(`Solution: ${cs.solution}`);
      if (cs.results) highlights.push(`Results: ${cs.results}`);

      // Keep cards compact: if backend has very long text, trim each highlight.
      const trimmedHighlights = highlights
        .slice(0, 3)
        .map((h) => (h.length > 160 ? `${h.slice(0, 157)}…` : h));

      const tags = [];
      if (cs.industry) tags.push(cs.industry);
      if (cs.stack) tags.push(cs.stack);

      return {
        id: cs.id,
        title: cs.title,
        highlights: trimmedHighlights.length ? trimmedHighlights : [cs.summary],
        tags: tags.length ? tags : ['Case study'],
      };
    });
};

const errorToMessage = (err) => {
  if (!err) return '';
  return err.message || 'Something went wrong. Please try again.';
};

// PUBLIC_INTERFACE
function App() {
  /**
   * Keep the template's theme mechanism, but default to a light ocean theme.
   * In a future step we can add persistence (localStorage) if desired.
   */
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const year = useMemo(() => new Date().getFullYear(), []);

  const {
    data: servicesData,
    loading: servicesLoading,
    error: servicesError,
    refresh: refreshServices,
  } = useApiData(fetchServices);

  const {
    data: testimonialsData,
    loading: testimonialsLoading,
    error: testimonialsError,
    refresh: refreshTestimonials,
  } = useApiData(fetchTestimonials);

  const {
    data: caseStudiesData,
    loading: caseStudiesLoading,
    error: caseStudiesError,
    refresh: refreshCaseStudies,
  } = useApiData(fetchCaseStudies);

  const services = useMemo(() => mapServicesToCards(servicesData), [servicesData]);
  const testimonials = useMemo(() => mapTestimonials(testimonialsData), [testimonialsData]);
  const caseStudies = useMemo(() => mapCaseStudies(caseStudiesData), [caseStudiesData]);

  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Keep index in bounds as testimonials load/change
  useEffect(() => {
    if (!testimonials.length) return;
    setTestimonialIndex((idx) => Math.min(idx, testimonials.length - 1));
  }, [testimonials.length]);

  const activeTestimonial = testimonials.length ? testimonials[testimonialIndex] : null;

  const goPrev = () => {
    if (!testimonials.length) return;
    setTestimonialIndex((idx) => (idx - 1 + testimonials.length) % testimonials.length);
  };

  const goNext = () => {
    if (!testimonials.length) return;
    setTestimonialIndex((idx) => (idx + 1) % testimonials.length);
  };

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    website: '', // honeypot (should remain empty)
  });

  const [contactStatus, setContactStatus] = useState({ type: 'idle', message: '' });
  const [contactSubmitting, setContactSubmitting] = useState(false);

  const onContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const onContactSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation + honeypot behavior.
    if (contactForm.website) {
      // Honeypot triggered - silently "succeed"
      setContactStatus({ type: 'success', message: 'Thanks — we will be in touch shortly.' });
      return;
    }

    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactStatus({ type: 'error', message: 'Please fill out name, email, and message.' });
      return;
    }

    setContactSubmitting(true);
    setContactStatus({ type: 'idle', message: '' });

    try {
      await submitContactLead({
        name: contactForm.name,
        email: contactForm.email,
        company: contactForm.company,
        message: contactForm.message,
        honeypot: contactForm.website,
        source: 'website',
      });

      setContactStatus({
        type: 'success',
        message: 'Thanks! Your message was sent. We will respond with next steps shortly.',
      });

      // Reset form on success (keep honeypot empty)
      setContactForm({
        name: '',
        email: '',
        company: '',
        message: '',
        website: '',
      });
    } catch (err) {
      setContactStatus({
        type: 'error',
        message: errorToMessage(err),
      });
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <div className="App">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <div className="container header-inner">
          <div className="brand" aria-label="Company">
            <span className="brand-mark" aria-hidden="true">
              OE
            </span>
            <div className="brand-text">
              <div className="brand-name">Ocean Engineering</div>
              <div className="brand-tagline">Embedded • Networking • Gateways</div>
            </div>
          </div>

          <nav className="nav" aria-label="Primary">
            <a href="#services">Services</a>
            <a href="#expertise">Expertise</a>
            <a href="#case-studies">Case studies</a>
            <a href="#contact" className="nav-cta">
              Contact
            </a>
          </nav>

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            type="button"
          >
            {theme === 'light' ? 'Dark' : 'Light'}
          </button>
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section className="section hero" aria-labelledby="hero-title">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Ocean Professional Engineering Services</p>
              <h1 id="hero-title" className="hero-title">
                Embedded & networking expertise to ship reliable products faster.
              </h1>
              <p className="hero-subtext">
                From BSP bring-up to L2/L3 protocol development and carrier-grade gateways, we help teams build
                high-performance systems with confidence.
              </p>

              <div className="hero-actions">
                <a className="btn btn-primary" href="#contact">
                  Talk to an engineer
                </a>
                <a className="btn btn-ghost" href="#case-studies">
                  View case studies
                </a>
              </div>

              <div className="hero-metrics" aria-label="Highlights">
                <div className="metric">
                  <div className="metric-value">Embedded Linux</div>
                  <div className="metric-label">Bring-up & optimization</div>
                </div>
                <div className="metric">
                  <div className="metric-value">Gateway stacks</div>
                  <div className="metric-label">RDK‑B • OpenWRT • prplOS</div>
                </div>
                <div className="metric">
                  <div className="metric-value">Quality-first</div>
                  <div className="metric-label">Automation & validation</div>
                </div>
              </div>
            </div>

            <div className="hero-panel" aria-label="Featured capabilities">
              <div className="panel-card">
                <h2 className="panel-title">What we deliver</h2>
                <ul className="checklist">
                  <li>Clean, maintainable C/C++ and Linux-based systems</li>
                  <li>Performance tuning and resource optimization</li>
                  <li>Protocol interoperability testing and QA strategy</li>
                  <li>Reproducible builds and release engineering</li>
                </ul>
                <div className="panel-note">
                  <strong>Live:</strong> services, testimonials, and case studies are now loaded from the backend API.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="section" aria-labelledby="services-title">
          <div className="container">
            <div className="section-head">
              <h2 id="services-title" className="section-title">
                Services
              </h2>
              <p className="section-subtitle">
                Practical engineering support across the full lifecycle—from early bring-up to production hardening.
              </p>
            </div>

            {servicesLoading ? <p className="section-subtitle">Loading services…</p> : null}

            {servicesError ? (
              <p className="section-subtitle">
                Could not load services. {errorToMessage(servicesError)}{' '}
                <button type="button" className="text-link" onClick={refreshServices}>
                  Retry
                </button>
              </p>
            ) : null}

            {!servicesLoading && !servicesError ? (
              <div className="cards-grid" role="list">
                {services.map((service) => (
                  <article className="card" role="listitem" key={service.slug || service.title}>
                    <h3 className="card-title">{service.title}</h3>
                    <p className="card-description">{service.description}</p>
                    <div className="card-footer">
                      <a className="text-link" href="#contact" aria-label={`Contact us about ${service.title}`}>
                        Discuss this service
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {/* Expertise */}
        <section id="expertise" className="section section-alt" aria-labelledby="expertise-title">
          <div className="container expertise-grid">
            <div>
              <h2 id="expertise-title" className="section-title">
                Expertise & technologies
              </h2>
              <p className="section-subtitle">
                We work across embedded platforms, gateways, and networking stacks with a focus on quality and speed.
              </p>

              <div className="tag-cloud" aria-label="Technologies">
                {TECHNOLOGIES.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <aside className="info-panel" aria-label="Engagement model">
              <h3 className="info-title">Engagements that fit your team</h3>
              <ul className="info-list">
                <li>Project-based delivery with clear milestones</li>
                <li>Embedded specialists to augment your engineering team</li>
                <li>QA and automation to improve reliability at scale</li>
              </ul>
              <a className="btn btn-secondary" href="#contact">
                Get a quick estimate
              </a>
            </aside>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section" aria-labelledby="testimonials-title">
          <div className="container">
            <div className="section-head">
              <h2 id="testimonials-title" className="section-title">
                Testimonials
              </h2>
              <p className="section-subtitle">What teams say after shipping together.</p>
            </div>

            {testimonialsLoading ? <p className="section-subtitle">Loading testimonials…</p> : null}

            {testimonialsError ? (
              <p className="section-subtitle">
                Could not load testimonials. {errorToMessage(testimonialsError)}{' '}
                <button type="button" className="text-link" onClick={refreshTestimonials}>
                  Retry
                </button>
              </p>
            ) : null}

            {!testimonialsLoading && !testimonialsError && activeTestimonial ? (
              <div className="testimonial">
                <button className="icon-btn" type="button" onClick={goPrev} aria-label="Previous testimonial">
                  ‹
                </button>

                <figure className="testimonial-card">
                  <blockquote className="testimonial-quote">“{activeTestimonial.quote}”</blockquote>
                  <figcaption className="testimonial-meta">
                    <span className="testimonial-name">{activeTestimonial.name}</span>
                    {activeTestimonial.company ? (
                      <span className="testimonial-company">{activeTestimonial.company}</span>
                    ) : null}
                  </figcaption>

                  <div className="dots" role="tablist" aria-label="Select testimonial">
                    {testimonials.map((_, idx) => (
                      <button
                        key={testimonials[idx].id || idx}
                        type="button"
                        className={`dot ${idx === testimonialIndex ? 'dot-active' : ''}`}
                        onClick={() => setTestimonialIndex(idx)}
                        aria-label={`Testimonial ${idx + 1}`}
                        aria-pressed={idx === testimonialIndex}
                      />
                    ))}
                  </div>
                </figure>

                <button className="icon-btn" type="button" onClick={goNext} aria-label="Next testimonial">
                  ›
                </button>
              </div>
            ) : null}
          </div>
        </section>

        {/* Case Studies */}
        <section id="case-studies" className="section section-alt" aria-labelledby="case-title">
          <div className="container">
            <div className="section-head">
              <h2 id="case-title" className="section-title">
                Featured projects
              </h2>
              <p className="section-subtitle">
                A glimpse into the kind of work we deliver—performance, stability, and smooth production transitions.
              </p>
            </div>

            {caseStudiesLoading ? <p className="section-subtitle">Loading case studies…</p> : null}

            {caseStudiesError ? (
              <p className="section-subtitle">
                Could not load case studies. {errorToMessage(caseStudiesError)}{' '}
                <button type="button" className="text-link" onClick={refreshCaseStudies}>
                  Retry
                </button>
              </p>
            ) : null}

            {!caseStudiesLoading && !caseStudiesError ? (
              <div className="cases-grid" role="list">
                {caseStudies.map((cs) => (
                  <article className="case-card" role="listitem" key={cs.id || cs.title}>
                    <h3 className="card-title">{cs.title}</h3>
                    <ul className="bullets">
                      {cs.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                    <div className="case-tags" aria-label="Project tags">
                      {cs.tags.map((t) => (
                        <span className="tag tag-soft" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="section" aria-labelledby="contact-title">
          <div className="container contact-grid">
            <div>
              <h2 id="contact-title" className="section-title">
                Contact
              </h2>
              <p className="section-subtitle">
                Tell us about your product, timeline, and constraints. We’ll respond with next steps.
              </p>

              <div className="contact-cards">
                <div className="mini-card">
                  <div className="mini-card-title">Email</div>
                  <div className="mini-card-body">hello@ocean-engineering.example</div>
                </div>
                <div className="mini-card">
                  <div className="mini-card-title">Focus</div>
                  <div className="mini-card-body">Embedded Linux • Networking • Gateways</div>
                </div>
              </div>
            </div>

            <form className="form" onSubmit={onContactSubmit} aria-label="Contact form">
              <div className="form-row">
                <label className="field">
                  <span className="label">Name</span>
                  <input
                    name="name"
                    value={contactForm.name}
                    onChange={onContactChange}
                    autoComplete="name"
                    required
                    disabled={contactSubmitting}
                  />
                </label>

                <label className="field">
                  <span className="label">Email</span>
                  <input
                    name="email"
                    type="email"
                    value={contactForm.email}
                    onChange={onContactChange}
                    autoComplete="email"
                    required
                    disabled={contactSubmitting}
                  />
                </label>
              </div>

              <label className="field">
                <span className="label">Company</span>
                <input
                  name="company"
                  value={contactForm.company}
                  onChange={onContactChange}
                  autoComplete="organization"
                  disabled={contactSubmitting}
                />
              </label>

              <label className="field">
                <span className="label">Message</span>
                <textarea
                  name="message"
                  value={contactForm.message}
                  onChange={onContactChange}
                  rows={5}
                  required
                  disabled={contactSubmitting}
                />
              </label>

              {/* Honeypot: hidden from users, visible to bots */}
              <div className="honeypot" aria-hidden="true">
                <label className="field">
                  <span className="label">Website</span>
                  <input
                    name="website"
                    value={contactForm.website}
                    onChange={onContactChange}
                    tabIndex={-1}
                    disabled={contactSubmitting}
                  />
                </label>
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={contactSubmitting}>
                {contactSubmitting ? 'Sending…' : 'Send message'}
              </button>

              {contactStatus.type !== 'idle' ? (
                <p
                  className={`form-status ${contactStatus.type === 'success' ? 'status-success' : 'status-error'}`}
                  role="status"
                >
                  {contactStatus.message}
                </p>
              ) : null}

              <p className="form-help">
                This form sends a request to <code>POST /api/contact</code>.
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer" aria-label="Footer">
        <div className="container footer-inner">
          <div className="footer-left">
            <div className="footer-brand">Ocean Engineering</div>
            <div className="footer-text">Engineering services for embedded and networked systems.</div>
          </div>

          <div className="footer-links" aria-label="Legal and contact links">
            <a href="#contact">Contact</a>
            <a href="#services">Services</a>
            <a href="/privacy" onClick={(e) => e.preventDefault()}>
              Privacy
            </a>
            <a href="/terms" onClick={(e) => e.preventDefault()}>
              Terms
            </a>
          </div>

          <div className="footer-right">
            <div className="footer-text">© {year} Ocean Engineering. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
