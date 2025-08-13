import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import DashboardPage from './pages/Dashboard/DashboardPage';

// Lazy load other pages to prevent initial loading errors
const JobsListPage = React.lazy(() => import('./pages/Jobs/JobsListPage').catch(() => ({ default: () => <div>Jobs page temporarily unavailable</div> })));
const DocumentsListPage = React.lazy(() => import('./pages/Documents/DocumentsListPage').catch(() => ({ default: () => <div>Documents page temporarily unavailable</div> })));
const SystemHealthPage = React.lazy(() => import('./pages/System/SystemHealthPage').catch(() => ({ default: () => <div>System page temporarily unavailable</div> })));
const ProxyPage = React.lazy(() => import('./components/Proxies/ProxyPage').catch(() => ({ default: () => <div>Proxies page temporarily unavailable</div> })));
const DataPage = React.lazy(() => import('./components/Data/DataPage').catch(() => ({ default: () => <div>Data page temporarily unavailable</div> })));
const AnalyticsPage = React.lazy(() => import('./components/Analytics/AnalyticsPage').catch(() => ({ default: () => <div>Analytics page temporarily unavailable</div> })));
const SettingsPage = React.lazy(() => import('./pages/Settings/SettingsPage').catch(() => ({ default: () => <div>Settings page temporarily unavailable</div> })));
const HelpPage = React.lazy(() => import('./pages/Help/HelpPage').catch(() => ({ default: () => <div>Help page temporarily unavailable</div> })));

// Create a basic query client mock if @tanstack/react-query is not available
let QueryClientProvider: React.ComponentType<{ client: any; children: React.ReactNode }>;
let queryClient: any;

try {
  const ReactQuery = require('@tanstack/react-query');
  QueryClientProvider = ReactQuery.QueryClientProvider;
  queryClient = new ReactQuery.QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
      },
    },
  });
} catch (error) {
  // Fallback if react-query is not available
  QueryClientProvider = ({ children }: { children: React.ReactNode; client?: any }) => <>{children}</>;
  queryClient = {};
}

const App: React.FC = () => {
  useEffect(() => {
    // Hide loading screen when React app loads
    const hideLoadingScreen = () => {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        // Remove from DOM after animation
        setTimeout(() => {
          if (loadingScreen.parentNode) {
            loadingScreen.parentNode.removeChild(loadingScreen);
          }
        }, 600); // Match CSS transition duration
      }
    };

    // Hide loading screen after a short delay to ensure app is rendered
    const timer = setTimeout(hideLoadingScreen, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes>
          <Suspense fallback={<div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/jobs" element={<JobsListPage />} />
              <Route path="/documents" element={<DocumentsListPage />} />
              <Route path="/system" element={<SystemHealthPage />} />
              <Route path="/proxies" element={<ProxyPage />} />
              <Route path="/data" element={<DataPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </AppRoutes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;