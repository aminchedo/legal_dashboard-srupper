// Lightweight client-side wrappers around backend API for proxy analytics/testing

import { ProxyRecord, ProxyTestResult } from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

async function http<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, init);
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`API ${path} failed: ${res.status} ${text}`);
    }
    return res.json();
}

export const databaseService = {
    async addOrUpdateProxy(record: ProxyRecord): Promise<void> {
        await http('/proxy/upsert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(record)
        });
    },

    async addProxyTestResult(result: ProxyTestResult): Promise<void> {
        await http('/proxy/test-result', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(result)
        });
    },

    async listProxyTestResults(limit = 100): Promise<ProxyTestResult[]> {
        return http<ProxyTestResult[]>(`/proxy/test-results?limit=${limit}`);
    },

    async updateSiteLastScraped(url: string): Promise<void> {
        await http('/scraping/site-last-scraped', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });
    },
};
