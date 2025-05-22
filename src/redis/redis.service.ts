import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: Redis;

  onModuleInit() {
    this.client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  }

  getClient(): Redis {
    return this.client;
  }

  // Add to Bloom Filter (called during signup)
  async addToUsernameBloom(username: string): Promise<void> {
    await this.client.call('BF.ADD', 'usernames', username);
  }

  // Check if username possibly exists
  async mightExistInBloom(username: string): Promise<boolean> {
    const result = await this.client.call('BF.EXISTS', 'usernames', username);
    return result === 1;
  }

  // Cache user by username
  async cacheUser(username: string, data: any, ttl = 60): Promise<void> {
    await this.client.setex(`user:${username}`, ttl, JSON.stringify(data));
  }

  // Get cached user
  async getCachedUser(username: string): Promise<any | null> {
    const raw = await this.client.get(`user:${username}`);
    return raw ? JSON.parse(raw) : null;
  }

  // Invalidate cache
  async invalidateUser(username: string): Promise<void> {
    await this.client.del(`user:${username}`);
  }
}
