import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import AppLayout from './components/Layout/AppLayout';
import PrivateRoute from './components/Auth/PrivateRoute';
import LoadingSpinner from './components/UI/LoadingSpinner';
import ToastContainer from './components/UI/ToastContainer';
import { motion } from 'framer-motion';

// Lazy load pages for better performance
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const DocumentsPage = React.lazy(() => import('./pages/DocumentsPage'));
const AnalyticsPage = React.lazy(() => import('./pages/AnalyticsPage'));
const JobsPage = React.lazy(() => import('./pages/JobsPage'));
const ProxiesPage = React.lazy(() => import('./pages/ProxiesPage'));
const SystemPage = React.lazy(() => import('./pages/SystemPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const HelpPage = React.lazy(() => import('./pages/HelpPage'));
const RecordingPage = React.lazy(() => import('./pages/RecordingPage'));
const DataPage = React.lazy(() => import('./pages/DataPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));

// Error fallback component
const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({ 
  error, 
  resetErrorBoundary 
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="max-w-md w-full premium-card shadow-xl p-8">
      <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 dark:bg-red-900 rounded-full mb-6">
        <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-3 persian-text">
        خطایی رخ داده است
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6 persian-text">
        {error.message}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="w-full premium-button premium-button-primary"
      >
        تلاش مجدد
      </button>
    </div>
  </div>
);

// Premium Loading fallback for Suspense
const PageLoadingFallback: React.FC = () => (
  <LoadingSpinner 
    variant="fullscreen" 
    showProgress={true} 
    progress={85}
    text="در حال بارگذاری صفحه..."
  />
);

// Premium App Loading Component
const AppLoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  const loadingSteps = [
    'در حال راه‌اندازی سیستم...',
    'بارگذاری کامپوننت‌ها...',
    'اتصال به سرور...',
    'آماده‌سازی داشبورد...',
    'تقریباً آماده است...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <LoadingSpinner 
      variant="fullscreen" 
      showProgress={true} 
      progress={progress}
      text={loadingSteps[currentStep]}
    />
  );
};

const App: React.FC = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isAppLoading) {
    return <AppLoadingScreen />;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Routes>
            {/* Public routes */}
            <Route
              path="/login"
              element={
                <React.Suspense fallback={<PageLoadingFallback />}>
                  <LoginPage />
                </React.Suspense>
              }
            />

            {/* Private routes wrapped in AppLayout */}
            <Route path="/" element={<PrivateRoute />}>
              <Route
                path="/"
                element={
                  <AppLayout>
                    <Routes>
                      {/* Redirect root to dashboard */}
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      
                      {/* Main application pages */}
                      <Route
                        path="/dashboard"
                        element={
                          <React.Suspense fallback={<PageLoadingFallback />}>
                            <DashboardPage />
                          </React.Suspense>
                        }
                      />
                      
                      <Route
                        path="/documents"
                        element={
                          <React.Suspense fallback={<PageLoadingFallback />}>
                            <DocumentsPage />
                          </React.Suspense>
                        }
                      />
                      
                      <Route
                        path="/analytics"
                        element={
                          <React.Suspense fallback={<PageLoadingFallback />}>
                            <AnalyticsPage />
                          </React.Suspense>
                        }
                      />
                      
                      <Route
                        path="/jobs"
                        element={
                          <React.Suspense fallback={<PageLoadingFallback />}>
                            <JobsPage />
                          </React.Suspense>
                        }
                      />
                      
                      <Route
                        path="/proxies"
                        element={
                          <React.Suspense fallback={<PageLoadingFallback />}>
                            <ProxiesPage />
                          </React.Suspense>
                        }
                      />
                      
                      <Route
                        path="/system"
                        element={
                          <React.Suspense fallback={<PageLoadingFallback />}>
                            <SystemPage />
                          </React.Suspense>
                        }
                      />
                      
                      <Route
                        path="/settings"
                        element={
                          <React.Suspense fallback={<PageLoadingFallback />}>
                            <SettingsPage />
                          </React.Suspense>
                        }
                      />
                      
                      <Route
                        path="/help"
                        element={
                          <React.Suspense fallback={<PageLoadingFallback />}>
                            <HelpPage />
                          </React.Suspense>
                        }
                      />
                      
                      <Route
                        path="/recording"
                        element={
                          <React.Suspense fallback={<PageLoadingFallback />}>
                            <RecordingPage />
                          </React.Suspense>
                        }
                      />
                      
                      <Route
                        path="/data"
                        element={
                          <React.Suspense fallback={<PageLoadingFallback />}>
                            <DataPage />
                          </React.Suspense>
                        }
                      />

                      {/* Legacy route redirects */}
                      <Route path="/health" element={<Navigate to="/system" replace />} />
                      <Route path="/system-health" element={<Navigate to="/system" replace />} />
                      <Route path="/reports" element={<Navigate to="/analytics" replace />} />
                      <Route path="/users" element={<Navigate to="/settings" replace />} />
                      <Route path="/projects" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/scraping" element={<Navigate to="/jobs" replace />} />
                      <Route path="/audit" element={<Navigate to="/system" replace />} />

                      {/* 404 fallback */}
                      <Route
                        path="*"
                        element={
                          <div className="flex items-center justify-center min-h-screen">
                            <div className="text-center">
                              <div className="mb-8">
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ duration: 0.5, type: "spring" }}
                                >
                                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                                    <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.802-6.207-2.145M5.636 20.364A9.958 9.958 0 0112 22a9.958 9.958 0 016.364-2.636M2.636 7.636A9.958 9.958 0 012 12c0 1.773.463 3.444 1.276 4.887" />
                                    </svg>
                                  </div>
                                </motion.div>
                              </div>
                              <motion.h1 
                                className="text-4xl font-bold text-gray-900 dark:text-white mb-4 persian-text"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                              >
                                صفحه یافت نشد
                              </motion.h1>
                              <motion.p 
                                className="text-gray-600 dark:text-gray-400 mb-8 persian-text"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                              >
                                صفحه‌ای که به دنبال آن هستید وجود ندارد.
                              </motion.p>
                              <motion.button
                                onClick={() => window.history.back()}
                                className="premium-button premium-button-primary"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                بازگشت
                              </motion.button>
                            </div>
                          </div>
                        }
                      />
                    </Routes>
                  </AppLayout>
                }
              />
            </Route>
          </Routes>

          {/* Global Toast Container */}
          <ToastContainer />
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;

