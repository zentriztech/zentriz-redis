import { CacheGetOptions, CacheSetOptions } from '../types/cache.types';
export declare class CacheService {
    private client;
    constructor(prefix?: string);
    /**
     * Initialize cache service
     */
    initialize(): Promise<void>;
    /**
     * Get cached value
     */
    get<T = any>(key: string, options?: CacheGetOptions): Promise<T | null>;
    /**
     * Set cached value
     */
    set(key: string, value: any, options?: CacheSetOptions): Promise<void>;
    /**
     * Delete cached value
     */
    delete(key: string): Promise<void>;
    /**
     * Check if key exists in cache
     */
    has(key: string): Promise<boolean>;
    /**
     * Clear all cache entries with prefix
     */
    clear(): Promise<void>;
    /**
     * Get or set cached value (cache-aside pattern)
     */
    getOrSet<T>(key: string, factory: () => Promise<T>, options?: CacheSetOptions): Promise<T>;
}
