import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Migration code

    await db.schema
      .alterTable('media')
      .addColumn('is_private', 'boolean', (col) => col.defaultTo(false))
      .execute(); 
    await db.schema
    .alterTable('album')
    .addColumn('is_private', 'boolean', (col) => col.defaultTo(false))
    .execute();       
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
  await db.schema
  .alterTable('media')
  .dropColumn('is_private')
  .execute();
  
  await db.schema
  .alterTable('album')
  .dropColumn('is_private')
  .execute();

}
