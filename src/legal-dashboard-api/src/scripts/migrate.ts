import fs from 'fs';
import path from 'path';
import { databaseService } from '@services/database.service';
import { logger } from '@utils/logger';

function runMigrations(): void {
  const db = databaseService.getClient();
  const dir = path.resolve(process.cwd(), 'src', 'scripts', 'migrations');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
  for (const file of files) {
    const sql = fs.readFileSync(path.join(dir, file), 'utf-8');
    logger.info(`Applying migration ${file}`);
    db.run('BEGIN');
    try {
      sql
        .split(/^--\s.*$/m) // allow comments
        .join('\n')
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .forEach((stmt) => db.run(stmt));
      db.run('COMMIT');
    } catch (e) {
      db.run('ROLLBACK');
      throw e;
    }
  }
}

try {
  runMigrations();
  logger.info('Database migrations completed');
  process.exit(0);
} catch (err) {
  logger.error('Migration failed', err);
  process.exit(1);
}


