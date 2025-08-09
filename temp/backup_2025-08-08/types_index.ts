export interface ScrapedItem {
    id: string;
    url: string;
    title: string;
    content: string;
    domain: string;
    category: string;
    ratingScore: number;
    wordCount: number;
    createdAt: Date;
    status: 'completed' | 'processing' | 'failed';
}

export interface LegalSite {
    id: number;
    name: string;
    url: string;
    category: string;
    active: boolean;
    lastScraped?: Date;
}

export interface DatabaseStats {
    totalItems: number;
    categories: Record<string, number>;
    avgRating: number;
    topDomains: Record<string, number>;
    recentItems: number;
}

export interface ScrapingSettings {
    maxPages: number;
    delay: number;
    minContentLength: number;
    enableRating: boolean;
}

export type PageType = 'dashboard' | 'scraping' | 'data' | 'analytics';

