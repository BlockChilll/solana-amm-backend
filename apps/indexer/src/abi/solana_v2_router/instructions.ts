import {address, array, i64, struct, u64} from '@subsquid/borsh'
import {instruction} from '../abi.support.js'

export interface AddLiquidity {
    amountADesired: bigint
    amountBDesired: bigint
    amountAMin: bigint
    amountBMin: bigint
    deadline: bigint
}

export const addLiquidity = instruction(
    {
        d8: '0xb59d59438fb63448',
    },
    {
        ammProgram: 0,
        ammConfig: 1,
        pool: 2,
        mintA: 3,
        mintB: 4,
        userAccountA: 5,
        userAccountB: 6,
        poolAccountA: 7,
        poolAccountB: 8,
        lockedLpAccount: 9,
        mintLp: 10,
        feeToLpAccount: 11,
        toLpAccount: 12,
        provider: 13,
        tokenProgram: 14,
    },
    struct({
        amountADesired: u64,
        amountBDesired: u64,
        amountAMin: u64,
        amountBMin: u64,
        deadline: i64,
    }),
)

export interface AddLiquiditySol {
    amountTokenDesired: bigint
    amountTokenMin: bigint
    amountSolMin: bigint
    maxSol: bigint
    deadline: bigint
}

export const addLiquiditySol = instruction(
    {
        d8: '0x5fec31a9de45402b',
    },
    {
        ammProgram: 0,
        ammConfig: 1,
        pool: 2,
        mintA: 3,
        mintB: 4,
        mintSol: 5,
        userTokenAccount: 6,
        poolAccountA: 7,
        poolAccountB: 8,
        lockedLpAccount: 9,
        mintLp: 10,
        feeToLpAccount: 11,
        toLpAccount: 12,
        temporaryWsolAccount: 13,
        provider: 14,
        tokenProgram: 15,
        systemProgram: 16,
    },
    struct({
        amountTokenDesired: u64,
        amountTokenMin: u64,
        amountSolMin: u64,
        maxSol: u64,
        deadline: i64,
    }),
)

export interface RemoveLiquidity {
    liquidity: bigint
    amountAMin: bigint
    amountBMin: bigint
    deadline: bigint
}

export const removeLiquidity = instruction(
    {
        d8: '0x5055d14818ceb16c',
    },
    {
        ammProgram: 0,
        ammConfig: 1,
        pool: 2,
        mintA: 3,
        mintB: 4,
        userLpAccount: 5,
        poolAccountLp: 6,
        poolAccountA: 7,
        poolAccountB: 8,
        mintLp: 9,
        feeToLpAccount: 10,
        toAccountA: 11,
        toAccountB: 12,
        provider: 13,
        tokenProgram: 14,
    },
    struct({
        liquidity: u64,
        amountAMin: u64,
        amountBMin: u64,
        deadline: i64,
    }),
)

export interface RemoveLiquiditySol {
    liquidity: bigint
    amountTokenMin: bigint
    amountSolMin: bigint
    deadline: bigint
}

export const removeLiquiditySol = instruction(
    {
        d8: '0x2ffcd9d31c81af8b',
    },
    {
        ammProgram: 0,
        ammConfig: 1,
        pool: 2,
        mintA: 3,
        mintB: 4,
        mintSol: 5,
        userLpAccount: 6,
        poolAccountLp: 7,
        poolAccountA: 8,
        poolAccountB: 9,
        mintLp: 10,
        feeToLpAccount: 11,
        toTokenAccount: 12,
        temporaryWsolAccount: 13,
        solRecipient: 14,
        provider: 15,
        tokenProgram: 16,
        systemProgram: 17,
    },
    struct({
        liquidity: u64,
        amountTokenMin: u64,
        amountSolMin: u64,
        deadline: i64,
    }),
)

export interface SwapExactSolForTokens {
    amountIn: bigint
    amountOutMin: bigint
    path: Array<string>
    deadline: bigint
}

export const swapExactSolForTokens = instruction(
    {
        d8: '0x5d58ff541c11d682',
    },
    {
        trader: 0,
        temporaryWsolAccount: 1,
        wsolMint: 2,
        toTokenAccount: 3,
        ammProgram: 4,
        tokenProgram: 5,
        systemProgram: 6,
    },
    struct({
        amountIn: u64,
        amountOutMin: u64,
        path: array(address),
        deadline: i64,
    }),
)

export interface SwapExactTokensForSol {
    amountIn: bigint
    amountOutMin: bigint
    path: Array<string>
    deadline: bigint
}

export const swapExactTokensForSol = instruction(
    {
        d8: '0x5df90228d214c09e',
    },
    {
        trader: 0,
        userTokenAccount: 1,
        temporaryWsolAccount: 2,
        wsolMint: 3,
        solRecipient: 4,
        ammProgram: 5,
        tokenProgram: 6,
        systemProgram: 7,
    },
    struct({
        amountIn: u64,
        amountOutMin: u64,
        path: array(address),
        deadline: i64,
    }),
)

export interface SwapExactTokensForTokens {
    amountIn: bigint
    amountOutMin: bigint
    path: Array<string>
    deadline: bigint
}

export const swapExactTokensForTokens = instruction(
    {
        d8: '0xf956fd32b1dd49a2',
    },
    {
        trader: 0,
        userTokenAccount: 1,
        toTokenAccount: 2,
        ammProgram: 3,
        tokenProgram: 4,
    },
    struct({
        amountIn: u64,
        amountOutMin: u64,
        path: array(address),
        deadline: i64,
    }),
)

export interface SwapSolForExactTokens {
    amountOut: bigint
    amountInMax: bigint
    path: Array<string>
    deadline: bigint
}

export const swapSolForExactTokens = instruction(
    {
        d8: '0xa76d03026c2eb44a',
    },
    {
        trader: 0,
        temporaryWsolAccount: 1,
        wsolMint: 2,
        toTokenAccount: 3,
        ammProgram: 4,
        tokenProgram: 5,
        systemProgram: 6,
    },
    struct({
        amountOut: u64,
        amountInMax: u64,
        path: array(address),
        deadline: i64,
    }),
)

export interface SwapTokensForExactSol {
    amountOut: bigint
    amountInMax: bigint
    path: Array<string>
    deadline: bigint
}

export const swapTokensForExactSol = instruction(
    {
        d8: '0x4eb0490753350be1',
    },
    {
        trader: 0,
        userTokenAccount: 1,
        temporaryWsolAccount: 2,
        wsolMint: 3,
        solRecipient: 4,
        ammProgram: 5,
        tokenProgram: 6,
        systemProgram: 7,
    },
    struct({
        amountOut: u64,
        amountInMax: u64,
        path: array(address),
        deadline: i64,
    }),
)

export interface SwapTokensForExactTokens {
    amountOut: bigint
    amountInMax: bigint
    path: Array<string>
    deadline: bigint
}

export const swapTokensForExactTokens = instruction(
    {
        d8: '0x3767464e1e896613',
    },
    {
        trader: 0,
        userTokenAccount: 1,
        toTokenAccount: 2,
        ammProgram: 3,
        tokenProgram: 4,
    },
    struct({
        amountOut: u64,
        amountInMax: u64,
        path: array(address),
        deadline: i64,
    }),
)
