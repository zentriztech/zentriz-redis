"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const redis_client_1 = require("../clients/redis-client");
const core_1 = require("@zentriztech/core");
const logger = (0, core_1.getLogger)({ functionName: 'CacheService' });
class CacheService {
    client;
    constructor(prefix = 'cache') {
        this.client = new redis_client_1.RedisClient(prefix);
    }
    /**
     * Initialize cache service
     */
    async initialize() {
        await this.client.connect();
    }
    /**
     * Get cached value
     */
    async get(key, options) {
        return this.client.get(key, options);
    }
    /**
     * Set cached value
     */
    async set(key, value, options) {
        await this.client.set(key, value, options);
    }
    /**
     * Delete cached value
     */
    async delete(key) {
        await this.client.del(key);
    }
    /**
     * Check if key exists in cache
     */
    async has(key) {
        return this.client.exists(key);
    }
    /**
     * Clear all cache entries with prefix
     */
    async clear() {
        const keys = await this.client.keys('*');
        if (keys.length > 0) {
            await this.client.del(...keys);
            logger.info({ msg: 'Cache cleared', count: keys.length });
        }
    }
    /**
     * Get or set cached value (cache-aside pattern)
     */
    async getOrSet(key, factory, options) {
        const cached = await this.get(key);
        if (cached !== null) {
            return cached;
        }
        const value = await factory();
        await this.set(key, value, options);
        return value;
    }
}
exports.CacheService = CacheService;
