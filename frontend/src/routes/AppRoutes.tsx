import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { PageType } from '../types';

// تابع تبدیل مسیر به نوع صفحه
function pathToPageType(pathname: string): PageType {
    if (pathname.startsWith('/analytics')) return 'analytics';
    if (pathname.startsWith('/recording')) return 'recording';
    if (pathname.startsWith('/jobs')) return 'jobs';
    if (pathname.startsWith('/documents')) return 'documents';
    if (pathname.startsWith('/system')) return 'system';
    if (pathname.startsWith('/proxies')) return 'proxies';
    if (pathname.startsWith('/settings')) return 'settings';
    if (pathname.startsWith('/help')) return 'help';
    if (pathname.startsWith('/data')) return 'data';
    return 'dashboard';
}

// تابع تبدیل نوع صفحه به مسیر
function pageTypeToPath(page: PageType): string {
    switch (page) {
        case 'analytics':
            return '/analytics';
        case 'recording':
            return '/recording'; // اصلاح شده از '/Modal' به '/recording'
        case 'jobs':
            return '/jobs';
        case 'documents':
            return '/documents';
        case 'system':
            return '/system';
        case 'proxies':
            return '/proxies';
        case 'settings':
            return '/settings';
        case 'help':
            return '/help';
        case 'data':
            return '/data';
        default:
            return '/dashboard';
    }
}

interface Props {
    children: React.ReactNode;
}

export default function AppRoutes({ children }: Props) {
    const location = useLocation();
    const navigate = useNavigate();

    const currentPage = pathToPageType(location.pathname);
    const onPageChange = (page: PageType) => navigate(pageTypeToPath(page));

    return (
        <AppLayout currentPage={currentPage} onPageChange={onPageChange}>
            {children}
        </AppLayout>
    );
}



