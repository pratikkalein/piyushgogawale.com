import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Idempotent on purpose: production may already carry `media.prefix` (it has
// been serving R2 uploads), and an unconditional ADD COLUMN would abort the
// whole migration before `pages.lede` / `pages.portrait_id` were added. Guards
// keep this re-runnable and conflict-free across environments.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "prefix" varchar DEFAULT 'media';
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "lede" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "portrait_id" integer;
  DO $$ BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint WHERE conname = 'pages_portrait_id_media_id_fk'
    ) THEN
      ALTER TABLE "pages" ADD CONSTRAINT "pages_portrait_id_media_id_fk"
        FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    END IF;
  END $$;
  CREATE INDEX IF NOT EXISTS "pages_portrait_idx" ON "pages" USING btree ("portrait_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages" DROP CONSTRAINT IF EXISTS "pages_portrait_id_media_id_fk";
  DROP INDEX IF EXISTS "pages_portrait_idx";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "prefix";
  ALTER TABLE "pages" DROP COLUMN IF EXISTS "lede";
  ALTER TABLE "pages" DROP COLUMN IF EXISTS "portrait_id";`)
}
