import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Migration code

    await db.schema
      .alterTable('media')
      .addColumn('uploaded', 'boolean', (col) => col.defaultTo(false))
      .execute();

      await db
      .updateTable('media')
      .set({uploaded: true})
      .execute();
    
      await db.schema
      .alterTable('media')
      .alterColumn('uploaded', col => col.setNotNull())
      .execute();
    
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
  await db.schema
  .alterTable('media')
  .dropColumn('uploaded')
  .execute();
}
