const fs = require('fs');
const path = require('path');
const { ts, createLogger } = require('./utils');
const { scrapeCentralBank } = require('./cbi-scraper');
const { scrapeGov } = require('./gov-scraper');
const { scrapeTSE } = require('./tse-scraper');
const { scrapeAmar } = require('./amar-scraper');
const { scrapeMOE } = require('./moe-scraper');

async function runAllScrapers() {
  const logger = createLogger('full-operation');
  const start = Date.now();
  logger.log('🕷️ Starting comprehensive web scraping test...');

  const results = {
    startTime: new Date().toISOString(),
    targets: [],
    screenshots: [],
    dataFiles: [],
    logs: [logger.logPath],
    errors: [],
    timings: {}
  };

  const tasks = [
    scrapeCentralBank(),
    scrapeGov(),
    scrapeTSE(),
    scrapeAmar(),
    scrapeMOE(),
  ];

  const settled = await Promise.allSettled(tasks);

  for (const s of settled) {
    if (s.status === 'fulfilled') {
      const r = s.value;
      results.targets.push({ target: r.target, url: r.url, status: r.status, responseMs: r.timings && r.timings.responseMs });
      if (r.screenshot) results.screenshots.push(r.screenshot);
      if (r.dataFile) results.dataFiles.push(r.dataFile);
      if (r.htmlFile) results.dataFiles.push(r.htmlFile);
      logger.log(`Result for ${r.target}: ${r.status}`);
    } else {
      results.errors.push(String(s.reason));
      logger.error(`A scraper failed: ${String(s.reason)}`);
    }
  }

  results.timings.totalMs = Date.now() - start;
  const reportPath = path.join(__dirname, 'data', `report-${ts()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  logger.log(`📊 Scraping operation completed in ${results.timings.totalMs} ms! Report: ${reportPath}`);
  return results;
}

if (require.main === module) {
  runAllScrapers().then(() => {}).catch((e) => { console.error(e); process.exit(1); });
}

module.exports = { runAllScrapers };