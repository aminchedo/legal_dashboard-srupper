#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/enhanced-demo.sh [--ngrok] [--localtunnel] [--minutes N]
# Default: local only

DURATION_MINUTES=5
USE_NGROK=false
USE_LOCALTUNNEL=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --ngrok) USE_NGROK=true; shift ;;
    --localtunnel) USE_LOCALTUNNEL=true; shift ;;
    --minutes) DURATION_MINUTES=${2:-5}; shift 2 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

cleanup() {
  echo "\n🧹 Cleaning up..."
  pkill -f "vite preview" 2>/dev/null || true
  pkill -f "node server.js" 2>/dev/null || true
  lsof -ti:3001,5173 | xargs -r kill 2>/dev/null || true
}
trap cleanup EXIT

echo "🎬 Starting Legal Dashboard Demo"
cleanup || true
sleep 1

# Start backend
( cd backend && node server.js > ../backend.local.log 2>&1 & echo $! > ../backend.local.pid )
sleep 3
if curl -sf http://localhost:3001/health > /dev/null; then echo "✅ Backend OK"; else echo "❌ Backend failed"; fi

# Frontend build + preview
( cd frontend && npm ci && npm run build && nohup npm run preview -- --port 5173 > ../frontend.local.log 2>&1 & echo $! > ../frontend.local.pid )
sleep 3
if curl -sf http://localhost:5173/ > /dev/null; then echo "✅ Frontend OK"; else echo "❌ Frontend failed"; fi

URL="http://localhost:5173"

if $USE_NGROK; then
  if [[ -z "${NGROK_AUTHTOKEN:-}" ]]; then
    echo "❌ NGROK_AUTHTOKEN not set. Skipping ngrok."
  else
    command -v ngrok >/dev/null 2>&1 || { echo "Installing ngrok..."; sudo apt-get update && sudo apt-get install -y ngrok; }
    ngrok config add-authtoken "$NGROK_AUTHTOKEN"
    ngrok http 5173 --log=stdout > ngrok.local.log 2>&1 &
    sleep 5
    URL=$(curl -sf localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url' || true)
    echo "🌐 ngrok URL: $URL"
  fi
fi

if $USE_LOCALTUNNEL && [[ -z "$URL" || "$URL" == http*localhost* ]]; then
  command -v lt >/dev/null 2>&1 || npm install -g localtunnel
  SUB="legal-dashboard-$(date +%s)"
  lt --port 5173 --subdomain "$SUB" > lt.local.log 2>&1 &
  sleep 5
  URL="https://${SUB}.loca.lt"
  echo "🌐 LocalTunnel URL: $URL"
fi

echo "\n🎊 LIVE at: $URL"
for i in $(seq 1 "$DURATION_MINUTES"); do
  echo "⏱️ Minute $i/$DURATION_MINUTES"
  sleep 60
done