#!/bin/bash
# Script to archive GitHub repositories that haven't been updated in 12 months and have 0 stars
# Usage: ./scripts/archive-repos.sh [--dry-run] [--owner OWNER]

set -e

# Default values
DRY_RUN=true
OWNER="tyy130"
MONTHS_INACTIVE=12

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --no-dry-run)
      DRY_RUN=false
      shift
      ;;
    --owner)
      OWNER="$2"
      shift 2
      ;;
    --help)
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Archive GitHub repositories that haven't been updated in 12 months and have 0 stars"
      echo ""
      echo "Options:"
      echo "  --dry-run       Run without making changes (default)"
      echo "  --no-dry-run    Actually archive repositories"
      echo "  --owner OWNER   GitHub username/org to scan (default: tyy130)"
      echo "  --help          Show this help message"
      echo ""
      echo "Requirements:"
      echo "  - GitHub CLI (gh) must be installed and authenticated"
      echo "  - GITHUB_TOKEN environment variable (optional, uses gh auth token by default)"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# Check if gh is installed
if ! command -v gh &> /dev/null; then
  echo "❌ Error: GitHub CLI (gh) is not installed"
  echo "Install it from: https://cli.github.com/"
  exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
  echo "❌ Error: GitHub CLI is not authenticated"
  echo "Run: gh auth login"
  exit 1
fi

# Calculate the date 12 months ago
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  TWELVE_MONTHS_AGO=$(date -u -v-12m +%Y-%m-%dT%H:%M:%SZ)
else
  # Linux
  TWELVE_MONTHS_AGO=$(date -u -d "12 months ago" +%Y-%m-%dT%H:%M:%SZ)
fi

echo "🔍 Scanning repositories for $OWNER..."
echo "📅 Looking for repos not updated since: $TWELVE_MONTHS_AGO"
echo "🏃 Dry run mode: $DRY_RUN"
echo ""

# Get all repositories for the user (with pagination)
echo "📥 Fetching repositories..."
REPOS=$(gh api --paginate "users/$OWNER/repos?per_page=100&type=owner" --jq '.[] | {name: .name, stars: .stargazers_count, updated_at: .updated_at, archived: .archived, private: .private}')

# Process each repository
ARCHIVED_COUNT=0
SKIPPED_COUNT=0
CANDIDATES=()

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

while IFS= read -r repo; do
  REPO_NAME=$(echo "$repo" | jq -r '.name')
  STARS=$(echo "$repo" | jq -r '.stars')
  UPDATED_AT=$(echo "$repo" | jq -r '.updated_at')
  IS_ARCHIVED=$(echo "$repo" | jq -r '.archived')
  IS_PRIVATE=$(echo "$repo" | jq -r '.private')
  
  # Skip if already archived
  if [ "$IS_ARCHIVED" = "true" ]; then
    echo "⏭️  Skipping $REPO_NAME (already archived)"
    ((SKIPPED_COUNT++))
    continue
  fi
  
  # Check if repo has 0 stars and hasn't been updated in 12 months
  if [ "$STARS" -eq 0 ] && [ "$UPDATED_AT" \< "$TWELVE_MONTHS_AGO" ]; then
    VISIBILITY="public"
    if [ "$IS_PRIVATE" = "true" ]; then
      VISIBILITY="private"
    fi
    
    echo "📦 Found candidate for archival: $REPO_NAME ($VISIBILITY)"
    echo "   Stars: $STARS"
    echo "   Last updated: $UPDATED_AT"
    
    CANDIDATES+=("$OWNER/$REPO_NAME")
    
    if [ "$DRY_RUN" = "false" ]; then
      echo "   🗃️  Archiving..."
      ERROR_OUTPUT=$(gh api \
        --method PATCH \
        -H "Accept: application/vnd.github+json" \
        "repos/$OWNER/$REPO_NAME" \
        -f archived=true 2>&1)
      if [ $? -eq 0 ]; then
        echo "   ✅ Archived!"
      else
        echo "   ❌ Failed to archive: $ERROR_OUTPUT"
      fi
    else
      echo "   ℹ️  Would archive (dry run mode)"
    fi
    
    ((ARCHIVED_COUNT++))
    echo ""
  else
    if [ "$STARS" -gt 0 ] || [ "$UPDATED_AT" \> "$TWELVE_MONTHS_AGO" ]; then
      # Only show details for repos we're keeping for a specific reason
      echo "✓ Keeping $REPO_NAME (Stars: $STARS, Updated: $UPDATED_AT)"
      ((SKIPPED_COUNT++))
    fi
  fi
  
done < <(echo "$REPOS" | jq -c '.')

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Summary:"
echo "   Repositories processed: $((ARCHIVED_COUNT + SKIPPED_COUNT))"
echo "   Repositories archived/would archive: $ARCHIVED_COUNT"
echo "   Repositories kept: $SKIPPED_COUNT"

if [ $ARCHIVED_COUNT -gt 0 ]; then
  echo ""
  echo "📦 Repositories identified for archival:"
  for repo in "${CANDIDATES[@]}"; do
    echo "   - $repo"
  done
fi

if [ "$DRY_RUN" = "true" ]; then
  echo ""
  echo "ℹ️  This was a dry run. To actually archive repositories, run with --no-dry-run"
fi

echo ""
