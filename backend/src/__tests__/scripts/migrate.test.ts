// Setup a test to run migrations end-to-end
import { describe, expect, test, beforeAll } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { databaseService } from '@services/database.service';

// Helper to set DB URL before importing migrate script
const TEST_DB_PATH = path.resolve(process.cwd(), 'test-data', `test-db-${Date.now()}.sqlite`);

describe('Database migrations', () => {
    beforeAll(() => {
        // Ensure test-data dir exists
        const dir = path.dirname(TEST_DB_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        // Point the database to the temp path for this test
        process.env.DATABASE_URL = TEST_DB_PATH;
    });

    test('should apply all SQL migrations without error', async () => {
        // Dynamically import the migrate runner so it picks up env
        const migrateModule = await import('@scripts/migrate');
        // If it reaches here without throwing, database should be initialized

        // Verify some core tables exist
        const client = databaseService.getClient();
        const tables = client.query<{ name: string }>(
            "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('documents','document_versions','documents_fts')"
        );

        const tableNames = new Set(tables.map(t => t.name));
        expect(tableNames.has('documents')).toBe(true);
        expect(tableNames.has('document_versions')).toBe(true);

        // Clean up (close file will be handled by better-sqlite3 when process exits)
        // Optionally remove file
        try { fs.unlinkSync(TEST_DB_PATH); } catch { }
    });
});
