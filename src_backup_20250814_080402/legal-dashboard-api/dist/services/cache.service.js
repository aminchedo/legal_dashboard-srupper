"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheService = void 0;
const redis_1 = require("redis");
const config_1 = require("../utils/config");
const logger_1 = require("../utils/logger");
class CacheService {
    constructor() {
        this.client = null;
        this.inMemory = new Map();
    }
    async connect() {
        try {
            this.client = (0, redis_1.createClient)({ url: process.env.REDIS_URL });
            this.client.on('error', (err) => logger_1.logger.error('Redis error', err));
            await this.client.connect();
            logger_1.logger.info('Redis connected');
        }
        catch (err) {
            logger_1.logger.warn('Redis unavailable, using in-memory cache');
            this.client = null;
        }
    }
    async get(key) {
        if (this.client)
            return (await this.client.get(key));
        const entry = this.inMemory.get(key);
        if (!entry)
            return null;
        if (entry.expiresAt && entry.expiresAt < Date.now()) {
            this.inMemory.delete(key);
            return null;
        }
        return entry.value;
    }
    async set(key, value, ttlSeconds = config_1.config.CACHE_TTL) {
        if (this.client) {
            await this.client.set(key, value, { EX: ttlSeconds });
            return;
        }
        const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
        this.inMemory.set(key, { value, expiresAt });
    }
}
exports.cacheService = new CacheService();
//# sourceMappingURL=cache.service.js.map