
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { fileURLToPath } from 'node:url';

import { PoolsController } from './pools/pools.controller.js';
import { PoolsService } from './pools/pools.service.js';

const protoPath = fileURLToPath(
  new URL(
    '../../../packages/contracts/proto/analytics/analytics.proto',
    import.meta.url,
  ),
);

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ANALYTICS_GRPC',
        transport: Transport.GRPC,
        options: {
          url: 'localhost:50051',
          package: 'analytics',
          protoPath,
          loader: {
            longs: String,
          },
        },
      },
    ]),
  ],
  controllers: [PoolsController],
  providers: [PoolsService],
})
export class AppModule {}
