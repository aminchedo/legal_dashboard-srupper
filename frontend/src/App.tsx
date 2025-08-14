import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ErrorBoundary from './components/ErrorBoundary';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/Dashboard/DashboardPage';
import DocumentsListPage from './pages/Documents/DocumentsListPage';
import AnalyticsPage from './pages/Analytics/AnalyticsPage';
import JobsListPage from './pages/Jobs/JobsListPage';
import SystemHealthPage from './pages/System/SystemHealthPage';
import ProxiesPage from './pages/Proxies/ProxiesPage';
import SettingsPage from './pages/Settings/SettingsPage';
import HelpPage from './pages/Help/HelpPage';
import RecordingPage from './pages/Recording/RecordingPage';
import DataPage from './pages/Data/DataPage';
import LoadingSpinner from './components/ui/LoadingSpinner';
import Button from './components/ui/Button';

// تعریف نوع برای مسیرهای برنامه
interface AppRoute {
  path: string;
  component: React.ComponentType;
  name: string;
  description?: string;
}

// تعریف مسیرهای اصلی برنامه با توضیحات فارسی
const appRoutes: AppRoute[] = [
  { path: '/dashboard', component: DashboardPage, name: 'داشبورد', description: 'صفحه اصلی و نمای کلی' },
  { path: '/documents', component: DocumentsListPage, name: 'مستندات', description: 'مدیریت اسناد حقوقی' },
  { path: '/analytics', component: AnalyticsPage, name: 'آنالیز', description: 'آمار و تحلیل‌ها' },
  { path: '/jobs', component: JobsListPage, name: 'وظایف', description: 'مدیریت وظایف و پروژه‌ها' },
  { path: '/system', component: SystemHealthPage, name: 'وضعیت سیستم', description: 'نظارت بر سلامت سیستم' },
  { path: '/proxies', component: ProxiesPage, name: 'پروکسی‌ها', description: 'مدیریت پروکسی‌ها' },
  { path: '/recording', component: RecordingPage, name: 'ضبط', description: 'ضبط و اسکرپینگ' },
  { path: '/settings', component: SettingsPage, name: 'تنظیمات', description: 'تنظیمات عمومی' },
  { path: '/help', component: HelpPage, name: 'راهنما', description: 'راهنما و پشتیبانی' },
  { path: '/data', component: DataPage, name: 'داده‌ها', description: 'مدیریت داده‌ها' },
];

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

// کامپوننت بارگذاری صفحه
const PageLoadingFallback: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingSpinner variant="progress" size="lg" text="در حال بارگذاری صفحه..." />
    </div>
  );
};

// صفحه بارگذاری برنامه
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

// کامپوننت 404 بهبود یافته
const NotFoundPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-gray-50"
    >
      <div className="premium-card p-8 max-w-md w-full mx-4 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2 persian-text">
            صفحه یافت نشد
          </h2>
          <p className="text-gray-600 persian-text">
            صفحه‌ای که به دنبال آن هستید وجود ندارد.
          </p>
        </div>
        
        <Button 
          onClick={() => window.location.href = '/dashboard'}
          variant="primary"
          className="w-full"
        >
          بازگشت به داشبورد
        </Button>
      </div>
    </motion.div>
  );
};

// کامپوننت اصلی برنامه
function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // تنظیم جهت RTL برای متن فارسی
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'fa');
    
    // شبیه‌سازی زمان بارگذاری برنامه
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <AppLoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppLayout>
            <Routes>
              {/* مسیرهای اصلی برنامه */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* مسیرهای تعریف شده */}
              {appRoutes.map((route) => (
                <Route 
                  key={route.path}
                  path={route.path} 
                  element={<route.component />} 
                />
              ))}
              
              {/* مسیرهای مستندات با wildcard */}
              <Route path="/documents/*" element={<DocumentsListPage />} />
              <Route path="/jobs/*" element={<JobsListPage />} />
              
              {/* مسیرهای جایگزین (Aliases) برای سازگاری */}
              <Route path="/scraping" element={<Navigate to="/recording" replace />} />
              <Route path="/general-settings" element={<Navigate to="/settings" replace />} />
              <Route path="/analysis" element={<Navigate to="/analytics" replace />} />
              <Route path="/dashboard-home" element={<Navigate to="/dashboard" replace />} />
              <Route path="/system-health" element={<Navigate to="/system" replace />} />
              <Route path="/data-management" element={<Navigate to="/data" replace />} />
              
              {/* صفحه 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AppLayout>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
