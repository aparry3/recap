import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Add is_admin column to person table
  await db.schema
    .alterTable('person')
    .addColumn('is_admin', 'boolean', (col) => col.defaultTo(false).notNull())
    .execute();

  // Create admin_actions table for audit logging
  await db.schema
    .createTable('admin_actions')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('admin_id', 'varchar', (col) => col.notNull().references('person.id'))
    .addColumn('action', 'varchar', (col) => col.notNull())
    .addColumn('target_type', 'varchar')
    .addColumn('target_id', 'varchar')
    .addColumn('metadata', 'jsonb')
    .addColumn('created', 'timestamp', (col) => col.defaultTo('now()').notNull())
    .execute();

  // Add indexes for efficient querying
  await db.schema
    .createIndex('idx_admin_actions_admin_id')
    .on('admin_actions')
    .column('admin_id')
    .execute();

  await db.schema
    .createIndex('idx_admin_actions_created')
    .on('admin_actions')
    .column('created')
    .using('btree')
    .execute();

  // Update existing admin users with @ourweddingrecap.com email
  await db
    .updateTable('person')
    .set({ is_admin: true })
    .where('email', 'like', '%@ourweddingrecap.com')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop indexes
  await db.schema
    .dropIndex('idx_admin_actions_created')
    .execute();

  await db.schema
    .dropIndex('idx_admin_actions_admin_id')
    .execute();

  // Drop admin_actions table
  await db.schema
    .dropTable('admin_actions')
    .execute();

  // Remove is_admin column from person table
  await db.schema
    .alterTable('person')
    .dropColumn('is_admin')
    .execute();
}