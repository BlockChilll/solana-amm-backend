import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAnalyticsTables1793821871442 implements MigrationInterface {
    name = 'CreateAnalyticsTables1793821871442'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "processed_events" ("event_id" character varying NOT NULL, "processed_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_585a690352092645ee665d70ac2" PRIMARY KEY ("event_id"))`);
        await queryRunner.query(`CREATE TABLE "pool_stats" ("pool_address" character varying NOT NULL, "total_swaps" bigint NOT NULL DEFAULT '0', CONSTRAINT "PK_4bfe11179329851cb5d90dec814" PRIMARY KEY ("pool_address"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "pool_stats"`);
        await queryRunner.query(`DROP TABLE "processed_events"`);
    }

}
