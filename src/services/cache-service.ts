import { RedisClient } from '../clients/redis-client';
import { CacheGetOptions, CacheSetOptions } from '../types/cache.types';
import { getLogger } from '@zentriztech/core';

const logger = getLogger({ functionName: 'CacheService' });

export class CacheService {
  private client: RedisClient;

  constructor(prefix: string = 'cache') {
    this.client = new RedisClient(prefix);
  }

  /**
   * Initialize cache service
   */
  async initialize(): Promise<void> {
    await this.client.connect();
  }

  /**
   * Get cached value
   */
  async get<T = any>(key: string, options?: CacheGetOptions): Promise<T | null> {
    return this.client.get<T>(key, options);
  }

  /**
   * Set cached value
   */
  async set(key: string, value: any, options?: CacheSetOptions): Promise<void> {
    await this.client.set(key, value, options);
  }

  /**
   * Delete cached value
   */
  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  /**
   * Check if key exists in cache
   */
  async has(key: string): Promise<boolean> {
    return this.client.exists(key);
  }

  /**
   * Clear all cache entries with prefix
   */
  async clear(): Promise<void> {
    const keys = await this.client.keys('*');
    if (keys.length > 0) {
      await this.client.del(...keys);
      logger.info({ msg: 'Cache cleared', count: keys.length });
    }
  }

  /**
   * Get or set cached value (cache-aside pattern)
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    options?: CacheSetOptions
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, options);
    return value;
  }
}
