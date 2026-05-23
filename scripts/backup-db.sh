#!/usr/bin/env bash
# Create a local PostgreSQL backup with pg_dump.
#
# Usage:
#   ./scripts/backup-db.sh
#   BACKUP_DIR=/path/to/dir ./scripts/backup-db.sh
#
# Requires: pg_dump, DB_URI in .env or environment (DigitalOcean Postgres).

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# shellcheck disable=SC1091
source "$ROOT/scripts/lib/pg-dump.sh"

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

if [[ -z "${DB_URI:-}" ]]; then
  echo "Error: DB_URI is not set. Add it to .env or export it." >&2
  exit 1
fi

PG_DUMP_BIN="$(resolve_pg_dump)"
pg_dump_version_hint "$PG_DUMP_BIN"

BACKUP_DIR="${BACKUP_DIR:-$ROOT/backups}"
mkdir -p "$BACKUP_DIR"

STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="$BACKUP_DIR/gkg-vyaspuja-${STAMP}.dump"

export PGSSLMODE="${PGSSLMODE:-require}"

echo "Creating backup..."
"$PG_DUMP_BIN" "$DB_URI" \
  --format=custom \
  --no-owner \
  --no-acl \
  --file="$OUT"

echo "Backup saved: $OUT ($(du -h "$OUT" | cut -f1))"
