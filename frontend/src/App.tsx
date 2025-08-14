import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/Dashboard/DashboardPage';
import EnhancedDocumentsPage from './pages/Documents/EnhancedDocumentsPage';
import AnalyticsPage from './pages/Analytics/AnalyticsPage';
import JobsListPage from './pages/Jobs/JobsListPage';
import SystemHealthPage from './pages/System/SystemHealthPage';
import ProxiesPage from './pages/Proxies/ProxiesPage';
import SettingsPage from './pages/Settings/SettingsPage';
import HelpPage from './pages/Help/HelpPage';
import RecordingPage from './pages/Recording/RecordingPage';
import DataPage from './pages/Data/DataPage';

// Create QueryClient with proper configuration
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
    // Set RTL direction for Persian text
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'fa');
    
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
        <Routes>
          <Route path="/*" element={
            <AppLayout>
              <Routes>
                {/* Main application routes */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/documents/*" element={<EnhancedDocumentsPage />} />
                <Route path="/data" element={<DataPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/jobs/*" element={<JobsListPage />} />
                <Route path="/system" element={<SystemHealthPage />} />
                <Route path="/proxies" element={<ProxiesPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/help" element={<HelpPage />} />
                
                {/* Legacy routes - redirect to new structure */}
                <Route path="/scraping" element={<RecordingPage />} />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </AppLayout>
          } />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;