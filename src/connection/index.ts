import Redis, { RedisOptions } from 'ioredis';
import { getLogger } from '@zentriztech/core';

const logger = getLogger({ functionName: 'RedisConnection' });

let redisClient: Redis | null = null;

export interface RedisConnectionOptions extends RedisOptions {
  host?: string;
  port?: number;
  password?: string;
  db?: number;
}

/**
 * Get or create Redis connection singleton
 */
export async function getRedisClient(options?: RedisConnectionOptions): Promise<Redis> {
  if (redisClient && redisClient.status === 'ready') {
    return redisClient;
  }

  const config: RedisOptions = {
    host: options?.host || process.env.REDIS_HOST || 'localhost',
    port: options?.port || parseInt(process.env.REDIS_PORT || '6379', 10),
    password: options?.password || process.env.REDIS_PASSWORD,
    db: options?.db || parseInt(process.env.REDIS_DB || '0', 10),
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 50, 2000);
      logger.warn({ msg: 'Redis connection retry', times, delay });
      return delay;
    },
    maxRetriesPerRequest: 3,
    lazyConnect: false,
    ...options,
  };

  redisClient = new Redis(config);

  redisClient.on('connect', () => {
    logger.info({ msg: 'Redis connected', host: config.host, port: config.port });
  });

  redisClient.on('error', (error) => {
    logger.error({ msg: 'Redis connection error', error: error.message });
  });

  redisClient.on('close', () => {
    logger.warn({ msg: 'Redis connection closed' });
  });

  redisClient.on('reconnecting', () => {
    logger.info({ msg: 'Redis reconnecting' });
  });

  try {
    await redisClient.connect();
  } catch (error: any) {
    logger.error({ msg: 'Failed to connect to Redis', error: error.message });
    throw error;
  }

  return redisClient;
}

/**
 * Close Redis connection
 */
export async function closeRedisConnection(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info({ msg: 'Redis connection closed' });
  }
}

/**
 * Get current Redis client instance (may be null if not connected)
 */
export function getCurrentRedisClient(): Redis | null {
  return redisClient;
}
