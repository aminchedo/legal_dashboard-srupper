import React, { useState, useCallback, useMemo } from 'react';
import { 
  FileText, Upload, Search, Filter, Download, Trash2, 
  Eye, Edit, Star, StarOff, FolderOpen, Calendar,
  ChevronDown, MoreVertical, File, FileImage, 
  FilePdf, FileSpreadsheet, Grid, List, SortAsc, SortDesc
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, StatusBadge } from '../../components/ui';
import { LEGAL_TERMINOLOGY } from '../../lib/terminology';
import { cn, formatPersianNumber, formatBytes, formatRelativeTime } from '../../lib/utils';

// Types
interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'pdf' | 'docx' | 'txt' | 'image' | 'excel' | 'other';
  size: number;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  isStarred: boolean;
  status: 'processed' | 'processing' | 'error' | 'pending';
  extractedText?: string;
  metadata?: Record<string, any>;
  thumbnail?: string;
}

type ViewMode = 'grid' | 'list';
type SortField = 'title' | 'createdAt' | 'size' | 'category';
type SortDirection = 'asc' | 'desc';

// Mock data
const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'قرارداد خرید املاک تجاری',
    description: 'قرارداد خرید یک واحد تجاری در منطقه ۱ تهران',
    category: 'املاک',
    type: 'pdf',
    size: 2456789,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    tags: ['قرارداد', 'املاک', 'تجاری'],
    isStarred: true,
    status: 'processed'
  },
  {
    id: '2',
    title: 'دادنامه دیوان عدالت اداری',
    description: 'رای شماره ۱۲۳۴ دیوان عدالت اداری در خصوص تخلف اداری',
    category: 'آرا قضایی',
    type: 'pdf',
    size: 1876543,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    tags: ['دادنامه', 'دیوان عدالت', 'اداری'],
    isStarred: false,
    status: 'processed'
  },
  {
    id: '3',
    title: 'لایحه قانونی مالیات بر ارزش افزوده',
    description: 'متن کامل لایحه اصلاح قانون مالیات بر ارزش افزوده',
    category: 'قوانین',
    type: 'docx',
    size: 987654,
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
    tags: ['قانون', 'مالیات', 'ارزش افزوده'],
    isStarred: true,
    status: 'processing'
  },
  {
    id: '4',
    title: 'گزارش تحلیل آرای حقوقی',
    description: 'تحلیل جامع آرای صادره در حوزه حقوق تجارت',
    category: 'گزارشات',
    type: 'excel',
    size: 3456789,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    tags: ['گزارش', 'تحلیل', 'حقوق تجارت'],
    isStarred: false,
    status: 'processed'
  },
  {
    id: '5',
    title: 'مدارک شناسایی متهم',
    description: 'تصاویر و مدارک شناسایی در پرونده کیفری',
    category: 'مدارک',
    type: 'image',
    size: 1234567,
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
    tags: ['مدارک', 'شناسایی', 'کیفری'],
    isStarred: false,
    status: 'error'
  }
];

const categories = ['همه', 'املاک', 'آرا قضایی', 'قوانین', 'گزارشات', 'مدارک'];

const getFileIcon = (type: Document['type']) => {
  switch (type) {
    case 'pdf': return FilePdf;
    case 'image': return FileImage;
    case 'excel': return FileSpreadsheet;
    case 'docx': return FileText;
    default: return File;
  }
};

const getFileTypeColor = (type: Document['type']) => {
  switch (type) {
    case 'pdf': return 'text-red-600 bg-red-50';
    case 'image': return 'text-green-600 bg-green-50';
    case 'excel': return 'text-emerald-600 bg-emerald-50';
    case 'docx': return 'text-blue-600 bg-blue-50';
    default: return 'text-neutral-600 bg-neutral-50';
  }
};

