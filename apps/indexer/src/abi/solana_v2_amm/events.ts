import {event} from '../abi.support.js'
import {BurnLiquidity as BurnLiquidity_, MintLiquidity as MintLiquidity_, PoolCreated as PoolCreated_, Swap as Swap_, Sync as Sync_} from './types.js'

export type BurnLiquidity = BurnLiquidity_

export const BurnLiquidity = event(
    {
        d8: '0xa817e43e4382a1d4',
    },
    BurnLiquidity_,
)

export type MintLiquidity = MintLiquidity_

export const MintLiquidity = event(
    {
        d8: '0x4068c01ec1889baf',
    },
    MintLiquidity_,
)

export type PoolCreated = PoolCreated_

export const PoolCreated = event(
    {
        d8: '0xca2c295868dc9d52',
    },
    PoolCreated_,
)

export type Swap = Swap_

export const Swap = event(
    {
        d8: '0x516ce3becdd00ac4',
    },
    Swap_,
)

export type Sync = Sync_

export const Sync = event(
    {
        d8: '0xcc540f8eb53c3899',
    },
    Sync_,
)
