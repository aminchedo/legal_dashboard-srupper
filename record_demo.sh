#!/usr/bin/env bash
set -euo pipefail

cat << 'EOF'
Demo: Dashboard + API

Steps:
1) In one terminal, start the backend (port 3001):
   npm run start --prefix backend

2) In another terminal, start the frontend (port 5177):
   npm run dev --prefix frontend

3) Verify API endpoints:
   curl http://localhost:3001/api/dashboard/statistics
   curl http://localhost:3001/api/dashboard/activity

4) Open the app in the browser:
   http://localhost:5177/
EOF