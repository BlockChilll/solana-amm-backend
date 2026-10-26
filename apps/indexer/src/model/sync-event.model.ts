import {Entity, PrimaryColumn, Column, Index} from 'typeorm'

@Entity()
export class SyncEvent {
    @PrimaryColumn('varchar')
    id!: string

    @Index()
    @Column('varchar')
    pool!: string

    @Column('varchar')
    txSignature!: string

    @Column('integer')
    slot!: number

    @Column('integer')
    logIndex!: number

    @Column('numeric', {precision: 40, scale: 0})
    reserveA!: string

    @Column('numeric', {precision: 40, scale: 0})
    reserveB!: string
}
