import {DataSource} from 'typeorm'
import {SnakeNamingStrategy} from 'typeorm-naming-strategies'
import {
    PoolCreatedEvent,
    SwapEvent,
    LiquidityEvent,
    SyncEvent
} from '../model/index.js'

export const apiDatabase = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [
        PoolCreatedEvent,
        SwapEvent,
        LiquidityEvent,
        SyncEvent
    ],
    synchronize: false,
    logging: false,
    namingStrategy: new SnakeNamingStrategy(),
})
