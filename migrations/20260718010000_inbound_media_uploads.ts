import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('gallery_person')
    .addColumn('joined_at', 'timestamptz')
    .execute()

  await sql`
    update gallery_person
    set joined_at = coalesce(
      (select gallery.created from gallery where gallery.id = gallery_person.gallery_id),
      now()
    )
  `.execute(db)

  await db.schema
    .alterTable('gallery_person')
    .alterColumn('joined_at', (column) => column.setDefault(sql`now()`))
    .execute()

  await db.schema
    .alterTable('gallery_person')
    .alterColumn('joined_at', (column) => column.setNotNull())
    .execute()

  await db.schema
    .createIndex('gallery_person_latest_gallery_index')
    .on('gallery_person')
    .columns(['person_id', 'joined_at'])
    .execute()

  await db.schema
    .alterTable('media')
    .addColumn('source', 'varchar')
    .addColumn('source_id', 'varchar')
    .execute()

  await db.schema
    .createIndex('media_inbound_source_unique')
    .unique()
    .on('media')
    .columns(['source', 'source_id'])
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('media_inbound_source_unique').ifExists().execute()
  await db.schema.alterTable('media').dropColumn('source_id').dropColumn('source').execute()
  await db.schema.dropIndex('gallery_person_latest_gallery_index').ifExists().execute()
  await db.schema.alterTable('gallery_person').dropColumn('joined_at').execute()
}
