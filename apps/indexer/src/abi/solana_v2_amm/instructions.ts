import {address, binary, struct, u64, unit} from '@subsquid/borsh'
import {instruction} from '../abi.support.js'

export type Burn = undefined

export const burn = instruction(
    {
        d8: '0x746e1d386bdb2a5d',
    },
    {
        ammConfig: 0,
        pool: 1,
        mintA: 2,
        mintB: 3,
        poolAccountA: 4,
        poolAccountB: 5,
        mintLp: 6,
        poolAccountLp: 7,
        feeToLpAccount: 8,
        toAccountA: 9,
        toAccountB: 10,
        provider: 11,
        tokenProgram: 12,
    },
    unit,
)

export interface CreateAmmConfig {
    feeToSetter: string
    feeTo: string
}

export const createAmmConfig = instruction(
    {
        d8: '0x8934edd4d7756c68',
    },
    {
        ammConfig: 0,
        payer: 1,
        systemProgram: 2,
    },
    struct({
        feeToSetter: address,
        feeTo: address,
    }),
)

export type CreatePool = undefined

export const createPool = instruction(
    {
        d8: '0xe992d18ecf6840bc',
    },
    {
        pool: 0,
        mintA: 1,
        mintB: 2,
        mintLp: 3,
        poolAccountA: 4,
        poolAccountB: 5,
        poolAccountLp: 6,
        lockedLpAccount: 7,
        payer: 8,
        tokenProgram: 9,
        associatedTokenProgram: 10,
        systemProgram: 11,
    },
    unit,
)

export type Mint = undefined

export const mint = instruction(
    {
        d8: '0x3339e12fb69289a6',
    },
    {
        ammConfig: 0,
        pool: 1,
        mintA: 2,
        mintB: 3,
        poolAccountA: 4,
        poolAccountB: 5,
        lockedLpAccount: 6,
        mintLp: 7,
        feeToLpAccount: 8,
        toLpAccount: 9,
        provider: 10,
        tokenProgram: 11,
    },
    unit,
)

export interface SetFeeTo {
    feeTo: string
}

export const setFeeTo = instruction(
    {
        d8: '0x1c78f61df472dbfa',
    },
    {
        ammConfig: 0,
        feeToSetter: 1,
    },
    struct({
        feeTo: address,
    }),
)

export interface SetFeeToSetter {
    feeToSetter: string
}

export const setFeeToSetter = instruction(
    {
        d8: '0xac6ea96af3f5958f',
    },
    {
        ammConfig: 0,
        feeToSetter: 1,
    },
    struct({
        feeToSetter: address,
    }),
)

export type Skim = undefined

export const skim = instruction(
    {
        d8: '0xee78dd8a523c64da',
    },
    {
        pool: 0,
        mintA: 1,
        mintB: 2,
        poolAccountA: 3,
        poolAccountB: 4,
        toAccountA: 5,
        toAccountB: 6,
        tokenProgram: 7,
    },
    unit,
)

export interface Swap {
    amountAOut: bigint
    amountBOut: bigint
    callbackData: Uint8Array
}

export const swap = instruction(
    {
        d8: '0xf8c69e91e17587c8',
    },
    {
        pool: 0,
        mintA: 1,
        mintB: 2,
        poolAccountA: 3,
        poolAccountB: 4,
        toAccountA: 5,
        toAccountB: 6,
        trader: 7,
        tokenProgram: 8,
        callbackProgram: 9,
    },
    struct({
        amountAOut: u64,
        amountBOut: u64,
        callbackData: binary,
    }),
)

export type Sync = undefined

export const sync = instruction(
    {
        d8: '0x04db28a4159dbd58',
    },
    {
        pool: 0,
        mintA: 1,
        mintB: 2,
        poolAccountA: 3,
        poolAccountB: 4,
    },
    unit,
)
