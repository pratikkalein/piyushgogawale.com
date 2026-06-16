import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN "prefix" varchar DEFAULT 'media';
  ALTER TABLE "pages" ADD COLUMN "lede" varchar;
  ALTER TABLE "pages" ADD COLUMN "portrait_id" integer;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_portrait_idx" ON "pages" USING btree ("portrait_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DROP CONSTRAINT "pages_portrait_id_media_id_fk";
  
  DROP INDEX "pages_portrait_idx";
  ALTER TABLE "media" DROP COLUMN "prefix";
  ALTER TABLE "pages" DROP COLUMN "lede";
  ALTER TABLE "pages" DROP COLUMN "portrait_id";`)
}
