const fs = require('fs');
const path = require('path');

const scrapingConfig = {
  respectRobotsTxt: true,
  userAgent: 'Educational Web Scraper - Research Purpose',
  requestDelayMs: 2000,
  maxRetries: 3,
  timeoutMs: 30000,
  headers: {
    'Accept': 'text/html,application/xhtml+xml',
    'Accept-Language': 'fa,en-US;q=0.9',
    'Cache-Control': 'no-cache'
  }
};

function ensureDirs() {
  const dirs = [
    path.join(__dirname, 'logs'),
    path.join(__dirname, 'screenshots'),
    path.join(__dirname, 'data'),
  ];
  dirs.forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });
}

function ts() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  return `${yyyy}${mm}${dd}-${hh}${mi}${ss}`;
}

function createLogger(prefix) {
  ensureDirs();
  const logPath = path.join(__dirname, 'logs', `${prefix}-${ts()}.log`);
  return {
    logPath,
    log: (message) => {
      const line = `[${new Date().toISOString()}] ${message}\n`;
      process.stdout.write(message + '\n');
      fs.appendFileSync(logPath, line);
    },
    error: (message) => {
      const line = `[${new Date().toISOString()}] ERROR: ${message}\n`;
      process.stderr.write('ERROR: ' + message + '\n');
      fs.appendFileSync(logPath, line);
    }
  };
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function saveJSON(filePrefix, obj) {
  ensureDirs();
  const filePath = path.join(__dirname, 'data', `${filePrefix}-${ts()}.json`);
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2));
  return filePath;
}

function saveHTML(filePrefix, html) {
  ensureDirs();
  const filePath = path.join(__dirname, 'data', `${filePrefix}-${ts()}.html`);
  fs.writeFileSync(filePath, html);
  return filePath;
}

function screenshotPath(filePrefix) {
  ensureDirs();
  return path.join(__dirname, 'screenshots', `${filePrefix}-${ts()}.png`);
}

function buildUrlCandidates(rawUrl) {
  try {
    const u = new URL(rawUrl);
    const hostNoWww = u.hostname.replace(/^www\./i, '');
    const hostWithWww = hostNoWww.startsWith('www.') ? hostNoWww : `www.${hostNoWww}`;
    const basePaths = [u.pathname === '/' ? '/' : u.pathname];
    const schemes = ['https:', 'http:'];
    const hosts = [hostNoWww, hostWithWww];
    const candidates = new Set();
    for (const scheme of schemes) {
      for (const host of hosts) {
        for (const p of basePaths) {
          candidates.add(`${scheme}//${host}${p}`);
          candidates.add(`${scheme}//${host}${p.endsWith('/') ? p : p + '/'}`);
        }
      }
    }
    // Also include the original raw input
    candidates.add(rawUrl);
    return Array.from(candidates);
  } catch {
    return [rawUrl];
  }
}

async function navigateWithFallback(page, url, logger, perAttemptTimeoutMs) {
  const candidates = buildUrlCandidates(url);
  const strategies = [
    { waitUntil: 'domcontentloaded' },
    { waitUntil: 'load' },
    { waitUntil: 'networkidle' },
  ];
  const timeout = perAttemptTimeoutMs || scrapingConfig.timeoutMs;

  for (const candidate of candidates) {
    for (const strat of strategies) {
      try {
        logger.log(`Navigating to ${candidate} with waitUntil=${strat.waitUntil}`);
        await page.goto(candidate, { ...strat, timeout });
        return candidate;
      } catch (err) {
        logger.error(`Navigation failed for ${candidate} (${strat.waitUntil}): ${err && err.message ? err.message : err}`);
        await delay(500);
      }
    }
  }
  throw new Error(`All navigation attempts failed for ${url}`);
}

module.exports = {
  scrapingConfig,
  ensureDirs,
  ts,
  createLogger,
  delay,
  saveJSON,
  saveHTML,
  screenshotPath,
  buildUrlCandidates,
  navigateWithFallback,
};