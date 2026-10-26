import {Entity, PrimaryColumn, Column, Index} from 'typeorm'

export enum LiquidityEventType {
    MINT = 'MINT',
    BURN = 'BURN',
}

@Entity()
export class LiquidityEvent {
    @PrimaryColumn('varchar')
    id!: string

    @Index()
    @Column('varchar')
    pool!: string

    @Column('varchar')
    provider!: string

    @Column('varchar')
    type!: LiquidityEventType

    @Column('varchar')
    txSignature!: string

    @Column('integer')
    slot!: number

    @Column('integer')
    logIndex!: number

    @Column('numeric', {precision: 40, scale: 0})
    amountA!: string

    @Column('numeric', {precision: 40, scale: 0})
    amountB!: string

    @Column('numeric', {precision: 40, scale: 0})
    liquidity!: string
}
