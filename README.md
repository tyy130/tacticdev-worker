# TacticDev Worker

High-performance Cloudflare Workers-based marketing site for TacticDev - delivering lightning-fast, edge-optimized web experiences for ambitious founders and product teams.

## About TacticDev

TacticDev is a product development agency that designs and ships digital products for founders who need to move fast without breaking quality. We provide:

- **Product Strategy Sprints**: Two-week intensives to discover and align your product vision
- **Design Systems & Research**: Research-driven, scalable design experiences
- **Full-Stack Engineering**: Modern web apps with automated QA and DevOps

**Mission**: Empower founders to ship category-defining products with high-velocity, integrated product squads.

**Values**: Speed without compromise, founder-first collaboration, transparent communication, technical excellence.

## Repository Overview

This repository contains a Cloudflare Worker that serves the TacticDev marketing site with:

- Single-file HTML deployment for optimal performance
- Contact form handling with honeypot spam protection
- Edge caching for global low-latency access
- TypeScript for type-safe development

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Cloudflare account (for deployment)
- Wrangler CLI (`npm install -g wrangler`)

### Installation

```bash
# Clone the repository
git clone https://github.com/tyy130/tacticdev-worker.git
cd tacticdev-worker

# Install dependencies
npm install
```

### Development

```bash
# Start local development server
npm start

# The site will be available at http://localhost:8787
```

### Testing

```bash
# Run tests (requires vitest setup)
# Note: Test infrastructure is minimal - production deploys via GitHub Actions
npm test
```

### Deployment

```bash
# Deploy to Cloudflare Workers
npm run deploy

# Or use GitHub Actions (automatic on push to main)
```

## Project Structure

```
tacticdev-worker/
├── src/
│   ├── index.ts       # Main worker with inline HTML
│   └── worker.ts      # Alternative R2-based worker (legacy)
├── test/
│   └── index.spec.ts  # Basic worker tests
├── wrangler.jsonc     # Cloudflare Workers configuration
├── package.json       # Dependencies and scripts
└── README.md          # This file
```

## Contact Form

The contact form endpoint (`POST /contact`) includes:

- Field validation (name, email, message)
- Honeypot spam protection
- Email regex validation
- Success/error response handling

## Configuration

Edit `wrangler.jsonc` to configure:

- Worker name
- Routes and domains
- Environment variables
- Compatibility settings

## Brand Voice Guidelines

TacticDev's brand voice is:

- **Professional yet approachable**: We're experts who speak plainly
- **Action-oriented**: Focus on outcomes and momentum
- **Founder-centric**: Always prioritize the founder's perspective
- **Technically credible**: Show expertise without jargon
- **Confident but humble**: We deliver results, not just promises

See [BRAND_VOICE.md](./BRAND_VOICE.md) for detailed guidelines.

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

Private repository - All rights reserved.

## Connect With Us

- **Website**: [tacticdev.com](https://tacticdev.com)
- **Email**: [hello@tacticdev.com](mailto:hello@tacticdev.com)
- **GitHub**: [github.com/tyy130](https://github.com/tyy130)
- **LinkedIn**: [linkedin.com/company/tacticdev](https://linkedin.com/company/tacticdev)
- **Twitter/X**: [@tacticdev](https://twitter.com/tacticdev)

---

Built with ⚡ on Cloudflare Workers | © 2025 TacticDev
