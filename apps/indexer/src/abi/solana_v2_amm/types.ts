import {Codec, address, fixedArray, struct, u128, u32, u64, u8} from '@subsquid/borsh'

export interface AmmConfig {
    feeTo: string
    feeToSetter: string
}

export const AmmConfig: Codec<AmmConfig> = struct({
    feeTo: address,
    feeToSetter: address,
})

export interface BurnLiquidity {
    pool: string
    provider: string
    amountA: bigint
    amountB: bigint
    liquidity: bigint
}

export const BurnLiquidity: Codec<BurnLiquidity> = struct({
    pool: address,
    provider: address,
    amountA: u64,
    amountB: u64,
    liquidity: u64,
})

export interface MintLiquidity {
    pool: string
    provider: string
    amountA: bigint
    amountB: bigint
    liquidity: bigint
}

export const MintLiquidity: Codec<MintLiquidity> = struct({
    pool: address,
    provider: address,
    amountA: u64,
    amountB: u64,
    liquidity: u64,
})

export interface Pool {
    mintA: string
    mintB: string
    reserveA: bigint
    reserveB: bigint
    blockTimestampLast: number
    priceACumulativeLast: Array<bigint>
    priceBCumulativeLast: Array<bigint>
    kLast: bigint
    bump: number
}

export const Pool: Codec<Pool> = struct({
    mintA: address,
    mintB: address,
    reserveA: u64,
    reserveB: u64,
    blockTimestampLast: u32,
    priceACumulativeLast: fixedArray(u64, 4),
    priceBCumulativeLast: fixedArray(u64, 4),
    kLast: u128,
    bump: u8,
})

export interface PoolCreated {
    pool: string
    mintA: string
    mintB: string
    mintLp: string
}

export const PoolCreated: Codec<PoolCreated> = struct({
    pool: address,
    mintA: address,
    mintB: address,
    mintLp: address,
})

export interface Swap {
    pool: string
    trader: string
    amountAIn: bigint
    amountBIn: bigint
    amountAOut: bigint
    amountBOut: bigint
}

export const Swap: Codec<Swap> = struct({
    pool: address,
    trader: address,
    amountAIn: u64,
    amountBIn: u64,
    amountAOut: u64,
    amountBOut: u64,
})

export interface Sync {
    pool: string
    reserveA: bigint
    reserveB: bigint
}

export const Sync: Codec<Sync> = struct({
    pool: address,
    reserveA: u64,
    reserveB: u64,
})
