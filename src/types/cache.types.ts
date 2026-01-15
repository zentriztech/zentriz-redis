export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string; // Key prefix
}

export interface CacheGetOptions {
  parse?: boolean; // Parse JSON automatically (default: true)
}

export interface CacheSetOptions extends CacheOptions {
  nx?: boolean; // Only set if key doesn't exist
  xx?: boolean; // Only set if key exists
}
