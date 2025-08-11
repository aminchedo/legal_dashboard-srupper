# Scripts

- install-deps.sh: installs backend and frontend dependencies
- start-dev.sh: starts backend and frontend with health checks
- stop-all.sh: stops all managed processes
- process-manager.js: orchestrates processes and logs to temp/
- health-check.js: prints JSON health report

Usage:

```bash
chmod +x scripts/*.sh
./scripts/start-dev.sh
# ... to stop
./scripts/stop-all.sh
```