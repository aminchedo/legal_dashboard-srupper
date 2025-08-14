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
  Download,
  Globe2,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  UserIcon,
  QuestionMarkCircleIcon,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import Button from '../ui/Button';
import Card, { MetricCard, StatCard, InfoCard } from '../ui/Card';
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
  currentPage?: string;
  onPageChange?: (page: string) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, currentPage, onPageChange }) => {
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
      id: 'data',
      label: 'مدیریت داده‌ها',
      href: '/data',
      icon: Database,
      description: 'مدیریت داده‌های استخراج‌شده',
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
      id: 'scraping',
      label: 'استخراج اطلاعات',
      href: '/recording',
      icon: Download,
      description: 'استخراج خودکار اطلاعات حقوقی',
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
        'premium-sidebar',
        'lg:relative lg:translate-x-0 lg:shadow-none lg:block',
        'flex flex-col'
      )}
    >
      {/* Header with Logo */}
      <div className="p-4 border-b border-gray-200">
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
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Shield className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h1 className="font-bold text-gray-900 text-sm persian-text">
                    Legal Dashboard
                  </h1>
                  <p className="text-xs text-gray-600 persian-text">
                    Premium Platform
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
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mx-auto"
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
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <motion.div 
                  className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <User className="w-4 h-4 text-white" />
                </motion.div>
                <div className="flex-1 text-right">
                  <p className="text-sm font-medium text-gray-900 persian-text">
                    {userData.name}
                  </p>
                  <p className="text-xs text-gray-600 persian-text">
                    {userData.role}
                  </p>
                </div>
                <ChevronDown className={cn(
                  'w-4 h-4 text-gray-400 transition-transform',
                  showUserMenu && 'rotate-180'
                )} />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 left-0 mt-1 premium-card z-50"
                  >
                    <div className="p-2">
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md persian-text">
                        <User className="w-4 h-4" />
                        پروفایل کاربری
                      </button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md persian-text">
                        <Settings className="w-4 h-4" />
                        تنظیمات حساب
                      </button>
                      <hr className="my-1 border-gray-200" />
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md persian-text">
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
        <div className="p-3 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="sidebar-search"
              type="text"
              placeholder="جستجو در منو..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="premium-input w-full pr-10 pl-3 py-2 text-sm bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {filteredNavigationItems.map((item, index) => {
            const isActive = isActiveRoute(item.href);
            
            return (
              <motion.div
                key={item.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'premium-sidebar-item group',
                    isActive && 'active'
                  )}
                >
                  <item.icon
                    className={cn(
                      'premium-sidebar-icon',
                      isActive
                        ? 'text-white'
                        : 'text-gray-400 group-hover:text-gray-600'
                    )}
                  />
                  <span className="flex-1 persian-text">{item.label}</span>
                  {item.badge && (
                    <motion.span
                      className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      {item.badge.text}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </nav>
    </motion.aside>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className={cn(
        'flex-1 lg:mr-64',
        sidebarCollapsed && 'lg:mr-16'
      )}>
        {/* Header */}
        <header className="premium-nav">
          <div className="flex items-center justify-between w-full">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold text-gray-900 persian-text">
                  {navigationItems.find(item => isActiveRoute(item.href))?.label || 'داشبورد'}
                </h1>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="جستجو..."
                  className="premium-input w-64 pr-10 pl-3 py-2 text-sm bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              {/* User Menu (Desktop) */}
              <div className="hidden lg:block relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <motion.img
                    src={userData.avatar || `https://ui-avatars.com/api/?name=${userData.name}&background=3b82f6&color=fff`}
                    alt={userData.name}
                    className="w-8 h-8 rounded-lg"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  />
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-2 premium-card z-50 min-w-[200px]"
                    >
                      <div className="p-2">
                        <div className="px-3 py-2 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900 persian-text">{userData.name}</p>
                          <p className="text-xs text-gray-600 persian-text">{userData.email}</p>
                        </div>
                        <div className="p-1">
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md persian-text">
                            <User className="w-4 h-4" />
                            پروفایل کاربری
                          </button>
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md persian-text">
                            <Settings className="w-4 h-4" />
                            تنظیمات حساب
                          </button>
                          <hr className="my-1 border-gray-200" />
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md persian-text">
                            <LogOut className="w-4 h-4" />
                            خروج
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="premium-container py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;