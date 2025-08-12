import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('gallery')
    .addColumn('deleted_at', 'timestamp')
    .execute();

  await db.schema
    .createIndex('gallery_deleted_at_idx')
    .on('gallery')
    .column('deleted_at')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('gallery_deleted_at_idx').execute();
  await db.schema
    .alterTable('gallery')
    .dropColumn('deleted_at')
    .execute();
}