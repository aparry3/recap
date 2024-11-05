import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
  .createTable('person')
  .addColumn('id', 'varchar', (col) => col.primaryKey())
  .addColumn('name', 'varchar', (col) => col.notNull())
  .addColumn('email', 'varchar')
  .execute();

  await db.schema
  .createTable('gallery')
  .addColumn('id', 'varchar', (col) => col.primaryKey())
  .addColumn('name', 'varchar', (col) => col.notNull())
  .addColumn('path', 'varchar', (col) => col.notNull())
  .addColumn('date', 'date')
  .addColumn('person_id', 'varchar', (col) => col.references('person.id').notNull())
  .execute();

  await db.schema
    .createTable('album')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('date', 'date')
    .addColumn('gallery_id', 'varchar', (col) => col.notNull().references('gallery.id'))
    .execute();

  await db.schema
    .createTable('media')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('content_type', 'varchar', (col) => col.notNull())
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('key', 'varchar', (col) => col.notNull())
    .addColumn('height', 'integer')
    .addColumn('width', 'integer')
    .addColumn('person_id', 'varchar', (col) => col.notNull().references('person.id'))
    .addColumn('latitude', 'float8')
    .addColumn('longitude', 'float8')
    .execute();

  await db.schema
    .createTable('tag')
    .addColumn('person_id', 'varchar', (col) => col.references('person.id'))
    .addColumn('media_id', 'varchar', (col) => col.references('media.id'))
    .addPrimaryKeyConstraint('tag_pk', ['person_id', 'media_id'])
    .execute();

  await db.schema
    .createTable('gallery_media')
    .addColumn('gallery_id', 'varchar', (col) => col.references('gallery.id'))
    .addColumn('media_id', 'varchar', (col) => col.references('media.id'))
    .addPrimaryKeyConstraint('gallery_media_pk', ['gallery_id', 'media_id'])
    .execute();

    await db.schema
    .createTable('gallery_person')
    .addColumn('gallery_id', 'varchar', (col) => col.references('gallery.id'))
    .addColumn('person_id', 'varchar', (col) => col.references('person.id'))
    .addPrimaryKeyConstraint('gallery_person_pk', ['gallery_id', 'person_id'])
    .execute();


  await db.schema
    .createTable('album_media')
    .addColumn('album_id', 'varchar', (col) => col.references('album.id'))
    .addColumn('media_id', 'varchar', (col) => col.references('media.id'))
    .addPrimaryKeyConstraint('album_media_pk', ['album_id', 'media_id'])
    .execute();


}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('album_media').execute();
  await db.schema.dropTable('gallery_media').execute();
  await db.schema.dropTable('gallery_person').execute();
  await db.schema.dropTable('tag').execute();
  await db.schema.dropTable('media').execute();
  await db.schema.dropTable('album').execute();
  await db.schema.dropTable('gallery').execute();
  await db.schema.dropTable('person').execute();
}