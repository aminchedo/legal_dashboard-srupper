import React, { useState, useCallback, useMemo } from 'react';
import { Search, Filter, Calendar, Tag, FileText, Star, ChevronDown, X, Clock } from 'lucide-react';
import { theme } from '../../styles/design-tokens';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

type SortOption = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

type FilterState = {
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
};

interface AdvancedDocumentFilterProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  categories: Array<{ id: string; name: string; color?: string }>;
  sources: Array<{ name: string; count: number }>;
  tags: Array<{ id: string; name: string; color?: string }>;
  suggestions: string[];
  isLoading?: boolean;
  onSearch: (query: string) => void;
  onExport: (format: 'json' | 'csv' | 'xlsx') => void;
  onImport: () => void;
  resultCount?: number;
}

const statusOptions = [
  { value: 'همه', label: 'همه وضعیت‌ها', color: 'gray' },
  { value: 'draft', label: 'پیش‌نویس', color: 'yellow' },
  { value: 'review', label: 'در حال بررسی', color: 'blue' },
  { value: 'published', label: 'منتشر شده', color: 'green' },
  { value: 'archived', label: 'بایگانی شده', color: 'gray' },
];

const sortOptions: SortOption[] = [
  { value: 'created_at', label: 'تاریخ ایجاد', icon: <Calendar size={14} /> },
  { value: 'updated_at', label: 'تاریخ به‌روزرسانی', icon: <Clock size={14} /> },
  { value: 'title', label: 'عنوان', icon: <FileText size={14} /> },
  { value: 'score', label: 'امتیاز', icon: <Star size={14} /> },
  { value: 'category', label: 'دسته‌بندی', icon: <Tag size={14} /> },
];

export default function AdvancedDocumentFilter({
  filters,
  onFiltersChange,
  categories = [],
  sources = [],
  tags = [],
  suggestions = [],
  isLoading = false,
  onSearch,
  onExport,
  onImport,
  resultCount,
}: AdvancedDocumentFilterProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleFilterChange = useCallback((key: keyof FilterState, value: any) => {
    onFiltersChange({ [key]: value, page: 1 });
  }, [onFiltersChange]);

  const handleTagToggle = useCallback((tagId: string) => {
    const newTags = filters.tags.includes(tagId)
      ? filters.tags.filter(id => id !== tagId)
      : [...filters.tags, tagId];
    handleFilterChange('tags', newTags);
  }, [filters.tags, handleFilterChange]);

  const clearFilters = useCallback(() => {
    onFiltersChange({
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
    });
  }, [onFiltersChange]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.query ||
      filters.category !== 'همه' ||
      filters.source !== 'همه' ||
      filters.status !== 'همه' ||
      filters.dateFrom ||
      filters.dateTo ||
      filters.tags.length > 0 ||
      filters.minScore !== null ||
      filters.maxScore !== null
    );
  }, [filters]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    handleFilterChange('query', suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  }, [handleFilterChange, onSearch]);

  return (
    <Card variant="default" padding="lg" className="mb-6">
      {/* Main Search Bar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Input
            placeholder="جستجو در عناوین، محتوا و توضیحات..."
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            leftIcon={<Search size={18} />}
            size="lg"
            className="text-lg"
          />
          
          {/* Search Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-right px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-center gap-3">
                    <Search size={14} className="text-gray-400" />
                    <span className="text-gray-900">{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <Button
          variant={showAdvanced ? "primary" : "outline"}
          onClick={() => setShowAdvanced(!showAdvanced)}
          leftIcon={<Filter size={18} />}
        >
          فیلترهای پیشرفته
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`} 
          />
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            leftIcon={<X size={18} />}
          >
            پاک کردن فیلترها
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-gray-200 pt-6 space-y-6">
          {/* Quick Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                دسته‌بندی
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="همه">همه دسته‌بندی‌ها</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Source Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                منبع
              </label>
              <select
                value={filters.source}
                onChange={(e) => handleFilterChange('source', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="همه">همه منابع</option>
                {sources.map(source => (
                  <option key={source.name} value={source.name}>
                    {source.name} ({source.count.toLocaleString('fa-IR')})
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وضعیت
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مرتب‌سازی
              </label>
              <div className="flex gap-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Button
                  variant="outline"
                  onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3"
                >
                  {filters.sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
            </div>
          </div>

          {/* Date Range and Score Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                محدوده تاریخ
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="از تاریخ"
                />
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="تا تاریخ"
                />
              </div>
            </div>

            {/* Score Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                محدوده امتیاز (0-100)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.minScore || ''}
                  onChange={(e) => handleFilterChange('minScore', e.target.value ? parseInt(e.target.value) : null)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="حداقل"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.maxScore || ''}
                  onChange={(e) => handleFilterChange('maxScore', e.target.value ? parseInt(e.target.value) : null)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="حداکثر"
                />
              </div>
            </div>
          </div>

          {/* Tags Filter */}
          {tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                برچسب‌ها
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagToggle(tag.id)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      filters.tags.includes(tag.id)
                        ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                        : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                    }`}
                    style={{ 
                      backgroundColor: filters.tags.includes(tag.id) 
                        ? tag.color ? `${tag.color}20` : undefined 
                        : undefined,
                      color: filters.tags.includes(tag.id) 
                        ? tag.color || undefined 
                        : undefined 
                    }}
                  >
                    <Tag size={14} />
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                onClick={() => onSearch(filters.query)}
                isLoading={isLoading}
                leftIcon={<Search size={18} />}
              >
                اعمال فیلترها
              </Button>
              
              {resultCount !== undefined && (
                <span className="text-sm text-gray-600">
                  {resultCount.toLocaleString('fa-IR')} نتیجه یافت شد
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={onImport}
                leftIcon={<FileText size={18} />}
                size="sm"
              >
                درون‌ریزی
              </Button>
              
              <div className="relative group">
                <Button
                  variant="outline"
                  size="sm"
                  className="group-hover:bg-gray-50"
                >
                  برون‌بری
                  <ChevronDown size={14} className="mr-1" />
                </Button>
                
                <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <button
                    onClick={() => onExport('json')}
                    className="block w-full text-right px-4 py-2 hover:bg-gray-50 border-b border-gray-100"
                  >
                    JSON
                  </button>
                  <button
                    onClick={() => onExport('csv')}
                    className="block w-full text-right px-4 py-2 hover:bg-gray-50 border-b border-gray-100"
                  >
                    CSV
                  </button>
                  <button
                    onClick={() => onExport('xlsx')}
                    className="block w-full text-right px-4 py-2 hover:bg-gray-50"
                  >
                    Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}