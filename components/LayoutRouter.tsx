import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { PageType } from '../types';

function pathToPageType(pathname: string): PageType {
    if (pathname.startsWith('/scraping')) return 'scraping';
    if (pathname.startsWith('/data')) return 'data';
    if (pathname.startsWith('/analytics')) return 'analytics';
    if (pathname.startsWith('/proxies')) return 'proxies';
    if (pathname.startsWith('/settings')) return 'settings';
    if (pathname.startsWith('/help')) return 'help';
    return 'dashboard';
}

function pageTypeToPath(page: PageType): string {
    switch (page) {
        case 'scraping':
            return '/scraping';
        case 'data':
            return '/data';
        case 'analytics':
            return '/analytics';
        case 'proxies':
            return '/proxies';
        case 'settings':
            return '/settings';
        case 'help':
            return '/help';
        default:
            return '/dashboard';
    }
}

interface Props {
    children: React.ReactNode;
}

export default function LayoutRouter({ children }: Props) {
    const location = useLocation();
    const navigate = useNavigate();

    const currentPage = pathToPageType(location.pathname);
    const onPageChange = (page: PageType) => navigate(pageTypeToPath(page));

    return (
        <Layout currentPage={currentPage} onPageChange={onPageChange}>
            {children}
        </Layout>
    );
}


