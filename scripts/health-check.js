#!/usr/bin/env node

const fs = require('fs');

async function ping(url) {
  const started = Date.now();
  try {
    const res = await fetch(url, { redirect: 'manual' });
    const ms = Date.now() - started;
    return { ok: res.ok, status: res.status, ms };
  } catch (e) {
    const ms = Date.now() - started;
    return { ok: false, status: 0, ms, error: String(e) };
  }
}

(async () => {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001/health';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173/';

  const [b, f] = await Promise.all([ping(backendUrl), ping(frontendUrl)]);
  const mem = process.memoryUsage();
  const report = {
    timestamp: new Date().toISOString(),
    backend: { url: backendUrl, ...b },
    frontend: { url: frontendUrl, ...f },
    monitor: {
      rssMB: Math.round((mem.rss / (1024 * 1024)) * 10) / 10,
      heapUsedMB: Math.round((mem.heapUsed / (1024 * 1024)) * 10) / 10,
      nodePid: process.pid,
    },
  };
  console.log(JSON.stringify(report, null, 2));

  try {
    fs.mkdirSync('./temp', { recursive: true });
    fs.writeFileSync('./temp/last-health.json', JSON.stringify(report, null, 2));
  } catch {}
})();