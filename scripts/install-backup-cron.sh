#!/usr/bin/env bash
# Install a daily cron job (2:00 AM) to upload pg_dump backups to S3.
#
# Usage:
#   ./scripts/install-backup-cron.sh
#   CRON_SCHEDULE="0 3 * * *" ./scripts/install-backup-cron.sh
#
# Logs: backups/cron.log in the project root.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCHEDULE="${CRON_SCHEDULE:-0 2 * * *}"
LOG_FILE="$ROOT/backups/cron.log"
MARKER="# gkg-vyaspuja db backup to s3"

if ! command -v npm >/dev/null 2>&1; then
  echo "Error: npm not found in PATH." >&2
  exit 1
fi

NPM_BIN="$(command -v npm)"
mkdir -p "$ROOT/backups"

CRON_LINE="$SCHEDULE cd $ROOT && $NPM_BIN run db:backup:s3 >> $LOG_FILE 2>&1 $MARKER"

EXISTING="$(crontab -l 2>/dev/null || true)"
if printf '%s\n' "$EXISTING" | grep -Fq "$MARKER"; then
  UPDATED="$(printf '%s\n' "$EXISTING" | grep -Fv "$MARKER")"
  printf '%s\n%s\n' "$UPDATED" "$CRON_LINE" | crontab -
  echo "Updated existing cron job."
else
  (printf '%s\n' "$EXISTING"; echo "$CRON_LINE") | crontab -
  echo "Installed cron job."
fi

echo "Schedule: $SCHEDULE"
echo "Command:  cd $ROOT && npm run db:backup:s3"
echo "Log file: $LOG_FILE"
echo ""
echo "Current crontab:"
crontab -l
