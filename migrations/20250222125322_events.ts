import { Kysely } from 'kysely'


export async function up(db: Kysely<any>): Promise<void> {
  // Migration code
  await db.schema
    .alterTable('person')
    .addColumn('phone', 'varchar')
    .execute(); 

  await db.schema
    .createTable('wedding_event')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('location', 'varchar')
    .addColumn('start', 'date')
    .addColumn('end', 'date')
    .addColumn('attire', 'varchar')
    .addColumn('gallery_id', 'varchar', col => col.references('gallery.id').notNull())
    .execute();
  
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
  await db.schema
  .alterTable('person')
  .dropColumn('phone')
  .execute();

  await db.schema
  .dropTable('wedding_event')
  .execute();
}
