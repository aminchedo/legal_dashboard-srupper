import { useEffect, useState } from 'react';
import {
    BarChart3,
    Database,
    Globe,
    Home,
    Menu,
    Settings,
    Scale,
    Bell,
    Search
} from 'lucide-react';
import { PageType } from '../types';

interface LayoutProps {
    children: React.ReactNode;
    currentPage: PageType;
    onPageChange: (page: PageType) => void;
}

const navigationItems = [
    { id: 'dashboard' as PageType, label: 'داشبورد کلی', icon: Home },
    { id: 'scraping' as PageType, label: 'وب اسکرپینگ', icon: Globe },
    { id: 'data' as PageType, label: 'داده‌های جمع‌آوری شده', icon: Database },
    { id: 'analytics' as PageType, label: 'تحلیل و گزارش', icon: BarChart3 },
];

export default function Layout({ children, currentPage, onPageChange }: LayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        try {
            const saved = localStorage.getItem('theme');
            if (saved) return saved === 'dark';
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        } catch {
            return false;
        }
    });
    const [language, setLanguage] = useState<'fa' | 'en'>(() => {
        try {
            const saved = localStorage.getItem('lang');
            if (saved === 'en' || saved === 'fa') return saved;
            return 'fa';
        } catch {
            return 'fa';
        }
    });
    const [globalQuery, setGlobalQuery] = useState('');

    useEffect(() => {
        const root = document.documentElement;
        if (darkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('dir', language === 'fa' ? 'rtl' : 'ltr');
        localStorage.setItem('lang', language);
    }, [language]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            {/* Header */}
            <header className="relative overflow-hidden bg-gradient-to-l from-blue-800 to-blue-900 text-white shadow-lg">
                <div className="absolute inset-0 opacity-20 bg-gradient-radial" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 gap-3">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="md:hidden p-2 rounded-md hover:bg-white/10 transition-colors"
                            >
                                <Menu size={24} />
                            </button>
                            <div className="flex items-center gap-3">
                                <Scale className="text-yellow-400 animate-float" size={32} />
                                <div>
                                    <h1 className="text-xl font-bold">داشبورد حقوقی ایران</h1>
                                    <p className="text-blue-200 text-sm">سامانه هوشمند مدیریت اطلاعات حقوقی</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 flex-1 max-w-xl">
                            {/* Global search */}
                            <div className="hidden md:flex items-center gap-2 flex-1 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg px-3 py-1.5">
                                <Search size={18} className="text-blue-100" />
                                <input
                                    value={globalQuery}
                                    onChange={(e) => setGlobalQuery(e.target.value)}
                                    placeholder={language === 'fa' ? 'جستجوی سریع...' : 'Global search...'}
                                    aria-label="global-search"
                                    className="bg-transparent placeholder-blue-200 text-white text-sm w-full focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setLanguage(prev => prev === 'fa' ? 'en' : 'fa')}
                                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm"
                                title={language === 'fa' ? 'Switch to English' : 'تغییر به فارسی'}
                            >
                                {language === 'fa' ? 'FA' : 'EN'}
                            </button>
                            <button
                                className="relative p-2 rounded-lg hover:bg-white/10 border border-white/10 text-blue-100"
                                aria-label="notifications"
                                title={language === 'fa' ? 'اعلان‌ها' : 'Notifications'}
                            >
                                <Bell size={18} />
                                <span className="absolute -top-0.5 -left-0.5 w-2 h-2 bg-yellow-400 rounded-full" />
                            </button>
                            <button
                                onClick={() => setDarkMode(v => !v)}
                                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm"
                                title="تغییر حالت تم"
                            >
                                {darkMode ? '☀️ روشن' : '🌙 تاریک'}
                            </button>
                            <Settings size={20} className="text-blue-200 hover:text-white cursor-pointer transition-colors" />
                            {/* User avatar */}
                            <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white text-xs font-semibold">
                                U
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`
          fixed inset-y-0 right-0 z-50 w-64 bg-white dark:bg-slate-900 shadow-xl transform transition-transform duration-300 ease-in-out mt-16
          md:relative md:translate-x-0 md:mt-0 md:z-0
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
                    <nav className="h-full overflow-y-auto py-6">
                        <div className="px-4 space-y-2">
                            {navigationItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = currentPage === item.id;

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            onPageChange(item.id);
                                            setSidebarOpen(false);
                                        }}
                                        className={`
                      w-full flex items-center gap-3 px-4 py-3 text-right rounded-lg transition-all duration-200
                      ${isActive
                                                ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 border-r-4 border-blue-700 dark:border-blue-400 font-semibold shadow-sm'
                                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-800'
                                            }
                    `}
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium">{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </nav>
                </aside>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main content */}
                <main className="flex-1 md:pr-64">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

