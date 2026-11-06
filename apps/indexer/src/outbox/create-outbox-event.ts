import {OutboxEvent} from '../model/outbox-event.model.js'

export type AmmEventType =
    | 'PoolCreated'
    | 'MintLiquidity'
    | 'BurnLiquidity'
    | 'Swap'
    | 'Sync'

type IndexedEvent = {
    id: string
    pool: string
}

type EventPosition = {
    slot: number
    transactionIndex: number
    logIndex: number
}

export function createOutboxEvent<T extends IndexedEvent>(
    event: T,
    eventType: AmmEventType,
    position: EventPosition,
): OutboxEvent {
    const outbox = new OutboxEvent()

    outbox.id = `${eventType}:${event.id}`
    outbox.eventType = eventType
    outbox.aggregateId = event.pool
    outbox.topic = 'amm.events'

    outbox.slot = position.slot
    outbox.transactionIndex = position.transactionIndex
    outbox.logIndex = position.logIndex

    outbox.payload = {
        ...event,
        eventId: outbox.id,
        eventType,
        schemaVersion: 1,
        transactionIndex: position.transactionIndex,
    }

    outbox.status = 'PENDING'
    outbox.publishedAt = null
    outbox.retryCount = 0
    outbox.lastError = null

    return outbox
}
