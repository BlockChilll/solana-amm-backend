import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('pool_stats')
export class PoolStats {
  @PrimaryColumn({ name: 'pool_address', type: 'varchar' })
  poolAddress!: string;

  @Column({ name: 'total_swaps', type: 'bigint', default: 0 })
  totalSwaps!: string;
}
