import * as path from 'path';
import { promises as fs } from 'fs';
import {
  Migrator,
  FileMigrationProvider,
} from 'kysely';
import { db } from './src/lib/db';

// Read the command-line argument (either 'up' or 'down')
const action = process.argv[2];

async function runMigration(action: string) {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.join(__dirname, './migrations'),
    }),
  });

  try {
    if (action === 'up') {
      const { error, results } = await migrator.migrateToLatest();
      results?.forEach((it) => {
        if (it.status === 'Success') {
          console.log(`migration "${it.migrationName}" was executed successfully`);
        } else if (it.status === 'Error') {
          console.error(`failed to execute migration "${it.migrationName}"`);
        }
      });

      if (error) {
        throw error;
      }
    } else if (action === 'down') {
      const { error, results } = await migrator.migrateDown();
      results?.forEach((it) => {
        if (it.status === 'Success') {
          console.log(`migration "${it.migrationName}" was rolled back successfully`);
        } else if (it.status === 'Error') {
          console.error(`failed to roll back migration "${it.migrationName}"`);
        }
      });

      if (error) {
        throw error;
      }
    } else {
      console.error('Invalid action. Use "up" or "down".');
      process.exit(1);
    }
  } catch (error) {
    console.error('Migration failed');
    console.error(error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

runMigration(action);
