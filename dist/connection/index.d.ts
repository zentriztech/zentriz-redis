import Redis, { RedisOptions } from 'ioredis';
export interface RedisConnectionOptions extends RedisOptions {
    host?: string;
    port?: number;
    password?: string;
    db?: number;
}
/**
 * Get or create Redis connection singleton
 */
export declare function getRedisClient(options?: RedisConnectionOptions): Promise<Redis>;
/**
 * Close Redis connection
 */
export declare function closeRedisConnection(): Promise<void>;
/**
 * Get current Redis client instance (may be null if not connected)
 */
export declare function getCurrentRedisClient(): Redis | null;
