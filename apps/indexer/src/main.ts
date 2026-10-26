
import {run} from '@subsquid/batch-processor'
import {augmentBlock} from '@subsquid/solana-objects'
import {DataSourceBuilder} from '@subsquid/solana-stream'
import {TypeormDatabase} from '@subsquid/typeorm-store'

import * as events from './abi/solana_v2_amm/events.js'

import {
    PoolCreatedEvent,
    SwapEvent,
    LiquidityEvent,
    LiquidityEventType,
    SyncEvent,
} from './model/index.js'

const AMM_PROGRAM_ID =
    'HwVgAGBTdPvyXCyN5gRE2pun9BccbskyiRCnMboyeyns'

const START_SLOT = 514880720

const dataSource = new DataSourceBuilder()
    .setPortal({
        url: 'https://portal.sqd.dev/datasets/solana-devnet',
        http: {retryAttempts: Infinity},
    })
    .setBlockRange({from: START_SLOT})
    .setFields({
        transaction: {
            signatures: true,
            err: true,
        },
        log: {
            programId: true,
            kind: true,
            message: true,
        },
    })
    .addLog({
        where: {
            programId: [AMM_PROGRAM_ID],
            kind: ['data'],
        },
        include: {
            transaction: true,
        },
    })
    .build()

const database = new TypeormDatabase({
    supportHotBlocks: false,
})

run(dataSource, database, async (ctx) => {
    const poolCreatedEvents: PoolCreatedEvent[] = []
    const swapEvents: SwapEvent[] = []
    const liquidityEvents: LiquidityEvent[] = []
    const syncEvents: SyncEvent[] = []

    for (const block of ctx.blocks.map(augmentBlock)) {
        const slot = block.header.number

        for (const log of block.logs) {
            if (
                log.programId !== AMM_PROGRAM_ID ||
                log.kind !== 'data'
            ) {
                continue
            }

            const tx = log.getTransaction()

            if (tx.err != null) continue

            const txSignature = tx.signatures[0]

            if (!txSignature) {
                throw new Error(
                    `Missing transaction signature at slot ${slot}`,
                )
            }

            const hex =
                '0x' +
                Buffer.from(log.message, 'base64').toString('hex')

            const discriminator = hex.slice(0, 18)
            const id = `${txSignature}-${log.logIndex}`

            if (discriminator === events.PoolCreated.d8) {
                const data = events.PoolCreated.decode(hex)

                const event = new PoolCreatedEvent()
                event.id = id
                event.txSignature = txSignature
                event.slot = slot
                event.logIndex = log.logIndex
                event.pool = data.pool
                event.mintA = data.mintA
                event.mintB = data.mintB
                event.mintLp = data.mintLp

                poolCreatedEvents.push(event)
            }

            else if (discriminator === events.MintLiquidity.d8) {
                const data = events.MintLiquidity.decode(hex)

                const event = new LiquidityEvent()
                event.id = id
                event.txSignature = txSignature
                event.slot = slot
                event.logIndex = log.logIndex
                event.pool = data.pool
                event.provider = data.provider
                event.type = LiquidityEventType.MINT
                event.amountA = data.amountA.toString()
                event.amountB = data.amountB.toString()
                event.liquidity = data.liquidity.toString()

                liquidityEvents.push(event)
            }

            else if (discriminator === events.BurnLiquidity.d8) {
                const data = events.BurnLiquidity.decode(hex)

                const event = new LiquidityEvent()
                event.id = id
                event.txSignature = txSignature
                event.slot = slot
                event.logIndex = log.logIndex
                event.pool = data.pool
                event.provider = data.provider
                event.type = LiquidityEventType.BURN
                event.amountA = data.amountA.toString()
                event.amountB = data.amountB.toString()
                event.liquidity = data.liquidity.toString()

                liquidityEvents.push(event)
            }

            else if (discriminator === events.Swap.d8) {
                const data = events.Swap.decode(hex)

                const event = new SwapEvent()
                event.id = id
                event.txSignature = txSignature
                event.slot = slot
                event.logIndex = log.logIndex
                event.pool = data.pool
                event.trader = data.trader
                event.amountAIn = data.amountAIn.toString()
                event.amountBIn = data.amountBIn.toString()
                event.amountAOut = data.amountAOut.toString()
                event.amountBOut = data.amountBOut.toString()

                swapEvents.push(event)
            }

            else if (discriminator === events.Sync.d8) {
                const data = events.Sync.decode(hex)

                const event = new SyncEvent()
                event.id = id
                event.txSignature = txSignature
                event.slot = slot
                event.logIndex = log.logIndex
                event.pool = data.pool
                event.reserveA = data.reserveA.toString()
                event.reserveB = data.reserveB.toString()

                syncEvents.push(event)
            }
        }
    }

    if (poolCreatedEvents.length > 0) {
        await ctx.store.insert(poolCreatedEvents)
    }

    if (liquidityEvents.length > 0) {
        await ctx.store.insert(liquidityEvents)
    }

    if (swapEvents.length > 0) {
        await ctx.store.insert(swapEvents)
    }

    if (syncEvents.length > 0) {
        await ctx.store.insert(syncEvents)
    }

    const total =
        poolCreatedEvents.length +
        liquidityEvents.length +
        swapEvents.length +
        syncEvents.length

    if (total > 0) {
        console.log('Events inserted:', {
            poolCreated: poolCreatedEvents.length,
            liquidity: liquidityEvents.length,
            swaps: swapEvents.length,
            syncs: syncEvents.length,
        })
    }
})
