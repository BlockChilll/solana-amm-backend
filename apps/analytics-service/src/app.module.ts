import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';
import { ProcessedEvent } from './entities/processed-event.entity.js';
import { PoolStats } from './entities/pool-stats.entity.js';
import { AnalyticsService } from './analytics.service.js';
import { KafkaModule } from './kafka/kafka.module.js';

import { AnalyticsController } from './analytics.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().port().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        KAFKA_BROKER: Joi.string().required(),
      }),
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow<string>('DB_HOST'),
        port: config.getOrThrow<number>('DB_PORT'),
        username: config.getOrThrow<string>('DB_USER'),
        password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    TypeOrmModule.forFeature([ProcessedEvent, PoolStats]),
    KafkaModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AppModule {}
