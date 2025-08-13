import React, { useState, useCallback, useRef } from 'react';
import {
  Upload,
  Download,
  FileText,
  AlertTriangle,
  CheckCircle2,
  X,
  ArrowRight,
  ArrowLeft,
  File,
  FileSpreadsheet,
  FileType,
  AlertCircle,
  RefreshCw,
  Eye,
} from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';

interface ImportError {
  row: number;
  field: string;
  message: string;
  value: any;
}

interface ImportValidationResult {
  isValid: boolean;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  errors: ImportError[];
  preview: Array<Record<string, any>>;
}

interface ImportExportModalProps {
  isOpen: boolean;
  mode: 'import' | 'export';
  onClose: () => void;
  onImport: (file: File, options: ImportOptions) => Promise<ImportValidationResult>;
  onExport: (filters: any, format: ExportFormat, options: ExportOptions) => Promise<void>;
  categories: Array<{ id: string; name: string }>;
  currentFilters?: any;
}

interface ImportOptions {
  overwrite: boolean;
  skipInvalid: boolean;
  categoryMapping: Record<string, string>;
  defaultCategory?: string;
  validateContent: boolean;
  createCategories: boolean;
}

interface ExportOptions {
  includeContent: boolean;
  includeMetadata: boolean;
  includeHistory: boolean;
  dateFormat: 'persian' | 'gregorian';
  encoding: 'utf8' | 'utf16';
}

type ExportFormat = 'json' | 'csv' | 'xlsx' | 'xml';

const exportFormats = [
  { 
    value: 'json' as ExportFormat, 
    label: 'JSON', 
    icon: <FileType size={20} />, 
    description: 'فرمت JSON برای توسعه‌دهندگان'
  },
  { 
    value: 'csv' as ExportFormat, 
    label: 'CSV', 
    icon: <FileSpreadsheet size={20} />, 
    description: 'فایل CSV برای Excel و Google Sheets'
  },
  { 
    value: 'xlsx' as ExportFormat, 
    label: 'Excel', 
    icon: <FileSpreadsheet size={20} />, 
    description: 'فایل Excel با قابلیت‌های پیشرفته'
  },
  { 
    value: 'xml' as ExportFormat, 
    label: 'XML', 
    icon: <FileText size={20} />, 
    description: 'فرمت XML برای تبادل داده'
  },
];

