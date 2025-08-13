import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import DashboardPage from './pages/Dashboard/DashboardPage';

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
            {/* Simple routing - no complex lazy loading for now */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Temporary placeholder routes */}
            <Route path="/jobs" element={<div className="p-8 text-center">Jobs page coming soon</div>} />
            <Route path="/documents" element={<div className="p-8 text-center">Documents page coming soon</div>} />
            <Route path="/system" element={<div className="p-8 text-center">System page coming soon</div>} />
            <Route path="/proxies" element={<div className="p-8 text-center">Proxies page coming soon</div>} />
            <Route path="/data" element={<div className="p-8 text-center">Data page coming soon</div>} />
            <Route path="/analytics" element={<div className="p-8 text-center">Analytics page coming soon</div>} />
            <Route path="/settings" element={<div className="p-8 text-center">Settings page coming soon</div>} />
            <Route path="/help" element={<div className="p-8 text-center">Help page coming soon</div>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppRoutes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;