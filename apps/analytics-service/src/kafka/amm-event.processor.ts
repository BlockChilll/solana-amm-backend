import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProcessedEvent } from '../entities/processed-event.entity.js';
import type { AmmEvent } from '@amm/contracts/schemas/amm-events';

@Injectable()
export class AmmEventProcessor {
  constructor(private readonly dataSource: DataSource) {}

  async process(event: AmmEvent): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const inserted = await manager
        .createQueryBuilder()
        .insert()
        .into(ProcessedEvent)
        .values({ eventId: event.eventId })
        .orIgnore()
        .returning('event_id')
        .execute();

      // Already processed: don't increment again.
      if (inserted.raw.length === 0) {
        return;
      }

      await manager.query(
        `
        INSERT INTO pool_stats (pool_address, total_swaps)
        VALUES ($1, 1)
        ON CONFLICT (pool_address)
        DO UPDATE SET total_swaps = pool_stats.total_swaps + 1
        `,
        [event.pool],
      );
    });
  }
}
