import { ErrorTracker, DocumentationFetcher } from './error-tracker';

interface Env {
  ASSETS: R2Bucket;
  BUCKET_PREFIX: string;
}

// Global error tracker instance (in production, use Durable Objects or KV)
const errorTracker = new ErrorTracker(3); // Threshold of 3 occurrences
const docFetcher = new DocumentationFetcher();

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
        text-align: center;
        opacity: 0.65;
        font-size: 0.85rem;
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
          <a href="#loom-lang">Loom Lang</a>
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

      <section id="loom-lang">
        <div class="section-header">
          <span>Open Source</span>
          <h2>Loom Lang — AI-Powered Automation Language</h2>
          <p>
            An experimental programming language that learns from your intent. Write declarative automation scripts
            and let Loom figure out the implementation details.
          </p>
        </div>
        <div class="card-grid">
          <article class="card">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <h3>Declarative & AI-Driven</h3>
            <p>
              Describe what you want to achieve, not how to do it. Loom's AI core translates your intent into
              executable code.
            </p>
          </article>
          <article class="card">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <h3>Self-Learning</h3>
            <p>
              Loom analyzes your scripts to identify patterns and autonomously creates new commands, evolving with
              your workflow.
            </p>
          </article>
          <article class="card">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <h3>Permission-Based Security</h3>
            <p>
              Scripts must explicitly declare intent to access sensitive resources, preventing unexpected or
              malicious behavior.
            </p>
          </article>
        </div>
        <div style="margin-top: 2rem; padding: 2rem; border-radius: 1.2rem; border: 1px solid rgba(56, 189, 248, 0.3); background: rgba(15, 23, 42, 0.6);">
          <h3 style="margin-top: 0;">Download Loom Lang</h3>
          <p style="opacity: 0.8; margin-bottom: 1.5rem;">
            Get started with Loom by downloading the latest release for your platform:
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
            <a href="/downloads/loom-lang/latest/loom-linux-x64" class="primary-btn" download style="display: inline-block; text-decoration: none;">
              Download for Linux
            </a>
            <a href="/downloads/loom-lang/latest/loom-macos-x64" class="primary-btn" download style="display: inline-block; text-decoration: none;">
              Download for macOS
            </a>
            <a href="/downloads/loom-lang/latest/loom-windows-x64.exe" class="primary-btn" download style="display: inline-block; text-decoration: none;">
              Download for Windows
            </a>
          </div>
          <p style="margin-top: 1.5rem; font-size: 0.9rem; opacity: 0.7;">
            Learn more and contribute on <a href="https://github.com/Tactic-Dev/loom-lang" target="_blank" rel="noopener noreferrer" style="color: var(--accent);">GitHub</a>
          </p>
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

    <footer>© ${new Date().getFullYear()} TacticDev. Built for the founders shipping what’s next.</footer>

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
    try {
      const url = new URL(request.url);

      if (request.method === 'POST' && url.pathname === '/contact') {
        return handleContact(request);
      }

      // Handle loom-lang downloads
      if (request.method === 'GET' && url.pathname.startsWith('/downloads/loom-lang/')) {
        return handleLoomDownload(request, env);
      }

      // Error reporting endpoint
      if (request.method === 'GET' && url.pathname === '/api/errors') {
        return handleErrorReport(request);
      }

      if (request.method === 'GET' || request.method === 'HEAD') {
        if (request.method === 'HEAD') {
          return new Response(null, { status: 200, headers: okHeaders });
        }
        return new Response(HOMEPAGE_HTML, { status: 200, headers: okHeaders });
      }

      return new Response('Not found', { status: 404 });
    } catch (error) {
      // Track any unhandled errors
      const err = error instanceof Error ? error : new Error(String(error));
      const record = errorTracker.track(err, { path: new URL(request.url).pathname });
      
      // If this error is frequent, log documentation
      if (errorTracker.isFrequent(record.fingerprint)) {
        console.warn(`Frequent error detected (${record.count} occurrences):`, record.message);
        
        // Fetch and log documentation
        const docs = await docFetcher.fetchDocumentation(record);
        if (docs.length > 0) {
          console.log('Relevant documentation:');
          docs.slice(0, 3).forEach(doc => {
            console.log(`- ${doc.source}: ${doc.url}`);
          });
        }
      }
      
      return new Response('Internal server error', { status: 500 });
    }
  }
} satisfies ExportedHandler<Env>;

async function handleContact(request: Request): Promise<Response> {
  try {
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
  } catch (error) {
    // Track contact form errors
    const err = error instanceof Error ? error : new Error(String(error));
    const record = errorTracker.track(err, { handler: 'contact' });
    
    // If frequent, fetch documentation
    if (errorTracker.isFrequent(record.fingerprint)) {
      console.warn(`Frequent contact form error (${record.count} occurrences):`, record.message);
      const docs = await docFetcher.fetchDocumentation(record);
      if (docs.length > 0) {
        console.log('Suggested documentation:');
        docs.slice(0, 3).forEach(doc => console.log(`- ${doc.source}: ${doc.url}`));
      }
    }
    
    return new Response('Please complete all fields correctly.', { status: 400 });
  }
}

async function handleLoomDownload(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace('/downloads/loom-lang/', '');

  // Supported downloads
  const validPaths = [
    'latest/loom-linux-x64',
    'latest/loom-macos-x64',
    'latest/loom-windows-x64.exe'
  ];

  if (!validPaths.includes(path)) {
    return new Response('Not found', { status: 404 });
  }

  try {
    const r2Key = `downloads/loom-lang/${path}`;
    const object = await env.ASSETS.get(r2Key);

    if (!object) {
      return new Response('File not found', { status: 404 });
    }

    const headers = new Headers({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${path.split('/').pop()}"`,
      'Cache-Control': 'public, max-age=3600',
      'ETag': object.httpEtag
    });

    if (object.size) {
      headers.set('Content-Length', object.size.toString());
    }

    return new Response(object.body, { status: 200, headers });
  } catch (error) {
    // Track R2 errors
    const err = error instanceof Error ? error : new Error(String(error));
    const record = errorTracker.track(err, { handler: 'loom-download', path });
    
    console.error('Error fetching from R2:', error);
    
    // If frequent, fetch documentation
    if (errorTracker.isFrequent(record.fingerprint)) {
      console.warn(`Frequent R2 error (${record.count} occurrences):`, record.message);
      const docs = await docFetcher.fetchDocumentation(record);
      if (docs.length > 0) {
        console.log('Suggested documentation:');
        docs.slice(0, 3).forEach(doc => console.log(`- ${doc.source}: ${doc.url}`));
      }
    }
    
    return new Response('Internal server error', { status: 500 });
  }
}

/**
 * Handle error reporting endpoint
 * Returns all tracked errors with documentation links
 */
function handleErrorReport(request: Request): Response {
  const url = new URL(request.url);
  const showAll = url.searchParams.get('all') === 'true';
  
  const errors = showAll ? errorTracker.getAllErrors() : errorTracker.getFrequentErrors();
  
  const report = {
    timestamp: new Date().toISOString(),
    threshold: 3,
    totalErrors: errorTracker.getAllErrors().length,
    frequentErrors: errorTracker.getFrequentErrors().length,
    errors: errors.map(error => ({
      fingerprint: error.fingerprint,
      message: error.message,
      count: error.count,
      firstSeen: new Date(error.firstSeen).toISOString(),
      lastSeen: new Date(error.lastSeen).toISOString(),
      context: error.context,
      isFrequent: error.count >= 3
    }))
  };
  
  return new Response(JSON.stringify(report, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
}
