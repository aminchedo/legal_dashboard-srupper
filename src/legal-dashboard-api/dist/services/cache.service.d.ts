declare class CacheService {
    private client;
    private inMemory;
    connect(): Promise<void>;
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttlSeconds?: number): Promise<void>;
}
export declare const cacheService: CacheService;
export {};
