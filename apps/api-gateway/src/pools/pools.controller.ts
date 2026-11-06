import { Controller, Get, Param } from '@nestjs/common';
import { PoolsService } from './pools.service.js';

@Controller('pools')
export class PoolsController {
  constructor(
    private readonly poolsService: PoolsService,
  ) {}

  @Get(':poolAddress/stats')
  getPoolStats(@Param('poolAddress') poolAddress: string) {
    return this.poolsService.getPoolStats(poolAddress);
  }
}
