import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import DashboardPage from './pages/Dashboard/DashboardPage';
import JobsListPage from './pages/Jobs/JobsListPage';
import DocumentsListPage from './pages/Documents/DocumentsListPage';
import SystemHealthPage from './pages/System/SystemHealthPage';
import ProxiesPage from './pages/Proxies/ProxiesPage';
import SettingsPage from './pages/Settings/SettingsPage';
import HelpPage from './pages/Help/HelpPage';

// Create QueryClient properly - NO try-catch needed
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  useEffect(() => {
    // Hide loading screen when React app loads
    const hideLoadingScreen = () => {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
          if (loadingScreen.parentNode) {
            loadingScreen.parentNode.removeChild(loadingScreen);
          }
        }, 600);
      }
    };

    const timer = setTimeout(hideLoadingScreen, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppRoutes>
          <Routes>
            {/* Main application routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/jobs" element={<JobsListPage />} />
            <Route path="/documents" element={<DocumentsListPage />} />
            <Route path="/system" element={<SystemHealthPage />} />
            <Route path="/proxies" element={<ProxiesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help" element={<HelpPage />} />
            
            {/* Legacy routes - redirect to new structure */}
            <Route path="/data" element={<Navigate to="/documents" replace />} />
            <Route path="/analytics" element={<Navigate to="/dashboard" replace />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppRoutes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;