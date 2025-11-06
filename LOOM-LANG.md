# Loom Lang Distribution

This document describes how Loom Lang binaries are built and distributed through the TacticDev Worker.

## Overview

Loom Lang is an experimental, AI-powered programming language designed for declarative automation. The language is developed and maintained in the [Tactic-Dev/loom-lang](https://github.com/Tactic-Dev/loom-lang) repository, and this worker provides download access to pre-built binaries.

## Build Process

### Automated Builds

The `.github/workflows/build-loom-lang.yml` workflow automatically builds Loom Lang binaries for multiple platforms:

- **Linux (x64)**: Built on `ubuntu-latest`
- **macOS (x64)**: Built on `macos-latest`
- **Windows (x64)**: Built on `windows-latest`

### Build Triggers

The workflow is triggered by:

1. **Push to main branch**: When changes are merged to `main` (only if the workflow file changes)
2. **Manual dispatch**: Can be triggered manually from the GitHub Actions interface
3. **Repository dispatch**: Triggered automatically when the loom-lang repository is updated

### Build Steps

For each platform, the workflow:

1. Checks out the loom-lang repository
2. Sets up Python 3.11
3. Installs dependencies from `requirements.txt`
4. Installs PyInstaller
5. Builds a single-file executable using PyInstaller
6. Uploads the binary as a GitHub Actions artifact
7. Uploads the binary to Cloudflare R2 storage

## Storage

Binaries are stored in Cloudflare R2 at the following paths:

```
downloads/loom-lang/latest/loom-linux-x64
downloads/loom-lang/latest/loom-macos-x64
downloads/loom-lang/latest/loom-windows-x64.exe
```

## Download Endpoints

The worker serves binaries via HTTP GET requests:

- **Linux**: `https://tacticdev.com/downloads/loom-lang/latest/loom-linux-x64`
- **macOS**: `https://tacticdev.com/downloads/loom-lang/latest/loom-macos-x64`
- **Windows**: `https://tacticdev.com/downloads/loom-lang/latest/loom-windows-x64.exe`

### Endpoint Behavior

- **Content-Type**: `application/octet-stream`
- **Content-Disposition**: `attachment; filename="<filename>"`
- **Cache-Control**: `public, max-age=3600`
- **ETag**: Uses R2 object's ETag for cache validation

## Homepage Integration

The homepage includes a dedicated "Loom Lang" section that:

- Explains the key features of Loom Lang
- Provides download buttons for all three platforms
- Links to the GitHub repository for more information

## Triggering a New Build

To trigger a new build of Loom Lang binaries:

### Option 1: Manual Dispatch

1. Go to the Actions tab in GitHub
2. Select "Build Loom Lang" workflow
3. Click "Run workflow"
4. Select the branch (usually `main`)
5. Click "Run workflow" button

### Option 2: Push to Main

Merge changes that update the build workflow file.

### Option 3: Repository Dispatch (from loom-lang repo)

The loom-lang repository can trigger builds here by sending a repository dispatch event:

```bash
curl -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token <GITHUB_TOKEN>" \
  https://api.github.com/repos/tyy130/tacticdev-worker/dispatches \
  -d '{"event_type":"loom-lang-updated"}'
```

## Troubleshooting

### Build Failures

If builds fail, check:

1. **Python dependencies**: Ensure `requirements.txt` in loom-lang is correct
2. **PyInstaller compatibility**: Some Python packages have issues with PyInstaller
3. **Platform-specific issues**: Check the logs for each platform

### Upload Failures

If R2 upload fails:

1. Verify `CLOUDFLARE_API_TOKEN` secret has R2 write permissions
2. Verify `CLOUDFLARE_ACCOUNT_ID` is correct
3. Ensure the R2 bucket `tacticdev-assets` exists
4. Check Wrangler version is compatible (currently using Wrangler 3.x)

### Download Failures

If downloads fail:

1. Check that binaries were successfully uploaded to R2
2. Verify the R2 bucket binding in `wrangler.jsonc`
3. Test the download endpoints manually
4. Check worker logs in Cloudflare dashboard

## Future Enhancements

Potential improvements:

- **Versioned releases**: Store multiple versions instead of just "latest"
- **Checksums**: Provide SHA256 checksums for verification
- **Auto-update mechanism**: Allow the loom binary to self-update
- **Release notes**: Include version information and changelog
- **ARM builds**: Add support for ARM64 architectures (Apple Silicon, ARM Linux)
