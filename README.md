# @zentriztech/redis

Zentriz Redis Package - Redis client for cache operations and session management.

> **Status**: Ready for production use

## Installation

```bash
npm install @zentriztech/redis
```

## Usage

### Basic Cache Operations

```typescript
import { CacheService } from '@zentriztech/redis';

const cache = new CacheService('myapp');
await cache.initialize();

// Set value
await cache.set('user:123', { name: 'John', email: 'john@example.com' }, { ttl: 3600 });

// Get value
const user = await cache.get('user:123');

// Delete value
await cache.delete('user:123');

// Check if exists
const exists = await cache.has('user:123');
```

### Cache-Aside Pattern

```typescript
const user = await cache.getOrSet(
  'user:123',
  async () => {
    // Fetch from database
    return await db.users.findById(123);
  },
  { ttl: 3600 }
);
```

### Session Management

```typescript
import { SessionService } from '@zentriztech/redis';

const sessions = new SessionService(3600); // 1 hour default TTL
await sessions.initialize();

// Set session
await sessions.set('session-id', { userId: 123, role: 'admin' });

// Get session
const session = await sessions.get('session-id');

// Refresh session TTL
await sessions.refresh('session-id');

// Delete session
await sessions.delete('session-id');
```

### Direct Redis Client

```typescript
import { RedisClient } from '@zentriztech/redis';

const client = new RedisClient('prefix');
await client.connect();

// Basic operations
await client.set('key', 'value', { ttl: 60 });
const value = await client.get('key');
await client.del('key');

// Multiple operations
await client.mset({ key1: 'value1', key2: 'value2' });
const values = await client.mget('key1', 'key2');

// Keys and expiration
const keys = await client.keys('pattern:*');
await client.expire('key', 3600);
const ttl = await client.ttl('key');
```

## Configuration

Set environment variables:

```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-password
REDIS_DB=0
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Clean
npm run clean
```

## License

MIT
