#!/usr/bin/env bash
set -euo pipefail

BACKEND_URL=${1:-http://localhost:3001/health}
FRONTEND_URL=${2:-http://localhost:5173/}

fail=false

echo "🧪 Checking backend: $BACKEND_URL"
if curl -sf "$BACKEND_URL" > /dev/null; then
  echo "✅ Backend healthy"
else
  echo "❌ Backend not reachable: $BACKEND_URL"
  fail=true
fi

echo "🧪 Checking frontend: $FRONTEND_URL"
if curl -sf "$FRONTEND_URL" > /dev/null; then
  echo "✅ Frontend reachable"
else
  echo "❌ Frontend not reachable: $FRONTEND_URL"
  fail=true
fi

$fail && exit 1 || exit 0