# Legal Dashboard – Full Stack

A modern legal analytics dashboard with a React + Vite frontend and an Express + TypeScript backend. It provides document management, analytics, scraping utilities, OCR hooks, and real‑time updates via WebSockets.

## Prerequisites
- Node.js: >= 18 (recommended LTS)
- npm: >= 8
- OS: Linux, macOS, or Windows

## Project Structure
```
/ (root – frontend)
├─ src/                      # React app source
├─ vite.config.ts            # Dev server + proxy to backend
├─ package.json              # Frontend scripts and root orchestrators
├─ .env.example              # Frontend env template (VITE_*)
└─ src/legal-dashboard-api/  # Backend (Express + TS)
   ├─ src/                   # Server source
   ├─ tsconfig.json          # TS build config
   ├─ nodemon.json           # Dev runner config
   ├─ package.json           # Backend scripts
   └─ .env.example           # Backend env template
```

## Installation
1) Clone the repository and change directory to project root.
2) Copy environment templates:
   - Frontend: `cp .env.example .env` (optional; defaults are fine)
   - Backend: `cp src/legal-dashboard-api/.env.example src/legal-dashboard-api/.env`
3) Install dependencies for both frontend and backend:

```bash
npm run install:all
```

## Available Scripts (root)
- `dev` – Start frontend dev server (Vite)
- `dev:frontend` – Frontend dev on port 5177
- `dev:backend` – Backend dev (nodemon + ts-node)
- `dev:all` – Run frontend + backend in dev concurrently
- `build` – Type-check and build frontend
- `build:all` – Build frontend and backend
- `preview` – Serve built frontend on port 5177
- `start:backend` – Run compiled backend from `dist/`
- `start:frontend` – Serve built frontend (preview)
- `start:full` – Build both and run backend + preview concurrently
- `start:quick` – Run both in dev mode
- `lint`, `lint:fix`, `format`, `format:check`, `test`, `typecheck` – Quality and tests

Backend-only scripts (inside `src/legal-dashboard-api`):
- `start`, `dev`, `build`, `build:watch`, `test`, `test:watch`, `test:coverage`
- `lint`, `lint:fix`, `format`, `clean`, `migrate`, `seed`, `db:migrate`, `db:seed`

## Development
- Quick start (hot reload both):
```bash
npm run start:quick
```
- Frontend only (http://localhost:5177):
```bash
npm run dev:frontend
```
- Backend only (http://localhost:3000):
```bash
npm run dev:backend
```

## Configuration
- Frontend env (create `.env` in root):
  - `VITE_API_URL` – Backend base URL used by Vite proxy and API calls. Default: `http://localhost:3000`.
- Backend env (create `src/legal-dashboard-api/.env`):
  - `PORT` (default 3000)
  - `CORS_ORIGIN` (default `http://localhost:5177`)
  - `DATABASE_URL` (SQLite path by default)
  - `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`
  - `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS`
  - `UPLOAD_MAX_SIZE`, `UPLOAD_DEST`
  - `CACHE_TTL`, `OCR_MODEL_PATH`, `SCRAPING_DELAY_MS`, `WEBSOCKET_PORT`

## API
- Health check: `GET /health` → `{ "status": "ok" }`
- Namespaced endpoints under `/api/*`:
  - `/api/auth`, `/api/dashboard`, `/api/documents`, `/api/analytics`, `/api/enhanced-analytics`, `/api/ocr`, `/api/reports`, `/api/scraping`, `/api/ws`, `/api/ratings`, `/api/proxy`

## Build and Run (Production-like)
1) Build all:
```bash
npm run build:all
```
2) Start full stack:
```bash
npm run start:full
```
- Frontend preview: http://localhost:5177
- Backend API: http://localhost:3000
- Health: `curl http://localhost:3000/health`

## Deployment
- Vercel (Frontend):
  - Framework: Vite
  - Build command: `npm run build`
  - Output dir: `dist`
  - Env: `VITE_API_URL` pointing to your backend
- Railway/Fly/Render/Railway (Backend):
  - Node 18+ runtime
  - Install: `npm ci`
  - Build: `npm run build`
  - Start: `npm start`
  - Expose port from `PORT` env
- Hugging Face Spaces (Frontend):
  - Space type: static
  - Build: `npm run build`
  - Output: `dist`

## Troubleshooting
- Port already in use: stop conflicting processes or change `PORT`/Vite port.
- CORS issues: set `CORS_ORIGIN` to your frontend origin.
- Proxy issues in dev: set `VITE_API_URL` in root `.env` to your backend URL.
- SQLite file permission: ensure the `database` directory exists and is writable.
- Sharp install errors on deploy: ensure build system has libvips or use node 18+ with prebuilt binaries.

## Contributing
- Fork, create a feature branch, run `npm run start:quick`, and open a PR.
- Use `eslint`, `prettier`, and `vitest`/`jest` for quality.