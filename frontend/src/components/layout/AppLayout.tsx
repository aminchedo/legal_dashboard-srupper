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
  SwapOutlined,
  LineChartOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import { PageType } from '../../types';
import CommandPalette, { CommandItem } from '../common/CommandPalette';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

const navigationItems = (t: (key: string) => string) => ([
  { id: 'dashboard' as PageType, label: t('nav.dashboard'), icon: HomeOutlined },
  { id: 'analytics' as PageType, label: 'تحلیل‌ها', icon: LineChartOutlined },
  { id: 'recording' as PageType, label: 'ضبط صفحه', icon: VideoCameraOutlined },
  { id: 'jobs' as PageType, label: t('nav.jobs'), icon: GlobalOutlined },
  { id: 'documents' as PageType, label: t('nav.documents'), icon: DatabaseOutlined },
  { id: 'system' as PageType, label: t('nav.system'), icon: BarChartOutlined },
  { id: 'proxies' as PageType, label: t('nav.proxies'), icon: SwapOutlined },
]);

export default function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const { t, i18n } = useTranslation();
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
    const dir = language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem('lang', language);
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

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
      label: t('commands.goDashboard'),
      hint: t('app.subtitle'),
      action: () => onPageChange('dashboard'),
      keywords: ['home', 'overview', 'dashboard'],
    },
    {
      id: 'nav-scraping',
      label: t('commands.goJobs'),
      hint: t('nav.jobs'),
      action: () => onPageChange('jobs'),
      keywords: ['crawl', 'scrape'],
    },
    {
      id: 'nav-data',
      label: t('commands.goDocuments'),
      hint: t('nav.documents'),
      action: () => onPageChange('documents'),
      keywords: ['documents', 'items'],
    },
    {
      id: 'nav-analytics',
      label: t('commands.goSystem'),
      hint: t('nav.system'),
      action: () => onPageChange('system'),
      keywords: ['charts', 'reports', 'analytics'],
    },
    {
      id: 'nav-proxies',
      label: t('commands.goProxies'),
      hint: t('nav.proxies'),
      action: () => onPageChange('proxies'),
      keywords: ['proxy', 'proxies', 'rotation', 'network'],
    },
    {
      id: 'toggle-theme',
      label: darkMode ? t('theme.light') : t('theme.dark'),
      hint: 'Theme',
      action: () => setDarkMode((v) => !v),
      keywords: ['theme', 'dark', 'light'],
    },
    {
      id: 'toggle-lang',
      label: t('commands.toggleLang'),
      hint: 'FA / EN',
      action: () => setLanguage((prev) => (prev === 'fa' ? 'en' : 'fa')),
      keywords: ['language', 'rtl', 'ltr'],
    },
    {
      id: 'focus-search',
      label: t('commands.focusSearch'),
      hint: t('app.subtitle'),
      action: () => searchInputRef.current?.focus(),
      keywords: ['search', 'find'],
    },
    {
      id: 'nav-settings',
      label: t('commands.settings'),
      hint: t('nav.settings'),
      action: () => onPageChange('settings'),
      keywords: ['settings', 'config'],
    },
    {
      id: 'nav-help',
      label: t('commands.help'),
      hint: t('nav.help'),
      action: () => onPageChange('help'),
      keywords: ['help', 'docs'],
    },
  ], [darkMode, t, onPageChange]);

  const navItems = navigationItems(t);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-l from-blue-800 to-blue-900 text-white shadow-lg">
        <div className="absolute inset-0 opacity-20 bg-gradient-radial" />
        <div className="max-w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-1.5 sm:p-2 rounded-md hover:bg-white/10 transition-colors flex-shrink-0"
              >
                <MenuOutlined className="text-sm sm:text-base" />
              </button>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <AlertOutlined className="text-yellow-400 text-sm sm:text-base flex-shrink-0" />
                <div className="min-w-0">
                  <h1 className="text-base sm:text-lg lg:text-xl font-bold truncate">{t('app.title')}</h1>
                  <p className="text-blue-200 text-xs sm:text-sm hidden sm:block truncate">{t('app.subtitle')}</p>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-3 flex-1 max-w-xl mx-4">
              {/* Global search */}
              <div className="flex items-center gap-2 flex-1 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg px-3 py-1.5">
                <SearchOutlined className="text-blue-100" />
                <input
                  ref={searchInputRef}
                  value={globalQuery}
                  onChange={(e) => setGlobalQuery(e.target.value)}
                  placeholder={t('app.searchPlaceholder')}
                  aria-label="global-search"
                  className="bg-transparent placeholder-blue-200 text-white text-sm w-full focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button
                onClick={() => setLanguage(prev => prev === 'fa' ? 'en' : 'fa')}
                className="px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm"
                title={language === 'fa' ? 'Switch to English' : 'تغییر به فارسی'}
              >
                {language === 'fa' ? 'FA' : 'EN'}
              </button>
              <button
                onClick={() => setIsPaletteOpen(true)}
                className="hidden lg:inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-white hover:bg-white/20 text-sm"
                title="Command menu (Ctrl+K)"
              >
                ⌘K
              </button>
              <button
                className="relative p-1.5 sm:p-2 rounded-lg hover:bg-white/10 border border-white/10 text-blue-100"
                aria-label="notifications"
                title={t('aria.notifications')}
              >
                <BellOutlined className="text-sm sm:text-base" />
                <span className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full" />
              </button>
              <button
                onClick={() => setDarkMode(v => !v)}
                className="hidden sm:inline-flex px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm"
                title={t('commands.toggleTheme')}
              >
                {darkMode ? t('theme.light') : t('theme.dark')}
              </button>
              <SettingOutlined
                onClick={() => onPageChange('settings')}
                className="hidden sm:block text-blue-200 hover:text-white cursor-pointer transition-colors text-base sm:text-lg"
              />
              {/* User avatar */}
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white text-xs font-semibold">
                U
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 right-0 z-50 w-64 bg-white dark:bg-slate-900 shadow-xl transform transition-transform duration-300 ease-in-out mt-16
          lg:relative lg:translate-x-0 lg:mt-0 lg:z-0 lg:w-64
          md:w-72 md:relative md:translate-x-0 md:mt-0 md:z-0
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        `}>
          <nav className="h-full overflow-y-auto py-6">
            <div className="px-3 sm:px-4 space-y-1 sm:space-y-2">
              {[...navItems, { id: 'settings' as any, label: t('nav.settings'), icon: SettingOutlined }, { id: 'help' as any, label: t('nav.help'), icon: AlertOutlined }].map((item) => {
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
                      w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-right rounded-lg transition-all duration-200 text-sm sm:text-base
                      ${isActive
                        ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 border-r-4 border-blue-700 dark:border-blue-400 font-semibold shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-800'
                      }
                    `}
                  >
                    <Icon size={18} className="sm:w-5 sm:h-5" />
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
        <main className="flex-1 w-full md:pl-0 lg:pl-0">
          <div className="max-w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
      <CommandPalette
        open={isPaletteOpen}
        onOpenChange={setIsPaletteOpen}
        items={commands}
        placeholder={i18n.t('app.searchPlaceholder')}
      />
    </div>
  );
}