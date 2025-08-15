import React, { useState, useEffect } from 'react';
import {
  FileText,
  Calendar,
  User,
  Tag,
  Star,
  ExternalLink,
  Edit3,
  History,
  Download,
  Share2,
  BookOpen,
  Clock,
  Eye,
  Archive,
  AlertCircle,
  CheckCircle2,
  X,
  ChevronRight,
  ChevronDown,
  Copy,
  RotateCcw,
} from 'lucide-react';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import SmartRating from './SmartRating';
import SmartCategorization from './SmartCategorization';

interface DocumentVersion {
  id: string;
  version: number;
  title: string;
  changeSummary: string;
  createdAt: string;
  createdBy: string;
}

interface DocumentHistory {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
}

interface DocumentData {
  id: string;
  title: string;
  content: string;
  category: string;
  source: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  score: number;
  language: string;
  keywords: string[];
  metadata: Record<string, any>;
  url?: string;
  wordCount: number;
  readingTime: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  createdBy: string;
  updatedBy?: string;
  tags: Array<{ id: string; name: string; color?: string }>;
  versions?: DocumentVersion[];
  history?: DocumentHistory[];
}

interface DocumentPreviewProps {
  document: DocumentData | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (document: DocumentData) => void;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onExport: (id: string, format: string) => void;
  onVersionRevert: (id: string, version: number) => void;
  isLoading?: boolean;
}

const statusConfig = {
  draft: { label: 'پیش‌نویس', color: '#fbbf24', icon: <Edit3 size={14} /> },
  review: { label: 'در حال بررسی', color: '#3b82f6', icon: <Eye size={14} /> },
  published: { label: 'منتشر شده', color: '#10b981', icon: <CheckCircle2 size={14} /> },
  archived: { label: 'بایگانی شده', color: '#6b7280', icon: <Archive size={14} /> },
};

