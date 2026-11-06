import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PoolStats } from './entities/pool-stats.entity.js';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(PoolStats)
    private readonly poolStatsRepository: Repository<PoolStats>,
  ) {}

  async getPoolStats(poolAddress: string) {
    const stats = await this.poolStatsRepository.findOne({
      where: { poolAddress },
    });

    return {
      poolAddress,
      totalSwaps: stats?.totalSwaps ?? '0',
    };
  }
}
