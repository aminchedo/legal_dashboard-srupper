#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SCRIPTS_DIR="$ROOT_DIR/scripts"
LOG_DIR="$ROOT_DIR/temp"
PID_DIR="$SCRIPTS_DIR/.pids"
CONFIG_JSON="$SCRIPTS_DIR/config.json"

mkdir -p "$LOG_DIR" "$PID_DIR"

# Install deps first
"$SCRIPTS_DIR/install-deps.sh"

# Ensure config exists
if [ ! -f "$CONFIG_JSON" ]; then
  cat > "$CONFIG_JSON" <<'JSON'
{
  "backend": {
    "cwd": "backend",
    "port": 3001,
    "healthPath": "/health",
    "start": "npm run start"
  },
  "frontend": {
    "cwd": "frontend",
    "port": 5173,
    "start": "npm run dev"
  }
}
JSON
fi

# Start process manager
node "$SCRIPTS_DIR/process-manager.js" --config "$CONFIG_JSON" &
PM_PID=$!
echo $PM_PID > "$PID_DIR/process-manager.pid"
echo "Process manager started with PID $PM_PID"

# Tail logs if available
sleep 1
node "$SCRIPTS_DIR/health-check.js" || true

wait $PM_PID