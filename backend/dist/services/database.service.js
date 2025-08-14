"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseService = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const config_1 = require("@utils/config");
const logger_1 = require("@utils/logger");
class BetterSqliteTransaction {
    constructor(db) {
        this.inTransaction = false;
        this.db = db;
    }
    query(sql, params = []) {
        return this.db.prepare(sql).all(params);
    }
    run(sql, params = []) {
        const result = this.db.prepare(sql).run(params);
        return { changes: result.changes, lastInsertRowid: Number(result.lastInsertRowid) };
    }
    begin() {
        if (this.inTransaction)
            return;
        this.db.prepare('BEGIN').run();
        this.inTransaction = true;
    }
    commit() {
        if (!this.inTransaction)
            return;
        this.db.prepare('COMMIT').run();
        this.inTransaction = false;
    }
    rollback() {
        if (!this.inTransaction)
            return;
        this.db.prepare('ROLLBACK').run();
        this.inTransaction = false;
    }
}
class BetterSqliteClient {
    constructor(file) {
        this.db = new better_sqlite3_1.default(file);
        this.db.pragma('journal_mode = WAL');
        this.db.pragma('synchronous = NORMAL');
    }
    query(sql, params = []) {
        return this.db.prepare(sql).all(params);
    }
    run(sql, params = []) {
        const result = this.db.prepare(sql).run(params);
        return { changes: result.changes, lastInsertRowid: Number(result.lastInsertRowid) };
    }
    prepare(sql) {
        return this.db.prepare(sql);
    }
    transaction(callback) {
        if (callback) {
            const tx = new BetterSqliteTransaction(this.db);
            tx.begin();
            try {
                const result = callback(tx);
                tx.commit();
                return result;
            }
            catch (error) {
                tx.rollback();
                throw error;
            }
        }
        else {
            return new BetterSqliteTransaction(this.db);
        }
    }
    close() {
        this.db.close();
    }
}
class DatabaseService {
    constructor() {
        logger_1.logger.info(`Connecting to SQLite at ${config_1.config.DATABASE_URL}`);
        this.client = new BetterSqliteClient(config_1.config.DATABASE_URL);
    }
    getClient() {
        return this.client;
    }
}
exports.databaseService = new DatabaseService();
//# sourceMappingURL=database.service.js.map