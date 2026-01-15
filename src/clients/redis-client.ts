import Redis from 'ioredis';
import { getRedisClient } from '../connection';
import { serialize, deserialize } from '../utils/serialization';
import { CacheGetOptions, CacheSetOptions } from '../types/cache.types';
import { getLogger } from '@zentriztech/core';

const logger = getLogger({ functionName: 'RedisClient' });

export class RedisClient {
  private client!: Redis;
  private prefix: string;

  constructor(prefix: string = '') {
    this.prefix = prefix;
  }

  /**
   * Initialize client connection
   */
  async connect(): Promise<void> {
    this.client = await getRedisClient();
  }

  /**
   * Get full key with prefix
   */
  private getKey(key: string): string {
    return this.prefix ? `${this.prefix}:${key}` : key;
  }

  /**
   * Get value by key
   */
  async get<T = any>(key: string, options: CacheGetOptions = {}): Promise<T | null> {
    try {
      const fullKey = this.getKey(key);
      const value = await this.client.get(fullKey);
      
      if (value === null) {
        return null;
      }

      const shouldParse = options.parse !== false;
      return shouldParse ? deserialize<T>(value) : (value as T);
    } catch (error: any) {
      logger.error({ msg: 'Redis get error', key, error: error.message });
      throw error;
    }
  }

  /**
   * Set value with optional TTL
   */
  async set(key: string, value: any, options: CacheSetOptions = {}): Promise<void> {
    try {
      const fullKey = this.getKey(key);
      const serialized = serialize(value);
      
      if (options.ttl) {
        await this.client.setex(fullKey, options.ttl, serialized);
      } else if (options.nx) {
        await this.client.setnx(fullKey, serialized);
      } else if (options.xx) {
        await this.client.set(fullKey, serialized, 'XX');
      } else {
        await this.client.set(fullKey, serialized);
      }
    } catch (error: any) {
      logger.error({ msg: 'Redis set error', key, error: error.message });
      throw error;
    }
  }

  /**
   * Delete key(s)
   */
  async del(...keys: string[]): Promise<number> {
    try {
      const fullKeys = keys.map(k => this.getKey(k));
      return await this.client.del(...fullKeys);
    } catch (error: any) {
      logger.error({ msg: 'Redis del error', keys, error: error.message });
      throw error;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const fullKey = this.getKey(key);
      const result = await this.client.exists(fullKey);
      return result === 1;
    } catch (error: any) {
      logger.error({ msg: 'Redis exists error', key, error: error.message });
      throw error;
    }
  }

  /**
   * Set expiration time for key
   */
  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      const fullKey = this.getKey(key);
      const result = await this.client.expire(fullKey, seconds);
      return result === 1;
    } catch (error: any) {
      logger.error({ msg: 'Redis expire error', key, error: error.message });
      throw error;
    }
  }

  /**
   * Get multiple keys
   */
  async mget<T = any>(...keys: string[]): Promise<(T | null)[]> {
    try {
      const fullKeys = keys.map(k => this.getKey(k));
      const values = await this.client.mget(...fullKeys);
      return values.map(v => v ? deserialize<T>(v) : null);
    } catch (error: any) {
      logger.error({ msg: 'Redis mget error', keys, error: error.message });
      throw error;
    }
  }

  /**
   * Set multiple keys
   */
  async mset(keyValuePairs: Record<string, any>): Promise<void> {
    try {
      const args: string[] = [];
      for (const [key, value] of Object.entries(keyValuePairs)) {
        args.push(this.getKey(key), serialize(value));
      }
      await this.client.mset(...args);
    } catch (error: any) {
      logger.error({ msg: 'Redis mset error', error: error.message });
      throw error;
    }
  }

  /**
   * Get all keys matching pattern
   */
  async keys(pattern: string): Promise<string[]> {
    try {
      const fullPattern = this.prefix ? `${this.prefix}:${pattern}` : pattern;
      const keys = await this.client.keys(fullPattern);
      // Remove prefix from results
      return this.prefix ? keys.map(k => k.replace(`${this.prefix}:`, '')) : keys;
    } catch (error: any) {
      logger.error({ msg: 'Redis keys error', pattern, error: error.message });
      throw error;
    }
  }

  /**
   * Get TTL for key
   */
  async ttl(key: string): Promise<number> {
    try {
      const fullKey = this.getKey(key);
      return await this.client.ttl(fullKey);
    } catch (error: any) {
      logger.error({ msg: 'Redis ttl error', key, error: error.message });
      throw error;
    }
  }
}
