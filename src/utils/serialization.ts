/**
 * Serialize value to string for Redis storage
 */
export function serialize(value: any): string {
  if (typeof value === 'string') {
    return value;
  }
  return JSON.stringify(value);
}

/**
 * Deserialize value from Redis storage
 */
export function deserialize<T = any>(value: string | null): T | null {
  if (value === null) {
    return null;
  }
  
  try {
    return JSON.parse(value) as T;
  } catch {
    // If parsing fails, return as string
    return value as T;
  }
}
