/**
 * Serialize value to string for Redis storage
 */
export declare function serialize(value: any): string;
/**
 * Deserialize value from Redis storage
 */
export declare function deserialize<T = any>(value: string | null): T | null;
