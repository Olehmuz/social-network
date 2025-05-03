import { Provider, Logger } from '@nestjs/common';
import Redis from 'ioredis';

export const RedisProvider: Provider = {
  provide: 'REDIS_CLIENT',
  useFactory: async () => {
    const logger = new Logger('RedisProvider');

    const redis = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      connectTimeout: 10000, // Connection timeout of 10 seconds
      maxRetriesPerRequest: 3, // Retry 3 times per request
      retryStrategy: (times) => {
        const delay = Math.min(times * 100, 2000); // Increase delay with each retry, max 2 seconds
        logger.warn(
          `Retrying Redis connection attempt ${times}. Next retry in ${delay}ms`,
        );
        return delay;
      },
    });

    redis.on('connect', () => {
      logger.log('Successfully connected to Redis');
    });

    redis.on('error', (error) => {
      logger.error(`Redis connection error: ${error.message}`, error.stack);
    });

    try {
      // Test the connection by pinging Redis
      await redis.ping();
      logger.log('Redis is ready to accept connections');
    } catch (error) {
      logger.error(`Failed to connect to Redis: ${error.message}`, error.stack);
    }

    return redis;
  },
};
