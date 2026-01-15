"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisClient = void 0;
const connection_1 = require("../connection");
const serialization_1 = require("../utils/serialization");
const core_1 = require("@zentriztech/core");
const logger = (0, core_1.getLogger)({ functionName: 'RedisClient' });
class RedisClient {
    client;
    prefix;
    constructor(prefix = '') {
        this.prefix = prefix;
    }
    /**
     * Initialize client connection
     */
    async connect() {
        this.client = await (0, connection_1.getRedisClient)();
    }
    /**
     * Get full key with prefix
     */
    getKey(key) {
        return this.prefix ? `${this.prefix}:${key}` : key;
    }
    /**
     * Get value by key
     */
    async get(key, options = {}) {
        try {
            const fullKey = this.getKey(key);
            const value = await this.client.get(fullKey);
            if (value === null) {
                return null;
            }
            const shouldParse = options.parse !== false;
            return shouldParse ? (0, serialization_1.deserialize)(value) : value;
        }
        catch (error) {
            logger.error({ msg: 'Redis get error', key, error: error.message });
            throw error;
        }
    }
    /**
     * Set value with optional TTL
     */
    async set(key, value, options = {}) {
        try {
            const fullKey = this.getKey(key);
            const serialized = (0, serialization_1.serialize)(value);
            if (options.ttl) {
                await this.client.setex(fullKey, options.ttl, serialized);
            }
            else if (options.nx) {
                await this.client.setnx(fullKey, serialized);
            }
            else if (options.xx) {
                await this.client.set(fullKey, serialized, 'XX');
            }
            else {
                await this.client.set(fullKey, serialized);
            }
        }
        catch (error) {
            logger.error({ msg: 'Redis set error', key, error: error.message });
            throw error;
        }
    }
    /**
     * Delete key(s)
     */
    async del(...keys) {
        try {
            const fullKeys = keys.map(k => this.getKey(k));
            return await this.client.del(...fullKeys);
        }
        catch (error) {
            logger.error({ msg: 'Redis del error', keys, error: error.message });
            throw error;
        }
    }
    /**
     * Check if key exists
     */
    async exists(key) {
        try {
            const fullKey = this.getKey(key);
            const result = await this.client.exists(fullKey);
            return result === 1;
        }
        catch (error) {
            logger.error({ msg: 'Redis exists error', key, error: error.message });
            throw error;
        }
    }
    /**
     * Set expiration time for key
     */
    async expire(key, seconds) {
        try {
            const fullKey = this.getKey(key);
            const result = await this.client.expire(fullKey, seconds);
            return result === 1;
        }
        catch (error) {
            logger.error({ msg: 'Redis expire error', key, error: error.message });
            throw error;
        }
    }
    /**
     * Get multiple keys
     */
    async mget(...keys) {
        try {
            const fullKeys = keys.map(k => this.getKey(k));
            const values = await this.client.mget(...fullKeys);
            return values.map(v => v ? (0, serialization_1.deserialize)(v) : null);
        }
        catch (error) {
            logger.error({ msg: 'Redis mget error', keys, error: error.message });
            throw error;
        }
    }
    /**
     * Set multiple keys
     */
    async mset(keyValuePairs) {
        try {
            const args = [];
            for (const [key, value] of Object.entries(keyValuePairs)) {
                args.push(this.getKey(key), (0, serialization_1.serialize)(value));
            }
            await this.client.mset(...args);
        }
        catch (error) {
            logger.error({ msg: 'Redis mset error', error: error.message });
            throw error;
        }
    }
    /**
     * Get all keys matching pattern
     */
    async keys(pattern) {
        try {
            const fullPattern = this.prefix ? `${this.prefix}:${pattern}` : pattern;
            const keys = await this.client.keys(fullPattern);
            // Remove prefix from results
            return this.prefix ? keys.map(k => k.replace(`${this.prefix}:`, '')) : keys;
        }
        catch (error) {
            logger.error({ msg: 'Redis keys error', pattern, error: error.message });
            throw error;
        }
    }
    /**
     * Get TTL for key
     */
    async ttl(key) {
        try {
            const fullKey = this.getKey(key);
            return await this.client.ttl(fullKey);
        }
        catch (error) {
            logger.error({ msg: 'Redis ttl error', key, error: error.message });
            throw error;
        }
    }
}
exports.RedisClient = RedisClient;
