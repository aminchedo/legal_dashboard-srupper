import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LayoutRouter from './components/LayoutRouter';
import DashboardPage from './components/Dashboard/DashboardPage';
import ScrapingPage from './components/Scraping/ScrapingPage';
import DataPage from './components/Data/DataPage';
import AnalyticsPage from './components/Analytics/AnalyticsPage';
import ProxyPage from './components/Proxies/ProxyPage';
import SettingsPage from './components/Settings/SettingsPage';
import HelpPage from './components/Help/HelpPage';
import RecordingPage from './components/Recording/RecordingPage';
import LoginPage from './components/Auth/LoginPage';
import PrivateRoute from './components/Auth/PrivateRoute';
import LoadingScreen from './components/LoadingScreen';
import TestAuthFlow from './components/Auth/TestAuthFlow';

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
    return <LoadingScreen onLoadComplete={() => setInitialLoading(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/test-auth" element={<TestAuthFlow />} />

          {/* Protected routes */}
          <Route path="/" element={<PrivateRoute />}>
            <Route
              path="/"
              element={
                <LayoutRouter>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/scraping" element={<ScrapingPage />} />
                    <Route path="/data" element={<DataPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/proxies" element={<ProxyPage />} />
                    <Route path="/recording" element={<RecordingPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/help" element={<HelpPage />} />
                  </Routes>
                </LayoutRouter>
              }
            />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;