"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const proxy_controller_1 = require("../controllers/proxy.controller");
const scraping_service_1 = require("../services/scraping.service");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/test', proxy_controller_1.proxyController.test);
router.post('/test-intelligent', proxy_controller_1.proxyController.testIntelligentConnection);
router.get('/settings', proxy_controller_1.proxyController.getProxySettings);
router.put('/settings', proxy_controller_1.proxyController.updateProxySettings);
router.post('/discover-free', proxy_controller_1.proxyController.discoverFreeProxies);
router.post('/scrape-intelligent', auth_middleware_1.requireAuth, async (req, res) => {
    const { sourceId } = req.body;
    const userId = req.user?.id || 'system';
    try {
        const result = await scraping_service_1.scrapingService.scrapeWithIntelligence(sourceId, userId);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=proxy.routes.js.map