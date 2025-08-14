import { databaseService } from '@services/database.service';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';
import moment from 'moment';
import { logger } from '@utils/logger';

async function seed(): Promise<void> {
    const db = databaseService.getClient();
    // Ensure scraping_sources table has required columns; if not, try to add them (tolerate errors if exist)
    try {
        db.run(`ALTER TABLE scraping_sources ADD COLUMN url TEXT`);
    } catch {
        // Column already exists, ignore error
    }
    try { db.run(`ALTER TABLE scraping_sources ADD COLUMN category TEXT`); } catch {
        // Column already exists, ignore error
    }
    try { db.run(`ALTER TABLE scraping_sources ADD COLUMN priority INTEGER DEFAULT 2`); } catch {
        // Column already exists, ignore error
    }
    try { db.run(`ALTER TABLE scraping_sources ADD COLUMN status TEXT DEFAULT 'active'`); } catch {
        // Column already exists, ignore error
    }
    const adminEmail = 'admin@example.com';
    const existing = db.query<{ count: number }>('SELECT COUNT(1) as count FROM users WHERE email = ?', [adminEmail]);
    if (existing[0]?.count) {
        logger.info('Seed: admin already exists');
        return;
    }
    const id = uuid();
    const hash = await bcrypt.hash('Admin#12345', 10);
    db.run('INSERT INTO users (id, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)', [
        id,
        adminEmail,
        hash,
        'admin',
        moment().toISOString(),
    ]);
    logger.info('Seed: admin user created');

    // Seed mandatory Iranian legal sources if missing
    const mandatorySources: Array<{ name: string; url: string; priority: number; category: string; status: string }> = [
        { name: 'سامانه ملی قوانین و مقررات', url: 'https://qavanin.ir', priority: 1, category: 'official_laws', status: 'active' },
        { name: 'روزنامه رسمی جمهوری اسلامی ایران', url: 'https://rrk.ir', priority: 1, category: 'official_gazette', status: 'active' },
        { name: 'مجلس شورای اسلامی', url: 'https://majlis.ir', priority: 1, category: 'parliament', status: 'active' },
        { name: 'دولت جمهوری اسلامی ایران', url: 'https://dolat.ir', priority: 1, category: 'government', status: 'active' },
        { name: 'قوه قضائیه', url: 'https://dadgostari.ir', priority: 1, category: 'judiciary', status: 'active' },
        { name: 'مرکز پژوهش‌های مجلس', url: 'https://rc.majlis.ir', priority: 1, category: 'research', status: 'active' },
        { name: 'شورای نگهبان', url: 'https://shura-gc.ir', priority: 2, category: 'constitutional', status: 'active' },
        { name: 'وزارت دادگستری', url: 'https://moj.ir', priority: 2, category: 'ministry', status: 'active' },
    ];
    const nowIso = moment().toISOString();
    for (const src of mandatorySources) {
        const exists = db.query<{ count: number }>(
            'SELECT COUNT(1) as count FROM scraping_sources WHERE url = ? OR base_url = ?',
            [src.url, src.url]
        )[0]?.count || 0;
        if (!exists) {
            const id = uuid();
            const selectors = { content: 'article, main, .content, #content', title: 'h1, title', date: 'time, .date, .publish-date', next_page: 'a[rel="next"], .pagination a.next, .next a' };
            db.run(
                `INSERT INTO scraping_sources (id, name, base_url, url, category, priority, status, selectors, headers, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [id, src.name, src.url, src.url, src.category, src.priority, src.status, JSON.stringify(selectors), null, nowIso, null]
            );
            logger.info(`Seed: inserted scraping source ${src.name} (${src.url})`);
        }
    }
}

seed().then(() => process.exit(0)).catch((err) => {
    logger.error('Seed failed', err);
    process.exit(1);
});


