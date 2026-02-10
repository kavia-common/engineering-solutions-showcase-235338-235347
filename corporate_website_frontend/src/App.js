import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

/**
 * Simple, dependency-free content placeholders.
 * In a following step these will be replaced with API-fetched content (e.g. /api/content).
 */
const SERVICES = [
  {
    title: 'Embedded Software Development',
    description:
      'Production-grade firmware and middleware for connected devices—built for performance, reliability, and maintainability.',
  },
  {
    title: 'BSP Development',
    description:
      'Board bring-up, bootloader, kernel, device tree, drivers, and build systems tailored to your silicon and product needs.',
  },
  {
    title: 'Networking Development',
    description:
      'Feature development and optimization across routing, switching, and network services for embedded and edge platforms.',
  },
  {
    title: 'L2/L3 Protocol Development & QA Engineering',
    description:
      'Implementation plus validation for key protocols with automated test strategy, tooling, and continuous quality practices.',
  },
  {
    title: 'Gateway Development (RDK-B, OpenWRT, prplOS)',
    description:
      'Carrier-grade gateway solutions: customization, integration, performance tuning, and lifecycle support.',
  },
];

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

const TESTIMONIALS = [
  {
    quote:
      'Their team integrated seamlessly with ours and delivered a stable BSP on a tight schedule—excellent communication throughout.',
    name: 'Engineering Manager',
    company: 'Connectivity OEM',
  },
  {
    quote:
      'We saw measurable performance gains in gateway throughput and reduced field issues after the protocol QA improvements.',
    name: 'Director of Software',
    company: 'Broadband Provider',
  },
  {
    quote:
      'Strong embedded Linux expertise. The bring-up work was methodical and well-documented, accelerating our product launch.',
    name: 'Product Lead',
    company: 'IoT Platform Company',
  },
];

const CASE_STUDIES = [
  {
    title: 'High-Performance Home Gateway Modernization',
    highlights: [
      'Migrated and optimized RDK‑B gateway stack',
      'Improved throughput and reduced latency under load',
      'Introduced automated regression test pipelines',
    ],
    tags: ['RDK‑B', 'Networking', 'QA Automation'],
  },
  {
    title: 'Custom BSP for New Hardware Platform',
    highlights: [
      'Board bring-up with bootloader + kernel enablement',
      'Device tree and driver integration',
      'Reproducible builds and release artifacts',
    ],
    tags: ['BSP', 'Linux', 'Yocto'],
  },
];

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

  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const activeTestimonial = TESTIMONIALS[testimonialIndex];

  const goPrev = () => {
    setTestimonialIndex((idx) => (idx - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const goNext = () => {
    setTestimonialIndex((idx) => (idx + 1) % TESTIMONIALS.length);
  };

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    website: '', // honeypot (should remain empty)
  });

  const [contactStatus, setContactStatus] = useState({ type: 'idle', message: '' });

  const onContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const onContactSubmit = (e) => {
    e.preventDefault();

    // Basic client-side validation; API wiring will come later.
    if (contactForm.website) {
      // Honeypot triggered - silently "succeed"
      setContactStatus({ type: 'success', message: 'Thanks — we will be in touch shortly.' });
      return;
    }

    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactStatus({ type: 'error', message: 'Please fill out name, email, and message.' });
      return;
    }

    setContactStatus({
      type: 'success',
      message: 'Message prepared locally. API wiring will be added in the next step.',
    });
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
                From BSP bring-up to L2/L3 protocol development and carrier-grade gateways, we help teams
                build high-performance systems with confidence.
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
                  <strong>Next:</strong> connect this page to backend content endpoints to dynamically load services,
                  testimonials, and case studies.
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

            <div className="cards-grid" role="list">
              {SERVICES.map((service) => (
                <article className="card" role="listitem" key={service.title}>
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
              <p className="section-subtitle">
                A lightweight carousel for now—later this will be driven by backend content.
              </p>
            </div>

            <div className="testimonial">
              <button className="icon-btn" type="button" onClick={goPrev} aria-label="Previous testimonial">
                ‹
              </button>

              <figure className="testimonial-card">
                <blockquote className="testimonial-quote">“{activeTestimonial.quote}”</blockquote>
                <figcaption className="testimonial-meta">
                  <span className="testimonial-name">{activeTestimonial.name}</span>
                  <span className="testimonial-company">{activeTestimonial.company}</span>
                </figcaption>

                <div className="dots" role="tablist" aria-label="Select testimonial">
                  {TESTIMONIALS.map((_, idx) => (
                    <button
                      key={idx}
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

            <div className="cases-grid" role="list">
              {CASE_STUDIES.map((cs) => (
                <article className="case-card" role="listitem" key={cs.title}>
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
                />
              </label>

              {/* Honeypot: hidden from users, visible to bots */}
              <div className="honeypot" aria-hidden="true">
                <label className="field">
                  <span className="label">Website</span>
                  <input name="website" value={contactForm.website} onChange={onContactChange} tabIndex={-1} />
                </label>
              </div>

              <button type="submit" className="btn btn-primary btn-full">
                Send message
              </button>

              {contactStatus.type !== 'idle' ? (
                <p
                  className={`form-status ${
                    contactStatus.type === 'success' ? 'status-success' : 'status-error'
                  }`}
                  role="status"
                >
                  {contactStatus.message}
                </p>
              ) : null}

              <p className="form-help">
                We will connect this form to <code>POST /api/contact</code> in a follow-up step.
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
