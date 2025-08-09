import { createClient, RedisClientType } from 'redis';
import { config } from '@utils/config';
import { logger } from '@utils/logger';

class CacheService {
    private client: RedisClientType | null = null;
    private inMemory = new Map<string, { value: string; expiresAt: number | null }>();

    async connect(): Promise<void> {
        try {
            this.client = createClient({ url: process.env.REDIS_URL });
            this.client.on('error', (err) => logger.error('Redis error', err));
            await this.client.connect();
            logger.info('Redis connected');
        } catch (err) {
            logger.warn('Redis unavailable, using in-memory cache');
            this.client = null;
        }
    }

    async get(key: string): Promise<string | null> {
        if (this.client) return (await this.client.get(key)) as string | null;
        const entry = this.inMemory.get(key);
        if (!entry) return null;
        if (entry.expiresAt && entry.expiresAt < Date.now()) {
            this.inMemory.delete(key);
            return null;
        }
        return entry.value;
    }

    async set(key: string, value: string, ttlSeconds = config.CACHE_TTL): Promise<void> {
        if (this.client) {
            await this.client.set(key, value, { EX: ttlSeconds });
            return;
        }
        const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
        this.inMemory.set(key, { value, expiresAt });
    }
}

export const cacheService = new CacheService();


