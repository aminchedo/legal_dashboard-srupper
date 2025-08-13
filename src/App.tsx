import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import AppLayout from './components/Layout/AppLayout';
import PrivateRoute from './components/Auth/PrivateRoute';
import LoadingSpinner from './components/UI/LoadingSpinner';
import ToastContainer from './components/UI/ToastContainer';

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
    <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900 rounded-full mb-4">
        <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
        {error.message}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
      >
        Try again
      </button>
    </div>
  </div>
);

// Loading fallback for Suspense
const PageLoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

const App: React.FC = () => {
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
                          <React.Suspense fallback={<LoadingSpinner size="lg" />}>
                            <DashboardPage />
                          </React.Suspense>
                        }
                      />
                      
                      <Route
                        path="/documents"
                        element={
                          <React.Suspense fallback={<LoadingSpinner size="lg" />}>
                            <DocumentsPage />
                          </React.Suspense>
                        }
                      />
                      
                      <Route
                        path="/analytics"
                        element={
                          <React.Suspense fallback={<LoadingSpinner size="lg" />}>
                            <AnalyticsPage />
                          </React.Suspense>
                        }
                      />
                      
                      <Route
                        path="/jobs"
                        element={
                          <React.Suspense fallback={<LoadingSpinner size="lg" />}>
                            <JobsPage />
                          </React.Suspense>
                        }
                      />
                      
                      <Route
                        path="/proxies"
                        element={
                          <React.Suspense fallback={<LoadingSpinner size="lg" />}>
                            <ProxiesPage />
                          </React.Suspense>
                        }
                      />
                      
                      <Route
                        path="/system"
                        element={
                          <React.Suspense fallback={<LoadingSpinner size="lg" />}>
                            <SystemPage />
                          </React.Suspense>
                        }
                      />
                      
                      <Route
                        path="/settings"
                        element={
                          <React.Suspense fallback={<LoadingSpinner size="lg" />}>
                            <SettingsPage />
                          </React.Suspense>
                        }
                      />
                      
                      <Route
                        path="/help"
                        element={
                          <React.Suspense fallback={<LoadingSpinner size="lg" />}>
                            <HelpPage />
                          </React.Suspense>
                        }
                      />
                      
                      <Route
                        path="/recording"
                        element={
                          <React.Suspense fallback={<LoadingSpinner size="lg" />}>
                            <RecordingPage />
                          </React.Suspense>
                        }
                      />
                      
                      <Route
                        path="/data"
                        element={
                          <React.Suspense fallback={<LoadingSpinner size="lg" />}>
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
                          <div className="p-6 text-center">
                            <div className="max-w-md mx-auto">
                              <div className="mb-4">
                                <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.802-6.207-2.145M5.636 20.364A9.958 9.958 0 0112 22a9.958 9.958 0 016.364-2.636M2.636 7.636A9.958 9.958 0 012 12c0 1.773.463 3.444 1.276 4.887" />
                                </svg>
                              </div>
                              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Page Not Found
                              </h1>
                              <p className="text-gray-600 dark:text-gray-400 mb-4">
                                The page you're looking for doesn't exist.
                              </p>
                              <button
                                onClick={() => window.history.back()}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
                              >
                                Go Back
                              </button>
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

