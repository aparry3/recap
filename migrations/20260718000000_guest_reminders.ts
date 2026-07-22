import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('gallery')
    .addColumn('timezone', 'varchar', (col) => col.notNull().defaultTo('America/New_York'))
    .execute()

  await db.schema
    .alterTable('verification')
    .addColumn('expires_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now() + interval '24 hours'`))
    .execute()

  await db.schema
    .createTable('communication_consent')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('gallery_id', 'varchar', (col) => col.references('gallery.id').onDelete('cascade').notNull())
    .addColumn('person_id', 'varchar', (col) => col.references('person.id').onDelete('cascade').notNull())
    .addColumn('channel', 'varchar', (col) => col.notNull())
    .addColumn('status', 'varchar', (col) => col.notNull())
    .addColumn('disclosure_version', 'varchar', (col) => col.notNull())
    .addColumn('source', 'varchar', (col) => col.notNull())
    .addColumn('ip_address', 'varchar')
    .addColumn('user_agent', 'text')
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addUniqueConstraint('communication_consent_gallery_person_channel_unique', ['gallery_id', 'person_id', 'channel'])
    .execute()

  await db.schema
    .createTable('communication_suppression')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('channel', 'varchar', (col) => col.notNull())
    .addColumn('destination_hash', 'varchar', (col) => col.notNull())
    .addColumn('reason', 'varchar', (col) => col.notNull())
    .addColumn('active', 'boolean', (col) => col.notNull().defaultTo(true))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addUniqueConstraint('communication_suppression_channel_destination_unique', ['channel', 'destination_hash'])
    .execute()

  await db.schema
    .createTable('communication_consent_event')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('consent_id', 'varchar', (col) => col.references('communication_consent.id').onDelete('cascade').notNull())
    .addColumn('gallery_id', 'varchar', (col) => col.references('gallery.id').onDelete('cascade').notNull())
    .addColumn('person_id', 'varchar', (col) => col.references('person.id').onDelete('cascade').notNull())
    .addColumn('channel', 'varchar', (col) => col.notNull())
    .addColumn('status', 'varchar', (col) => col.notNull())
    .addColumn('disclosure_version', 'varchar', (col) => col.notNull())
    .addColumn('source', 'varchar', (col) => col.notNull())
    .addColumn('ip_address', 'varchar')
    .addColumn('user_agent', 'text')
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .execute()

  await db.schema
    .createTable('reminder')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('gallery_id', 'varchar', (col) => col.references('gallery.id').onDelete('cascade').notNull())
    .addColumn('created_by', 'varchar', (col) => col.references('person.id').notNull())
    .addColumn('title', 'varchar', (col) => col.notNull())
    .addColumn('send_at', 'timestamptz')
    .addColumn('status', 'varchar', (col) => col.notNull().defaultTo('draft'))
    .addColumn('send_email', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('send_sms', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('email_subject', 'varchar')
    .addColumn('email_body', 'text')
    .addColumn('sms_body', 'text')
    .addColumn('source', 'varchar', (col) => col.notNull().defaultTo('manual'))
    .addColumn('source_details', 'jsonb')
    .addColumn('version', 'integer', (col) => col.notNull().defaultTo(1))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('sent_at', 'timestamptz')
    .execute()

  await db.schema
    .createIndex('reminder_due_index')
    .on('reminder')
    .columns(['status', 'send_at'])
    .execute()

  await db.schema
    .createTable('reminder_delivery')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('reminder_id', 'varchar', (col) => col.references('reminder.id').onDelete('cascade'))
    .addColumn('gallery_id', 'varchar', (col) => col.references('gallery.id').onDelete('cascade').notNull())
    .addColumn('person_id', 'varchar', (col) => col.references('person.id').onDelete('cascade').notNull())
    .addColumn('channel', 'varchar', (col) => col.notNull())
    .addColumn('purpose', 'varchar', (col) => col.notNull())
    .addColumn('status', 'varchar', (col) => col.notNull())
    .addColumn('provider_message_id', 'varchar')
    .addColumn('idempotency_key', 'varchar', (col) => col.notNull().unique())
    .addColumn('attempt_count', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('last_error', 'text')
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('submitted_at', 'timestamptz')
    .addColumn('delivered_at', 'timestamptz')
    .execute()

  await db.schema
    .createIndex('reminder_delivery_provider_message_index')
    .on('reminder_delivery')
    .column('provider_message_id')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('reminder_delivery_provider_message_index').ifExists().execute()
  await db.schema.dropTable('reminder_delivery').execute()
  await db.schema.dropIndex('reminder_due_index').ifExists().execute()
  await db.schema.dropTable('reminder').execute()
  await db.schema.dropTable('communication_consent_event').execute()
  await db.schema.dropTable('communication_suppression').execute()
  await db.schema.dropTable('communication_consent').execute()
  await db.schema.alterTable('verification').dropColumn('expires_at').execute()
  await db.schema.alterTable('gallery').dropColumn('timezone').execute()
}
