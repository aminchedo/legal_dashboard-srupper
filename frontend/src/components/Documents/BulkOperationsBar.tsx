import React, { useState } from 'react';
import { 
  Check, 
  Trash2, 
  Tag, 
  Download, 
  Edit3, 
  Archive, 
  Eye, 
  X, 
  ChevronDown,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface BulkOperationsBarProps {
  selectedItems: string[];
  totalItems: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkDelete: (ids: string[]) => Promise<void>;
  onBulkCategorize: (ids: string[], category: string) => Promise<void>;
  onBulkTag: (ids: string[], tags: string[]) => Promise<void>;
  onBulkExport: (ids: string[], format: 'json' | 'csv' | 'xlsx') => Promise<void>;
  onBulkStatusChange: (ids: string[], status: string) => Promise<void>;
  categories: Array<{ id: string; name: string; color?: string }>;
  tags: Array<{ id: string; name: string; color?: string }>;
  isLoading?: boolean;
}

type BulkOperation = 'delete' | 'categorize' | 'tag' | 'export' | 'status' | null;

const statusOptions = [
  { value: 'draft', label: 'پیش‌نویس', color: '#fbbf24', icon: <Edit3 size={14} /> },
  { value: 'review', label: 'در حال بررسی', color: '#3b82f6', icon: <Eye size={14} /> },
  { value: 'published', label: 'منتشر شده', color: '#10b981', icon: <CheckCircle2 size={14} /> },
  { value: 'archived', label: 'بایگانی شده', color: '#6b7280', icon: <Archive size={14} /> },
];

export default function BulkOperationsBar({
  selectedItems,
  totalItems,
  onSelectAll,
  onDeselectAll,
  onBulkDelete,
  onBulkCategorize,
  onBulkTag,
  onBulkExport,
  onBulkStatusChange,
  categories = [],
  tags = [],
  isLoading = false,
}: BulkOperationsBarProps) {
  const [activeOperation, setActiveOperation] = useState<BulkOperation>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [operationLoading, setOperationLoading] = useState(false);

  const isAllSelected = selectedItems.length === totalItems && totalItems > 0;
  const hasSelection = selectedItems.length > 0;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  };

  const handleBulkOperation = async (operation: () => Promise<void>) => {
    try {
      setOperationLoading(true);
      await operation();
      setActiveOperation(null);
      setConfirmDelete(false);
    } catch (error) {
      console.error('Bulk operation failed:', error);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    await handleBulkOperation(() => onBulkDelete(selectedItems));
  };

  const handleCategorize = async (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      await handleBulkOperation(() => onBulkCategorize(selectedItems, category.name));
    }
  };

  const handleTagging = async (tagIds: string[]) => {
    const selectedTags = tags.filter(t => tagIds.includes(t.id)).map(t => t.name);
    await handleBulkOperation(() => onBulkTag(selectedItems, selectedTags));
  };

  const handleExport = async (format: 'json' | 'csv' | 'xlsx') => {
    await handleBulkOperation(() => onBulkExport(selectedItems, format));
  };

  const handleStatusChange = async (status: string) => {
    await handleBulkOperation(() => onBulkStatusChange(selectedItems, status));
  };

  if (!hasSelection) {
    return null;
  }

  return (
    <Card variant="elevated" padding="md" className="mb-4 border-l-4 border-l-blue-500">
      <div className="flex items-center justify-between">
        {/* Selection Info */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
              isAllSelected 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'border-blue-400 bg-white'
            }`}>
              {isAllSelected && <Check size={12} />}
            </div>
            <span className="text-sm font-medium">
              {isAllSelected ? 'لغو انتخاب همه' : 'انتخاب همه'}
            </span>
          </button>

          <div className="text-sm text-gray-600">
            <span className="font-semibold text-blue-700">
              {selectedItems.length.toLocaleString('fa-IR')}
            </span>
            {' '}مورد از{' '}
            <span className="font-semibold">
              {totalItems.toLocaleString('fa-IR')}
            </span>
            {' '}انتخاب شده
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onDeselectAll}
            leftIcon={<X size={16} />}
          >
            لغو انتخاب
          </Button>
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center gap-2">
          {/* Delete Action */}
          <Button
            variant={confirmDelete ? "error" : "outline"}
            size="sm"
            onClick={handleDelete}
            isLoading={operationLoading && activeOperation === 'delete'}
            leftIcon={confirmDelete ? <AlertTriangle size={16} /> : <Trash2 size={16} />}
            onMouseLeave={() => setConfirmDelete(false)}
          >
            {confirmDelete ? 'تأیید حذف' : 'حذف'}
          </Button>

          {/* Status Change */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveOperation(activeOperation === 'status' ? null : 'status')}
              rightIcon={<ChevronDown size={14} />}
              leftIcon={<Edit3 size={16} />}
            >
              تغییر وضعیت
            </Button>
            
            {activeOperation === 'status' && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48">
                {statusOptions.map(status => (
                  <button
                    key={status.value}
                    onClick={() => handleStatusChange(status.value)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    disabled={operationLoading}
                  >
                    <div 
                      className="w-4 h-4 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: status.color }}
                    >
                      {status.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {status.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Categorize Action */}
          {categories.length > 0 && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveOperation(activeOperation === 'categorize' ? null : 'categorize')}
                rightIcon={<ChevronDown size={14} />}
                leftIcon={<Tag size={16} />}
              >
                دسته‌بندی
              </Button>
              
              {activeOperation === 'categorize' && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48 max-h-60 overflow-y-auto">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorize(category.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                      disabled={operationLoading}
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color || '#6b7280' }}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {category.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tag Action */}
          {tags.length > 0 && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveOperation(activeOperation === 'tag' ? null : 'tag')}
                rightIcon={<ChevronDown size={14} />}
                leftIcon={<Tag size={16} />}
              >
                برچسب‌گذاری
              </Button>
              
              {activeOperation === 'tag' && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48 max-h-60 overflow-y-auto">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500 font-medium">انتخاب برچسب‌ها</p>
                  </div>
                  <div className="p-3 space-y-2">
                    {tags.map(tag => (
                      <label
                        key={tag.id}
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          // Handle multi-select logic here
                        />
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tag.color || '#6b7280' }}
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {tag.name}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-100">
                    <Button
                      size="sm"
                      variant="primary"
                      fullWidth
                      onClick={() => {
                        // Handle tag application
                        setActiveOperation(null);
                      }}
                      isLoading={operationLoading}
                    >
                      اعمال برچسب‌ها
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Export Action */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveOperation(activeOperation === 'export' ? null : 'export')}
              rightIcon={<ChevronDown size={14} />}
              leftIcon={<Download size={16} />}
            >
              برون‌بری
            </Button>
            
            {activeOperation === 'export' && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-40">
                <button
                  onClick={() => handleExport('json')}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-colors"
                  disabled={operationLoading}
                >
                  <span className="text-sm font-medium text-gray-900">JSON</span>
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-colors"
                  disabled={operationLoading}
                >
                  <span className="text-sm font-medium text-gray-900">CSV</span>
                </button>
                <button
                  onClick={() => handleExport('xlsx')}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  disabled={operationLoading}
                >
                  <span className="text-sm font-medium text-gray-900">Excel</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Operation Status */}
      {operationLoading && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span>در حال اجرای عملیات بر روی {selectedItems.length.toLocaleString('fa-IR')} مورد...</span>
          </div>
        </div>
      )}
    </Card>
  );
}