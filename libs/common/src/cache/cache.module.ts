import { Module } from '@nestjs/common';

import { CacheService } from './infrastructure/cache.service';
import { RedisProvider } from './infrastructure/redis/redis.provider';
import { RedisService } from './infrastructure/redis/redis.service';

@Module({
  providers: [
    RedisProvider,
    {
      provide: CacheService,
      useClass: RedisService,
    },
  ],
  exports: [CacheService],
})
export class CacheModule {}
