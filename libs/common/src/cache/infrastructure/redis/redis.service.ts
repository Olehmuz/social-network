import { Injectable, Inject, Logger } from '@nestjs/common';
import Redis from 'ioredis';

import { CacheService } from '../cache.service';

@Injectable()
export class RedisService implements CacheService {
  constructor(@Inject('REDIS_CLIENT') private client: Redis) {
    Logger.log('RedisService initialized');
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.set(key, value, 'EX', ttl);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