export default function ImportExportModal({
  isOpen,
  mode,
  onClose,
  onImport,
  onExport,
  categories = [],
  currentFilters = {},
}: ImportExportModalProps) {
  const [step, setStep] = useState<'options' | 'upload' | 'validation' | 'complete'>('options');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<ImportValidationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState(0);
  
  // Import options
  const [importOptions, setImportOptions] = useState<ImportOptions>({
    overwrite: false,
    skipInvalid: true,
    categoryMapping: {},
    validateContent: true,
    createCategories: false,
  });
  
  // Export options
  const [exportFormat, setExportFormat] = useState<ExportFormat>('json');
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeContent: true,
    includeMetadata: true,
    includeHistory: false,
    dateFormat: 'persian',
    encoding: 'utf8',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = useCallback(() => {
    setStep('options');
    setSelectedFile(null);
    setValidationResult(null);
    setIsProcessing(false);
    setError('');
    setProgress(0);
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  const handleFileSelect = useCallback((file: File) => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = ['application/json', 'text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    
    if (file.size > maxSize) {
      setError('حجم فایل نباید بیشتر از ۵۰ مگابایت باشد');
      return;
    }
    
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.csv')) {
      setError('فرمت فایل مجاز نیست. فقط JSON، CSV و Excel پذیرفته می‌شود');
      return;
    }
    
    setSelectedFile(file);
    setError('');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleValidateFile = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    setError('');
    
    try {
      const result = await onImport(selectedFile, importOptions);
      setValidationResult(result);
      setStep('validation');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'خطا در اعتبارسنجی فایل');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!selectedFile || !validationResult) return;
    
    setIsProcessing(true);
    setStep('complete');
    
    try {
      // Simulate progress for demo
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      handleClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'خطا در واردات داده‌ها');
      setStep('validation');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = async () => {
    setIsProcessing(true);
    setError('');
    
    try {
      await onExport(currentFilters, exportFormat, exportOptions);
      handleClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'خطا در برون‌بری داده‌ها');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            {mode === 'import' ? <Upload size={24} className="text-blue-600" /> : <Download size={24} className="text-green-600" />}
            <h2 className="text-xl font-bold text-gray-900">
              {mode === 'import' ? 'درون‌ریزی اسناد' : 'برون‌بری اسناد'}
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {mode === 'import' ? (
            // IMPORT MODE
            <div className="space-y-6">
              {step === 'options' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">تنظیمات درون‌ریزی</h3>
                  
                  <div className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={importOptions.overwrite}
                        onChange={(e) => setImportOptions(prev => ({ ...prev, overwrite: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        جایگزینی اسناد موجود با همان شناسه
                      </span>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={importOptions.skipInvalid}
                        onChange={(e) => setImportOptions(prev => ({ ...prev, skipInvalid: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        نادیده گرفتن رکوردهای نامعتبر
                      </span>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={importOptions.validateContent}
                        onChange={(e) => setImportOptions(prev => ({ ...prev, validateContent: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        اعتبارسنجی محتوای اسناد
                      </span>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={importOptions.createCategories}
                        onChange={(e) => setImportOptions(prev => ({ ...prev, createCategories: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        ایجاد دسته‌بندی‌های جدید در صورت نیاز
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="primary" onClick={() => setStep('upload')} rightIcon={<ArrowRight size={16} />}>
                      ادامه
                    </Button>
                    <Button variant="outline" onClick={handleClose}>
                      انصراف
                    </Button>
                  </div>
                </div>
              )}

              {step === 'upload' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Button variant="ghost" size="sm" onClick={() => setStep('options')} leftIcon={<ArrowLeft size={16} />}>
                      بازگشت
                    </Button>
                    <h3 className="text-lg font-semibold text-gray-900">انتخاب فایل</h3>
                  </div>

                  {/* File Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      selectedFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {selectedFile ? (
                      <div className="space-y-3">
                        <CheckCircle2 size={48} className="mx-auto text-green-500" />
                        <div>
                          <p className="text-lg font-medium text-gray-900">{selectedFile.name}</p>
                          <p className="text-sm text-gray-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} مگابایت
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedFile(null)}
                          leftIcon={<X size={16} />}
                        >
                          حذف فایل
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload size={48} className="mx-auto text-gray-400" />
                        <div>
                          <p className="text-lg font-medium text-gray-900">فایل را اینجا رها کنید</p>
                          <p className="text-sm text-gray-500">یا برای انتخاب کلیک کنید</p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          leftIcon={<File size={16} />}
                        >
                          انتخاب فایل
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".json,.csv,.xlsx"
                          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>

                  {/* Supported Formats */}
                  <Card variant="ghost" padding="sm">
                    <h4 className="font-medium text-gray-900 mb-2">فرمت‌های پشتیبانی شده:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• JSON - برای داده‌های ساختاریافته</li>
                      <li>• CSV - برای جداول ساده</li>
                      <li>• Excel (.xlsx) - برای جداول پیشرفته</li>
                    </ul>
                  </Card>

                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertTriangle size={16} className="text-red-500" />
                      <span className="text-sm text-red-700">{error}</span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      onClick={handleValidateFile}
                      disabled={!selectedFile || isProcessing}
                      isLoading={isProcessing}
                      rightIcon={<ArrowRight size={16} />}
                    >
                      اعتبارسنجی فایل
                    </Button>
                  </div>
                </div>
              )}

              {step === 'validation' && validationResult && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Button variant="ghost" size="sm" onClick={() => setStep('upload')} leftIcon={<ArrowLeft size={16} />}>
                      بازگشت
                    </Button>
                    <h3 className="text-lg font-semibold text-gray-900">نتایج اعتبارسنجی</h3>
                  </div>

                  {/* Validation Summary */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card variant="ghost" padding="sm" className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{validationResult.totalRows.toLocaleString('fa-IR')}</div>
                      <div className="text-sm text-gray-600">کل رکوردها</div>
                    </Card>
                    <Card variant="ghost" padding="sm" className="text-center">
                      <div className="text-2xl font-bold text-green-600">{validationResult.validRows.toLocaleString('fa-IR')}</div>
                      <div className="text-sm text-gray-600">معتبر</div>
                    </Card>
                    <Card variant="ghost" padding="sm" className="text-center">
                      <div className="text-2xl font-bold text-red-600">{validationResult.invalidRows.toLocaleString('fa-IR')}</div>
                      <div className="text-sm text-gray-600">نامعتبر</div>
                    </Card>
                  </div>

                  {/* Errors */}
                  {validationResult.errors.length > 0 && (
                    <Card variant="ghost" padding="sm">
                      <h4 className="font-medium text-red-900 mb-2 flex items-center gap-2">
                        <AlertCircle size={16} />
                        خطاهای یافت شده ({validationResult.errors.length})
                      </h4>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {validationResult.errors.slice(0, 10).map((error, index) => (
                          <div key={index} className="text-xs text-red-700 bg-red-50 p-2 rounded">
                            سطر {error.row}: {error.message} (فیلد: {error.field})
                          </div>
                        ))}
                        {validationResult.errors.length > 10 && (
                          <div className="text-xs text-gray-500 text-center">
                            و {validationResult.errors.length - 10} خطای دیگر...
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Preview */}
                  {validationResult.preview.length > 0 && (
                    <Card variant="ghost" padding="sm">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <Eye size={16} />
                        پیش‌نمایش داده‌ها
                      </h4>
                      <div className="max-h-32 overflow-auto">
                        <div className="text-xs font-mono bg-gray-50 p-2 rounded">
                          {JSON.stringify(validationResult.preview[0], null, 2)}
                        </div>
                      </div>
                    </Card>
                  )}

                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      onClick={handleConfirmImport}
                      disabled={!validationResult.isValid && !importOptions.skipInvalid}
                      leftIcon={<CheckCircle2 size={16} />}
                    >
                      تأیید و درون‌ریزی
                    </Button>
                    <Button variant="outline" onClick={() => setStep('upload')}>
                      انتخاب فایل دیگر
                    </Button>
                  </div>
                </div>
              )}

              {step === 'complete' && (
                <div className="text-center space-y-4">
                  <CheckCircle2 size={64} className="mx-auto text-green-500" />
                  <h3 className="text-lg font-semibold text-gray-900">درون‌ریزی با موفقیت انجام شد</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">{progress}% تکمیل شده</p>
                </div>
              )}
            </div>
          ) : (
            // EXPORT MODE
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">برون‌بری اسناد</h3>

              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">فرمت خروجی:</label>
                <div className="grid grid-cols-2 gap-3">
                  {exportFormats.map((format) => (
                    <button
                      key={format.value}
                      onClick={() => setExportFormat(format.value)}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        exportFormat === format.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        {format.icon}
                        <span className="font-medium">{format.label}</span>
                      </div>
                      <p className="text-xs text-gray-600">{format.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Export Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">گزینه‌های برون‌بری:</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeContent}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, includeContent: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">شامل محتوای کامل اسناد</span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeMetadata}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, includeMetadata: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">شامل اطلاعات متا</span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeHistory}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, includeHistory: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">شامل تاریخچه تغییرات</span>
                  </label>
                </div>
              </div>

              {/* Additional Options */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">فرمت تاریخ:</label>
                  <select
                    value={exportOptions.dateFormat}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, dateFormat: e.target.value as 'persian' | 'gregorian' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="persian">شمسی</option>
                    <option value="gregorian">میلادی</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">کدگذاری:</label>
                  <select
                    value={exportOptions.encoding}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, encoding: e.target.value as 'utf8' | 'utf16' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="utf8">UTF-8</option>
                    <option value="utf16">UTF-16</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle size={16} className="text-red-500" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={handleExport}
                  isLoading={isProcessing}
                  leftIcon={<Download size={16} />}
                >
                  شروع برون‌بری
                </Button>
                <Button variant="outline" onClick={handleClose}>
                  انصراف
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}