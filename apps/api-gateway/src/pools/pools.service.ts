
import {
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import type {
  AnalyticsServiceClient,
  GetPoolStatsResponse,
} from '@amm/contracts/analytics';

@Injectable()
export class PoolsService implements OnModuleInit {
  private analyticsService!: AnalyticsServiceClient;

  constructor(
    @Inject('ANALYTICS_GRPC')
    private readonly grpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.analyticsService =
      this.grpcClient.getService<AnalyticsServiceClient>(
        'AnalyticsService',
      );
  }

  async getPoolStats(
    poolAddress: string,
  ): Promise<GetPoolStatsResponse> {
    return firstValueFrom(
      this.analyticsService.getPoolStats({ poolAddress }),
    );
  }
}
