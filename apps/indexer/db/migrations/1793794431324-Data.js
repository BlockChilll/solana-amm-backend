module.exports = class Data1793794431324 {
    name = 'Data1793794431324'

    async up(db) {
        await db.query(`CREATE TABLE "outbox_event" ("id" character varying NOT NULL, "event_type" character varying NOT NULL, "aggregate_id" character varying NOT NULL, "topic" character varying NOT NULL, "payload" jsonb NOT NULL, "status" character varying NOT NULL DEFAULT 'PENDING', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "published_at" TIMESTAMP WITH TIME ZONE, "retry_count" integer NOT NULL DEFAULT '0', "last_error" text, CONSTRAINT "PK_cc0c9e40998e45ecfc5e313429d" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "idx_outbox_event_pending" ON "outbox_event" ("created_at") WHERE status = 'PENDING'`)
    }

    async down(db) {
        await db.query(`DROP INDEX "public"."idx_outbox_event_pending"`)
        await db.query(`DROP TABLE "outbox_event"`)
    }
}
