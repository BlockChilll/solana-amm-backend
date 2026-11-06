import { z } from 'zod';

const PublicKey = z.string().min(1);

const UnsignedInteger = z.number().int().nonnegative();

const TokenAmount = z.string().regex(/^\d+$/);

const BaseEventSchema = z.object({
  id: z.string().min(1),
  eventId: z.string().min(1),
  schemaVersion: z.literal(1),
  pool: PublicKey,
  txSignature: z.string().min(1),
  slot: UnsignedInteger,
  transactionIndex: UnsignedInteger,
  logIndex: UnsignedInteger,
});

const PoolCreatedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('PoolCreated'),
  mintA: PublicKey,
  mintB: PublicKey,
  mintLp: PublicKey,
});

const LiquidityEventSchema = BaseEventSchema.extend({
  provider: PublicKey,
  amountA: TokenAmount,
  amountB: TokenAmount,
  liquidity: TokenAmount,
});

const MintLiquidityEventSchema = LiquidityEventSchema.extend({
  eventType: z.literal('MintLiquidity'),
  type: z.literal('MINT'),
});

const BurnLiquidityEventSchema = LiquidityEventSchema.extend({
  eventType: z.literal('BurnLiquidity'),
  type: z.literal('BURN'),
});

const SwapEventSchema = BaseEventSchema.extend({
  eventType: z.literal('Swap'),
  trader: PublicKey,
  amountAIn: TokenAmount,
  amountBIn: TokenAmount,
  amountAOut: TokenAmount,
  amountBOut: TokenAmount,
});

const SyncEventSchema = BaseEventSchema.extend({
  eventType: z.literal('Sync'),
  reserveA: TokenAmount,
  reserveB: TokenAmount,
});

export const AmmEventSchema = z.discriminatedUnion('eventType', [
  PoolCreatedEventSchema,
  MintLiquidityEventSchema,
  BurnLiquidityEventSchema,
  SwapEventSchema,
  SyncEventSchema,
]);

export type AmmEvent = z.infer<typeof AmmEventSchema>;