export default function DocumentPreview({
  document,
  isOpen,
  onClose,
  onEdit,
  onStatusChange,
  onDelete,
  onExport,
  onVersionRevert,
  isLoading = false,
}: DocumentPreviewProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'metadata' | 'history' | 'versions'>('content');
  const [showFullContent, setShowFullContent] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (isOpen && document) {
      setActiveTab('content');
      setShowFullContent(false);
    }
  }, [isOpen, document]);

  const handleCopyContent = async () => {
    if (document?.content) {
      try {
        await navigator.clipboard.writeText(document.content);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (error) {
        console.error('Failed to copy content:', error);
      }
    }
  };

  const handleShare = async () => {
    if (document && navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: document.content.slice(0, 200) + '...',
          url: document.url || window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  if (!isOpen || !document) {
    return null;
  }

  const currentStatus = statusConfig[document.status];
  const contentPreview = document.content.slice(0, 500);
  const hasMoreContent = document.content.length > 500;

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'hidden'}`} role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 p-4 flex items-center justify-center">
        <Card className="w-full max-w-5xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900">جزئیات سند</h3>
            <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700" aria-label="Close">
              <X />
            </button>
          </div>
          
          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            <div className="lg:col-span-2 p-4 overflow-auto">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 bg-white">
                <div className="flex">
                  {[
                    { id: 'content', label: 'محتوا', icon: <FileText size={16} /> },
                    { id: 'metadata', label: 'اطلاعات', icon: <Tag size={16} /> },
                    { id: 'history', label: 'تاریخچه', icon: <History size={16} /> },
                    { id: 'versions', label: 'نسخه‌ها', icon: <RotateCcw size={16} /> },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 bg-blue-50'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="h-96 overflow-y-auto p-6">
                {activeTab === 'content' && (
                  <div className="space-y-4">
                    {/* Content Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star size={16} className="text-yellow-500" />
                        <span className="text-sm font-medium text-gray-700">
                          امتیاز: {(document.score * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCopyContent}
                          leftIcon={copySuccess ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                        >
                          {copySuccess ? 'کپی شد!' : 'کپی متن'}
                        </Button>
                        {document.url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(document.url, '_blank')}
                            leftIcon={<ExternalLink size={16} />}
                          >
                            مشاهده اصل
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Document Content */}
                    <div className="prose prose-sm max-w-none">
                      <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {showFullContent ? document.content : contentPreview}
                        {hasMoreContent && !showFullContent && '...'}
                      </div>
                      
                      {hasMoreContent && (
                        <button
                          onClick={() => setShowFullContent(!showFullContent)}
                          className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          {showFullContent ? 'نمایش کمتر' : 'نمایش بیشتر'}
                        </button>
                      )}
                    </div>

                    {/* Tags */}
                    {document.tags.length > 0 && (
                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">برچسب‌ها:</h4>
                        <div className="flex flex-wrap gap-2">
                          {document.tags.map((tag) => (
                            <Badge
                              key={tag.id}
                              category={tag.name}
                              color={tag.color || '#6b7280'}
                              variant="outline"
                              size="sm"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'metadata' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card variant="ghost" padding="sm">
                        <h4 className="font-medium text-gray-900 mb-2">اطلاعات کلی</h4>
                        <dl className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-gray-500">دسته‌بندی:</dt>
                            <dd className="text-gray-900 font-medium">{document.category}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500">منبع:</dt>
                            <dd className="text-gray-900 font-medium">{document.source}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500">زبان:</dt>
                            <dd className="text-gray-900 font-medium">{document.language || 'فارسی'}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500">تعداد کلمات:</dt>
                            <dd className="text-gray-900 font-medium">{document.wordCount.toLocaleString('fa-IR')}</dd>
                          </div>
                        </dl>
                      </Card>

                      <Card variant="ghost" padding="sm">
                        <h4 className="font-medium text-gray-900 mb-2">تاریخ‌ها</h4>
                        <dl className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-gray-500">ایجاد:</dt>
                            <dd className="text-gray-900 font-medium">
                              {format(new Date(document.createdAt), 'yyyy/MM/dd HH:mm', { locale: faIR })}
                            </dd>
                          </div>
                          {document.updatedAt && (
                            <div className="flex justify-between">
                              <dt className="text-gray-500">آخرین بروزرسانی:</dt>
                              <dd className="text-gray-900 font-medium">
                                {format(new Date(document.updatedAt), 'yyyy/MM/dd HH:mm', { locale: faIR })}
                              </dd>
                            </div>
                          )}
                          {document.publishedAt && (
                            <div className="flex justify-between">
                              <dt className="text-gray-500">انتشار:</dt>
                              <dd className="text-gray-900 font-medium">
                                {format(new Date(document.publishedAt), 'yyyy/MM/dd HH:mm', { locale: faIR })}
                              </dd>
                            </div>
                          )}
                        </dl>
                      </Card>
                    </div>

                    {/* Keywords */}
                    {document.keywords.length > 0 && (
                      <Card variant="ghost" padding="sm">
                        <h4 className="font-medium text-gray-900 mb-2">کلمات کلیدی</h4>
                        <div className="flex flex-wrap gap-2">
                          {document.keywords.map((keyword, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </Card>
                    )}

                    {/* Custom Metadata */}
                    {Object.keys(document.metadata).length > 0 && (
                      <Card variant="ghost" padding="sm">
                        <h4 className="font-medium text-gray-900 mb-2">اطلاعات اضافی</h4>
                        <dl className="space-y-2 text-sm">
                          {Object.entries(document.metadata).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <dt className="text-gray-500 capitalize">{key}:</dt>
                              <dd className="text-gray-900 font-medium">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </Card>
                    )}
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="space-y-3">
                    {document.history && document.history.length > 0 ? (
                      document.history.map((entry) => (
                        <div key={entry.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-900">{entry.action}</span>
                              <span className="text-xs text-gray-500">
                                {format(new Date(entry.timestamp), 'yyyy/MM/dd HH:mm', { locale: faIR })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{entry.description}</p>
                            <p className="text-xs text-gray-500 mt-1">توسط {entry.userName}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <History size={48} className="mx-auto mb-2 text-gray-300" />
                        <p>هیچ تاریخچه‌ای یافت نشد</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'versions' && (
                  <div className="space-y-3">
                    {document.versions && document.versions.length > 0 ? (
                      document.versions.map((version) => (
                        <Card key={version.id} variant="ghost" padding="sm">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900">
                                  نسخه {version.version}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {format(new Date(version.createdAt), 'yyyy/MM/dd HH:mm', { locale: faIR })}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">{version.changeSummary}</p>
                              <p className="text-xs text-gray-500">ایجاد شده توسط {version.createdBy}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onVersionRevert(document.id, version.version)}
                              leftIcon={<RotateCcw size={14} />}
                            >
                              بازگردانی
                            </Button>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <RotateCcw size={48} className="mx-auto mb-2 text-gray-300" />
                        <p>هیچ نسخه‌ای یافت نشد</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 space-y-4 border-t lg:border-t-0 lg:border-r border-neutral-200">
              {/* Smart Rating */}
              {document && (
                <SmartRating
                  documentId={document.id}
                  initialScore={document.score}
                  submitRating={async (docId, score) => { await fetch(`${(import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api'}/documents/${docId}/rating`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}` }, body: JSON.stringify({ score }) }); }}
                  onRated={() => {/* TODO: invalidate queries if needed */}}
                />
              )}

              {/* Smart Categorization */}
              {document && (
                <SmartCategorization
                  documentId={document.id}
                  fetchSuggestions={async (docId) => {
                    const res = await fetch(`${(import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api'}/documents/${docId}/categorization/suggestions`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}` }});
                    const data = await res.json();
                    return data?.suggestions || [];
                  }}
                  applyCategory={async (docId, category) => {
                    await fetch(`${(import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api'}/documents/${docId}/categorization`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}` }, body: JSON.stringify({ category }) });
                  }}
                  onApplied={() => {/* TODO: invalidate queries if needed */}}
                />
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}