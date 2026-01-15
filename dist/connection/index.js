"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisClient = getRedisClient;
exports.closeRedisConnection = closeRedisConnection;
exports.getCurrentRedisClient = getCurrentRedisClient;
const ioredis_1 = __importDefault(require("ioredis"));
const core_1 = require("@zentriztech/core");
const logger = (0, core_1.getLogger)({ functionName: 'RedisConnection' });
let redisClient = null;
/**
 * Get or create Redis connection singleton
 */
async function getRedisClient(options) {
    if (redisClient && redisClient.status === 'ready') {
        return redisClient;
    }
    const config = {
        host: options?.host || process.env.REDIS_HOST || 'localhost',
        port: options?.port || parseInt(process.env.REDIS_PORT || '6379', 10),
        password: options?.password || process.env.REDIS_PASSWORD,
        db: options?.db || parseInt(process.env.REDIS_DB || '0', 10),
        retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            logger.warn({ msg: 'Redis connection retry', times, delay });
            return delay;
        },
        maxRetriesPerRequest: 3,
        lazyConnect: false,
        ...options,
    };
    redisClient = new ioredis_1.default(config);
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
    }
    catch (error) {
        logger.error({ msg: 'Failed to connect to Redis', error: error.message });
        throw error;
    }
    return redisClient;
}
/**
 * Close Redis connection
 */
async function closeRedisConnection() {
    if (redisClient) {
        await redisClient.quit();
        redisClient = null;
        logger.info({ msg: 'Redis connection closed' });
    }
}
/**
 * Get current Redis client instance (may be null if not connected)
 */
function getCurrentRedisClient() {
    return redisClient;
}
