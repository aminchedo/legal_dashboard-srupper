import Database from 'better-sqlite3';
import { DatabaseClient, DatabaseTransaction } from '../types/database.types';
import { config } from '@utils/config';
import { logger } from '@utils/logger';

class BetterSqliteTransaction implements DatabaseTransaction {
    private db: Database.Database;
    private inTransaction = false;
    constructor(db: Database.Database) {
        this.db = db;
    }
    query<T = unknown>(sql: string, params: unknown[] = []): T[] {
        return this.db.prepare(sql).all(params) as T[];
    }
    run(sql: string, params: unknown[] = []): { changes: number; lastInsertRowid: number } {
        const result = this.db.prepare(sql).run(params);
        return { changes: result.changes, lastInsertRowid: Number(result.lastInsertRowid) };
    }
    begin(): void {
        if (this.inTransaction) return;
        this.db.prepare('BEGIN').run();
        this.inTransaction = true;
    }
    commit(): void {
        if (!this.inTransaction) return;
        this.db.prepare('COMMIT').run();
        this.inTransaction = false;
    }
    rollback(): void {
        if (!this.inTransaction) return;
        this.db.prepare('ROLLBACK').run();
        this.inTransaction = false;
    }
}

class BetterSqliteClient implements DatabaseClient {
    private db: Database.Database;
    constructor(file: string) {
        this.db = new Database(file);
        this.db.pragma('journal_mode = WAL');
        this.db.pragma('synchronous = NORMAL');
    }
    query<T = unknown>(sql: string, params: unknown[] = []): T[] {
        return this.db.prepare(sql).all(params) as T[];
    }
    run(sql: string, params: unknown[] = []): { changes: number; lastInsertRowid: number } {
        const result = this.db.prepare(sql).run(params);
        return { changes: result.changes, lastInsertRowid: Number(result.lastInsertRowid) };
    }
    prepare(sql: string) {
        return this.db.prepare(sql);
    }
    transaction<T>(callback?: (tx: DatabaseTransaction) => T): T | DatabaseTransaction {
        if (callback) {
            // Callback-style transaction
            const tx = new BetterSqliteTransaction(this.db);
            tx.begin();
            try {
                const result = callback(tx);
                tx.commit();
                return result;
            } catch (error) {
                tx.rollback();
                throw error;
            }
        } else {
            // Return transaction object for imperative style
            return new BetterSqliteTransaction(this.db);
        }
    }
    close(): void {
        this.db.close();
    }
}

class DatabaseService {
    private client: DatabaseClient;
    constructor() {
        logger.info(`Connecting to SQLite at ${config.DATABASE_URL}`);
        this.client = new BetterSqliteClient(config.DATABASE_URL);
    }
    getClient(): DatabaseClient {
        return this.client;
    }
}

export const databaseService = new DatabaseService();


