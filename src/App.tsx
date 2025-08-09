import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LayoutRouter from '../components/LayoutRouter';
import DashboardPage from './components/Dashboard/DashboardPage';
import DataPage from './components/Data/DataPage';
import ProxiesPage from './components/Proxies/ProxyPage';
import ScrapingPage from './components/Scraping/ScrapingPage';
import AnalyticsPage from './components/Analytics/AnalyticsPage';
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

