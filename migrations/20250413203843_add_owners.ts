import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('gallery')
        .addColumn('owners', sql`text[]`, (col) => col.notNull().defaultTo('{}'))
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('gallery')
        .dropColumn('owners')
        .execute()
} 