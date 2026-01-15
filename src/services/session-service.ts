import { RedisClient } from '../clients/redis-client';
import { getLogger } from '@zentriztech/core';

const logger = getLogger({ functionName: 'SessionService' });

export interface SessionData {
  [key: string]: any;
}

export class SessionService {
  private client: RedisClient;
  private defaultTtl: number;

  constructor(defaultTtl: number = 3600) {
    this.client = new RedisClient('session');
    this.defaultTtl = defaultTtl;
  }

  /**
   * Initialize session service
   */
  async initialize(): Promise<void> {
    await this.client.connect();
  }

  /**
   * Get session data
   */
  async get(sessionId: string): Promise<SessionData | null> {
    return this.client.get<SessionData>(sessionId) || null;
  }

  /**
   * Set session data
   */
  async set(sessionId: string, data: SessionData, ttl?: number): Promise<void> {
    await this.client.set(sessionId, data, { ttl: ttl || this.defaultTtl });
  }

  /**
   * Update session TTL
   */
  async refresh(sessionId: string, ttl?: number): Promise<void> {
    await this.client.expire(sessionId, ttl || this.defaultTtl);
  }

  /**
   * Delete session
   */
  async delete(sessionId: string): Promise<void> {
    await this.client.del(sessionId);
  }

  /**
   * Check if session exists
   */
  async exists(sessionId: string): Promise<boolean> {
    return this.client.exists(sessionId);
  }
}
