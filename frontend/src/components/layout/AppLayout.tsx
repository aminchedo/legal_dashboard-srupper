import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  BarChart3, 
  Server, 
  Settings, 
  Menu, 
  X,
  Bell,
  Search,
  User,
  ChevronDown,
  Activity,
  Database,
  Globe,
  Shield
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button, Card, StatusBadge } from '../ui';
import LEGAL_TERMINOLOGY from '../../lib/terminology';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'error' | 'info';
  };
}

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation items with proper Persian terminology
  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: LEGAL_TERMINOLOGY.dashboard,
      href: '/dashboard',
      icon: Home,
      description: 'نمای کلی سیستم و آمار اصلی',
    },
    {
      id: 'documents',
      label: LEGAL_TERMINOLOGY.documents,
      href: '/documents',
      icon: FileText,
      description: 'مدیریت و جستجو در اسناد حقوقی',
      badge: {
        text: '۱۲,۴۵۰',
        variant: 'info' as const,
      },
    },
    {
      id: 'analytics',
      label: LEGAL_TERMINOLOGY.analytics,
      href: '/analytics',
      icon: BarChart3,
      description: 'تحلیل و گزارش‌سازی پیشرفته',
    },
    {
      id: 'jobs',
      label: 'مدیریت پروژه‌ها',
      href: '/jobs',
      icon: Activity,
      description: 'پردازش و وضعیت پروژه‌ها',
      badge: {
        text: '۱۲',
        variant: 'success' as const,
      },
    },
    {
      id: 'system',
      label: LEGAL_TERMINOLOGY.systemHealth,
      href: '/system',
      icon: Server,
      description: 'نظارت بر سلامت سیستم',
      badge: {
        text: 'فعال',
        variant: 'success' as const,
      },
    },
    {
      id: 'proxies',
      label: 'مدیریت پروکسی',
      href: '/proxies',
      icon: Globe,
      description: 'تنظیمات و وضعیت پروکسی‌ها',
    },
    {
      id: 'settings',
      label: LEGAL_TERMINOLOGY.settings,
      href: '/settings',
      icon: Settings,
      description: 'تنظیمات سیستم و کاربری',
    },
  ];

  // Check if current path is active
  const isActiveRoute = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            // Open search
            break;
          case 'b':
            e.preventDefault();
            setSidebarOpen(!sidebarOpen);
            break;
        }
      }
      
      if (e.key === 'Escape') {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  const Sidebar = () => (
    <aside
      className={cn(
        'fixed inset-y-0 right-0 z-50 w-72 bg-white border-l border-neutral-200 shadow-xl',
        'transform transition-transform duration-300 ease-in-out',
        'lg:relative lg:translate-x-0 lg:w-64 lg:shadow-none',
        'dark:bg-neutral-900 dark:border-neutral-700',
        sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-neutral-900 dark:text-white text-sm">
                سیستم مدیریت حقوقی
              </h1>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                جمهوری اسلامی ایران
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = isActiveRoute(item.href);
            
            return (
              <li key={item.id}>
                <Link
                  to={item.href}
                  className={cn(
                    'group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    isActive && [
                      'bg-primary-50 text-primary-700 border border-primary-200',
                      'dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800'
                    ]
                  )}
                >
                  <item.icon 
                    className={cn(
                      'w-5 h-5 flex-shrink-0 transition-colors',
                      isActive ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-500 dark:text-neutral-400'
                    )} 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        'font-medium text-sm truncate',
                        isActive ? 'text-primary-700 dark:text-primary-400' : 'text-neutral-700 dark:text-neutral-200'
                      )}>
                        {item.label}
                      </span>
                      {item.badge && (
                        <StatusBadge 
                          variant={item.badge.variant} 
                          size="sm"
                          icon={false}
                        >
                          {item.badge.text}
                        </StatusBadge>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                        {item.description}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-700">
        <Card variant="glass" padding="sm">
          <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
            <span>سیستم عملیاتی</span>
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
            آخرین بروزرسانی: الان
          </div>
        </Card>
      </div>
    </aside>
  );

  const TopBar = () => (
    <header className="bg-white border-b border-neutral-200 px-4 py-3 dark:bg-neutral-900 dark:border-neutral-700">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Breadcrumb */}
          <nav className="hidden sm:flex items-center gap-2 text-sm">
            <Link 
              to="/dashboard" 
              className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            >
              داشبورد
            </Link>
            {location.pathname !== '/dashboard' && (
              <>
                <span className="text-neutral-300 dark:text-neutral-600">/</span>
                <span className="text-neutral-900 dark:text-white font-medium">
                  {navigationItems.find(item => isActiveRoute(item.href))?.label || 'صفحه'}
                </span>
              </>
            )}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Search className="w-4 h-4" />
            <span className="hidden md:inline">جستجو</span>
            <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-neutral-100 px-1.5 font-mono text-[10px] font-medium opacity-100 dark:bg-neutral-800">
              Ctrl+K
            </kbd>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-error-500 rounded-full" />
          </Button>

          {/* User menu */}
          <Button variant="ghost" size="sm" className="gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">کاربر</span>
            <ChevronDown className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900" dir="rtl">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          
          {/* Page content */}
          <main className="flex-1 overflow-auto">
            <div className="p-4 lg:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;