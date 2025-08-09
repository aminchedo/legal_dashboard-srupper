import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import DashboardPage from './components/Dashboard/DashboardPage';
import ScrapingPage from './components/Scraping/ScrapingPage';
import DataPage from './components/Data/DataPage';
import AnalyticsPage from './components/Analytics/AnalyticsPage';
import { PageType } from './types';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

function App() {
    const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <DashboardPage />;
            case 'scraping':
                return <ScrapingPage />;
            case 'data':
                return <DataPage />;
            case 'analytics':
                return <AnalyticsPage />;
            default:
                return <DashboardPage />;
        }
    };

    return (
        <QueryClientProvider client= { queryClient } >
        <div className="min-h-screen bg-gray-50" >
            <Layout currentPage={ currentPage } onPageChange = { setCurrentPage } >
                { renderPage() }
                </Layout>
                </div>
                </QueryClientProvider>
  );
}

export default App;

