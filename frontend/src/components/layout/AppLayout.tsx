import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Plus,
  Minimize2,
  Maximize2,
  Sun,
  Moon,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import { StatusBadge } from '../ui';
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
  notificationCount?: number;
}

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Enhanced navigation items with all 8 required pages
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
      notificationCount: 3,
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
      label: 'مدیریت وظایف',
      href: '/jobs',
      icon: Activity,
      description: 'پردازش و وضعیت پروژه‌ها',
      badge: {
        text: '۱۲',
        variant: 'success' as const,
      },
      notificationCount: 2,
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
    {
      id: 'help',
      label: 'راهنما و پشتیبانی',
      href: '/help',
      icon: HelpCircle,
      description: 'مرکز راهنما و پشتیبانی فنی',
    },
  ];

  // Filter navigation items based on search
  const filteredNavigationItems = navigationItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            // Focus search in sidebar
            const searchInput = document.getElementById('sidebar-search');
            if (searchInput) searchInput.focus();
            break;
          case 'b':
            e.preventDefault();
            setSidebarCollapsed(!sidebarCollapsed);
            break;
          case '/':
            e.preventDefault();
            setSidebarOpen(!sidebarOpen);
            break;
        }
      }
      
      if (e.key === 'Escape') {
        setSidebarOpen(false);
        setShowUserMenu(false);
        setShowNotifications(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen, sidebarCollapsed]);

  // Mock user data (replace with real data)
  const userData = {
    name: 'احمد محمدی',
    email: 'ahmad.mohammadi@legal.ir',
    role: 'مدیر سیستم',
    avatar: null,
  };

  // Mock notifications (replace with real data)
  const notifications = [
    {
      id: 1,
      title: 'سند جدید دریافت شد',
      message: 'اصلاحیه قانون تجارت آپلود شده است',
      time: '۵ دقیقه پیش',
      type: 'info' as const,
      unread: true,
    },
    {
      id: 2,
      title: 'فرآیند استخراج کامل شد',
      message: '۲۳۴ سند با موفقیت پردازش شد',
      time: '۱۵ دقیقه پیش',
      type: 'success' as const,
      unread: true,
    },
    {
      id: 3,
      title: 'هشدار سیستم',
      message: 'استفاده از حافظه به ۸۵٪ رسیده است',
      time: '۳۰ دقیقه پیش',
      type: 'warning' as const,
      unread: false,
    },
  ];

  const unreadNotifications = notifications.filter(n => n.unread).length;

  const Sidebar = () => (
    <motion.aside
      initial={false}
      animate={{
        width: sidebarCollapsed ? 64 : 288,
        x: sidebarOpen || window.innerWidth >= 1024 ? 0 : '100%',
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        'fixed inset-y-0 right-0 z-50 bg-white border-l border-neutral-200 shadow-xl',
        'lg:relative lg:translate-x-0 lg:shadow-none lg:block',
        'dark:bg-neutral-900 dark:border-neutral-700',
        'flex flex-col'
      )}
    >
      {/* Header with User Profile */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!sidebarCollapsed ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-neutral-900 dark:text-white text-sm">
                    سیستم مدیریت حقوقی
                  </h1>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    جمهوری اسلامی ایران
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md mx-auto"
              >
                <Shield className="w-6 h-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex"
            >
              {sidebarCollapsed ? (
                <Maximize2 className="w-4 h-4" />
              ) : (
                <Minimize2 className="w-4 h-4" />
              )}
            </Button>
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

        {/* User Profile Section */}
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4"
          >
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 text-right">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {userData.name}
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    {userData.role}
                  </p>
                </div>
                <ChevronDown className={cn(
                  'w-4 h-4 text-neutral-400 transition-transform',
                  showUserMenu && 'rotate-180'
                )} />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 left-0 mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-50"
                  >
                    <div className="p-2">
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md">
                        <User className="w-4 h-4" />
                        پروفایل کاربری
                      </button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md">
                        <Settings className="w-4 h-4" />
                        تنظیمات حساب
                      </button>
                      <hr className="my-1 border-neutral-200 dark:border-neutral-600" />
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md">
                        <LogOut className="w-4 h-4" />
                        خروج
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>

      {/* Search Section */}
      {!sidebarCollapsed && (
        <div className="p-3 border-b border-neutral-200 dark:border-neutral-700">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              id="sidebar-search"
              type="text"
              placeholder="جستجو در منو..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          <AnimatePresence>
            {filteredNavigationItems.map((item, index) => {
              const isActive = isActiveRoute(item.href);
              
              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.href}
                    className={cn(
                      'group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200',
                      'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                      'relative overflow-hidden',
                      isActive && [
                        'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 shadow-sm',
                        'dark:from-primary-900/30 dark:to-primary-800/30 dark:text-primary-400',
                        'before:absolute before:right-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary-600 before:dark:bg-primary-400'
                      ],
                      sidebarCollapsed && 'justify-center'
                    )}
                  >
                    <div className="relative">
                      <item.icon 
                        className={cn(
                          'w-5 h-5 flex-shrink-0 transition-colors',
                          isActive ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-500 dark:text-neutral-400'
                        )} 
                      />
                      {item.notificationCount && item.notificationCount > 0 && !sidebarCollapsed && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                        >
                          {item.notificationCount > 9 ? '9+' : item.notificationCount}
                        </motion.div>
                      )}
                    </div>
                    
                    <AnimatePresence>
                      {!sidebarCollapsed && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="flex-1 min-w-0"
                        >
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
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!sidebarCollapsed && (
                      <ChevronRight className={cn(
                        'w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity',
                        isActive ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-400'
                      )} />
                    )}
                  </Link>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>

        {/* Quick Actions */}
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700"
          >
            <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-3 px-3">
              عملیات سریع
            </h3>
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-3"
                onClick={() => navigate('/documents?action=upload')}
              >
                <Plus className="w-4 h-4" />
                آپلود سند جدید
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-3"
                onClick={() => navigate('/analytics?action=generate')}
              >
                <BarChart3 className="w-4 h-4" />
                تولید گزارش
              </Button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-700">
        {!sidebarCollapsed ? (
          <Card variant="glass" padding="sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
                <span>سیستم عملیاتی</span>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                ) : (
                  <Moon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                )}
              </button>
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
              آخرین بروزرسانی: الان
            </div>
          </Card>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              ) : (
                <Moon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              )}
            </button>
          </div>
        )}
      </div>
    </motion.aside>
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
              className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
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
          <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
            <Search className="w-4 h-4" />
            <span className="hidden md:inline">جستجو</span>
            <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-neutral-100 px-1.5 font-mono text-[10px] font-medium opacity-100 dark:bg-neutral-800">
              Ctrl+K
            </kbd>
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {unreadNotifications}
                </motion.span>
              )}
            </Button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-50"
                >
                  <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
                    <h3 className="font-semibold text-neutral-900 dark:text-white">اعلان‌ها</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={cn(
                          'p-4 border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors',
                          notification.unread && 'bg-primary-50 dark:bg-primary-900/20'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            'w-2 h-2 rounded-full mt-2',
                            notification.type === 'success' ? 'bg-green-500' :
                            notification.type === 'warning' ? 'bg-yellow-500' :
                            'bg-blue-500'
                          )} />
                          <div className="flex-1">
                            <h4 className="font-medium text-neutral-900 dark:text-white text-sm">
                              {notification.title}
                            </h4>
                            <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
                              {notification.message}
                            </p>
                            <span className="text-xs text-neutral-500 dark:text-neutral-500 mt-2 block">
                              {notification.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-neutral-200 dark:border-neutral-700">
                    <Button variant="ghost" size="sm" className="w-full">
                      مشاهده همه اعلان‌ها
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

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