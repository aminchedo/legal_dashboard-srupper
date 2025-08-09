"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_service_1 = require("../services/database.service");
const uuid_1 = require("uuid");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const moment_1 = __importDefault(require("moment"));
const logger_1 = require("../utils/logger");
async function seed() {
    const db = database_service_1.databaseService.getClient();
    try {
        db.run(`ALTER TABLE scraping_sources ADD COLUMN url TEXT`);
    }
    catch { }
    try {
        db.run(`ALTER TABLE scraping_sources ADD COLUMN category TEXT`);
    }
    catch { }
    try {
        db.run(`ALTER TABLE scraping_sources ADD COLUMN priority INTEGER DEFAULT 2`);
    }
    catch { }
    try {
        db.run(`ALTER TABLE scraping_sources ADD COLUMN status TEXT DEFAULT 'active'`);
    }
    catch { }
    const adminEmail = 'admin@example.com';
    const existing = db.query('SELECT COUNT(1) as count FROM users WHERE email = ?', [adminEmail]);
    if (existing[0]?.count) {
        logger_1.logger.info('Seed: admin already exists');
        return;
    }
    const id = (0, uuid_1.v4)();
    const hash = await bcryptjs_1.default.hash('Admin#12345', 10);
    db.run('INSERT INTO users (id, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)', [
        id,
        adminEmail,
        hash,
        'admin',
        (0, moment_1.default)().toISOString(),
    ]);
    logger_1.logger.info('Seed: admin user created');
    const mandatorySources = [
        { name: 'سامانه ملی قوانین و مقررات', url: 'https://qavanin.ir', priority: 1, category: 'official_laws', status: 'active' },
        { name: 'روزنامه رسمی جمهوری اسلامی ایران', url: 'https://rrk.ir', priority: 1, category: 'official_gazette', status: 'active' },
        { name: 'مجلس شورای اسلامی', url: 'https://majlis.ir', priority: 1, category: 'parliament', status: 'active' },
        { name: 'دولت جمهوری اسلامی ایران', url: 'https://dolat.ir', priority: 1, category: 'government', status: 'active' },
        { name: 'قوه قضائیه', url: 'https://dadgostari.ir', priority: 1, category: 'judiciary', status: 'active' },
        { name: 'مرکز پژوهش‌های مجلس', url: 'https://rc.majlis.ir', priority: 1, category: 'research', status: 'active' },
        { name: 'شورای نگهبان', url: 'https://shura-gc.ir', priority: 2, category: 'constitutional', status: 'active' },
        { name: 'وزارت دادگستری', url: 'https://moj.ir', priority: 2, category: 'ministry', status: 'active' },
    ];
    const nowIso = (0, moment_1.default)().toISOString();
    for (const src of mandatorySources) {
        const exists = db.query('SELECT COUNT(1) as count FROM scraping_sources WHERE url = ? OR base_url = ?', [src.url, src.url])[0]?.count || 0;
        if (!exists) {
            const id = (0, uuid_1.v4)();
            const selectors = { content: 'article, main, .content, #content', title: 'h1, title', date: 'time, .date, .publish-date', next_page: 'a[rel="next"], .pagination a.next, .next a' };
            db.run(`INSERT INTO scraping_sources (id, name, base_url, url, category, priority, status, selectors, headers, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [id, src.name, src.url, src.url, src.category, src.priority, src.status, JSON.stringify(selectors), null, nowIso, null]);
            logger_1.logger.info(`Seed: inserted scraping source ${src.name} (${src.url})`);
        }
    }
}
seed().then(() => process.exit(0)).catch((err) => {
    logger_1.logger.error('Seed failed', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map