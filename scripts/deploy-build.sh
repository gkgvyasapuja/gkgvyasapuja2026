#!/usr/bin/env bash
# Build locally → tar.gz standalone app → scp to server → extract there (tar+gzip, no unzip needed).
# Usage: ./scripts/deploy-build.sh
# Optional: DEPLOY_SSH_KEY, DEPLOY_USER, DEPLOY_HOST, DEPLOY_PATH (default /root/gkg-vyaspuja-standalone)

set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

KEY="${DEPLOY_SSH_KEY:-$HOME/.ssh/gkgsshkey}"
USER="${DEPLOY_USER:-root}"
HOST="${DEPLOY_HOST:-157.245.108.205}"
DEST="${DEPLOY_PATH:-/root/gkg-vyaspuja-standalone}"
SSH_OPTS=(-i "$KEY" -o StrictHostKeyChecking=accept-new)

ARCHIVE="gkg-deploy-$(date +%Y%m%d-%H%M%S).tar.gz"
STAGE=".deploy-stage"

rm -rf "$STAGE"
npm ci
npm run build

test -f .next/standalone/server.js

mkdir -p "$STAGE"
cp -a .next/standalone/. "$STAGE/"
mkdir -p "$STAGE/.next"
cp -a .next/static "$STAGE/.next/static"
[[ -d public ]] && cp -a public "$STAGE/public"

( cd "$STAGE" && tar czf "../$ARCHIVE" . )
rm -rf "$STAGE"

scp "${SSH_OPTS[@]}" "$ARCHIVE" "$USER@$HOST:/tmp/$ARCHIVE"

ssh "${SSH_OPTS[@]}" "$USER@$HOST" "mkdir -p '$DEST' && tar xzf '/tmp/$ARCHIVE' -C '$DEST' && rm -f '/tmp/$ARCHIVE'"

rm -f "$ARCHIVE"
echo "Deployed to $DEST — run: cd $DEST && NODE_ENV=production PORT=3000 node server.js"
