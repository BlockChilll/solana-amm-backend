import {Entity, PrimaryColumn, Column} from 'typeorm'

@Entity()
export class PoolCreatedEvent {
    @PrimaryColumn('varchar')
    id!: string

    @Column('varchar')
    txSignature!: string

    @Column('integer')
    slot!: number

    @Column('integer')
    logIndex!: number

    @Column('varchar')
    pool!: string

    @Column('varchar')
    mintA!: string

    @Column('varchar')
    mintB!: string

    @Column('varchar')
    mintLp!: string
}
