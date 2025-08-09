import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import DashboardPage from './pages/Dashboard/DashboardPage';
import JobsListPage from './pages/Jobs/JobsListPage';
import DocumentsListPage from './pages/Documents/DocumentsListPage';
import SystemHealthPage from './pages/System/SystemHealthPage';
import ProxiesPage from './pages/Proxies/ProxiesPage';
import SettingsPage from './pages/Settings/SettingsPage';
import HelpPage from './pages/Help/HelpPage';
import LoginPage from './pages/Auth/LoginPage';
import ProtectedRoute from './routes/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import AuthGuard from './pages/Auth/components/AuthGuard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  // Remove the built-in loading screen from index.html when our component-based one is ready
  useEffect(() => {
    if (!initialLoading) {
      const htmlLoadingScreen = document.getElementById('loading-screen');
      if (htmlLoadingScreen && htmlLoadingScreen.parentNode) {
        htmlLoadingScreen.parentNode.removeChild(htmlLoadingScreen);
      }
    }
  }, [initialLoading]);

  if (initialLoading) {
    return <LoadingSpinner onLoadComplete={() => setInitialLoading(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/test-auth" element={<AuthGuard />} />

          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route
              path="/"
              element={
                <AppRoutes>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/jobs" element={<JobsListPage />} />
                    <Route path="/documents" element={<DocumentsListPage />} />
                    <Route path="/system" element={<SystemHealthPage />} />
                    <Route path="/proxies" element={<ProxiesPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/help" element={<HelpPage />} />
                  </Routes>
                </AppRoutes>
              }
            />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;