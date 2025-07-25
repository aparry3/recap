import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Add createdBy to gallery table to track who created it
  await db.schema
    .alterTable('gallery')
    .addColumn('created_by', 'varchar', (col) => 
      col.references('person.id').onDelete('set null')
    )
    .execute();

  // Add index for faster queries
  await db.schema
    .createIndex('gallery_created_by_idx')
    .on('gallery')
    .column('created_by')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('gallery_created_by_idx').execute();
  await db.schema
    .alterTable('gallery')
    .dropColumn('created_by')
    .execute();
}