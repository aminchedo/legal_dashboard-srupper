#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
LOG_DIR="$ROOT_DIR/temp"
LOG_FILE="$LOG_DIR/backup-log.txt"

mkdir -p "$LOG_DIR"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

if [ ! -d "$BACKEND_DIR" ]; then
  log "ERROR: backend directory not found at $BACKEND_DIR" && exit 1
fi
if [ ! -d "$FRONTEND_DIR" ]; then
  log "ERROR: frontend directory not found at $FRONTEND_DIR" && exit 1
fi

log "Installing backend dependencies in $BACKEND_DIR"
cd "$BACKEND_DIR"
if [ ! -f package.json ]; then
  log "ERROR: backend/package.json not found" && exit 1
fi
npm ci || npm install

log "Installing frontend dependencies in $FRONTEND_DIR"
cd "$FRONTEND_DIR"
if [ ! -f package.json ]; then
  log "ERROR: frontend/package.json not found" && exit 1
fi
npm ci || npm install

log "Dependencies installed successfully."