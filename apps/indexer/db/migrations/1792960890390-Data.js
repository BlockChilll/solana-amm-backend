module.exports = class Data1792960890390 {
    name = 'Data1792960890390'

    async up(db) {
        await db.query(`CREATE TABLE "pool_created_event" ("id" character varying NOT NULL, "tx_signature" character varying NOT NULL, "slot" integer NOT NULL, "log_index" integer NOT NULL, "pool" character varying NOT NULL, "mint_a" character varying NOT NULL, "mint_b" character varying NOT NULL, "mint_lp" character varying NOT NULL, CONSTRAINT "PK_cafa5b7c45eaa63e8c5f2caf884" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "swap_event" ("id" character varying NOT NULL, "pool" character varying NOT NULL, "trader" character varying NOT NULL, "tx_signature" character varying NOT NULL, "slot" integer NOT NULL, "log_index" integer NOT NULL, "amount_a_in" numeric(40,0) NOT NULL, "amount_b_in" numeric(40,0) NOT NULL, "amount_a_out" numeric(40,0) NOT NULL, "amount_b_out" numeric(40,0) NOT NULL, CONSTRAINT "PK_556d6f3bd0c2899dbb0455d4e0a" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_cb450ee39f7c528792563b8068" ON "swap_event" ("pool") `)
        await db.query(`CREATE INDEX "IDX_d33868c7c626a068fb4e54af7f" ON "swap_event" ("tx_signature") `)
        await db.query(`CREATE TABLE "liquidity_event" ("id" character varying NOT NULL, "pool" character varying NOT NULL, "provider" character varying NOT NULL, "type" character varying NOT NULL, "tx_signature" character varying NOT NULL, "slot" integer NOT NULL, "log_index" integer NOT NULL, "amount_a" numeric(40,0) NOT NULL, "amount_b" numeric(40,0) NOT NULL, "liquidity" numeric(40,0) NOT NULL, CONSTRAINT "PK_2304e1bbb1e6769ce6f9a020edf" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_30b8085ca7bd1b6e6b75b0d738" ON "liquidity_event" ("pool") `)
        await db.query(`CREATE TABLE "sync_event" ("id" character varying NOT NULL, "pool" character varying NOT NULL, "tx_signature" character varying NOT NULL, "slot" integer NOT NULL, "log_index" integer NOT NULL, "reserve_a" numeric(40,0) NOT NULL, "reserve_b" numeric(40,0) NOT NULL, CONSTRAINT "PK_ee793a8fc585a352607159f8d95" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_008f5e7e784bc073b8c274f579" ON "sync_event" ("pool") `)
    }

    async down(db) {
        await db.query(`DROP INDEX "public"."IDX_008f5e7e784bc073b8c274f579"`)
        await db.query(`DROP TABLE "sync_event"`)
        await db.query(`DROP INDEX "public"."IDX_30b8085ca7bd1b6e6b75b0d738"`)
        await db.query(`DROP TABLE "liquidity_event"`)
        await db.query(`DROP INDEX "public"."IDX_d33868c7c626a068fb4e54af7f"`)
        await db.query(`DROP INDEX "public"."IDX_cb450ee39f7c528792563b8068"`)
        await db.query(`DROP TABLE "swap_event"`)
        await db.query(`DROP TABLE "pool_created_event"`)
    }
}
