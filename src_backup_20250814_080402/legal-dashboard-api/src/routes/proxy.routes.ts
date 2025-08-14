import { Router } from 'express';
import { proxyController } from '@controllers/proxy.controller';
import { scrapingService } from '@services/scraping.service';
import { requireAuth as authMiddleware } from '@middleware/auth.middleware';

const router = Router();

// KEEP existing POST /test route
router.post('/test', proxyController.test);

// ADD new intelligent routes
router.post('/test-intelligent', proxyController.testIntelligentConnection);
router.get('/settings', proxyController.getProxySettings);
router.put('/settings', proxyController.updateProxySettings);
router.post('/discover-free', proxyController.discoverFreeProxies);

// ADD intelligent scraping route
router.post('/scrape-intelligent', authMiddleware, async (req, res) => {
    const { sourceId } = req.body;
    const userId = req.user?.id || 'system';

    try {
        const result = await scrapingService.scrapeWithIntelligence(sourceId, userId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;


