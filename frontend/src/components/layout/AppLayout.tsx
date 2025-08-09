import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BarChartOutlined,
  DatabaseOutlined,
  GlobalOutlined,
  HomeOutlined,
  MenuOutlined,
  SettingOutlined,
  AlertOutlined,
  BellOutlined,
  SearchOutlined,
  SwapOutlined
} from '@ant-design/icons';
import { PageType } from '../../types';
import CommandPalette, { CommandItem } from '../common/CommandPalette';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

const navigationItems = [
  { id: 'dashboard' as PageType, label: 'داشبورد کلی', icon: HomeOutlined },
  { id: 'jobs' as PageType, label: 'وب اسکرپینگ', icon: GlobalOutlined },
  { id: 'documents' as PageType, label: 'داده‌های جمع‌آوری شده', icon: DatabaseOutlined },
  { id: 'system' as PageType, label: 'تحلیل و گزارش', icon: BarChartOutlined },
  { id: 'proxies' as PageType, label: 'پروکسی‌ها', icon: SwapOutlined },
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
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isMod = navigator.platform.toUpperCase().includes('MAC') ? e.metaKey : e.ctrlKey;
      if (isMod && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const commands: CommandItem[] = useMemo(() => [
    {
      id: 'nav-dashboard',
      label: 'رفتن به داشبورد',
      hint: 'نمای کلی سیستم',
      action: () => onPageChange('dashboard'),
      keywords: ['home', 'overview', 'dashboard'],
    },
    {
      id: 'nav-scraping',
      label: 'رفتن به وب اسکرپینگ',
      hint: 'جمع‌آوری اطلاعات',
      action: () => onPageChange('jobs'),
      keywords: ['crawl', 'scrape'],
    },
    {
      id: 'nav-data',
      label: 'رفتن به داده‌ها',
      hint: 'مدیریت داده‌های جمع‌آوری شده',
      action: () => onPageChange('documents'),
      keywords: ['documents', 'items'],
    },
    {
      id: 'nav-analytics',
      label: 'رفتن به تحلیل و گزارش',
      hint: 'نمودارها و گزارش‌ها',
      action: () => onPageChange('system'),
      keywords: ['charts', 'reports', 'analytics'],
    },
    {
      id: 'nav-proxies',
      label: 'مدیریت پروکسی',
      hint: 'افزودن/تست/چرخش',
      action: () => onPageChange('proxies'),
      keywords: ['proxy', 'proxies', 'rotation', 'network'],
    },
    {
      id: 'toggle-theme',
      label: darkMode ? 'تغییر به حالت روشن' : 'تغییر به حالت تاریک',
      hint: 'Theme',
      action: () => setDarkMode((v) => !v),
      keywords: ['theme', 'dark', 'light'],
    },
    {
      id: 'toggle-lang',
      label: 'تغییر زبان',
      hint: 'FA / EN',
      action: () => setLanguage((prev) => (prev === 'fa' ? 'en' : 'fa')),
      keywords: ['language', 'rtl', 'ltr'],
    },
    {
      id: 'focus-search',
      label: 'تمرکز روی جستجوی سراسری',
      hint: 'جعبه جستجو در هدر',
      action: () => searchInputRef.current?.focus(),
      keywords: ['search', 'find'],
    },
    {
      id: 'nav-settings',
      label: 'تنظیمات سیستم',
      hint: 'پیکربندی و ترجیحات',
      action: () => onPageChange('settings'),
      keywords: ['settings', 'config'],
    },
    {
      id: 'nav-help',
      label: 'راهنما',
      hint: 'سوالات متداول و مستندات',
      action: () => onPageChange('help'),
      keywords: ['help', 'docs'],
    },
  ], [darkMode]);

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
                <MenuOutlined />
              </button>
              <div className="flex items-center gap-3">
                <AlertOutlined className="text-yellow-400" />
                <div>
                  <h1 className="text-xl font-bold">داشبورد حقوقی ایران</h1>
                  <p className="text-blue-200 text-sm">سامانه هوشمند مدیریت اطلاعات حقوقی</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-1 max-w-xl">
              {/* Global search */}
              <div className="hidden md:flex items-center gap-2 flex-1 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg px-3 py-1.5">
                <SearchOutlined className="text-blue-100" />
                <input
                  ref={searchInputRef}
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
                onClick={() => setIsPaletteOpen(true)}
                className="hidden md:inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-white hover:bg-white/20 text-sm"
                title="Command menu (Ctrl+K)"
              >
                ⌘K
              </button>
              <button
                className="relative p-2 rounded-lg hover:bg-white/10 border border-white/10 text-blue-100"
                aria-label="notifications"
                title={language === 'fa' ? 'اعلان‌ها' : 'Notifications'}
              >
                <BellOutlined />
                <span className="absolute -top-0.5 -left-0.5 w-2 h-2 bg-yellow-400 rounded-full" />
              </button>
              <button
                onClick={() => setDarkMode(v => !v)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm"
                title="تغییر حالت تم"
              >
                {darkMode ? '☀️ روشن' : '🌙 تاریک'}
              </button>
              <SettingOutlined
                onClick={() => onPageChange('settings')}
                size={20}
                className="text-blue-200 hover:text-white cursor-pointer transition-colors"
              />
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
              {[...navigationItems, { id: 'settings' as any, label: 'تنظیمات', icon: SettingOutlined }, { id: 'help' as any, label: 'راهنما', icon: AlertOutlined }].map((item) => {
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
      <CommandPalette
        open={isPaletteOpen}
        onOpenChange={setIsPaletteOpen}
        items={commands}
        placeholder={language === 'fa' ? 'دستور یا صفحه موردنظر را بنویسید...' : 'Type a command or search...'}
      />
    </div>
  );
}