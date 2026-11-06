import 'dotenv/config'
import {DataSource} from 'typeorm'
import { Kafka, Partitioners } from 'kafkajs'
import {SnakeNamingStrategy} from 'typeorm-naming-strategies'

import {OutboxEvent} from '../model/outbox-event.model.js'

const POLL_INTERVAL_MS = 1000
const BATCH_SIZE = 100

const database = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASS ?? 'postgres',
    database: process.env.DB_NAME ?? 'amm_indexer',
    entities: [OutboxEvent],
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: false,
})

const kafka = new Kafka({
    clientId: 'amm-outbox-publisher',
    brokers: ['localhost:9092'],
})

const producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
    idempotent: true,
    maxInFlightRequests: 1,
})

let running = true

const sleep = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms))

async function publishBatch(): Promise<number> {
    const repository = database.getRepository(OutboxEvent)

    const pending = await repository.find({
        where: {status: 'PENDING'},
        order: {
            slot: 'ASC',
            transactionIndex: 'ASC',
            logIndex: 'ASC',
        },
        take: BATCH_SIZE,
    })

    for (const event of pending) {
        try {
            await producer.send({
                topic: event.topic,
                acks: -1,
                messages: [
                    {
                        key: event.aggregateId,
                        value: JSON.stringify(event.payload),
                    },
                ],
            })

            await repository.update(
                {id: event.id},
                {
                    status: 'PUBLISHED',
                    publishedAt: new Date(),
                    lastError: null,
                },
            )

            console.log(
                `Published ${event.eventType}: ${event.id}`,
            )
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error)

            await repository.increment(
                {id: event.id},
                'retryCount',
                1,
            )

            await repository.update(
                {id: event.id},
                {lastError: message},
            )

            console.error(`Failed to publish ${event.id}:`, message)

            // Don't publish later events ahead of this one.
            break
        }
    }

    return pending.length
}

async function main() {
    await database.initialize()
    await producer.connect()

    console.log('Outbox publisher started')

    process.on('SIGINT', () => {
        running = false
    })

    process.on('SIGTERM', () => {
        running = false
    })

    try {
        while (running) {
            const count = await publishBatch()

            if (count === 0) {
                await sleep(POLL_INTERVAL_MS)
            }
        }
    } finally {
        await producer.disconnect()
        await database.destroy()
    }
}

main().catch((error) => {
    console.error('Outbox publisher crashed:', error)
    process.exitCode = 1
})
