import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Upload, 
  FileText, 
  Calendar, 
  User, 
  Download, 
  Eye, 
  Edit3, 
  Trash2, 
  Grid, 
  List, 
  SortAsc, 
  SortDesc, 
  MoreVertical,
  Tag,
  Clock,
  FileCheck,
  AlertTriangle
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Button, 
  Input, 
  Select, 
  FileUpload, 
  StatusBadge 
} from '../../components/ui';
import { LEGAL_TERMINOLOGY } from '../../lib/terminology';
import { cn, formatBytes, formatDate, formatRelativeTime } from '../../lib/utils';

// Mock data for documents
interface Document {
  id: string;
  title: string;
  description?: string;
  category: string;
  type: 'contract' | 'legal_opinion' | 'court_ruling' | 'legislation' | 'correspondence' | 'other';
  status: 'active' | 'archived' | 'pending_review' | 'under_revision';
  priority: 'high' | 'medium' | 'low';
  size: number;
  format: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  tags: string[];
  version: number;
  isConfidential: boolean;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'قرارداد خدمات حقوقی شرکت آلفا',
    description: 'قرارداد ارائه خدمات مشاوره حقوقی به مدت یک سال',
    category: 'قراردادها',
    type: 'contract',
    status: 'active',
    priority: 'high',
    size: 2048576,
    format: 'PDF',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    createdBy: 'احمد محمدی',
    tags: ['قرارداد', 'خدمات', 'حقوقی'],
    version: 2,
    isConfidential: true
  },
  {
    id: '2',
    title: 'نظریه حقوقی در خصوص مالکیت فکری',
    description: 'بررسی جنبه‌های حقوقی حمایت از مالکیت فکری در قوانین ایران',
    category: 'نظریات حقوقی',
    type: 'legal_opinion',
    status: 'pending_review',
    priority: 'medium',
    size: 1536000,
    format: 'DOCX',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    createdBy: 'مریم احمدی',
    tags: ['مالکیت فکری', 'نظریه', 'حقوق'],
    version: 1,
    isConfidential: false
  },
  {
    id: '3',
    title: 'رای دیوان عدالت اداری - پرونده ۱۴۰۳۰۱۲۳۴',
    description: 'رای دیوان در خصوص ابطال تصمیم اداری شهرداری',
    category: 'آراء قضایی',
    type: 'court_ruling',
    status: 'archived',
    priority: 'low',
    size: 892416,
    format: 'PDF',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    createdBy: 'سعید رضایی',
    tags: ['دیوان', 'عدالت اداری', 'رای'],
    version: 1,
    isConfidential: false
  }
];

const DocumentsListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'createdAt' | 'updatedAt' | 'size'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUpload, setShowUpload] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort documents
  const filteredAndSortedDocuments = useMemo(() => {
    let filtered = mockDocuments.filter(doc => {
      const matchesSearch = searchTerm === '' || 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === '' || doc.category === selectedCategory;
      const matchesType = selectedType === '' || doc.type === selectedType;
      const matchesStatus = selectedStatus === '' || doc.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesType && matchesStatus;
    });

    // Sort documents
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sortBy === 'title') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedType, selectedStatus, sortBy, sortOrder]);

  const handleFileUpload = async (files: File[]) => {
    // Simulate upload process
    console.log('Uploading files:', files);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setShowUpload(false);
  };

  const getStatusBadge = (status: Document['status']) => {
    const statusMap = {
      active: { variant: 'success' as const, label: LEGAL_TERMINOLOGY.status.active },
      archived: { variant: 'secondary' as const, label: LEGAL_TERMINOLOGY.status.archived },
      pending_review: { variant: 'warning' as const, label: LEGAL_TERMINOLOGY.status.pending_review },
      under_revision: { variant: 'error' as const, label: LEGAL_TERMINOLOGY.status.under_revision }
    };
    return statusMap[status];
  };

  const getPriorityBadge = (priority: Document['priority']) => {
    const priorityMap = {
      high: { variant: 'error' as const, label: LEGAL_TERMINOLOGY.priority.high },
      medium: { variant: 'warning' as const, label: LEGAL_TERMINOLOGY.priority.medium },
      low: { variant: 'secondary' as const, label: LEGAL_TERMINOLOGY.priority.low }
    };
    return priorityMap[priority];
  };

  const getTypeIcon = (type: Document['type']) => {
    const iconMap = {
      contract: FileCheck,
      legal_opinion: FileText,
      court_ruling: AlertTriangle,
      legislation: FileText,
      correspondence: FileText,
      other: FileText
    };
    return iconMap[type] || FileText;
  };

  const DocumentCard: React.FC<{ document: Document }> = ({ document }) => {
    const TypeIcon = getTypeIcon(document.type);
    const statusBadge = getStatusBadge(document.status);
    const priorityBadge = getPriorityBadge(document.priority);
    
    if (viewMode === 'list') {
      return (
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* Icon and Title */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <TypeIcon className="w-8 h-8 text-primary-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                    {document.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate mt-1">
                    {document.description}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="hidden md:flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                <span>{document.category}</span>
                <span>{formatBytes(document.size)}</span>
                <span>{formatRelativeTime(document.updatedAt)}</span>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center gap-3">
                <StatusBadge variant={statusBadge.variant} size="sm">
                  {statusBadge.label}
                </StatusBadge>
                
                <Button variant="ghost" size="sm" icon={MoreVertical} />
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="hover:shadow-md transition-shadow duration-200 group">
        <CardContent className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <TypeIcon className="w-5 h-5 text-primary-500" />
              {document.isConfidential && (
                <StatusBadge variant="error" size="sm">محرمانه</StatusBadge>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              icon={MoreVertical}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>

          {/* Title and Description */}
          <div>
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 line-clamp-2 mb-1">
              {document.title}
            </h3>
            {document.description && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                {document.description}
              </p>
            )}
          </div>

          {/* Tags */}
          {document.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {document.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded"
                >
                  {tag}
                </span>
              ))}
              {document.tags.length > 3 && (
                <span className="px-2 py-1 text-xs text-neutral-500 dark:text-neutral-400">
                  +{document.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <StatusBadge variant={statusBadge.variant} size="sm">
                {statusBadge.label}
              </StatusBadge>
              <StatusBadge variant={priorityBadge.variant} size="sm">
                {priorityBadge.label}
              </StatusBadge>
            </div>
            
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              {formatBytes(document.size)} • {document.format}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
              <User className="w-3 h-3" />
              <span>{document.createdBy}</span>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" icon={Eye} />
              <Button variant="ghost" size="sm" icon={Download} />
              <Button variant="ghost" size="sm" icon={Edit3} />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {LEGAL_TERMINOLOGY.pages.documents}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            مدیریت و سازماندهی اسناد و مدارک حقوقی
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            icon={showFilters ? Filter : Filter}
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-primary-50 text-primary-600' : ''}
          >
            فیلترها
          </Button>
          <Button
            variant="primary"
            icon={Upload}
            onClick={() => setShowUpload(true)}
          >
            آپلود سند
          </Button>
        </div>
      </div>

      {/* Search and Controls */}
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Input
              placeholder="جستجو در عنوان، توضیحات و برچسب‌ها..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
              className="flex-1"
            />
            
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex rounded-lg border border-neutral-200 dark:border-neutral-700 p-1">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                                     icon={Grid}
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                />
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  icon={List}
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8 p-0"
                />
              </div>

              {/* Sort Controls */}
              <Select
                options={[
                  { value: 'updatedAt', label: 'تاریخ به‌روزرسانی' },
                  { value: 'createdAt', label: 'تاریخ ایجاد' },
                  { value: 'title', label: 'عنوان' },
                  { value: 'size', label: 'حجم فایل' }
                ]}
                value={sortBy}
                onChange={(value) => setSortBy(value as any)}
                size="sm"
              />
              
              <Button
                variant="outline"
                size="sm"
                icon={sortOrder === 'asc' ? SortAsc : SortDesc}
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="h-10 w-10 p-0"
              />
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="flex flex-wrap gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <Select
                label="دسته‌بندی"
                options={[
                  { value: '', label: 'همه دسته‌ها' },
                  { value: 'قراردادها', label: 'قراردادها' },
                  { value: 'نظریات حقوقی', label: 'نظریات حقوقی' },
                  { value: 'آراء قضایی', label: 'آراء قضایی' }
                ]}
                value={selectedCategory}
                onChange={setSelectedCategory}
                size="sm"
                className="w-48"
              />
              
              <Select
                label="نوع سند"
                options={[
                  { value: '', label: 'همه انواع' },
                  { value: 'contract', label: LEGAL_TERMINOLOGY.documentTypes.contract },
                  { value: 'legal_opinion', label: LEGAL_TERMINOLOGY.documentTypes.legal_opinion },
                  { value: 'court_ruling', label: LEGAL_TERMINOLOGY.documentTypes.court_ruling },
                  { value: 'legislation', label: LEGAL_TERMINOLOGY.documentTypes.legislation }
                ]}
                value={selectedType}
                onChange={setSelectedType}
                size="sm"
                className="w-48"
              />
              
              <Select
                label="وضعیت"
                options={[
                  { value: '', label: 'همه وضعیت‌ها' },
                  { value: 'active', label: LEGAL_TERMINOLOGY.status.active },
                  { value: 'archived', label: LEGAL_TERMINOLOGY.status.archived },
                  { value: 'pending_review', label: LEGAL_TERMINOLOGY.status.pending_review },
                  { value: 'under_revision', label: LEGAL_TERMINOLOGY.status.under_revision }
                ]}
                value={selectedStatus}
                onChange={setSelectedStatus}
                size="sm"
                className="w-48"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400">
        <span>
          {filteredAndSortedDocuments.length} سند از {mockDocuments.length} سند
        </span>
        <div className="flex items-center gap-4">
          <span>مرتب‌سازی بر اساس {sortBy === 'updatedAt' ? 'تاریخ به‌روزرسانی' : sortBy === 'createdAt' ? 'تاریخ ایجاد' : sortBy === 'title' ? 'عنوان' : 'حجم فایل'}</span>
        </div>
      </div>

      {/* Documents Grid/List */}
      {filteredAndSortedDocuments.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              هیچ سندی یافت نشد
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 mb-4">
              با تغییر فیلترها یا جستجوی جدید دوباره تلاش کنید
            </p>
            <Button variant="primary" icon={Upload} onClick={() => setShowUpload(true)}>
              آپلود اولین سند
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={cn(
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-3'
        )}>
          {filteredAndSortedDocuments.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <CardTitle>آپلود سند جدید</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUpload
                accept=".pdf,.doc,.docx,.txt"
                multiple
                maxSize={10 * 1024 * 1024}
                maxFiles={5}
                onUpload={handleFileUpload}
                hint="فرمت‌های مجاز: PDF, DOC, DOCX, TXT - حداکثر حجم: ۱۰ مگابایت"
              />
              
              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <Button variant="outline" onClick={() => setShowUpload(false)}>
                  انصراف
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DocumentsListPage;