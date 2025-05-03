import { Injectable, Inject, Logger } from '@nestjs/common';
import Redis from 'ioredis';

import { CacheService } from '../cache.service';

@Injectable()
export class RedisService implements CacheService {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject('REDIS_CLIENT') private client: Redis) {
    this.logger.log('RedisService initialized');
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      this.logger.error(
        `Error getting key ${key}: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.client.set(key, value, 'EX', ttl);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      this.logger.error(
        `Error setting key ${key}: ${error.message}`,
        error.stack,
      );
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      this.logger.error(
        `Error deleting key ${key}: ${error.message}`,
        error.stack,
      );
    }
  }

  async isConnected(): Promise<boolean> {
    try {
      await this.client.ping();
      return true;
    } catch (error) {
      this.logger.error(
        `Redis connection check failed: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }
}
