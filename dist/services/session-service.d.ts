export interface SessionData {
    [key: string]: any;
}
export declare class SessionService {
    private client;
    private defaultTtl;
    constructor(defaultTtl?: number);
    /**
     * Initialize session service
     */
    initialize(): Promise<void>;
    /**
     * Get session data
     */
    get(sessionId: string): Promise<SessionData | null>;
    /**
     * Set session data
     */
    set(sessionId: string, data: SessionData, ttl?: number): Promise<void>;
    /**
     * Update session TTL
     */
    refresh(sessionId: string, ttl?: number): Promise<void>;
    /**
     * Delete session
     */
    delete(sessionId: string): Promise<void>;
    /**
     * Check if session exists
     */
    exists(sessionId: string): Promise<boolean>;
}
