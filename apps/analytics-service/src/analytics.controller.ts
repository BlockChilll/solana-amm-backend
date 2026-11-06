import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import type {
  GetPoolStatsRequest,
  GetPoolStatsResponse,
} from '@amm/contracts/analytics';

import { AnalyticsService } from './analytics.service.js';

@Controller()
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
  ) {}

  @GrpcMethod('AnalyticsService', 'GetPoolStats')
  async getPoolStats(
    request: GetPoolStatsRequest,
  ): Promise<GetPoolStatsResponse> {
    return this.analyticsService.getPoolStats(
      request.poolAddress,
    );
  }
}
