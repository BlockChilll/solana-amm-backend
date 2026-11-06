import 'reflect-metadata';
import 'dotenv/config';

import { DataSource } from 'typeorm';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { ProcessedEvent } from '../entities/processed-event.entity.js';
import { PoolStats } from '../entities/pool-stats.entity.js';

const currentDir = dirname(fileURLToPath(import.meta.url));

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  username: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  entities: [ProcessedEvent, PoolStats],
  migrations: [join(currentDir, '../migrations/*{.ts,.js}')],
  synchronize: false,
});
