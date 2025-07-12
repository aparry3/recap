import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('likes')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('media_id', 'varchar', (col) => col.references('media.id').notNull())
    .addColumn('person_id', 'varchar', (col) => col.references('person.id').notNull())
    .addColumn('created', 'timestamp', (col) => 
      col.defaultTo(sql`now()`).notNull()
    )
    .addUniqueConstraint('likes_media_person_unique', ['media_id', 'person_id'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropTable('likes')
    .execute();
}
