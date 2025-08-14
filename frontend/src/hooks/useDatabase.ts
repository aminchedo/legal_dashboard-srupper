import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import { ScrapedItem, DatabaseStats } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem('accessToken');
  const headers = { ...init?.headers, Authorization: `Bearer ${token}` };
  const res = await fetch(url, { ...init, headers });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

// General database information hook
export const useDatabase = () => {
  return useQuery({
    queryKey: ['database'],
    queryFn: () => apiClient.getAnalytics(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      // Don't retry on connection refused errors
      if (error?.message?.includes('ERR_CONNECTION_REFUSED')) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });
};

// Re-implement useDocuments to use apiClient
export const useDocuments = (filters: { page?: number; limit?: number; status?: string; category?: string; source?: string, query?: string } = {}) => {
  return useQuery({
    queryKey: ['documents', filters],
    queryFn: () => apiClient.getDocuments(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on connection refused errors
      if (error?.message?.includes('ERR_CONNECTION_REFUSED')) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });
};

export const useStatistics = () => {
  return useQuery<DatabaseStats>({
    queryKey: ['statistics'],
    queryFn: () => apiClient.getAnalytics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on connection refused errors
      if (error?.message?.includes('ERR_CONNECTION_REFUSED')) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: 1000,
    // Show cached data while fetching
    refetchOnWindowFocus: false,
  });
};

export const useScrapingStats = () => {
  return useQuery({
    queryKey: ['scrapingStats'],
    queryFn: () => apiClient.getScrapingStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      // Don't retry on connection refused errors
      if (error?.message?.includes('ERR_CONNECTION_REFUSED')) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    refetchInterval: 10000, // Refetch every 10 seconds (reduced from 5)
  });
};

export const useScrapingJobs = (params?: { page?: number; limit?: number; status?: string }) => {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.status) query.set('status', params.status);
  const url = `${API_BASE}/scraping/status?${query.toString()}`;
  return useQuery({ queryKey: ['scrapingJobs', params], queryFn: () => fetchJson<{ jobs: any[]; pagination: any }>(url), refetchInterval: 3000 });
};

export const useScrapingSources = () => {
  return useQuery<{ sources: any[]; count: number }>({
    queryKey: ['scrapingSources'],
    queryFn: () => apiClient.listScrapingSources(),
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.message?.includes('ERR_CONNECTION_REFUSED')) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });
};

export const useScrapedItems = (limit = 10) => {
  return useQuery<ScrapedItem[]>({
    queryKey: ['recentItems', limit],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/documents?limit=${limit}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}` },
      });
      if (!res.ok) throw new Error('Failed to load recent items');
      const data = await res.json();
      return data.items || [];
    },
    staleTime: 60 * 1000,
  });
};
