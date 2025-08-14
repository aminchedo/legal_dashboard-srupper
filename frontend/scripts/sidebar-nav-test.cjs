const { chromium } = require('playwright');

(async () => {
	const baseUrl = process.env.BASE_URL || 'http://localhost:5173';
	const browser = await chromium.launch({ headless: true });
	const page = await browser.newPage();

	const results = {
		sidebarVisible: false,
		items: {}
	};

	async function checkSidebarVisible() {
		try {
			await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'domcontentloaded' });
			const aside = page.locator('aside');
			results.sidebarVisible = await aside.first().isVisible().catch(() => false);
		} catch {
			results.sidebarVisible = false;
		}
	}

	async function testNavItem(key, path) {
		const item = { found: false, clicked: false, urlChanged: false, loaded: false };
		try {
			await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'domcontentloaded' });
			const link = page.locator(`a[href="${path}"]`).first();
			item.found = (await link.count()) > 0 && await link.isVisible().catch(() => false);
			if (!item.found) {
				results.items[key] = item;
				return;
			}
			await Promise.all([
				page.waitForURL(`**${path}**`, { timeout: 5000 }),
				link.click()
			]);
			item.clicked = true;
			const currentUrl = page.url();
			item.urlChanged = currentUrl.includes(path);

			// Consider page loaded if we can see at least one H1 and no Vite error overlay is present
			try {
				await page.locator('h1').first().waitFor({ state: 'visible', timeout: 3000 });
				const overlayCount = await page.locator('vite-error-overlay, #vite-error-overlay').count();
				item.loaded = overlayCount === 0;
			} catch {
				item.loaded = false;
			}
		} catch {
			// Keep defaults
		}
		results.items[key] = item;
	}

	await checkSidebarVisible();
	await testNavItem('documents', '/documents');
	await testNavItem('analytics', '/analytics');
	await testNavItem('settings', '/settings');

	console.log(JSON.stringify(results));
	await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });