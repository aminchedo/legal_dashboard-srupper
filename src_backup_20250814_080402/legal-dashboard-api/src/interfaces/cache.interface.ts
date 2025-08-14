export interface CacheClient {
    connect(): Promise<void>;
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttlSeconds?: number): Promise<void>;
    del?(key: string): Promise<void>;
}


