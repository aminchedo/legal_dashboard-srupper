const { chromium } = require('playwright');

(async () => {
	const baseUrl = process.env.BASE_URL || 'http://localhost:5173';
	const browser = await chromium.launch({ headless: true });
	const page = await browser.newPage();

	async function diagnose(path) {
		const result = { path, urlChanged: false, h1Visible: false, consoleErrors: [], pageErrors: [], failedRequests: [] };

		const consoleListener = msg => {
			if (msg.type() === 'error') {
				result.consoleErrors.push(msg.text());
			}
		};
		const pageErrorListener = err => result.pageErrors.push(String(err));
		const requestFailedListener = req => {
			result.failedRequests.push({ url: req.url(), failure: req.failure()?.errorText || 'unknown' });
		};
		page.on('console', consoleListener);
		page.on('pageerror', pageErrorListener);
		page.on('requestfailed', requestFailedListener);

		try {
			await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'domcontentloaded' });
			const link = page.locator(`a[href="${path}"]`).first();
			if (await link.count() === 0) {
				result.consoleErrors.push('Sidebar link not found');
				return result;
			}
			await Promise.all([
				page.waitForURL(`**${path}**`, { timeout: 5000 }).catch(() => {}),
				link.click()
			]);
			result.urlChanged = page.url().includes(path);
			try {
				await page.locator('h1').first().waitFor({ state: 'visible', timeout: 3000 });
				result.h1Visible = true;
			} catch {
				result.h1Visible = false;
			}
		} finally {
			page.off('console', consoleListener);
			page.off('pageerror', pageErrorListener);
			page.off('requestfailed', requestFailedListener);
		}
		return result;
	}

	const paths = ['/documents', '/analytics', '/settings', '/jobs', '/system', '/proxies', '/help'];
	const out = {};
	for (const p of paths) {
		out[p] = await diagnose(p);
	}
	console.log(JSON.stringify(out, null, 2));
	await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });