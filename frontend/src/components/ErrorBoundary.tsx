import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ErrorBoundary: React.FC<Props> = ({ children, fallback }) => {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('ERR_CONNECTION_REFUSED')) {
        setHasError(true);
        setError(new Error('Backend connection failed'));
        event.preventDefault(); // Prevent console error
      }
    };

    const handleError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('ERR_CONNECTION_REFUSED')) {
        setHasError(true);
        setError(event.error);
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (hasError) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.312 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">خطا در اتصال به سرور</h2>
          <p className="text-gray-600 mb-6">
            امکان اتصال به backend وجود ندارد. در حال نمایش داده‌های نمونه...
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => {
                setHasError(false);
                setError(null);
                window.location.reload();
              }}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              تلاش مجدد
            </button>
            <button 
              onClick={() => {
                setHasError(false);
                setError(null);
              }}
              className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              ادامه با داده‌های نمونه
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left">
              <summary className="text-sm text-gray-500 cursor-pointer">جزئیات خطا</summary>
              <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                {error?.message || 'Unknown error'}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};