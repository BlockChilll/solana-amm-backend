
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AmmEventProcessor } from './amm-event.processor.js';
import type { DataSource, EntityManager } from 'typeorm';
import type { AmmEvent } from '@amm/contracts/schemas/amm-events';

const swap: AmmEvent = {
  id: 'test-swap-001',
  eventId: 'Swap:test-swap-001',
  eventType: 'Swap',
  schemaVersion: 1,
  pool: 'test-pool',
  trader: 'test-trader',
  txSignature: 'test-signature',
  slot: 1,
  transactionIndex: 0,
  logIndex: 0,
  amountAIn: '100',
  amountBIn: '0',
  amountAOut: '0',
  amountBOut: '90',
};

describe('AmmEventProcessor', () => {
  const execute = vi.fn();
  const query = vi.fn();

  const builder = {
    insert: vi.fn(),
    into: vi.fn(),
    values: vi.fn(),
    orIgnore: vi.fn(),
    returning: vi.fn(),
    execute,
  };

  const manager = {
    createQueryBuilder: vi.fn(),
    query,
  };

  const dataSource = {
    transaction: vi.fn(),
  };

  let processor: AmmEventProcessor;

  beforeEach(() => {
    vi.clearAllMocks();

    builder.insert.mockReturnValue(builder);
    builder.into.mockReturnValue(builder);
    builder.values.mockReturnValue(builder);
    builder.orIgnore.mockReturnValue(builder);
    builder.returning.mockReturnValue(builder);
    manager.createQueryBuilder.mockReturnValue(builder);

    dataSource.transaction.mockImplementation(
      async (callback: (entityManager: EntityManager) => Promise<void>) =>
        callback(manager as unknown as EntityManager),
    );

    processor = new AmmEventProcessor(dataSource as unknown as DataSource);
  });

  it('increments total_swaps for a new event', async () => {
    execute.mockResolvedValue({ raw: [{ event_id: swap.eventId }] });
    query.mockResolvedValue([]);

    await processor.process(swap);

    expect(execute).toHaveBeenCalledOnce();
    expect(query).toHaveBeenCalledOnce();
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO pool_stats'),
      [swap.pool],
    );
  });

  it('does not increment total_swaps for a duplicate event', async () => {
    execute.mockResolvedValue({ raw: [] });

    await processor.process(swap);

    expect(query).not.toHaveBeenCalled();
  });

  it('propagates database write failures', async () => {
    execute.mockResolvedValue({ raw: [{ event_id: swap.eventId }] });
    query.mockRejectedValue(new Error('Database unavailable'));

    await expect(processor.process(swap)).rejects.toThrow(
      'Database unavailable',
    );
  });
});
