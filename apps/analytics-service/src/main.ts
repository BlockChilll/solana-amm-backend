import { NestFactory } from '@nestjs/core';
import { fileURLToPath } from 'node:url';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module.js';

const protoPath = fileURLToPath(
  new URL(
    '../../../packages/contracts/proto/analytics/analytics.proto',
    import.meta.url,
  ),
);

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:50051',
        package: 'analytics',
        protoPath,
        loader: {
          longs: String,
        },
      },
    },
  );

  await app.listen();
}

await bootstrap();
