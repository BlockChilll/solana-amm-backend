import {Codec, address, fixedArray, struct, u128, u32, u64, u8} from '@subsquid/borsh'

export interface AmmConfig {
    feeTo: string
    feeToSetter: string
}

export const AmmConfig: Codec<AmmConfig> = struct({
    feeTo: address,
    feeToSetter: address,
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
