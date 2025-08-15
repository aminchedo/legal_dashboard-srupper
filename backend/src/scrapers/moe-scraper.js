const { chromium } = require('playwright');
const { createLogger, scrapingConfig, delay, saveJSON, saveHTML, screenshotPath, navigateWithFallback } = require('./utils');

async function extractMOEData(page) {
  const data = await page.evaluate(() => {
    const getTexts = (sel, limit = 25) => Array.from(document.querySelectorAll(sel)).slice(0, limit).map(e => e.textContent && e.textContent.trim()).filter(Boolean);
    return {
      title: document.title,
      news: getTexts('.news, .headline, h2, h3'),
      services: getTexts('.service, .services a, nav a'),
      contacts: getTexts('footer, .contact, .footer'),
      links: Array.from(document.querySelectorAll('a')).slice(0, 50).map(a => ({ text: a.textContent && a.textContent.trim(), href: a.href })),
    };
  });
  return data;
}

async function scrapeMOE() {
  const logger = createLogger('moe-scrape');
  const url = 'https://www.moe.gov.ir';
  const result = { target: 'moe.gov.ir', url, status: 'INIT', screenshot: null, dataFile: null, htmlFile: null, timings: {} };
  const start = Date.now();

  for (let attempt = 1; attempt <= scrapingConfig.maxRetries; attempt++) {
    const attemptStart = Date.now();
    logger.log(`Attempt ${attempt} to scrape ${url}`);
    let browser;
    try {
      browser = await chromium.launch({ headless: true });
      const context = await browser.newContext({
        userAgent: scrapingConfig.userAgent,
        viewport: { width: 1366, height: 768 },
        extraHTTPHeaders: scrapingConfig.headers,
        ignoreHTTPSErrors: true,
      });
      const page = await context.newPage();
      page.setDefaultTimeout(scrapingConfig.timeoutMs);

      await navigateWithFallback(page, url, logger, scrapingConfig.timeoutMs);
      await delay(1000);
      await page.waitForLoadState('networkidle', { timeout: scrapingConfig.timeoutMs }).catch(() => {});

      const shotPath = screenshotPath('moe-homepage');
      await page.screenshot({ path: shotPath, fullPage: true });
      result.screenshot = shotPath;
      logger.log(`Screenshot saved: ${shotPath}`);

      const html = await page.content();
      const htmlFile = saveHTML('moe-homepage', html);
      result.htmlFile = htmlFile;
      logger.log(`HTML saved: ${htmlFile}`);

      const data = await extractMOEData(page);
      const dataFile = saveJSON('moe-data', data);
      result.dataFile = dataFile;
      logger.log(`Data JSON saved: ${dataFile}`);

      await browser.close();

      result.status = 'SUCCESS';
      result.timings.responseMs = Date.now() - attemptStart;
      break;
    } catch (err) {
      logger.error(`Attempt ${attempt} failed: ${err && err.message ? err.message : err}`);
      result.status = 'RETRYING';
      result.error = err && err.message ? err.message : String(err);
      try { if (browser) await browser.close(); } catch {}
      if (attempt < scrapingConfig.maxRetries) {
        await delay(scrapingConfig.requestDelayMs);
      }
    }
  }

  result.timings.totalMs = Date.now() - start;
  logger.log(`Finished scraping ${url} with status ${result.status} in ${result.timings.totalMs}ms`);
  return result;
}

if (require.main === module) {
  scrapeMOE().then(() => {}).catch((e) => { console.error(e); process.exit(1); });
}

module.exports = { scrapeMOE };