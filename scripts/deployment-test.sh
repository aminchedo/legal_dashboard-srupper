#!/usr/bin/env bash
set -euo pipefail

RETRIES=10
SLEEP=2

cd frontend
npm ci
npm run build
cd ..

( cd backend && node server.js > backend.quick.log 2>&1 & echo $! > backend.quick.pid )
sleep 3
( cd frontend && nohup npm run preview -- --port 5173 > ../frontend.quick.log 2>&1 & echo $! > ../frontend.quick.pid )

for i in $(seq 1 $RETRIES); do
  if curl -sf http://localhost:3001/health >/dev/null && curl -sf http://localhost:5173/ >/dev/null; then
    echo "✅ Pre-deployment health checks passed"
    exit 0
  fi
  echo "Waiting for services... attempt $i/$RETRIES"
  sleep $SLEEP
  SLEEP=$((SLEEP+1))
done

echo "❌ Services failed to become healthy"
exit 1