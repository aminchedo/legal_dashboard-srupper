"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyController = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../utils/logger");
class ProxyController {
    async testIntelligentConnection(req, res) {
        const { url } = req.body;
        try {
            const directResult = await this.attemptDirectConnection(url);
            if (directResult.success) {
                return res.json({
                    success: true,
                    method: 'direct',
                    message: 'Direct connection successful - no proxy needed',
                    result: directResult
                });
            }
            const proxyResult = await this.testWithRotatingProxy(url);
            return res.json({
                success: proxyResult.success,
                method: 'proxy',
                message: proxyResult.success ? 'Proxy connection successful' : 'All methods failed',
                result: proxyResult
            });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error?.message || 'unknown error' });
        }
    }
    async getProxySettings(req, res) {
        const settings = {
            enableSmartProxy: process.env.ENABLE_SMART_PROXY === 'true',
            autoDiscoverFreeProxies: process.env.AUTO_DISCOVER_PROXIES === 'true',
            intelligentMode: process.env.PROXY_INTELLIGENCE_MODE || 'adaptive',
            maxDirectAttempts: parseInt(process.env.MAX_DIRECT_ATTEMPTS || '2')
        };
        res.json(settings);
    }
    async updateProxySettings(req, res) {
        const { enableSmartProxy, autoDiscoverFreeProxies, intelligentMode, maxDirectAttempts } = req.body;
        this.updateIntelligentSettings({
            enableSmartProxy,
            autoDiscoverFreeProxies,
            intelligentMode,
            maxDirectAttempts
        });
        res.json({ success: true, message: 'Intelligent proxy settings updated' });
    }
    async discoverFreeProxies(req, res) {
        try {
            const freeProxies = await this.autoDiscoverFreeProxies();
            res.json({
                success: true,
                count: freeProxies.length,
                proxies: freeProxies,
                message: `Discovered ${freeProxies.length} working free proxies`
            });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    async attemptDirectConnection(url) {
        const startTime = Date.now();
        try {
            const response = await axios_1.default.head(url, {
                timeout: 5000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            return {
                success: true,
                status: response.status,
                responseTime: Date.now() - startTime
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    async autoDiscoverFreeProxies() {
        const freeProxySources = [
            'https://www.proxy-list.download/api/v1/get?type=http',
            'https://api.proxyscrape.com/v2/?request=get&protocol=http&timeout=10000&country=all'
        ];
        const validProxies = [];
        for (const source of freeProxySources) {
            try {
                const response = await axios_1.default.get(source, { timeout: 5000 });
                const proxies = this.parseProxyList(response.data);
                const tested = await this.quickTestProxies(proxies.slice(0, 5));
                validProxies.push(...tested);
                if (validProxies.length >= 10)
                    break;
            }
            catch (error) {
                console.log(`Failed to get proxies from ${source}`);
                continue;
            }
        }
        return validProxies;
    }
    parseProxyList(data) {
        return data.split(/\r?\n/).filter(p => p.trim());
    }
    async quickTestProxies(proxies) {
        const testUrl = 'https://httpbin.org/status/200';
        const workingProxies = [];
        const testPromises = proxies.map(async (proxy) => {
            try {
                const proxyUrl = new URL(`http://${proxy}`);
                const config = {
                    method: 'HEAD',
                    url: testUrl,
                    timeout: 5000,
                    proxy: {
                        host: proxyUrl.hostname,
                        port: Number(proxyUrl.port),
                        protocol: 'http'
                    }
                };
                await axios_1.default.request(config);
                workingProxies.push(proxy);
            }
            catch (error) {
            }
        });
        await Promise.all(testPromises);
        return workingProxies;
    }
    async testWithRotatingProxy(url) {
        logger_1.logger.info(`Testing with rotating proxy for URL: ${url}`);
        return { success: false, error: 'Proxy rotation not fully implemented in this mock.' };
    }
    updateIntelligentSettings(settings) {
        logger_1.logger.info('Updating intelligent proxy settings', settings);
        Object.entries(settings).forEach(([key, value]) => {
        });
    }
    async test(req, res) {
        try {
            const { proxy, testUrl = 'https://httpbin.org/status/204', timeoutMs = 10000 } = req.body;
            if (!testUrl) {
                return res.status(400).json({ error: 'testUrl is required' });
            }
            const startedAt = Date.now();
            const config = {
                method: 'HEAD',
                url: testUrl,
                timeout: timeoutMs,
                validateStatus: (s) => s >= 200 && s < 400,
                headers: {
                    'User-Agent': 'ProxyTester/1.0',
                },
            };
            if (proxy) {
                try {
                    const parsed = new URL(proxy);
                    config.proxy = {
                        host: parsed.hostname,
                        port: Number(parsed.port),
                        protocol: parsed.protocol.replace(':', ''),
                        auth: parsed.username || parsed.password
                            ? { username: decodeURIComponent(parsed.username), password: decodeURIComponent(parsed.password) }
                            : undefined,
                    };
                }
                catch (e) {
                    return res.status(400).json({ error: 'Invalid proxy URL' });
                }
            }
            try {
                const response = await axios_1.default.request(config);
                const latencyMs = Date.now() - startedAt;
                return res.json({ success: true, statusCode: response.status, latencyMs });
            }
            catch (err) {
                const latencyMs = Date.now() - startedAt;
                logger_1.logger.warn('Proxy test failed', err?.message || err);
                return res.json({ success: false, errorMessage: err?.message || 'network error', latencyMs });
            }
        }
        catch (error) {
            logger_1.logger.error('Failed to test proxy', error);
            return res.status(500).json({ error: 'Failed to test proxy' });
        }
    }
}
exports.proxyController = new ProxyController();
//# sourceMappingURL=proxy.controller.js.map