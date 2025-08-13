import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  FileText, 
  Grid, 
  List, 
  Plus, 
  Settings, 
  TrendingUp,
  Clock,
  User,
  ExternalLink,
  Tag,
  Star,
  Calendar,
  Eye,
  Edit3,
  Trash2,
  Check,
} from 'lucide-react';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';

import { apiClient } from '../../services/apiClient';
import AdvancedDocumentFilter from '../../components/Documents/AdvancedDocumentFilter';
import BulkOperationsBar from '../../components/Documents/BulkOperationsBar';
import DocumentPreview from '../../components/Documents/DocumentPreview';
import ImportExportModal from '../../components/Documents/ImportExportModal';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

type ViewMode = 'grid' | 'list';

interface FilterState {
  query: string;
  category: string;
  source: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  tags: string[];
  minScore: number | null;
  maxScore: number | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

interface DocumentItem {
  id: string;
  title: string;
  content: string;
  category: string;
  source: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  score: number;
  url?: string;
  wordCount: number;
  readingTime: number;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
  createdBy: string;
  tags: Array<{ id: string; name: string; color?: string }>;
  domain: string;
}

const statusConfig = {
  draft: { label: 'پیش‌نویس', color: '#fbbf24' },
  review: { label: 'در حال بررسی', color: '#3b82f6' },
  published: { label: 'منتشر شده', color: '#10b981' },
  archived: { label: 'بایگانی شده', color: '#6b7280' },
};

export default function EnhancedDocumentsPage() {
  const queryClient = useQueryClient();
  
  // State Management
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [previewDocument, setPreviewDocument] = useState<DocumentItem | null>(null);
  const [showImportExport, setShowImportExport] = useState<{ isOpen: boolean; mode: 'import' | 'export' }>({
    isOpen: false,
    mode: 'import'
  });
  
  const [filters, setFilters] = useState<FilterState>({
    query: '',
    category: 'همه',
    source: 'همه',
    status: 'همه',
    dateFrom: '',
    dateTo: '',
    tags: [],
    minScore: null,
    maxScore: null,
    sortBy: 'created_at',
    sortOrder: 'desc',
    page: 1,
    limit: 25,
  });

  // Search suggestions state
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Data Fetching
  const { data: documentsData, isLoading: documentsLoading, error: documentsError } = useQuery({
    queryKey: ['documents', filters],
    queryFn: () => apiClient.searchDocuments(filters),
    keepPreviousData: true,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.getCategories(),
  });

  const { data: tagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: () => apiClient.getTags(),
  });

