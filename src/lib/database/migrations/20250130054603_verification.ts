import { Kysely } from 'kysely'


export async function up(db: Kysely<any>): Promise<void> {
  // Migration code
    await db.schema
    .createTable('verification')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('person_id', 'varchar', (col) => col.references('person.id').notNull())
    .addColumn('verified', 'boolean', (col) => col.defaultTo(false))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
  .dropTable('verification')
  .execute();
}
