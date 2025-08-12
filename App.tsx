import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Components
import LayoutRouter from './components/LayoutRouter';
import PrivateRoute from './components/Auth/PrivateRoute';
import LoginPage from './components/Auth/LoginPage';
import TestAuthFlow from './components/Auth/TestAuthFlow';

// Pages - با مسیر دقیق که شما گفتید
import DashboardPage from './pages/Dashboard/DashboardPage';
import ScrapingPage from './components/Scraping/ScrapingPage';
import DataPage from './components/Data/DataPage';
import AnalyticsPage from './components/Analytics/AnalyticsPage';
import ProxyPage from './components/Proxies/ProxyPage';
import SettingsPage from './components/Settings/SettingsPage';
import HelpPage from './components/Help/HelpPage';
import RecordingPage from './components/Recording/RecordingPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  console.log('App component loaded');

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