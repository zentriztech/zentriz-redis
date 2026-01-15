"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serialize = serialize;
exports.deserialize = deserialize;
/**
 * Serialize value to string for Redis storage
 */
function serialize(value) {
    if (typeof value === 'string') {
        return value;
    }
    return JSON.stringify(value);
}
/**
 * Deserialize value from Redis storage
 */
function deserialize(value) {
    if (value === null) {
        return null;
    }
    try {
        return JSON.parse(value);
    }
    catch {
        // If parsing fails, return as string
        return value;
    }
}