const DocumentCard: React.FC<{
  document: Document;
  onToggleStar: (id: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
}> = ({ document, onToggleStar, onView, onEdit, onDelete, onDownload }) => {
  const FileIcon = getFileIcon(document.type);
  const fileColorClass = getFileTypeColor(document.type);

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className={cn("p-2 rounded-lg", fileColorClass)}>
            <FileIcon className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleStar(document.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {document.isStarred ? (
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              ) : (
                <StarOff className="w-4 h-4" />
              )}
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <h3 className="font-semibold text-neutral-900 line-clamp-2 mb-1">
            {document.title}
          </h3>
          <p className="text-sm text-neutral-600 line-clamp-2">
            {document.description}
          </p>
        </div>

        <div className="flex items-center justify-between mb-3">
          <StatusBadge variant={
            document.status === 'processed' ? 'success' :
            document.status === 'processing' ? 'warning' :
            document.status === 'error' ? 'error' : 'secondary'
          }>
            {document.status === 'processed' && 'پردازش شده'}
            {document.status === 'processing' && 'در حال پردازش'}
            {document.status === 'error' && 'خطا'}
            {document.status === 'pending' && 'در انتظار'}
          </StatusBadge>
          <span className="text-xs text-neutral-500">
            {formatBytes(document.size)}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {document.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-neutral-100 text-neutral-700 rounded-full"
            >
              {tag}
            </span>
          ))}
          {document.tags.length > 3 && (
            <span className="px-2 py-1 text-xs bg-neutral-100 text-neutral-700 rounded-full">
              +{formatPersianNumber(document.tags.length - 3)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-neutral-500 mb-3">
          <span>{document.category}</span>
          <span>{formatRelativeTime(document.createdAt)}</span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(document.id)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 ml-1" />
            مشاهده
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload(document.id)}
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const DocumentRow: React.FC<{
  document: Document;
  onToggleStar: (id: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
}> = ({ document, onToggleStar, onView, onEdit, onDelete, onDownload }) => {
  const FileIcon = getFileIcon(document.type);
  const fileColorClass = getFileTypeColor(document.type);

  return (
    <div className="flex items-center p-4 hover:bg-neutral-50 border-b border-neutral-200 last:border-b-0">
      <div className="flex items-center flex-1 min-w-0">
        <div className={cn("p-2 rounded-lg mr-3", fileColorClass)}>
          <FileIcon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-neutral-900 truncate">
              {document.title}
            </h3>
            {document.isStarred && (
              <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-neutral-600 truncate">
            {document.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-neutral-600">
        <span className="hidden md:block">{document.category}</span>
        <span className="hidden lg:block">{formatBytes(document.size)}</span>
        <span className="hidden xl:block">{formatRelativeTime(document.createdAt)}</span>
        
        <StatusBadge
          variant={
            document.status === 'processed' ? 'success' :
            document.status === 'processing' ? 'warning' :
            document.status === 'error' ? 'error' : 'secondary'
          }
          size="sm"
        >
          {document.status === 'processed' && 'پردازش شده'}
          {document.status === 'processing' && 'در حال پردازش'}
          {document.status === 'error' && 'خطا'}
          {document.status === 'pending' && 'در انتظار'}
        </StatusBadge>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleStar(document.id)}
          >
            {document.isStarred ? (
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
            ) : (
              <StarOff className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(document.id)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDownload(document.id)}
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(document.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const DocumentsListPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('همه');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Handlers
  const handleToggleStar = useCallback((id: string) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === id ? { ...doc, isStarred: !doc.isStarred } : doc
      )
    );
  }, []);

  const handleView = useCallback((id: string) => {
    console.log('View document:', id);
  }, []);

  const handleEdit = useCallback((id: string) => {
    console.log('Edit document:', id);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  }, []);

  const handleDownload = useCallback((id: string) => {
    console.log('Download document:', id);
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filtered and sorted documents
  const filteredDocuments = useMemo(() => {
    let filtered = documents;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'همه') {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [documents, searchQuery, selectedCategory, sortField, sortDirection]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {LEGAL_TERMINOLOGY.documents.title}
          </h1>
          <p className="text-neutral-600 mt-1">
            مدیریت و سازماندهی اسناد حقوقی
          </p>
        </div>
        <Button icon={Upload} variant="primary">
          بارگذاری سند جدید
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">کل اسناد</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {formatPersianNumber(documents.length)}
                </p>
              </div>
              <FileText className="w-8 h-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">پردازش شده</p>
                <p className="text-2xl font-bold text-success-600">
                  {formatPersianNumber(documents.filter(d => d.status === 'processed').length)}
                </p>
              </div>
              <Eye className="w-8 h-8 text-success-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">در حال پردازش</p>
                <p className="text-2xl font-bold text-warning-600">
                  {formatPersianNumber(documents.filter(d => d.status === 'processing').length)}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-warning-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">ستاره‌دار</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {formatPersianNumber(documents.filter(d => d.isStarred).length)}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="جستجو در اسناد..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-neutral-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute left-2 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-neutral-300 rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Sort */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort('title')}
                className="whitespace-nowrap"
              >
                نام
                {sortField === 'title' && (
                  sortDirection === 'asc' ? 
                    <SortAsc className="w-4 h-4 mr-1" /> : 
                    <SortDesc className="w-4 h-4 mr-1" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort('createdAt')}
                className="whitespace-nowrap"
              >
                تاریخ
                {sortField === 'createdAt' && (
                  sortDirection === 'asc' ? 
                    <SortAsc className="w-4 h-4 mr-1" /> : 
                    <SortDesc className="w-4 h-4 mr-1" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-neutral-600">
          {formatPersianNumber(filteredDocuments.length)} سند یافت شد
        </p>
      </div>

      {/* Documents Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDocuments.map(document => (
            <DocumentCard
              key={document.id}
              document={document}
              onToggleStar={handleToggleStar}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDownload={handleDownload}
            />
          ))}
        </div>
      ) : (
        <Card>
          <div className="divide-y divide-neutral-200">
            {filteredDocuments.map(document => (
              <DocumentRow
                key={document.id}
                document={document}
                onToggleStar={handleToggleStar}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDownload={handleDownload}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              هیچ سندی یافت نشد
            </h3>
            <p className="text-neutral-600 mb-4">
              برای شروع، اسناد خود را بارگذاری کنید
            </p>
            <Button icon={Upload} variant="primary">
              بارگذاری اولین سند
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentsListPage;