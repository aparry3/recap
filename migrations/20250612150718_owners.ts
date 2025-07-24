import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('gallery_person')
    .addColumn('owner', 'boolean', (col) => col.notNull().defaultTo(false))
    .execute()

    await db.schema
    .alterTable('gallery')
    .addColumn('owners', sql`text[]`, (col) => col.notNull().defaultTo(sql`'{}'`))
    .execute()

}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('gallery_person')
    .dropColumn('owner')
    .execute()

    await db.schema
    .alterTable('gallery')
    .dropColumn('owners')
    .execute()

}