  const { data: statisticsData } = useQuery({
    queryKey: ['document-statistics'],
    queryFn: () => apiClient.getDocumentStatistics(),
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['documents']);
      queryClient.invalidateQueries(['document-statistics']);
      setSelectedItems(prev => prev.filter(item => item !== id));
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => apiClient.bulkDeleteDocuments(ids),
    onSuccess: () => {
      queryClient.invalidateQueries(['documents']);
      queryClient.invalidateQueries(['document-statistics']);
      setSelectedItems([]);
    },
  });

  const bulkCategorizeMutation = useMutation({
    mutationFn: ({ ids, category }: { ids: string[]; category: string }) => 
      apiClient.bulkCategorizeDocuments(ids, category),
    onSuccess: () => {
      queryClient.invalidateQueries(['documents']);
      setSelectedItems([]);
    },
  });

  const bulkTagMutation = useMutation({
    mutationFn: ({ ids, tags }: { ids: string[]; tags: string[] }) => 
      apiClient.bulkTagDocuments(ids, tags),
    onSuccess: () => {
      queryClient.invalidateQueries(['documents']);
      setSelectedItems([]);
    },
  });

  const statusChangeMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiClient.updateDocumentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['documents']);
    },
  });

  // Computed values
  const documents = documentsData?.items || [];
  const pagination = documentsData?.pagination;
  const categories = categoriesData || [];
  const tags = tagsData || [];
  const sources = statisticsData?.topDomains ? 
    Object.entries(statisticsData.topDomains).map(([name, count]) => ({ name, count: count as number })) : 
    [];

  // Handlers
  const handleFiltersChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    if (query.trim()) {
      try {
        const suggestions = await apiClient.getDocumentSuggestions(query);
        setSuggestions(suggestions);
      } catch (error) {
        console.error('Failed to get suggestions:', error);
      }
    }
    setFilters(prev => ({ ...prev, query, page: 1 }));
  }, []);

  const handleSelectItem = useCallback((id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedItems(documents.map(doc => doc.id));
  }, [documents]);

  const handleDeselectAll = useCallback(() => {
    setSelectedItems([]);
  }, []);

  const handlePreviewDocument = useCallback(async (document: DocumentItem) => {
    try {
      // Fetch complete document data including versions and history
      const fullDocument = await apiClient.getDocumentById(document.id);
      setPreviewDocument(fullDocument);
    } catch (error) {
      console.error('Failed to fetch document details:', error);
      setPreviewDocument(document);
    }
  }, []);

  const handleEditDocument = useCallback((document: DocumentItem) => {
    // Implement document editing logic
    console.log('Edit document:', document.id);
  }, []);

  const handleDeleteDocument = useCallback(async (id: string) => {
    if (confirm('آیا از حذف این سند اطمینان دارید؟')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete document:', error);
      }
    }
  }, [deleteMutation]);

  const handleStatusChange = useCallback(async (id: string, status: string) => {
    try {
      await statusChangeMutation.mutateAsync({ id, status });
    } catch (error) {
      console.error('Failed to change status:', error);
    }
  }, [statusChangeMutation]);

  const handleExportDocument = useCallback(async (id: string, format: string) => {
    try {
      const blob = await apiClient.exportDocuments({ ids: [id] }, format as any);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `document-${id}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export document:', error);
    }
  }, []);

  const handleVersionRevert = useCallback(async (id: string, version: number) => {
    if (confirm(`آیا از بازگردانی به نسخه ${version} اطمینان دارید؟`)) {
      try {
        await apiClient.revertDocumentVersion(id, version);
        queryClient.invalidateQueries(['documents']);
        setPreviewDocument(null);
      } catch (error) {
        console.error('Failed to revert version:', error);
      }
    }
  }, [queryClient]);

  // Bulk operations handlers
  const handleBulkDelete = useCallback(async (ids: string[]) => {
    try {
      await bulkDeleteMutation.mutateAsync(ids);
    } catch (error) {
      console.error('Failed to bulk delete:', error);
      throw error;
    }
  }, [bulkDeleteMutation]);

  const handleBulkCategorize = useCallback(async (ids: string[], category: string) => {
    try {
      await bulkCategorizeMutation.mutateAsync({ ids, category });
    } catch (error) {
      console.error('Failed to bulk categorize:', error);
      throw error;
    }
  }, [bulkCategorizeMutation]);

  const handleBulkTag = useCallback(async (ids: string[], tags: string[]) => {
    try {
      await bulkTagMutation.mutateAsync({ ids, tags });
    } catch (error) {
      console.error('Failed to bulk tag:', error);
      throw error;
    }
  }, [bulkTagMutation]);

  const handleBulkExport = useCallback(async (ids: string[], format: 'json' | 'csv' | 'xlsx') => {
    try {
      const blob = await apiClient.exportDocuments({ ids }, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `documents-export.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to bulk export:', error);
      throw error;
    }
  }, []);

  const handleBulkStatusChange = useCallback(async (ids: string[], status: string) => {
    try {
      await Promise.all(ids.map(id => apiClient.updateDocumentStatus(id, status)));
      queryClient.invalidateQueries(['documents']);
    } catch (error) {
      console.error('Failed to change status:', error);
      throw error;
    }
  }, [queryClient]);

  // Import/Export handlers
  const handleImport = useCallback(async (file: File, options: any) => {
    try {
      return await apiClient.validateImportFile(file);
    } catch (error) {
      console.error('Failed to import:', error);
      throw error;
    }
  }, []);

  const handleExport = useCallback(async (filters: any, format: any, options: any) => {
    try {
      const blob = await apiClient.exportDocuments(filters, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `documents-export.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export:', error);
      throw error;
    }
  }, []);

  if (documentsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-2">خطا در بارگذاری اسناد</div>
          <Button variant="outline" onClick={() => queryClient.invalidateQueries(['documents'])}>
            تلاش مجدد
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">مدیریت اسناد</h1>
          <p className="text-gray-600 mt-1">
            جستجو، مدیریت و سازماندهی اسناد حقوقی
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowImportExport({ isOpen: true, mode: 'import' })}
            leftIcon={<Plus size={18} />}
          >
            درون‌ریزی
          </Button>
          
          <Button
            variant="primary"
            onClick={() => {/* Handle create document */}}
            leftIcon={<Plus size={18} />}
          >
            ایجاد سند جدید
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {statisticsData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card variant="ghost" padding="sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">کل اسناد</div>
                <div className="text-xl font-bold text-gray-900">
                  {statisticsData.totalDocuments?.toLocaleString('fa-IR') || '0'}
                </div>
              </div>
            </div>
          </Card>
          
          <Card variant="ghost" padding="sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">امروز</div>
                <div className="text-xl font-bold text-gray-900">
                  {statisticsData.todayCount?.toLocaleString('fa-IR') || '0'}
                </div>
              </div>
            </div>
          </Card>
          
          <Card variant="ghost" padding="sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock size={20} className="text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">در انتظار بررسی</div>
                <div className="text-xl font-bold text-gray-900">
                  {statisticsData.pendingReview?.toLocaleString('fa-IR') || '0'}
                </div>
              </div>
            </div>
          </Card>
          
          <Card variant="ghost" padding="sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Tag size={20} className="text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">دسته‌بندی‌ها</div>
                <div className="text-xl font-bold text-gray-900">
                  {categories.length.toLocaleString('fa-IR')}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Advanced Filter */}
      <AdvancedDocumentFilter
        filters={filters}
        onFiltersChange={handleFiltersChange}
        categories={categories}
        sources={sources}
        tags={tags}
        suggestions={suggestions}
        isLoading={documentsLoading}
        onSearch={handleSearch}
        onExport={(format) => setShowImportExport({ isOpen: true, mode: 'export' })}
        onImport={() => setShowImportExport({ isOpen: true, mode: 'import' })}
        resultCount={pagination?.totalItems}
      />

      {/* Bulk Operations Bar */}
      <BulkOperationsBar
        selectedItems={selectedItems}
        totalItems={documents.length}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onBulkDelete={handleBulkDelete}
        onBulkCategorize={handleBulkCategorize}
        onBulkTag={handleBulkTag}
        onBulkExport={handleBulkExport}
        onBulkStatusChange={handleBulkStatusChange}
        categories={categories}
        tags={tags}
        isLoading={bulkDeleteMutation.isLoading || bulkCategorizeMutation.isLoading}
      />

      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">نمایش:</span>
          <div className="flex rounded-lg border border-gray-300 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
        
        {pagination && (
          <div className="text-sm text-gray-600">
            نمایش {documents.length.toLocaleString('fa-IR')} از {pagination.totalItems.toLocaleString('fa-IR')} سند
          </div>
        )}
      </div>

      {/* Documents List */}
      {documentsLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : documents.length === 0 ? (
        <Card variant="ghost" padding="lg" className="text-center py-12">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ سندی یافت نشد</h3>
          <p className="text-gray-500 mb-4">
            {filters.query ? 'جستجوی شما نتیجه‌ای نداشت' : 'هنوز سندی اضافه نشده است'}
          </p>
          <Button variant="primary" leftIcon={<Plus size={18} />}>
            ایجاد اولین سند
          </Button>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              viewMode={viewMode}
              isSelected={selectedItems.includes(document.id)}
              onSelect={() => handleSelectItem(document.id)}
              onPreview={() => handlePreviewDocument(document)}
              onEdit={() => handleEditDocument(document)}
              onDelete={() => handleDeleteDocument(document.id)}
              onStatusChange={(status) => handleStatusChange(document.id, status)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => handleFiltersChange({ page: filters.page - 1 })}
            disabled={filters.page === 1}
          >
            قبلی
          </Button>
          
          <span className="text-sm text-gray-600 mx-4">
            صفحه {filters.page.toLocaleString('fa-IR')} از {pagination.totalPages.toLocaleString('fa-IR')}
          </span>
          
          <Button
            variant="outline"
            onClick={() => handleFiltersChange({ page: filters.page + 1 })}
            disabled={filters.page === pagination.totalPages}
          >
            بعدی
          </Button>
        </div>
      )}

      {/* Document Preview Modal */}
      <DocumentPreview
        document={previewDocument}
        isOpen={!!previewDocument}
        onClose={() => setPreviewDocument(null)}
        onEdit={handleEditDocument}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteDocument}
        onExport={handleExportDocument}
        onVersionRevert={handleVersionRevert}
      />

      {/* Import/Export Modal */}
      <ImportExportModal
        isOpen={showImportExport.isOpen}
        mode={showImportExport.mode}
        onClose={() => setShowImportExport({ isOpen: false, mode: 'import' })}
        onImport={handleImport}
        onExport={handleExport}
        categories={categories}
        currentFilters={filters}
      />
    </div>
  );
}

// Document Card Component
interface DocumentCardProps {
  document: DocumentItem;
  viewMode: ViewMode;
  isSelected: boolean;
  onSelect: () => void;
  onPreview: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: string) => void;
}

function DocumentCard({
  document,
  viewMode,
  isSelected,
  onSelect,
  onPreview,
  onEdit,
  onDelete,
  onStatusChange,
}: DocumentCardProps) {
  const statusInfo = statusConfig[document.status];

  if (viewMode === 'list') {
    return (
      <Card variant="interactive" padding="md" className={`transition-all ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
        <div className="flex items-center gap-4">
          <button
            onClick={onSelect}
            className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
              isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'
            }`}
          >
            {isSelected && <Check size={12} />}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate cursor-pointer hover:text-blue-600" onClick={onPreview}>
                  {document.title}
                </h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span>{document.category}</span>
                  <span>{format(new Date(document.createdAt), 'yyyy/MM/dd', { locale: faIR })}</span>
                  <span>{document.wordCount.toLocaleString('fa-IR')} کلمه</span>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500" />
                    {(document.score * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge
                  category={statusInfo.label}
                  color={statusInfo.color}
                  variant="filled"
                  size="sm"
                />
                
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={onPreview}>
                    <Eye size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onEdit}>
                    <Edit3 size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onDelete}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="interactive" padding="md" className={`transition-all ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <button
            onClick={onSelect}
            className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
              isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'
            }`}
          >
            {isSelected && <Check size={12} />}
          </button>
          
          <Badge
            category={statusInfo.label}
            color={statusInfo.color}
            variant="filled"
            size="sm"
          />
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600" onClick={onPreview}>
            {document.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-3">
            {document.content.slice(0, 150)}...
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{document.category}</span>
            <div className="flex items-center gap-1">
              <Star size={12} className="text-yellow-500" />
              {(document.score * 100).toFixed(0)}%
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{format(new Date(document.createdAt), 'yyyy/MM/dd', { locale: faIR })}</span>
            <span>{document.wordCount.toLocaleString('fa-IR')} کلمه</span>
          </div>
        </div>
        
        {document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {document.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag.id}
                category={tag.name}
                color={tag.color || '#6b7280'}
                variant="outline"
                size="sm"
              />
            ))}
            {document.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{document.tags.length - 3}</span>
            )}
          </div>
        )}
        
        <div className="flex items-center gap-1 pt-2 border-t border-gray-200">
          <Button variant="ghost" size="sm" onClick={onPreview} className="flex-1">
            <Eye size={14} />
          </Button>
          <Button variant="ghost" size="sm" onClick={onEdit} className="flex-1">
            <Edit3 size={14} />
          </Button>
          {document.url && (
            <Button variant="ghost" size="sm" onClick={() => window.open(document.url, '_blank')} className="flex-1">
              <ExternalLink size={14} />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}