import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Provider Component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000
    };

    setToasts(prev => [...prev, newToast]);

    // Auto dismiss
    if (newToast.duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, newToast.duration);
    }
  }, [dismissToast]);

  const showSuccess = useCallback((title: string, message?: string) => {
    showToast({ type: 'success', title, message });
  }, [showToast]);

  const showError = useCallback((title: string, message?: string) => {
    showToast({ type: 'error', title, message });
  }, [showToast]);

  const showWarning = useCallback((title: string, message?: string) => {
    showToast({ type: 'warning', title, message });
  }, [showToast]);

  const showInfo = useCallback((title: string, message?: string) => {
    showToast({ type: 'info', title, message });
  }, [showToast]);

  const value: ToastContextValue = {
    toasts,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismissToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Individual Toast Component
interface ToastComponentProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const ToastComponent: React.FC<ToastComponentProps> = ({ toast, onDismiss }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (toast.duration! / 100));
          return Math.max(0, newProgress);
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [toast.duration]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-success-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-error-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return cn(
          'bg-success-50 border-success-200 dark:bg-success-900/20 dark:border-success-800',
          'text-success-800 dark:text-success-200'
        );
      case 'error':
        return cn(
          'bg-error-50 border-error-200 dark:bg-error-900/20 dark:border-error-800',
          'text-error-800 dark:text-error-200'
        );
      case 'warning':
        return cn(
          'bg-warning-50 border-warning-200 dark:bg-warning-900/20 dark:border-warning-800',
          'text-warning-800 dark:text-warning-200'
        );
      case 'info':
        return cn(
          'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
          'text-blue-800 dark:text-blue-200'
        );
    }
  };

  const getProgressColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-success-500';
      case 'error':
        return 'bg-error-500';
      case 'warning':
        return 'bg-warning-500';
      case 'info':
        return 'bg-blue-500';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 1
      }}
      className={cn(
        'relative max-w-sm w-full pointer-events-auto',
        'border rounded-lg shadow-lg overflow-hidden',
        'backdrop-blur-sm',
        getStyles()
      )}
    >
      {/* Progress Bar */}
      {toast.duration && toast.duration > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-black/10">
          <motion.div
            className={cn('h-full', getProgressColor())}
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium leading-5 mb-1">
                  {toast.title}
                </h4>
                {toast.message && (
                  <p className="text-sm opacity-90 leading-5">
                    {toast.message}
                  </p>
                )}
              </div>

              <button
                onClick={() => onDismiss(toast.id)}
                className={cn(
                  'inline-flex rounded-md p-1.5 transition-colors duration-200',
                  'hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2',
                  toast.type === 'success' && 'focus:ring-success-500',
                  toast.type === 'error' && 'focus:ring-error-500',
                  toast.type === 'warning' && 'focus:ring-warning-500',
                  toast.type === 'info' && 'focus:ring-blue-500'
                )}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {toast.action && (
              <div className="mt-3">
                <button
                  onClick={() => {
                    toast.action!.onClick();
                    onDismiss(toast.id);
                  }}
                  className={cn(
                    'text-sm font-medium underline decoration-2 underline-offset-2',
                    'hover:no-underline transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2 rounded',
                    toast.type === 'success' && 'text-success-700 dark:text-success-300 focus:ring-success-500',
                    toast.type === 'error' && 'text-error-700 dark:text-error-300 focus:ring-error-500',
                    toast.type === 'warning' && 'text-warning-700 dark:text-warning-300 focus:ring-warning-500',
                    toast.type === 'info' && 'text-blue-700 dark:text-blue-300 focus:ring-blue-500'
                  )}
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Toast Container Component
const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-2 rtl:left-0 rtl:right-auto">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            toast={toast}
            onDismiss={dismissToast}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastComponent;
export { ToastContainer };