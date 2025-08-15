import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';

export interface DocumentFilters {
  query?: string;
  category?: string;
  source?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CursorPage<T> {
  items: T[];
  next_cursor?: string; // base64
  has_more: boolean;
}

export function useDocumentsCursor<T = any>(filters: DocumentFilters, pageSize: number = 25) {
  const queryClient = useQueryClient();
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [pages, setPages] = useState<T[][]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setCursor(undefined);
    setPages([]);
    setHasMore(true);
    setError(null);
  }, []);

  useEffect(() => {
    reset();
  }, [filters.query, filters.category, filters.source, filters.status, filters.dateFrom, filters.dateTo, JSON.stringify(filters.tags), filters.sortBy, filters.sortOrder, reset]);

  const loadNext = useCallback(async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.listDocumentsCursor({ ...filters, limit: pageSize, cursor });
      setPages(prev => [...prev, res.items as T[]]);
      setCursor(res.next_cursor);
      setHasMore(!!res.has_more);
    } catch (e: any) {
      setError(e?.message || 'خطا در بارگذاری');
    } finally {
      setIsLoading(false);
    }
  }, [filters, pageSize, cursor, hasMore, isLoading]);

  const items = useMemo(() => pages.flat(), [pages]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['documents-cursor', filters] });

  return { items, isLoading, error, hasMore, loadNext, reset, invalidate } as const;
}