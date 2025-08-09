import { useState, useMemo, useEffect } from 'react';
import { Search, ExternalLink, Tag, Star, Calendar, FileText, Trash2 } from 'lucide-react';
import { useDocuments, useStatistics } from '../../hooks/useDatabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/apiClient';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';
import CategoryBadge from '../CategoryBadge';

const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
    },
  });
};

// A simple debounce hook
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function DataPage() {
  const [filters, setFilters] = useState({
    query: '',
    category: 'همه',
    source: 'همه',
    page: 1,
    limit: 25,
  });
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const debouncedQuery = useDebounce(filters.query, 300);

  const queryFilters = useMemo(() => ({
    ...filters,
    query: debouncedQuery,
    category: filters.category === 'همه' ? undefined : filters.category,
    source: filters.source === 'همه' ? undefined : filters.source,
  }), [filters, debouncedQuery]);

  const { data: documentsData, isLoading } = useDocuments(queryFilters as any);
  const { data: stats } = useStatistics();
  const deleteMutation = useDeleteDocument();

  const displayItems = documentsData?.items || [];
  const pagination = documentsData?.pagination;

  const handleDeleteItem = async (id: string) => {
    if (confirm('آیا از حذف این آیتم اطمینان دارید؟')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">داده‌های جمع‌آوری شده</h1>
        <p className="text-gray-600">جستجو و مدیریت اطلاعات حقوقی جمع‌آوری شده</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="جستجو در عناوین..."
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="همه">همه دسته‌بندی‌ها</option>
              {stats && Object.keys(stats.categories).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Domain Filter */}
          <div>
            <select
              value={filters.source}
              onChange={(e) => handleFilterChange('source', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="همه">همه منابع</option>
              {stats && Object.keys(stats.topDomains).map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>

          {/* Limit */}
          <div>
            <select
              value={filters.limit}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={25}>25 آیتم</option>
              <option value={50}>50 آیتم</option>
              <option value={100}>100 آیتم</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-600">
          <FileText size={20} />
          {pagination && (
            <span>
              نمایش {displayItems.length.toLocaleString('fa-IR')} آیتم از {pagination.totalItems.toLocaleString('fa-IR')} نتیجه
            </span>
          )}
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-4">
            {[...Array(filters.limit)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : displayItems.length === 0 ? (
          // Empty state
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <FileText size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ آیتمی یافت نشد</h3>
            <p className="text-gray-500">
              {filters.query ? 'جستجوی شما نتیجه‌ای نداشت' : 'هنوز آیتمی جمع‌آوری نشده است'}
            </p>
          </div>
        ) : (
          // Items
          displayItems.map((item: any) => {
            const isExpanded = expandedItems.has(item.id);

            return (
              <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <ExternalLink size={14} />
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 truncate max-w-48"
                        >
                          {item.domain}
                        </a>
                      </div>

                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{format(new Date(item.createdAt), 'yyyy/MM/dd', { locale: faIR })}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Star size={14} />
                        <span>{(item.ratingScore * 100).toFixed(0)}%</span>
                      </div>

                      <div className="text-gray-400">
                        {item.wordCount.toLocaleString('fa-IR')} کلمه
                      </div>
                    </div>

                    {/* Category Tag */}
                    <div className="flex items-center gap-2 mb-4">
                      <CategoryBadge
                        category={item.category}
                        icon={<Tag size={14} />}
                        color="#3B82F6"
                        variant="filled"
                        size="md"
                      />
                    </div>

                    {/* Content Preview */}
                    <div className="text-gray-700 leading-relaxed">
                      {isExpanded ? (
                        <div className="whitespace-pre-wrap">{item.content}</div>
                      ) : (
                        <div>
                          {item.content.slice(0, 300)}
                          {item.content.length > 300 && '...'}
                        </div>
                      )}

                      {item.content.length > 300 && (
                        <button
                          onClick={() => toggleExpanded(item.id)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm mt-2"
                        >
                          {isExpanded ? 'نمایش کمتر' : 'نمایش بیشتر'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="مشاهده اصل"
                    >
                      <ExternalLink size={18} />
                    </a>

                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => handleFilterChange('page', filters.page - 1)}
            disabled={filters.page === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50"
          >
            قبلی
          </button>
          <span className="text-gray-700">
            صفحه {filters.page.toLocaleString('fa-IR')} از {pagination.totalPages.toLocaleString('fa-IR')}
          </span>
          <button
            onClick={() => handleFilterChange('page', filters.page + 1)}
            disabled={filters.page === pagination.totalPages}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50"
          >
            بعدی
          </button>
        </div>
      )}
    </div>
  );
}