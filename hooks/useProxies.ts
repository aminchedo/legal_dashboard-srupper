// Minimal proxy hooks to satisfy imports and integrate with backend API
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProxyRecord, ProxyType, ProxyRotationSettings } from '../types';

const apiBase = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export function useProxies(filters: { query?: string; status?: ProxyRecord['status'][]; types?: ProxyType[]; countries?: string[] }) {
    return useQuery<ProxyRecord[]>({
        queryKey: ['proxies', filters],
        queryFn: async () => {
            const url = new URL(`${apiBase}/proxy/list`);
            if (filters.query) url.searchParams.set('q', filters.query);
            const res = await fetch(url.toString());
            if (!res.ok) return [];
            return res.json();
        },
        initialData: [],
    });
}

export function useProxyUpsert() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (record: ProxyRecord) => {
            const res = await fetch(`${apiBase}/proxy/upsert`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(record)
            });
            if (!res.ok) throw new Error('Failed to upsert proxy');
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['proxies'] })
    });
}

export function useProxyDelete() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`${apiBase}/proxy/${encodeURIComponent(id)}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete proxy');
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['proxies'] })
    });
}

export function useProxyBulkImport() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (rawList: string) => {
            const res = await fetch(`${apiBase}/proxy/import`, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: rawList });
            if (!res.ok) throw new Error('Failed to import proxies');
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['proxies'] })
    });
}

export function useRotationSettings() {
    return useQuery<ProxyRotationSettings | null>({
        queryKey: ['proxyRotationSettings'],
        queryFn: async () => {
            const res = await fetch(`${apiBase}/proxy/rotation-settings`);
            if (!res.ok) return {
                strategy: 'sequential',
                intervalSeconds: 0,
                requestsPerProxy: 10,
                failureThreshold: 3,
                stickySessionSeconds: 0,
                siteSpecificAssignments: {},
                geoRestrictions: {},
            } as ProxyRotationSettings;
            return res.json();
        }
    });
}

export function useSaveRotationSettings() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (settings: ProxyRotationSettings) => {
            const res = await fetch(`${apiBase}/proxy/rotation-settings`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
            if (!res.ok) throw new Error('Failed to save rotation settings');
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['proxyRotationSettings'] })
    });
}


