import Dexie, { Table } from 'dexie';
import { ScrapedItem, LegalSite, DatabaseStats } from '../types';

class LegalDashboardDB extends Dexie {
    scrapedItems!: Table<ScrapedItem>;
    legalSites!: Table<LegalSite>;

    constructor() {
        super('LegalDashboardDB');

        this.version(1).stores({
            scrapedItems: 'id, url, domain, category, ratingScore, createdAt, status',
            legalSites: '++id, name, url, category, active, lastScraped'
        });
    }
}

const db = new LegalDashboardDB();

// Initialize sample legal sites
const initializeSampleSites = async () => {
    const count = await db.legalSites.count();
    if (count === 0) {
        const sampleSites: Omit<LegalSite, 'id'>[] = [
            { name: 'دادگستری کل کشور', url: 'https://www.dadgostary.gov.ir', category: 'دادگستری', active: true },
            { name: 'قوانین و مقررات', url: 'https://qavanin.ir', category: 'قانون', active: true },
            { name: 'مرکز پژوهش‌های مجلس', url: 'https://rc.majlis.ir', category: 'پژوهش', active: true },
            { name: 'دیوان عدالت اداری', url: 'https://www.adliran.ir', category: 'عدالت اداری', active: true },
            { name: 'معاونت حقوقی رئیس‌جمهور', url: 'https://lawful.president.ir', category: 'حقوقی', active: true },
            { name: 'کانون وکلای دادگستری', url: 'https://www.iranbar.org', category: 'وکالت', active: true },
            { name: 'سازمان ثبت اسناد', url: 'https://www.sabteahval.ir', category: 'ثبت', active: true },
            { name: 'مرکز وکلا', url: 'https://www.markaz-vokala.ir', category: 'وکالت', active: true },
            { name: 'حقوق‌دان', url: 'https://www.hoquqdan.com', category: 'آموزش', active: true },
            { name: 'بانک اطلاعات حقوقی', url: 'https://dastour.ir', category: 'منابع', active: true }
        ];

        await db.legalSites.bulkAdd(sampleSites);
    }
};

// Initialize database
initializeSampleSites();

export const databaseService = {
    // Scraped Items
    async addScrapedItem(item: ScrapedItem): Promise<void> {
        await db.scrapedItems.put(item);
    },

    async getScrapedItems(limit = 100, category?: string): Promise<ScrapedItem[]> {
        let collection = db.scrapedItems.orderBy('createdAt').reverse();

        if (category) {
            collection = collection.filter(item => item.category === category);
        }

        return collection.limit(limit).toArray();
    },

    async searchScrapedItems(searchTerm: string, limit = 100): Promise<ScrapedItem[]> {
        return db.scrapedItems
            .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .limit(limit)
            .toArray();
    },

    async deleteScrapedItem(id: string): Promise<void> {
        await db.scrapedItems.delete(id);
    },

    async clearScrapedItems(): Promise<void> {
        await db.scrapedItems.clear();
    },

    // Legal Sites
    async getLegalSites(): Promise<LegalSite[]> {
        // 'active' is a boolean; query using true to avoid type mismatch
        return db.legalSites.where('active').equals(true).toArray();
    },

    async updateSiteLastScraped(url: string): Promise<void> {
        const site = await db.legalSites.where('url').equals(url).first();
        if (site) {
            await db.legalSites.update(site.id, { lastScraped: new Date() });
        }
    },

    // Statistics
    async getStatistics(): Promise<DatabaseStats> {
        const items = await db.scrapedItems.toArray();

        const categories: Record<string, number> = {};
        const domains: Record<string, number> = {};
        let totalRating = 0;
        let ratedItems = 0;

        items.forEach(item => {
            // Categories
            categories[item.category] = (categories[item.category] || 0) + 1;

            // Domains
            domains[item.domain] = (domains[item.domain] || 0) + 1;

            // Rating
            if (item.ratingScore > 0) {
                totalRating += item.ratingScore;
                ratedItems++;
            }
        });

        // Recent items (last 24 hours)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const recentItems = items.filter(item => item.createdAt > yesterday).length;

        // Sort domains by count
        const topDomains = Object.fromEntries(
            Object.entries(domains)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
        );

        return {
            totalItems: items.length,
            categories,
            avgRating: ratedItems > 0 ? totalRating / ratedItems : 0,
            topDomains,
            recentItems
        };
    }
};

export default db;

