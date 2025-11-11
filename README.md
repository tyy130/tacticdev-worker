# tacticdev-worker (monorepo)

This repository contains the backend and chat application code for the tacticdev project.

## Features

- **Marketing Site**: Serves the TacticDev marketing website
- **Contact Form**: Handles customer inquiries
- **Loom Lang Distribution**: Provides download access to Loom Lang binaries
- **Error Tracking & Documentation**: Automatically identifies frequent errors and provides relevant documentation links

## Error Tracking System

The worker includes an intelligent error tracking system that:
- Identifies errors that occur frequently (configurable threshold)
- Automatically searches for relevant documentation from Cloudflare, MDN, and Stack Overflow
- Provides an API endpoint (`/api/errors`) to view error reports
- Logs documentation links when frequent errors are detected

See [ERROR-TRACKING.md](ERROR-TRACKING.md) for detailed documentation.

## Loom Lang

This worker hosts pre-built binaries of [Loom Lang](https://github.com/Tactic-Dev/loom-lang), an experimental AI-powered programming language for declarative automation. 

Binaries are automatically built for Linux, macOS, and Windows, and made available for download at:
- `/downloads/loom-lang/latest/loom-linux-x64`
- `/downloads/loom-lang/latest/loom-macos-x64`
- `/downloads/loom-lang/latest/loom-windows-x64.exe`

See [LOOM-LANG.md](LOOM-LANG.md) for details on the build and distribution process.

## Note on the static site

The static marketing site has been split into its own repository: [tacticdev-site](https://github.com/tyy130/tacticdev-site).

The site was moved as a clean split (no preserved history) and is now maintained under that repository.

If you manage deployments or CI for the site, please use the `tacticdev-site` repository. This monorepo focuses on the worker/chat services.
