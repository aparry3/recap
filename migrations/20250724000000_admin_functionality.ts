import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Add is_admin column to person table
  await db.schema
    .alterTable('person')
    .addColumn('is_admin', 'boolean', (col) => col.defaultTo(false).notNull())
    .execute();

  // Update existing admin users with @ourweddingrecap.com email
  await db
    .updateTable('person')
    .set({ is_admin: true })
    .where('email', 'like', '%@ourweddingrecap.com')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Remove is_admin column from person table
  await db.schema
    .alterTable('person')
    .dropColumn('is_admin')
    .execute();
}