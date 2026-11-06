import {
    Entity,
    PrimaryColumn,
    Column,
    Index
} from 'typeorm'

@Entity()
@Index(
    'idx_outbox_event_pending',
    ['slot', 'transactionIndex', 'logIndex'],
    {where: "status = 'PENDING'"},
)
export class OutboxEvent {
    @PrimaryColumn('varchar')
    id!: string

    @Column('varchar')
    eventType!: string

    @Column('varchar')
    aggregateId!: string

    @Column('varchar')
    topic!: string

    @Column('jsonb')
    payload!: Record<string, unknown>

    @Column('varchar', {default: 'PENDING'})
    status!: string

    @Column('timestamptz', {default: () => 'CURRENT_TIMESTAMP'})
    createdAt!: Date

    @Column('timestamptz', {nullable: true})
    publishedAt!: Date | null

    @Column('integer', {default: 0})
    retryCount!: number

    @Column('text', {nullable: true})
    lastError!: string | null

    @Column('integer')
    slot!: number

    @Column('integer')
    transactionIndex!: number

    @Column('integer')
    logIndex!: number
}
