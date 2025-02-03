import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Migration code

    await db.schema
      .alterTable('gallery')
      .addColumn('zola', 'varchar')
      .addColumn('theknot', 'varchar')
      .execute();    
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
  await db.schema
  .alterTable('media')
  .dropColumn('zola')
  .dropColumn('theknot')
  .execute();
}
