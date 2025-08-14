"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const proxy_controller_1 = require("../controllers/proxy.controller");
const router = (0, express_1.Router)();
router.post('/test', proxy_controller_1.proxyController.test);
router.post('/test-intelligent', proxy_controller_1.proxyController.testIntelligentConnection);
router.get('/settings', proxy_controller_1.proxyController.getProxySettings);
router.put('/settings', proxy_controller_1.proxyController.updateProxySettings);
router.post('/discover-free', proxy_controller_1.proxyController.discoverFreeProxies);
exports.default = router;
//# sourceMappingURL=proxy.routes.js.map