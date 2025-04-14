import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('gallery_person')
    .addColumn('receive_messages', 'boolean', (col) => col.defaultTo(false))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('gallery_person')
    .dropColumn('receive_messages')
    .execute();
}
