"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const database_service_1 = require("../services/database.service");
const logger_1 = require("../utils/logger");
function runMigrations() {
    const db = database_service_1.databaseService.getClient();
    const dir = path_1.default.resolve(process.cwd(), 'src', 'scripts', 'migrations');
    const files = fs_1.default.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
    for (const file of files) {
        const sql = fs_1.default.readFileSync(path_1.default.join(dir, file), 'utf-8');
        logger_1.logger.info(`Applying migration ${file}`);
        db.run('BEGIN');
        try {
            sql
                .split(/^--\s.*$/m)
                .join('\n')
                .split(';')
                .map((s) => s.trim())
                .filter((s) => s.length > 0)
                .forEach((stmt) => db.run(stmt));
            db.run('COMMIT');
        }
        catch (e) {
            db.run('ROLLBACK');
            throw e;
        }
    }
}
try {
    runMigrations();
    logger_1.logger.info('Database migrations completed');
    process.exit(0);
}
catch (err) {
    logger_1.logger.error('Migration failed', err);
    process.exit(1);
}
//# sourceMappingURL=migrate.js.map