import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, File, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn, formatBytes } from '../../lib/utils';
import Button from './Button';

export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  disabled?: boolean;
  label?: string;
  hint?: string;
  error?: string;
  onFilesChange?: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  className?: string;
}

interface FileWithProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 10,
  disabled = false,
  label,
  hint,
  error,
  onFilesChange,
  onUpload,
  className
}) => {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `حجم فایل نباید بیشتر از ${formatBytes(maxSize)} باشد`;
    }
    
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const mimeType = file.type;
      
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExtension === type;
        }
        return mimeType.match(new RegExp(type.replace('*', '.*')));
      });
      
      if (!isAccepted) {
        return `نوع فایل مجاز نیست. فرمت‌های قابل قبول: ${accept}`;
      }
    }
    
    return null;
  };

  const addFiles = useCallback((newFiles: File[]) => {
    const validFiles: FileWithProgress[] = [];
    const errors: string[] = [];

    for (const file of newFiles) {
      if (files.length + validFiles.length >= maxFiles) {
        errors.push(`حداکثر ${maxFiles} فایل قابل انتخاب است`);
        break;
      }

      // Check if file already exists
      if (files.some(f => f.file.name === file.name && f.file.size === file.size)) {
        errors.push(`فایل ${file.name} قبلاً انتخاب شده است`);
        continue;
      }

      const validationError = validateFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
        continue;
      }

      validFiles.push({
        file,
        progress: 0,
        status: 'pending'
      });
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles.map(f => f.file));
    }

    if (errors.length > 0) {
      console.warn('File upload errors:', errors);
    }
  }, [files, maxFiles, onFilesChange]);

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles.map(f => f.file));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 0) {
      addFiles(selectedFiles);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const droppedFiles = Array.from(event.dataTransfer.files);
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles);
    }
  };

  const handleUpload = async () => {
    if (!onUpload || files.length === 0 || isUploading) return;

    setIsUploading(true);
    
    try {
      // Simulate upload progress
      const updatedFiles = [...files];
      
      for (let i = 0; i < updatedFiles.length; i++) {
        if (updatedFiles[i].status === 'pending') {
          updatedFiles[i].status = 'uploading';
          setFiles([...updatedFiles]);

          // Simulate progress
          for (let progress = 0; progress <= 100; progress += 10) {
            updatedFiles[i].progress = progress;
            setFiles([...updatedFiles]);
            await new Promise(resolve => setTimeout(resolve, 100));
          }

          updatedFiles[i].status = 'success';
          setFiles([...updatedFiles]);
        }
      }

      await onUpload(files.map(f => f.file));
    } catch (error) {
      // Mark all uploading files as error
      const updatedFiles = files.map(f => ({
        ...f,
        status: f.status === 'uploading' ? 'error' as const : f.status,
        error: f.status === 'uploading' ? 'خطا در آپلود فایل' : f.error
      }));
      setFiles(updatedFiles);
    } finally {
      setIsUploading(false);
    }
  };

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 rtl:text-right">
          {label}
        </label>
      )}

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer',
          'flex flex-col items-center justify-center text-center',
          'hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/10',
          isDragOver && 'border-primary-400 bg-primary-50 dark:bg-primary-900/20',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-error-400',
          !error && !isDragOver && 'border-neutral-300 dark:border-neutral-700'
        )}
      >
        <Upload className="w-8 h-8 text-neutral-400 dark:text-neutral-500 mb-2" />
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            فایل‌ها را اینجا بکشید یا کلیک کنید
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {accept && `فرمت‌های مجاز: ${accept}`}
            {maxSize && ` • حداکثر حجم: ${formatBytes(maxSize)}`}
            {multiple && ` • حداکثر ${maxFiles} فایل`}
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 rtl:text-right">
            فایل‌های انتخاب شده ({files.length})
          </h4>
          
          <div className="space-y-2">
            {files.map((fileItem, index) => (
              <div
                key={`${fileItem.file.name}-${index}`}
                className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
              >
                <File className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate">
                      {fileItem.file.name}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 flex-shrink-0">
                      {formatBytes(fileItem.file.size)}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  {fileItem.status === 'uploading' && (
                    <div className="mt-1">
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-1.5">
                        <div
                          className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${fileItem.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        {fileItem.progress}%
                      </span>
                    </div>
                  )}
                  
                  {/* Error Message */}
                  {fileItem.status === 'error' && fileItem.error && (
                    <p className="text-xs text-error-600 dark:text-error-400 mt-1">
                      {fileItem.error}
                    </p>
                  )}
                </div>

                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {fileItem.status === 'success' && (
                    <CheckCircle2 className="w-4 h-4 text-success-500" />
                  )}
                  {fileItem.status === 'error' && (
                    <AlertCircle className="w-4 h-4 text-error-500" />
                  )}
                  {fileItem.status === 'pending' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded"
                      disabled={isUploading}
                    >
                      <X className="w-3 h-3 text-neutral-500" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          {onUpload && files.some(f => f.status === 'pending') && (
            <Button
              onClick={handleUpload}
              loading={isUploading}
              disabled={files.length === 0 || isUploading}
              variant="primary"
              size="sm"
              className="w-full"
            >
              آپلود فایل‌ها
            </Button>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-error-600 dark:text-error-400 rtl:text-right">
          {error}
        </p>
      )}

      {/* Hint */}
      {!error && hint && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400 rtl:text-right">
          {hint}
        </p>
      )}
    </div>
  );
};

export default FileUpload;