import {Entity, PrimaryColumn, Column, Index} from 'typeorm'

@Entity()
export class SwapEvent {
    @PrimaryColumn('varchar')
    id!: string

    @Index()
    @Column('varchar')
    pool!: string

    @Column('varchar')
    trader!: string

    @Index()
    @Column('varchar')
    txSignature!: string

    @Column('integer')
    slot!: number

    @Column('integer')
    logIndex!: number

    @Column('numeric', {precision: 40, scale: 0})
    amountAIn!: string

    @Column('numeric', {precision: 40, scale: 0})
    amountBIn!: string

    @Column('numeric', {precision: 40, scale: 0})
    amountAOut!: string

    @Column('numeric', {precision: 40, scale: 0})
    amountBOut!: string
}
