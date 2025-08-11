#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PID_DIR="$ROOT_DIR/scripts/.pids"

if [ -d "$PID_DIR" ]; then
  for pidfile in "$PID_DIR"/*.pid; do
    [ -e "$pidfile" ] || continue
    PID=$(cat "$pidfile" || true)
    if [ -n "${PID:-}" ] && kill -0 "$PID" 2>/dev/null; then
      echo "Stopping PID $PID from $(basename "$pidfile")"
      kill "$PID" || true
    fi
    rm -f "$pidfile"
  done
else
  echo "No PID directory found at $PID_DIR"
fi

# Also try to stop vite and nodemon if still running (best-effort)
pkill -f "vite --port" || true
pkill -f "nodemon server.js" || true