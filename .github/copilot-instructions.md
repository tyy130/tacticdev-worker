# GitHub Copilot Instructions for tacticdev-worker

## Project Overview

This repository contains a Cloudflare Workers application that serves the TacticDev marketing website and distributes Loom Lang binaries. The worker handles static content delivery, contact form submissions, and automated distribution of pre-built Loom Lang executables.

## Architecture

- **Runtime**: Cloudflare Workers (serverless edge computing)
- **Storage**: Cloudflare R2 (S3-compatible object storage)
- **Language**: TypeScript
- **Testing**: Vitest with `@cloudflare/vitest-pool-workers`
- **Deployment**: Wrangler (Cloudflare's CLI tool)

### Key Components

1. **Marketing Site** (`src/index.ts`): Serves the TacticDev homepage with embedded HTML/CSS
2. **Contact Form Handler**: Processes customer inquiries (honeypot spam protection included)
3. **Loom Lang Distribution**: Provides download endpoints for pre-built Loom Lang binaries
4. **R2 Integration**: Fetches files from Cloudflare R2 bucket

## Technology Stack

- **TypeScript 5.3+**: Strict mode enabled
- **Cloudflare Workers**: Edge computing platform
- **Vitest 2.1+**: Testing framework with Workers pool
- **Wrangler 3.x**: Deployment and local development
- **Node.js 20**: Runtime for development

## Development Commands

```bash
# Install dependencies
npm install

# Run tests
npm test

# Watch mode for tests
npm run test:watch

# Start local development server
npm run start

# Deploy to Cloudflare
npm run deploy
```

## Code Style & Conventions

### TypeScript

- Use strict type checking (enabled in `tsconfig.json`)
- Prefer `interface` over `type` for object shapes
- Use explicit return types for exported functions
- Follow the existing naming conventions:
  - PascalCase for types/interfaces
  - camelCase for functions and variables
  - SCREAMING_SNAKE_CASE for constants

### Formatting

- Use Prettier for formatting (config in `.prettierrc`)
- Tabs for indentation (as per `.editorconfig`)
- No semicolons (Prettier config)

### File Organization

- Main application logic in `src/`
- Tests in `test/` directory
- Workflows in `.github/workflows/`
- Documentation in markdown files at root

## Testing Guidelines

- Write tests using Vitest
- Use `@cloudflare/vitest-pool-workers` for Workers-specific testing
- Test files use `.spec.ts` extension
- All tests must pass before deployment (enforced in CI)
- Mock external dependencies appropriately

### Example Test Pattern

```typescript
import { env, createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

describe('Worker', () => {
  it('should return 200 for homepage', async () => {
    const request = new Request('http://example.com/');
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(200);
  });
});
```

## Common Tasks

### Adding a New Route

1. Update the `fetch` handler in `src/index.ts`
2. Add path matching logic
3. Implement handler function
4. Add tests in `test/index.spec.ts`
5. Update documentation if customer-facing

### Modifying the Marketing Site

- The homepage HTML is embedded in `src/index.ts` as `HOMEPAGE_HTML`
- Styles are inline within the HTML (no separate CSS files)
- Keep the single-file approach for simplicity
- Test changes with `npm run start` before deploying

### Adding Loom Lang Features

- Binary build process is in `.github/workflows/build-loom-lang.yml`
- Download handler is `handleLoomDownload()` in `src/index.ts`
- Binaries are stored in R2 at `downloads/loom-lang/latest/`
- See `LOOM-LANG.md` for detailed distribution documentation

## Deployment Process

### Automated Deployment

- Pushes to `main` branch trigger automatic deployment via `.github/workflows/deploy.yml`
- Workflow runs tests before deploying
- Deployment uses Wrangler with credentials from GitHub Secrets

### Manual Deployment

```bash
npm run deploy
```

Requires:
- `CLOUDFLARE_API_TOKEN` environment variable
- `CLOUDFLARE_ACCOUNT_ID` environment variable

### Configuration

- Deployment config in `wrangler.jsonc`
- R2 bucket binding: `ASSETS` → `tacticdev-assets`
- Environment variables in `vars` section
- Routes configured for `tacticdev.com` domain

## R2 Storage Structure

```
tacticdev-assets/
├── tacticdev_site/           # Static website files
│   └── index.html
└── downloads/
    └── loom-lang/
        └── latest/
            ├── loom-linux-x64
            ├── loom-macos-x64
            └── loom-windows-x64.exe
```

## Important Notes

### Contact Form

- Uses honeypot field (`hp_field`) for spam prevention
- Email validation via regex
- Returns generic success message to prevent user enumeration
- Currently returns success without actually sending email (implement email service as needed)

### Security Considerations

- All user input is validated and sanitized
- Honeypot protection on contact form
- Path traversal protection (`..` in paths rejected)
- Content-Type headers set appropriately
- Cache headers configured for optimal performance

### Performance

- Static content cached for 1 year (`max-age=31536000, immutable`)
- HTML cached for 60 seconds with revalidation
- Downloads cached for 1 hour
- Use ETags for cache validation

## Workflow Management

### Deploy Workflow (`deploy.yml`)

- Triggers on push to `main`
- Can be manually triggered
- Runs tests before deployment
- Deploys to production environment

### Build Loom Lang Workflow (`build-loom-lang.yml`)

- Builds binaries for Linux, macOS, and Windows
- Triggered by:
  - Manual dispatch
  - Repository dispatch from `loom-lang` repo
  - Changes to the workflow file
- Uploads to R2 after successful build
- See `LOOM-LANG.md` for details

## Troubleshooting

### Tests Failing

- Ensure dependencies are installed: `npm install`
- Check Node.js version (should be 20.x)
- Verify test files are in `test/` directory

### Deployment Issues

- Verify Cloudflare credentials are set
- Check Wrangler version: `npx wrangler --version`
- Ensure R2 bucket exists and is accessible
- Review Cloudflare dashboard logs

### Local Development

- Use `npm run start` for local server
- Wrangler will simulate Workers environment
- R2 access requires proper configuration in `.dev.vars` (not committed)

## Additional Resources

- [LOOM-LANG.md](../LOOM-LANG.md) - Loom Lang distribution details
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Deployment documentation
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler Docs](https://developers.cloudflare.com/workers/wrangler/)
