"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const database_service_1 = require("../../services/database.service");
const TEST_DB_PATH = path_1.default.resolve(process.cwd(), 'test-data', `test-db-${Date.now()}.sqlite`);
(0, globals_1.describe)('Database migrations', () => {
    (0, globals_1.beforeAll)(() => {
        const dir = path_1.default.dirname(TEST_DB_PATH);
        if (!fs_1.default.existsSync(dir))
            fs_1.default.mkdirSync(dir, { recursive: true });
        process.env.DATABASE_URL = TEST_DB_PATH;
    });
    (0, globals_1.test)('should apply all SQL migrations without error', async () => {
        const migrateModule = await Promise.resolve().then(() => __importStar(require('../../scripts/migrate')));
        const client = database_service_1.databaseService.getClient();
        const tables = client.query("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('documents','document_versions','documents_fts')");
        const tableNames = new Set(tables.map(t => t.name));
        (0, globals_1.expect)(tableNames.has('documents')).toBe(true);
        (0, globals_1.expect)(tableNames.has('document_versions')).toBe(true);
        try {
            fs_1.default.unlinkSync(TEST_DB_PATH);
        }
        catch { }
    });
});
//# sourceMappingURL=migrate.test.js.map