export interface CacheOptions {
    ttl?: number;
    prefix?: string;
}
export interface CacheGetOptions {
    parse?: boolean;
}
export interface CacheSetOptions extends CacheOptions {
    nx?: boolean;
    xx?: boolean;
}
