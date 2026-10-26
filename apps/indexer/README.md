# Solana AMM Event Indexer

A TypeScript indexer for Anchor events emitted by a Solana AMM program on Devnet.

The indexer uses **SQD Squid SDK** to fetch Solana program logs, decode Anchor events, and persist immutable records in PostgreSQL using TypeORM.

## Indexed Events

| Anchor Event | PostgreSQL Table |
|---|---|
| `PoolCreated` | `pool_created_event` |
| `Swap` | `swap_event` |
| `MintLiquidity` | `liquidity_event` (`type = MINT`) |
| `BurnLiquidity` | `liquidity_event` (`type = BURN`) |
| `Sync` | `sync_event` |

All event records are immutable. The indexer does not maintain mutable pool state.

## Prerequisites

- Node.js and npm
- Docker
- Docker Compose (`docker-compose`)
- Access to the SQD Solana Devnet Portal

## Environment Configuration

Create a `.env` file in the project root:

```dotenv
DB_HOST=localhost
DB_PORT=5432
DB_NAME=amm_indexer
DB_USER=postgres
DB_PASS=postgres
```

Ensure the database configuration matches `docker-compose.yml`.

## First-Time Setup

Install dependencies:

```bash
npm install
```

Build the project:

```bash
npm run build
```

Start PostgreSQL:

```bash
docker-compose up -d
```

Apply the existing database migrations:

```bash
npm run db:migrate
```

Initialize the SQD processor checkpoint:

```bash
npm run db:bootstrap
```

Start the indexer:

```bash
npm start
```

The indexer begins processing events from the configured starting slot.

**Note:** Migration files should already exist in `db/migrations/` and be committed to Git. There is no need to generate migrations during normal first-time setup.

## Subsequent Runs

For normal restarts, preserve the existing database and indexing checkpoint.

Start PostgreSQL if it is not already running:

```bash
docker-compose up -d
```

Start the indexer:

```bash
npm start
```

The indexer resumes processing from its last saved checkpoint.

If the TypeScript source code has changed, rebuild first:

```bash
npm run build
npm start
```

**Note:** The default SQD Docker Compose configuration uses an anonymous PostgreSQL volume. `docker-compose up -d` preserves existing data when restarting the same container. However, after `docker-compose down`, a new container and database are created. To preserve indexed events and checkpoints, use `docker-compose stop` instead of `down`.

## Full Database Reset

To delete all indexed records and reindex from scratch:

```bash
npm run db:reset
```

Then start the indexer:

```bash
npm start
```

The `db:reset` script:

1. Builds the project.
2. Removes the existing development PostgreSQL container and its attached volumes.
3. Starts a fresh PostgreSQL instance.
4. Waits for PostgreSQL to become ready.
5. Applies database migrations.
6. Initializes the SQD checkpoint.

**Warning:** This operation permanently deletes the development database.

Do not use `db:reset` for normal restarts.

## Database Migrations

### Apply Existing Migrations

With PostgreSQL running:

```bash
npm run db:migrate
```

### Generate a New Migration

When TypeORM entities in `src/model/` change, generate a migration:

```bash
npm run build
npm run db:migration:generate
```

Review the generated migration in `db/migrations/`.

Apply it:

```bash
npm run db:migrate
```

Commit the migration file alongside the entity changes.

**Important:** Migration generation compares the current entity definitions against the existing PostgreSQL schema.

- For incremental migrations, generate against the previously applied schema.
- For an initial baseline migration, generate against an empty database.
- Do not generate an incremental migration against an old schema and then use it as the only migration on a fresh database.

## Inspect Indexed Events

Connect to PostgreSQL:

```bash
docker-compose exec db psql -U postgres -d amm_indexer
```

View pool creation events:

```sql
SELECT * FROM pool_created_event ORDER BY slot, log_index;
```

View swaps:

```sql
SELECT * FROM swap_event ORDER BY slot, log_index;
```

View liquidity events:

```sql
SELECT * FROM liquidity_event ORDER BY slot, log_index;
```

View reserve synchronization events:

```sql
SELECT * FROM sync_event ORDER BY slot, log_index;
```

Exit PostgreSQL:

```text
\q
```

## Available npm Scripts

| Script | Description |
|---|---|
| `npm run build` | Compile TypeScript into `lib/` |
| `npm start` | Start the indexer |
| `npm run typegen` | Generate TypeScript ABI bindings from Anchor IDLs |
| `npm run db:migrate` | Apply pending database migrations |
| `npm run db:migration:generate` | Generate a TypeORM migration |
| `npm run db:bootstrap` | Initialize the SQD processor checkpoint |
| `npm run db:reset` | Reset the database, apply migrations, and initialize the checkpoint |

## Project Structure

| Path | Description |
|---|---|
| `src/main.ts` | SQD data source configuration and event processing |
| `src/model/` | TypeORM entities |
| `src/abi/` | Generated Anchor ABI bindings |
| `idl/` | Anchor IDL files |
| `db/migrations/` | Database migrations |
| `db/bootstrap.sql` | SQD checkpoint initialization |
| `docker-compose.yml` | PostgreSQL configuration |

## Architecture

```text
Solana Devnet
    |
    v
SQD Portal
    |
    v
SQD Batch Processor
    |
    v
Anchor Event Decoder
    |
    v
TypeORM
    |
    v
PostgreSQL
```

The indexer is responsible exclusively for ingesting and storing on-chain events. A separate read-only API can query PostgreSQL to expose the indexed data to clients.
