import { CacheGetOptions, CacheSetOptions } from '../types/cache.types';
export declare class RedisClient {
    private client;
    private prefix;
    constructor(prefix?: string);
    /**
     * Initialize client connection
     */
    connect(): Promise<void>;
    /**
     * Get full key with prefix
     */
    private getKey;
    /**
     * Get value by key
     */
    get<T = any>(key: string, options?: CacheGetOptions): Promise<T | null>;
    /**
     * Set value with optional TTL
     */
    set(key: string, value: any, options?: CacheSetOptions): Promise<void>;
    /**
     * Delete key(s)
     */
    del(...keys: string[]): Promise<number>;
    /**
     * Check if key exists
     */
    exists(key: string): Promise<boolean>;
    /**
     * Set expiration time for key
     */
    expire(key: string, seconds: number): Promise<boolean>;
    /**
     * Get multiple keys
     */
    mget<T = any>(...keys: string[]): Promise<(T | null)[]>;
    /**
     * Set multiple keys
     */
    mset(keyValuePairs: Record<string, any>): Promise<void>;
    /**
     * Get all keys matching pattern
     */
    keys(pattern: string): Promise<string[]>;
    /**
     * Get TTL for key
     */
    ttl(key: string): Promise<number>;
}
