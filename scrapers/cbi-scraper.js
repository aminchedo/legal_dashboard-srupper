const { chromium } = require('playwright');
const { createLogger, scrapingConfig, delay, saveJSON, saveHTML, screenshotPath, navigateWithFallback } = require('./utils');

async function extractCBIData(page) {
  // Attempt to extract exchange rates and some headlines.
  const data = await page.evaluate(() => {
    const bySelectors = (selectors) => {
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el && el.textContent) return el.textContent.trim();
      }
      return null;
    };

    const grabTextList = (selector, limit = 10) => {
      return Array.from(document.querySelectorAll(selector))
        .slice(0, limit)
        .map((el) => el.textContent && el.textContent.trim())
        .filter(Boolean);
    };

    const numbers = Array.from(document.querySelectorAll('table, .rates, .currency, .exchange'))
      .map((el) => el.innerText)
      .join(' ');

    return {
      title: document.title,
      headings: grabTextList('h1, h2, h3', 15),
      exchangeRatesRaw: numbers,
      links: Array.from(document.querySelectorAll('a')).slice(0, 50).map(a => ({ text: a.textContent && a.textContent.trim(), href: a.href })),
    };
  });
  return data;
}

async function scrapeCentralBank() {
  const logger = createLogger('cbi-scrape');
  const url = 'https://www.cbi.ir';
  const result = { target: 'cbi.ir', url, status: 'INIT', screenshot: null, dataFile: null, htmlFile: null, timings: {} };
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

      const finalUrl = await navigateWithFallback(page, url, logger, scrapingConfig.timeoutMs);
      await delay(1000);
      await page.waitForLoadState('networkidle', { timeout: scrapingConfig.timeoutMs }).catch(() => {});

      const shotPath = screenshotPath('cbi-homepage');
      await page.screenshot({ path: shotPath, fullPage: true });
      result.screenshot = shotPath;
      logger.log(`Screenshot saved: ${shotPath}`);

      const html = await page.content();
      const htmlFile = saveHTML('cbi-homepage', html);
      result.htmlFile = htmlFile;
      logger.log(`HTML saved: ${htmlFile}`);

      const data = await extractCBIData(page);
      const dataFile = saveJSON('cbi-rates', data);
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
  scrapeCentralBank().then((res) => {
    // no-op
  }).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { scrapeCentralBank };