const HOMEPAGE_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>TacticDev · High-velocity product teams for ambitious founders</title>
    <meta
      name="description"
      content="TacticDev designs and ships digital products for founders who need to move fast without breaking quality."
    />
    
    <!-- Open Graph / Social Media Meta Tags -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://tacticdev.com/" />
    <meta property="og:title" content="TacticDev · High-velocity product teams for ambitious founders" />
    <meta property="og:description" content="We design, build, and launch digital products for venture-backed startups that need to move fast without compromising craft." />
    <meta property="og:image" content="https://tacticdev.com/og-image.png" />
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@tacticdev" />
    <meta name="twitter:title" content="TacticDev · High-velocity product teams for ambitious founders" />
    <meta name="twitter:description" content="We design, build, and launch digital products for venture-backed startups that need to move fast without compromising craft." />
    <meta name="twitter:image" content="https://tacticdev.com/og-image.png" />
    
    <!-- Additional Meta Tags -->
    <meta name="author" content="TacticDev" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://tacticdev.com/" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <style>
      :root {
        color-scheme: dark light;
        --bg-dark: #020617;
        --bg-light: #ffffff;
        --text-dark: #f8fafc;
        --text-light: #0f172a;
        --accent: #38bdf8;
        --accent-strong: #0284c7;
        --card-bg: rgba(15, 23, 42, 0.75);
        --card-border: rgba(148, 163, 184, 0.18);
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: "Manrope", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: var(--text-dark);
        background: radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.12), transparent 50%),
          radial-gradient(circle at 80% 0%, rgba(45, 212, 191, 0.12), transparent 40%),
          var(--bg-dark);
        min-height: 100vh;
        line-height: 1.6;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      header {
        position: sticky;
        top: 0;
        z-index: 10;
        backdrop-filter: blur(14px);
        background: rgba(2, 6, 23, 0.78);
        border-bottom: 1px solid rgba(148, 163, 184, 0.18);
      }

      .nav-container {
        max-width: 1080px;
        margin: 0 auto;
        padding: 1rem 1.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .brand {
        font-weight: 700;
        font-size: 1.1rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      nav {
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      nav a {
        font-size: 0.95rem;
        opacity: 0.8;
        transition: opacity 0.2s ease, transform 0.2s ease;
      }

      nav a:focus,
      nav a:hover {
        opacity: 1;
        transform: translateY(-1px);
      }

      .menu-toggle {
        display: none;
        background: none;
        border: 1px solid rgba(148, 163, 184, 0.3);
        color: inherit;
        border-radius: 0.75rem;
        padding: 0.45rem 0.75rem;
        font-size: 0.9rem;
      }

      main {
        max-width: 1080px;
        margin: 0 auto;
        padding: 0 1.5rem 5rem;
      }

      .hero {
        padding: 5.5rem 0 4rem;
        display: grid;
        gap: 2rem;
      }

      .hero h1 {
        font-size: clamp(2.4rem, 4vw + 1rem, 4.5rem);
        margin: 0;
        line-height: 1.1;
        letter-spacing: -0.02em;
      }

      .hero p {
        font-size: 1.05rem;
        max-width: 38rem;
        opacity: 0.78;
      }

      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: center;
      }

      .primary-btn {
        background: linear-gradient(135deg, var(--accent), var(--accent-strong));
        color: white;
        padding: 0.85rem 1.75rem;
        border-radius: 999px;
        font-weight: 600;
        border: none;
        font-size: 1rem;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .primary-btn:hover,
      .primary-btn:focus {
        transform: translateY(-1px);
        box-shadow: 0 18px 30px rgba(56, 189, 248, 0.25);
      }

      .secondary-link {
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }

      .badge-grid {
        margin-top: 3rem;
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }

      .badge {
        padding: 0.85rem 1rem;
        border-radius: 0.9rem;
        border: 1px solid rgba(148, 163, 184, 0.25);
        background: rgba(15, 23, 42, 0.6);
        font-size: 0.85rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      section {
        margin-top: 5.5rem;
      }

      .section-header {
        margin-bottom: 2rem;
      }

      .section-header span {
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        opacity: 0.6;
        display: block;
        margin-bottom: 0.85rem;
      }

      .section-header h2 {
        margin: 0;
        font-size: clamp(1.8rem, 2.5vw + 1rem, 3rem);
        letter-spacing: -0.02em;
      }

      .section-header p {
        max-width: 40rem;
        opacity: 0.72;
      }

      .card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1.5rem;
      }

      .card {
        padding: 1.75rem;
        border-radius: 1.2rem;
        border: 1px solid var(--card-border);
        background: var(--card-bg);
        display: flex;
        flex-direction: column;
        gap: 1rem;
        transition: transform 0.2s ease, border-color 0.2s ease;
      }

      .card:hover,
      .card:focus-within {
        transform: translateY(-4px);
        border-color: rgba(56, 189, 248, 0.45);
      }

      .card svg {
        width: 2.5rem;
        height: 2.5rem;
        color: var(--accent);
      }

      .card h3 {
        margin: 0;
        font-size: 1.3rem;
      }

      .card p {
        margin: 0;
        opacity: 0.72;
      }

      .card ul {
        margin: 0;
        padding-left: 1.25rem;
        display: grid;
        gap: 0.4rem;
        font-size: 0.95rem;
        opacity: 0.72;
      }

      .process {
        display: grid;
        gap: 1rem;
      }

      .process-step {
        display: grid;
        gap: 0.5rem;
        grid-template-columns: auto 1fr;
        align-items: start;
        padding: 1.25rem 1.5rem;
        border-radius: 1rem;
        border: 1px solid rgba(56, 189, 248, 0.18);
        background: rgba(15, 23, 42, 0.65);
      }

      .process-step strong {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.2rem;
        height: 2.2rem;
        border-radius: 999px;
        background: rgba(56, 189, 248, 0.18);
        color: var(--accent);
        font-weight: 600;
      }

      .process-step h3 {
        margin: 0;
        font-size: 1.1rem;
      }

      .process-step p {
        margin: 0;
        opacity: 0.72;
      }

      .testimonial-grid {
        display: grid;
        gap: 1.5rem;
      }

      .testimonial {
        border-radius: 1.2rem;
        border: 1px solid var(--card-border);
        background: var(--card-bg);
        padding: 1.75rem;
      }

      .testimonial p {
        margin-top: 0;
        font-size: 1rem;
        opacity: 0.85;
      }

      .testimonial cite {
        display: block;
        font-style: normal;
        margin-top: 1.25rem;
        font-weight: 600;
        opacity: 0.9;
      }

      .cta-panel {
        margin-top: 4rem;
        padding: 2.5rem;
        border-radius: 1.4rem;
        border: 1px solid rgba(56, 189, 248, 0.3);
        background: linear-gradient(135deg, rgba(56, 189, 248, 0.18), rgba(56, 189, 248, 0.05));
        display: grid;
        gap: 1.25rem;
      }

      .contact-form {
        display: grid;
        gap: 1rem;
      }

      .field {
        display: grid;
        gap: 0.35rem;
      }

      .field label {
        font-size: 0.9rem;
        opacity: 0.8;
      }

      .field input,
      .field textarea {
        padding: 0.8rem 1rem;
        border-radius: 0.9rem;
        border: 1px solid rgba(148, 163, 184, 0.35);
        background: rgba(15, 23, 42, 0.72);
        color: inherit;
        font: inherit;
        resize: vertical;
        min-height: 3rem;
      }

      .field input:focus,
      .field textarea:focus {
        outline: 2px solid rgba(56, 189, 248, 0.45);
        outline-offset: 2px;
      }

      .status-message {
        font-size: 0.9rem;
        min-height: 1.2rem;
      }

      footer {
        margin-top: 4rem;
        padding: 2rem 1.5rem 3rem;
        border-top: 1px solid rgba(148, 163, 184, 0.15);
      }

      .footer-container {
        max-width: 1080px;
        margin: 0 auto;
        display: grid;
        gap: 2rem;
      }

      .footer-section {
        display: grid;
        gap: 0.75rem;
      }

      .footer-section h4 {
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        margin: 0;
        opacity: 0.6;
        font-weight: 600;
      }

      .footer-links {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        font-size: 0.9rem;
      }

      .footer-links a {
        opacity: 0.75;
        transition: opacity 0.2s ease;
      }

      .footer-links a:hover,
      .footer-links a:focus {
        opacity: 1;
      }

      .social-links {
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .social-links a {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.5rem 0.75rem;
        border-radius: 0.5rem;
        border: 1px solid rgba(148, 163, 184, 0.25);
        background: rgba(15, 23, 42, 0.5);
        font-size: 0.85rem;
        opacity: 0.8;
        transition: all 0.2s ease;
      }

      .social-links a:hover,
      .social-links a:focus {
        opacity: 1;
        border-color: rgba(56, 189, 248, 0.4);
        transform: translateY(-1px);
      }

      .social-links svg {
        width: 1.1rem;
        height: 1.1rem;
      }

      .footer-about {
        font-size: 0.9rem;
        opacity: 0.7;
        line-height: 1.6;
        max-width: 40rem;
      }

      .footer-bottom {
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid rgba(148, 163, 184, 0.15);
        text-align: center;
        opacity: 0.6;
        font-size: 0.85rem;
      }

      @media (min-width: 768px) {
        .footer-container {
          grid-template-columns: 1.5fr 1fr 1fr;
        }
      }

      @media (max-width: 900px) {
        nav {
          position: absolute;
          inset: 100% 1.5rem auto;
          flex-direction: column;
          align-items: flex-start;
          padding: 1rem 1.25rem;
          background: rgba(2, 6, 23, 0.95);
          border-radius: 1rem;
          border: 1px solid rgba(148, 163, 184, 0.2);
          opacity: 0;
          pointer-events: none;
          transform: translateY(-10px);
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        nav[data-open="true"] {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }

        .menu-toggle {
          display: inline-flex;
        }
      }

      @media (min-width: 900px) {
        .hero {
          grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
          align-items: center;
        }

        .hero-visual {
          justify-self: end;
        }

        .testimonial-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      .hero-visual {
        display: grid;
        gap: 0.8rem;
        padding: 1.5rem;
        border-radius: 1.5rem;
        border: 1px solid rgba(56, 189, 248, 0.22);
        background: linear-gradient(160deg, rgba(56, 189, 248, 0.16), rgba(15, 23, 42, 0.85));
        box-shadow: 0 25px 45px rgba(15, 23, 42, 0.45);
      }

      .hero-visual-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.9rem 1.1rem;
        border-radius: 1rem;
        border: 1px solid rgba(148, 163, 184, 0.2);
        background: rgba(2, 6, 23, 0.55);
      }

      .hero-visual-row strong {
        font-size: 1rem;
      }

      .hero-visual-row span {
        font-size: 0.85rem;
        opacity: 0.75;
      }

      .metrics {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      }

      .metric {
        padding: 1.5rem;
        border-radius: 1.1rem;
        border: 1px solid rgba(148, 163, 184, 0.2);
        background: rgba(15, 23, 42, 0.6);
      }

      .metric strong {
        display: block;
        font-size: 2rem;
        margin-bottom: 0.4rem;
      }
    </style>
  </head>
  <body>
    <header>
      <div class="nav-container">
        <a class="brand" href="#top">TacticDev</a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" id="menuToggle">
          Menu
        </button>
        <nav id="site-nav">
          <a href="#services">Services</a>
          <a href="#process">Process</a>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>

    <main id="top">
      <section class="hero">
        <div>
          <h1>Product teams that ship clean, modern software at founder speed.</h1>
          <p>
            We design, build, and launch digital products for venture-backed startups that need to move fast
            without compromising craft. TacticDev plugs in as your elite product squad, from Figma to production
            deploys.
          </p>
          <div class="hero-actions">
            <a class="primary-btn" href="#contact">Book a discovery call</a>
            <a class="secondary-link" href="#work" aria-label="Jump to recent work">
              Explore recent wins
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 12h14m0 0-5-5m5 5-5 5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </a>
          </div>
          <div class="badge-grid" role="list">
            <div class="badge" role="listitem">Rapid iterations</div>
            <div class="badge" role="listitem">Full-stack craft</div>
            <div class="badge" role="listitem">Fractional teams</div>
            <div class="badge" role="listitem">Founder-trusted</div>
          </div>
        </div>
        <div class="hero-visual" aria-hidden="true">
          <div class="hero-visual-row">
            <strong>Launch in 6 weeks</strong>
            <span>AI-enabled finance platform</span>
          </div>
          <div class="hero-visual-row">
            <strong>3.2×</strong>
            <span>Faster shipping vs. in-house</span>
          </div>
          <div class="hero-visual-row">
            <strong>99.9%</strong>
            <span>Uptime across managed products</span>
          </div>
        </div>
      </section>

      <section id="services">
        <div class="section-header">
          <span>Services</span>
          <h2>Build momentum with an integrated product squad.</h2>
          <p>
            Strategy, design, and engineering should move together. We combine product leaders, senior
            designers, and battle-tested engineers who have shipped for YC, a16z, and bootstrapped founders alike.
          </p>
        </div>
        <div class="card-grid">
          <article class="card">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 12h14M5 12l4-4m-4 4 4 4"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <h3>Product strategy sprints</h3>
            <p>
              Discover the sharpest version of your idea and align it to real metrics in two-week intensives.
            </p>
            <ul>
              <li>Insight interviews & user mapping</li>
              <li>North-star roadmap & KPI model</li>
              <li>Launch plan ready to brief investors</li>
            </ul>
          </article>
          <article class="card">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 6h16v12H4V6Zm4 4h8m-8 4h5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <h3>Design systems & research</h3>
            <p>
              Bring clarity to your customer experience with research-driven design that scales gracefully.
            </p>
            <ul>
              <li>Evidence-backed UX flows</li>
              <li>Design systems in Figma + code</li>
              <li>Interactive prototypes with user testing</li>
            </ul>
          </article>
          <article class="card">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 5h14l-1.5 14h-11L5 5Zm4 4h6m-6 4h5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <h3>Full-stack engineering pods</h3>
            <p>
              Launch performant web apps and APIs with automated QA, observability, and DevOps baked in.
            </p>
            <ul>
              <li>TypeScript, React, and modern cloud</li>
              <li>Secure infra on Vercel, Fly, or Cloudflare</li>
              <li>CI/CD with automated testing and monitors</li>
            </ul>
          </article>
        </div>
      </section>

      <section id="process">
        <div class="section-header">
          <span>Process</span>
          <h2>Simple, outcome-focused collaboration.</h2>
          <p>
            We keep founders close to the work while removing day-to-day friction. The result: clear comms,
            predictable shipping, and more time to focus on growth.
          </p>
        </div>
        <div class="process">
          <div class="process-step">
            <strong>01</strong>
            <div>
              <h3>Diagnose the gap</h3>
              <p>We audit the current product, tech stack, and team rhythms to surface the blockers.</p>
            </div>
          </div>
          <div class="process-step">
            <strong>02</strong>
            <div>
              <h3>Codify the plan</h3>
              <p>We co-create a north-star roadmap with measurable milestones tied to revenue or retention.</p>
            </div>
          </div>
          <div class="process-step">
            <strong>03</strong>
            <div>
              <h3>Ship in weekly loops</h3>
              <p>Design, build, and review cycles run in parallel so we can ship to users every single week.</p>
            </div>
          </div>
          <div class="process-step">
            <strong>04</strong>
            <div>
              <h3>Scale with confidence</h3>
              <p>We add analytics, SLOs, and playbooks so the product stays healthy after hand-off.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="work">
        <div class="section-header">
          <span>Selected work</span>
          <h2>Trusted by founders building category-defining products.</h2>
        </div>
        <div class="metrics">
          <div class="metric">
            <strong>Series B fintech</strong>
            <p>Scaled a lending platform to 4 countries with unified underwriting in 10 weeks.</p>
          </div>
          <div class="metric">
            <strong>AI ops startup</strong>
            <p>Integrated LLM workflows that cut customer onboarding time from 14 days to 36 hours.</p>
          </div>
          <div class="metric">
            <strong>Healthcare marketplace</strong>
            <p>Rebuilt scheduling experience, lifting weekly active providers by 68%.</p>
          </div>
        </div>

        <div class="testimonial-grid" aria-label="Founder testimonials">
          <article class="testimonial">
            <p>
              “TacticDev is the rare partner that can own strategy and execution. They translated fuzzy ideas into a
              reliable product roadmap and shipped production-quality code without hand-holding.”
            </p>
            <cite>— Priya Raman, Founder @ RelayIQ</cite>
          </article>
          <article class="testimonial">
            <p>
              “Our investors still mention how polished our beta felt. The TacticDev team worked like an embedded
              squad—clear communication, rigorous QA, and zero ego.”
            </p>
            <cite>— Luca Mateo, CEO @ Vantage Labs</cite>
          </article>
        </div>
      </section>

      <section id="contact">
        <div class="section-header">
          <span>Get started</span>
          <h2>Tell us what you need to ship next.</h2>
          <p>
            Share a few details about your product and we’ll reply within one business day with availability and a
            tailored approach.
          </p>
        </div>
        <div class="cta-panel">
          <form class="contact-form" id="contactForm">
            <div class="field">
              <label for="name">Name</label>
              <input id="name" name="name" type="text" autocomplete="name" required />
            </div>
            <div class="field">
              <label for="email">Email</label>
              <input id="email" name="email" type="email" autocomplete="email" required />
            </div>
            <div class="field">
              <label for="message">Project details</label>
              <textarea id="message" name="message" rows="4" placeholder="What are you building?" required></textarea>
            </div>
            <input type="text" name="hp_field" tabindex="-1" autocomplete="off" hidden />
            <button class="primary-btn" type="submit">Send message</button>
            <p class="status-message" role="status" aria-live="polite" id="formStatus"></p>
          </form>
          <div>
            <h3>How we’ll respond</h3>
            <p>
              Expect a short Loom walkthrough and a tactical plan for how we’d tackle your roadmap. If it’s not a
              fit, we’ll still share useful next steps and intros from our network.
            </p>
            <p>
              Prefer to reach out directly? Email <a href="mailto:hello@tacticdev.com">hello@tacticdev.com</a> and
              we’ll follow up quickly.
            </p>
          </div>
        </div>
      </section>
    </main>

    <footer>
      <div class="footer-container">
        <div class="footer-section">
          <h4>About TacticDev</h4>
          <p class="footer-about">
            High-velocity product teams for ambitious founders. We design, build, and launch digital products for 
            venture-backed startups that need to move fast without compromising craft.
          </p>
        </div>

        <div class="footer-section">
          <h4>Quick Links</h4>
          <div class="footer-links">
            <a href="#services">Services</a>
            <a href="#process">Process</a>
            <a href="#work">Work</a>
            <a href="#contact">Contact</a>
          </div>
        </div>

        <div class="footer-section">
          <h4>Connect</h4>
          <div class="social-links" role="list">
            <a href="https://github.com/tyy130" target="_blank" rel="noopener noreferrer" aria-label="GitHub" role="listitem">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              GitHub
            </a>
            <a href="https://linkedin.com/company/tacticdev" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" role="listitem">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
            <a href="https://twitter.com/tacticdev" target="_blank" rel="noopener noreferrer" aria-label="Twitter/X" role="listitem">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Twitter
            </a>
          </div>
          <div class="footer-links" style="margin-top: 0.75rem;">
            <a href="mailto:hello@tacticdev.com">hello@tacticdev.com</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        © ${new Date().getFullYear()} TacticDev. Built for the founders shipping what's next.
      </div>
    </footer>

    <script>
      const nav = document.getElementById('site-nav');
      const toggle = document.getElementById('menuToggle');
      if (toggle) {
        toggle.addEventListener('click', () => {
          const isOpen = nav.getAttribute('data-open') === 'true';
          nav.setAttribute('data-open', String(!isOpen));
          toggle.setAttribute('aria-expanded', String(!isOpen));
        });
      }

      const form = document.getElementById('contactForm');
      if (form) {
        form.addEventListener('submit', async (event) => {
          event.preventDefault();
          const status = document.getElementById('formStatus');
          if (status) {
            status.textContent = 'Sending…';
          }

          const formData = new FormData(form);
          try {
            const response = await fetch('/contact', {
              method: 'POST',
              body: formData
            });

            const text = await response.text();
            if (response.ok) {
              if (status) {
                status.textContent = text || 'Thanks — we will reply shortly.';
              }
              form.reset();
            } else {
              if (status) {
                status.textContent = text || 'Please complete all fields correctly.';
              }
            }
          } catch (error) {
            if (status) {
              status.textContent = 'Network error — try again in a moment.';
            }
          }
        });
      }
    </script>
  </body>
</html>`;

const okHeaders = new Headers({
  'content-type': 'text/html; charset=utf-8',
  'cache-control': 'public, max-age=60'
});

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/contact') {
      return handleContact(request);
    }

    if (request.method === 'GET' || request.method === 'HEAD') {
      if (request.method === 'HEAD') {
        return new Response(null, { status: 200, headers: okHeaders });
      }
      return new Response(HOMEPAGE_HTML, { status: 200, headers: okHeaders });
    }

    return new Response('Not found', { status: 404 });
  }
} satisfies ExportedHandler;

async function handleContact(request: Request): Promise<Response> {
  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return new Response('Please complete all fields correctly.', { status: 400 });
  }

  const honeypot = String(formData.get('hp_field') || '').trim();
  if (honeypot) {
    return new Response('Thanks — we will reply shortly.', { status: 200 });
  }

  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const message = String(formData.get('message') || '').trim();

  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!name || !message || !emailRegex.test(email)) {
    return new Response('Please complete all fields correctly.', { status: 422 });
  }

  return new Response('Thanks — we will reply shortly.', { status: 200 });
}
