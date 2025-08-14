import Database from 'better-sqlite3';
import { DatabaseClient, DatabaseTransaction } from '@interfaces/database.interface';
import { config } from '@utils/config';
import { logger } from '@utils/logger';

class BetterSqliteTransaction implements DatabaseTransaction {
    private db: Database.Database;
    private inTransaction = false;
    constructor(db: Database.Database) {
        this.db = db;
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
    run(sql: string, params: unknown[] = []): void {
        this.db.prepare(sql).run(params);
    }
    transaction(): DatabaseTransaction {
        return new BetterSqliteTransaction(this.db);
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


