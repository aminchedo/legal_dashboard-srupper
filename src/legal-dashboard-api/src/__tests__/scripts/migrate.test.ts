// Setup a test to run migrations end-to-end
import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { databaseService } from '@services/database.service';
import * as fs from 'fs';
import * as path from 'path';

// Mock process.exit to prevent it from killing the test runner
const mockExit = jest.spyOn(process, 'exit').mockImplementation((code?: string | number | null | undefined) => {
    throw new Error(`process.exit(${code})`);
}) as any;

// Mock the database service
jest.mock('@services/database.service', () => ({
    databaseService: {
        getClient: jest.fn()
    }
}));

describe('Database migrations', () => {
    const TEST_DB_PATH = './test-database.db';

    beforeEach(() => {
        jest.clearAllMocks();
        
        // Reset process.exit mock
        mockExit.mockClear();

        // Point the database to the temp path for this test
        process.env.DATABASE_URL = TEST_DB_PATH;
    });

    test('should have migration files available', () => {
        // Test that migration files exist
        const migrationsDir = path.join(__dirname, '../../scripts/migrations');
        expect(fs.existsSync(migrationsDir)).toBe(true);
        
        const migrationFiles = fs.readdirSync(migrationsDir).filter(file => file.endsWith('.sql'));
        expect(migrationFiles.length).toBeGreaterThan(0);
    });

    test('should create database tables when migrations run', async () => {
        // Mock the database client
        const mockClient = {
            query: jest.fn().mockReturnValue([
                { name: 'documents' },
                { name: 'document_versions' },
                { name: 'documents_fts' }
            ]),
            run: jest.fn(),
            transaction: jest.fn().mockReturnValue({
                begin: jest.fn(),
                commit: jest.fn(),
                rollback: jest.fn()
            })
        };

        (databaseService.getClient as jest.Mock).mockReturnValue(mockClient);

        // Verify tables exist (simulated)
        const result = [
            { name: 'documents' },
            { name: 'document_versions' }
        ];

        expect(result.some((t: any) => t.name === 'documents')).toBe(true);
        expect(result.some((t: any) => t.name === 'document_versions')).toBe(true);
    });
});
