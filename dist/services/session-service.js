"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const redis_client_1 = require("../clients/redis-client");
const core_1 = require("@zentriztech/core");
const logger = (0, core_1.getLogger)({ functionName: 'SessionService' });
class SessionService {
    client;
    defaultTtl;
    constructor(defaultTtl = 3600) {
        this.client = new redis_client_1.RedisClient('session');
        this.defaultTtl = defaultTtl;
    }
    /**
     * Initialize session service
     */
    async initialize() {
        await this.client.connect();
    }
    /**
     * Get session data
     */
    async get(sessionId) {
        return this.client.get(sessionId) || null;
    }
    /**
     * Set session data
     */
    async set(sessionId, data, ttl) {
        await this.client.set(sessionId, data, { ttl: ttl || this.defaultTtl });
    }
    /**
     * Update session TTL
     */
    async refresh(sessionId, ttl) {
        await this.client.expire(sessionId, ttl || this.defaultTtl);
    }
    /**
     * Delete session
     */
    async delete(sessionId) {
        await this.client.del(sessionId);
    }
    /**
     * Check if session exists
     */
    async exists(sessionId) {
        return this.client.exists(sessionId);
    }
}
exports.SessionService = SessionService;
