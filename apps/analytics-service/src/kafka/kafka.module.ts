import { Module } from '@nestjs/common';
import { AmmEventsConsumer } from './amm-events.consumer.js';
import { AmmEventProcessor } from './amm-event.processor.js';

@Module({
  providers: [AmmEventsConsumer, AmmEventProcessor],
})
export class KafkaModule {}
