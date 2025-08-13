import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LayoutRouter from '../components/LayoutRouter';
import DashboardPage from './components/Dashboard/DashboardPage';
import DataPage from './components/Data/DataPage';
import ProxiesPage from './components/Proxies/ProxyPage';
import ScrapingPage from './components/Scraping/ScrapingPage';
import AnalyticsPage from './components/Analytics/AnalyticsPage';
import SystemHealthPage from './components/SystemHealth/SystemHealthPage';
import ReportsPage from './components/Reports/ReportsPage';
import UsersPage from './components/Users/UsersPage';
import LoginPage from './components/Auth/LoginPage';
import PrivateRoute from './components/Auth/PrivateRoute';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<PrivateRoute />}>
                    <Route
                        path="/"
                        element={
                            <LayoutRouter>
                                <Routes>
                                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                    <Route path="/dashboard" element={<DashboardPage />} />
                                    <Route path="/data" element={<DataPage />} />
                                    <Route path="/proxies" element={<ProxiesPage />} />
                                    <Route path="/scraping" element={<ScrapingPage />} />
                                    <Route path="/analytics" element={<AnalyticsPage />} />
                                    <Route path="/health" element={<SystemHealthPage />} />
                                    <Route path="/system-health" element={<SystemHealthPage />} />
                                    <Route path="/reports" element={<ReportsPage />} />
                                    <Route path="/users" element={<UsersPage />} />
                                    <Route path="/documents" element={<DataPage />} />
                                    <Route path="/projects" element={<DashboardPage />} />
                                    <Route path="/settings" element={<div className="p-6"><h1 className="text-2xl font-bold">تنظیمات سیستم</h1><p className="text-gray-600 mt-2">در حال توسعه...</p></div>} />
                                    <Route path="/help" element={<div className="p-6"><h1 className="text-2xl font-bold">راهنما و پشتیبانی</h1><p className="text-gray-600 mt-2">مستندات و راهنمای استفاده از سیستم</p></div>} />
                                    <Route path="/audit" element={<div className="p-6"><h1 className="text-2xl font-bold">گزارش حسابرسی</h1><p className="text-gray-600 mt-2">لاگ فعالیت‌های سیستم و کاربران</p></div>} />
                                    <Route path="*" element={<div className="p-6"><h1 className="text-2xl font-bold">صفحه پیدا نشد</h1><p className="text-gray-600 mt-2">صفحه مورد نظر شما وجود ندارد.</p></div>} />
                                </Routes>
                            </LayoutRouter>
                        }
                    />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;

