# Deployment Guide

## Overview
This project provides three deployment methods with smart orchestration:
- ngrok (authenticated, best UX, ~2 hours)
- LocalTunnel (no auth, ~60 minutes)
- GitHub Pages (static frontend, always-on)

An orchestrator workflow automatically selects the best available option and falls back gracefully.

## Prerequisites
- Node.js 18+ installed locally (for local runs)
- GitHub repository admin access

## Secrets
Add the following repository secret for ngrok (recommended):
- NGROK_AUTHTOKEN: use your token. Example provided for testing should be added as a secret, not hardcoded.

## Workflows
- `Deploy ngrok Live Demo (Authenticated)`: `.github/workflows/deploy-ngrok-live-demo.yml`
- `Deploy LocalTunnel Backup Demo`: `.github/workflows/deploy-localtunnel-backup.yml`
- `Deploy GitHub Pages (Static Frontend)`: `.github/workflows/deploy-github-pages-static.yml`
- `Deploy Orchestrator (Smart Fallbacks)`: `.github/workflows/deploy-orchestrator.yml`
- `Troubleshooting & Diagnostics`: `.github/workflows/troubleshooting-workflow.yml`

## Running Demos
- Orchestrator: Actions → Deploy Orchestrator → Run. You will receive a public URL in the logs/artifacts.
- Direct ngrok: Requires `NGROK_AUTHTOKEN` secret.
- LocalTunnel: No secrets required.

## GitHub Pages Setup (manual, one-time)
1. In repository Settings → Pages: set Source = GitHub Actions.
2. Run `Deploy GitHub Pages (Static Frontend)` once.
3. The site will host `index.html` and `demo-landing-page.html` from `frontend/dist/`.

## Local Development
- Quick start: `./scripts/enhanced-demo.sh`
- With ngrok: `NGROK_AUTHTOKEN=... ./scripts/enhanced-demo.sh --ngrok --minutes 15`
- With LocalTunnel: `./scripts/enhanced-demo.sh --localtunnel`

## Health Checks
- Backend: `GET /health` (port 3001)
- Frontend: Vite preview on port 5173

## Troubleshooting
- Use the Troubleshooting workflow to collect logs and verify ports.
- Common issues:
  - Port in use: stop conflicting processes or change ports.
  - Missing `NGROK_AUTHTOKEN`: add the secret.
  - LocalTunnel warning page: click Continue.

## Security Notes
- Do not commit tokens. Use GitHub Secrets.
- ngrok provides HTTPS and professional URLs.

## Sharing Demos
- Share the public URL printed by the workflow.
- URLs expire after their session; re-run workflow to renew.