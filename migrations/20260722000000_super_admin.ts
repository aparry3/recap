import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('person')
    .addColumn('is_super_admin', 'boolean', (column) => column.defaultTo(false).notNull())
    .execute()

  // Preserve the existing convention that company-domain admins are platform operators.
  await db
    .updateTable('person')
    .set({is_super_admin: true})
    .where('is_admin', '=', true)
    .where('email', 'ilike', '%@ourweddingrecap.com')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('person')
    .dropColumn('is_super_admin')
    .execute()
}
