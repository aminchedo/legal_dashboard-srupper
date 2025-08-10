# Troubleshooting

## Common Failures

- ngrok URL not detected
  - Cause: API not ready or log patterns changed
  - Fix: We retry API, then logs. Ensure `NGROK_AUTHTOKEN` is valid. Re-run.

- LocalTunnel URL inaccessible
  - Cause: Warning/consent page, or transient failure
  - Fix: Click Continue on warning page. The workflow retries and accepts 200/3xx/401/403 as reachable.

- GitHub Pages shows 404
  - Cause: Pages not enabled, or artifact path incorrect
  - Fix: Settings → Pages → Source = GitHub Actions. Re-run Pages workflow.

- Backend/Frontend health checks failing
  - Cause: Port conflicts or slow start
  - Fix: Use the Troubleshooting workflow to inspect logs and ports. Increase retries if needed.

## Diagnostic Workflow
Run `Troubleshooting & Diagnostics` from Actions to collect:
- backend.log, frontend.log
- listening ports
- environment info

## Local Testing
- `./scripts/deployment-test.sh` validates a quick local start.
- `./scripts/enhanced-demo.sh` for end-to-end manual validation.