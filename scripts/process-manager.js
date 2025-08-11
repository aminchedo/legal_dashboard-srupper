#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const net = require('net');

const args = process.argv.slice(2);
const configFlagIndex = args.indexOf('--config');
const configPath = configFlagIndex !== -1 ? path.resolve(args[configFlagIndex + 1]) : path.resolve(__dirname, 'config.json');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const projectRoot = path.resolve(__dirname, '..');
const pidDir = path.join(__dirname, '.pids');
const logDir = path.resolve(projectRoot, 'temp');
fs.mkdirSync(pidDir, { recursive: true });
fs.mkdirSync(logDir, { recursive: true });

const config = readJson(configPath);

function log(message) {
  const line = `[${new Date().toISOString()}] ${message}`;
  console.log(line);
  fs.appendFileSync(path.join(logDir, 'backup-log.txt'), line + '\n');
}

function wait(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function waitForHealth(name, url, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        log(`${name} health OK at ${url}`);
        return true;
      }
    } catch (e) {
      // ignore
    }
    await wait(500);
  }
  log(`${name} health check timed out after ${timeoutMs}ms for ${url}`);
  return false;
}

function isPortFree(port) {
  return new Promise(resolve => {
    const tester = net.createServer()
      .once('error', () => resolve(false))
      .once('listening', () => tester.once('close', () => resolve(true)).close())
      .listen(port, '127.0.0.1');
  });
}

async function findAvailablePort(startPort, maxTries = 20) {
  let port = Number(startPort);
  for (let i = 0; i < maxTries; i++) {
    if (await isPortFree(port)) return port;
    port++;
  }
  throw new Error(`No free port found starting from ${startPort}`);
}

function startProcess(name, options) {
  const { cwd, env, command, args = [] } = options;
  const child = spawn(command, args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: 'pipe',
    shell: true,
  });

  const outFile = path.join(logDir, `${name}.out.log`);
  const errFile = path.join(logDir, `${name}.err.log`);
  const outStream = fs.createWriteStream(outFile, { flags: 'a' });
  const errStream = fs.createWriteStream(errFile, { flags: 'a' });
  child.stdout.pipe(outStream);
  child.stderr.pipe(errStream);

  const pidFile = path.join(pidDir, `${name}.pid`);
  fs.writeFileSync(pidFile, String(child.pid));
  log(`${name} started (pid=${child.pid}) in ${cwd} with command: ${command} ${args.join(' ')}`);

  return { child, pidFile, outFile, errFile };
}

async function main() {
  const desiredBackendPort = Number(process.env.BACKEND_PORT || config.backend.port || 3001);
  const desiredFrontendPort = Number(process.env.FRONTEND_PORT || config.frontend.port || 5173);

  const backendPort = await findAvailablePort(desiredBackendPort);
  const frontendPort = await findAvailablePort(desiredFrontendPort);

  const backendCwd = path.resolve(projectRoot, config.backend.cwd);
  const frontendCwd = path.resolve(projectRoot, config.frontend.cwd);

  const procs = [];

  // Start backend
  procs.push(
    startProcess('backend', {
      cwd: backendCwd,
      env: { PORT: String(backendPort) },
      command: 'npm',
      args: ['run', 'start'],
    })
  );

  // Start frontend
  procs.push(
    startProcess('frontend', {
      cwd: frontendCwd,
      env: { VITE_API_URL: `http://localhost:${backendPort}`, VITE_BYPASS_AUTH: '1' },
      command: 'npm',
      args: ['run', 'dev', '--', '--port', String(frontendPort)],
    })
  );

  // Health check
  await waitForHealth('backend', `http://localhost:${backendPort}${config.backend.healthPath || '/health'}`);
  await waitForHealth('frontend', `http://localhost:${frontendPort}`);

  // Graceful shutdown
  const shutdown = async () => {
    log('Shutting down services...');
    for (const { child } of procs) {
      try {
        process.kill(child.pid, 'SIGTERM');
      } catch {}
    }
    await wait(500);
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});