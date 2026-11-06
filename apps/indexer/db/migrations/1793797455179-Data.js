module.exports = class Data1793797455179 {
    name = 'Data1793797455179'

    async up(db) {
        await db.query(`DROP INDEX "public"."idx_outbox_event_pending"`)
        await db.query(`ALTER TABLE "outbox_event" ADD "slot" integer NOT NULL`)
        await db.query(`ALTER TABLE "outbox_event" ADD "transaction_index" integer NOT NULL`)
        await db.query(`ALTER TABLE "outbox_event" ADD "log_index" integer NOT NULL`)
        await db.query(`CREATE INDEX "idx_outbox_event_pending" ON "outbox_event" ("slot", "transaction_index", "log_index") WHERE status = 'PENDING'`)
    }

    async down(db) {
        await db.query(`DROP INDEX "public"."idx_outbox_event_pending"`)
        await db.query(`ALTER TABLE "outbox_event" DROP COLUMN "log_index"`)
        await db.query(`ALTER TABLE "outbox_event" DROP COLUMN "transaction_index"`)
        await db.query(`ALTER TABLE "outbox_event" DROP COLUMN "slot"`)
        await db.query(`CREATE INDEX "idx_outbox_event_pending" ON "outbox_event" ("created_at") WHERE ((status)::text = 'PENDING'::text)`)
    }
}
