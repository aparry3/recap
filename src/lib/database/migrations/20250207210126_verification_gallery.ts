import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Migration code

    await db.schema
      .alterTable('verification')
      .addColumn('gallery_id', 'varchar')
      .execute(); 
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
  await db.schema
  .alterTable('verification')
  .dropColumn('gallery_id')
  .execute();
  }
