import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('galleryPerson')
    .addColumn('ownerType', 'text', col => col.nullable())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('galleryPerson')
    .dropColumn('ownerType')
    .execute()
}
