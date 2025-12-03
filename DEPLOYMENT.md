# Deployment Guide

This document outlines the deployment process for the TacticDev Worker.

## Prerequisites

- Node.js 20.x (see `.nvmrc`)
- npm 10.x or higher
- Cloudflare account with Workers enabled
- Required secrets configured in GitHub:
  - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token with Workers deploy permissions
  - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run tests:
   ```bash
   npm test
   ```

3. Start local development server:
   ```bash
   npm start
   ```

## Deployment

### Automatic Deployment (CI/CD)

The worker automatically deploys to Cloudflare when code is pushed to the `main` branch via GitHub Actions.

The deployment workflow:
1. Checks out the code
2. Sets up Node.js 20
3. Installs dependencies
4. Runs tests
5. Deploys to Cloudflare using `wrangler deploy`

### Manual Deployment

To deploy manually from your local machine:

```bash
# Ensure you have wrangler authenticated
npx wrangler login

# Deploy
npm run deploy
```

## Troubleshooting

### Authentication Errors

If you see "Unable to authenticate request [code: 10001]":

1. Verify that `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets are set correctly in GitHub
2. Ensure your API token has the following permissions:
   - Account.Workers Scripts: Edit
   - Account.Workers Routes: Edit
3. Check that the token hasn't expired

### Build Failures

If the build fails:

1. Ensure all tests pass locally: `npm test`
2. Check that dependencies are properly installed: `npm ci`
3. Verify Node.js version matches `.nvmrc`: `node --version`
4. Review the GitHub Actions logs for specific error messages

### Wrangler Version Issues

The project uses Wrangler v3 (currently 3.114.15). If you see version-related warnings:

- Stick with v3 for stability unless migrating to v4 is planned
- Update to the latest v3 version: `npm install --save-dev wrangler@^3.114.15`
- Run `npm install` to update `package-lock.json`

## Configuration

Worker configuration is managed in `wrangler.jsonc`:

- `name`: Worker name in Cloudflare
- `main`: Entry point file
- `compatibility_date`: Cloudflare Workers compatibility date
- `routes`: URL patterns for the worker
- `r2_buckets`: R2 bucket bindings (if applicable)
- `vars`: Environment variables

## Monitoring

After deployment:

1. Check the Cloudflare dashboard for deployment status
2. Verify the worker is responding at your configured routes
3. Review logs in Cloudflare Workers dashboard for any runtime errors

## Rolling Back

To roll back to a previous version:

1. Find the commit hash of the working version
2. Manually trigger the workflow from that commit using workflow_dispatch
3. Or deploy locally from that commit: `git checkout <commit-hash> && npm run deploy`
