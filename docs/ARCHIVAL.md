# Repository Archival Automation

This repository includes automation to archive GitHub repositories that haven't been updated in 12 months and have zero stars.

## Overview

The archival process helps maintain a clean repository list by automatically identifying and archiving inactive repositories that have no community interest (zero stars).

## Criteria for Archival

A repository will be considered for archival if:
1. It has **zero stars** (no community interest)
2. It hasn't been **updated in 12 months** (inactive)
3. It is **not already archived**

## Usage

### Automated (GitHub Actions)

A GitHub Action workflow runs automatically on the 1st of each month to identify repositories that meet the archival criteria. By default, it runs in **dry-run mode** and only reports what would be archived.

#### Setup for Actual Archival

To enable the workflow to actually archive repositories (not just dry-run), you need to:

1. Create a [Personal Access Token (PAT)](https://github.com/settings/tokens/new) with `repo` scope
2. Add it as a repository secret named `REPO_ADMIN_TOKEN`
3. Update the workflow to use `${{ secrets.REPO_ADMIN_TOKEN }}` instead of `${{ secrets.GITHUB_TOKEN }}`

**Note**: The default `GITHUB_TOKEN` only has read permissions and cannot archive repositories.

#### Manual Trigger

You can manually trigger the workflow from the GitHub Actions tab:

1. Go to **Actions** → **Archive Unused Repositories**
2. Click **Run workflow**
3. Choose dry run mode:
   - `true` (default): Only report what would be archived
   - `false`: Actually archive the repositories (requires PAT setup)

### Manual Script

You can also run the archival script locally:

```bash
# Dry run (default) - see what would be archived
./scripts/archive-repos.sh

# Actually archive repositories
./scripts/archive-repos.sh --no-dry-run

# Scan a different owner
./scripts/archive-repos.sh --owner myusername

# Get help
./scripts/archive-repos.sh --help
```

#### Requirements

The script requires:
- [GitHub CLI (gh)](https://cli.github.com/) installed and authenticated
- Appropriate permissions to archive repositories

To authenticate with GitHub CLI:
```bash
gh auth login
```

## Output

The script provides detailed output including:
- List of repositories scanned
- Repositories identified for archival with their stats
- Summary of total repositories processed, archived, and kept

Example output:
```
🔍 Scanning repositories for tyy130...
📅 Looking for repos not updated since: 2023-11-06T18:15:50Z
🏃 Dry run mode: true

📥 Fetching repositories...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 Found candidate for archival: old-project (public)
   Stars: 0
   Last updated: 2022-05-15T10:30:00Z
   ℹ️  Would archive (dry run mode)

✓ Keeping tacticdev-worker (Stars: 5, Updated: 2024-11-01T12:00:00Z)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Summary:
   Repositories processed: 15
   Repositories archived/would archive: 1
   Repositories kept: 14

📦 Repositories identified for archival:
   - tyy130/old-project

ℹ️  This was a dry run. To actually archive repositories, run with --no-dry-run
```

## Safety Features

- **Dry-run by default**: The workflow and script default to dry-run mode to prevent accidental archival
- **Already archived repos are skipped**: Won't try to re-archive already archived repositories
- **Detailed logging**: See exactly what repositories are being processed and why
- **Manual approval**: Requires explicit action to actually archive repositories

## Unarchiving

If a repository was archived by mistake, you can unarchive it:

1. Go to the repository on GitHub
2. Click the **Unarchive this repository** button (requires admin access)

Or use the GitHub API:
```bash
gh api --method PATCH "repos/OWNER/REPO" -f archived=false
```

## Customization

To modify the archival criteria, edit:
- `.github/workflows/archive-repos.yml` for the GitHub Action
- `scripts/archive-repos.sh` for the standalone script

Key variables:
- `MONTHS_INACTIVE`: Number of months of inactivity (default: 12)
- `OWNER`: GitHub username or organization (default: tyy130)
