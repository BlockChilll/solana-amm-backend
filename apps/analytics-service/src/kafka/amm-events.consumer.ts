import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer, Kafka, Producer } from 'kafkajs';
import { ZodError } from 'zod';
import { AmmEvent, AmmEventSchema } from '@amm/contracts/schemas/amm-events';
import { AmmEventProcessor } from './amm-event.processor.js';
import { isRetryableError } from './is-retryable-error.js';


@Injectable()
export class AmmEventsConsumer
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(AmmEventsConsumer.name);

  private readonly consumer: Consumer;
  private readonly producer: Producer;

  constructor(private readonly config: ConfigService, private readonly processor: AmmEventProcessor) {
    const kafka = new Kafka({
      clientId: 'amm-analytics-service',
      brokers: [
        this.config.get<string>('KAFKA_BROKER') ?? 'localhost:9092',
      ],
    });

    this.consumer = kafka.consumer({
      groupId: 'amm-analytics',
    });
    this.producer = kafka.producer();
  }

  async onModuleInit(): Promise<void> {
    await this.consumer.connect();
    await this.producer.connect();

    await this.consumer.subscribe({
      topic: 'amm.events',
      fromBeginning: true,
    });

    await this.consumer.run({
      autoCommit: false,

      eachMessage: async ({ topic, partition, message, heartbeat }) => {
        let event;

        try {
          if (!message.value) {
            throw new SyntaxError('Empty Kafka message');
          }

          event = AmmEventSchema.parse(
            JSON.parse(message.value.toString('utf8')),
          );
        } catch (error) {
          if (!(error instanceof SyntaxError) && !(error instanceof ZodError)) {
            throw error;
          }

          await this.publishToDlq(
            topic,
            partition,
            message.offset,
            message.value,
            error,
          );

          this.logger.warn(
            `Invalid event sent to DLQ: ${topic}[${partition}]:${message.offset}`,
          );

          await this.consumer.commitOffsets([{
            topic,
            partition,
            offset: (BigInt(message.offset) + 1n).toString(),
          }]);

          return;
        }

        if (event.eventType === 'Swap') {
          await this.processWithRetry(event, heartbeat);
        } else {
          this.logger.log(
            `Skipping ${event.eventType} event at offset ${message.offset}`,
          );
        }

        await this.consumer.commitOffsets([{
          topic,
          partition,
          offset: (BigInt(message.offset) + 1n).toString(),
        }]);
      },
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.consumer.disconnect();
    await this.producer.disconnect();
  }

  private async publishToDlq(
    topic: string,
    partition: number,
    offset: string,
    payload: Buffer | null,
    error: Error,
  ): Promise<void> {
    await this.producer.send({
      topic: 'amm.events.dlq',
      acks: -1,
      messages: [
        {
          value: JSON.stringify({
            originalTopic: topic,
            originalPartition: partition,
            originalOffset: offset,
            payload: payload?.toString('utf8') ?? null,
            error: error.message,
            failedAt: new Date().toISOString(),
          }),
        },
      ],
    });
  }

  private async processWithRetry(
    event: AmmEvent,
    heartbeat: () => Promise<void>,
  ): Promise<void> {
    const maxAttempts = 4;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await this.processor.process(event);
        return;
      } catch (error) {
        if (!isRetryableError(error)) {
          throw error;
        }

        if (attempt === maxAttempts) {
          throw error;
        }

        const delay = 1000 * 2 ** (attempt - 1);

        this.logger.warn(
          `Processing failed (attempt ${attempt}/${maxAttempts}). Retrying in ${delay}ms`,
        );

        await new Promise<void>((resolve) => setTimeout(resolve, delay));
        await heartbeat();
      }
    }
  }
}
