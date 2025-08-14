import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import {
  HomeIcon,
  DocumentIcon,
  ChartBarIcon,
  CogIcon,
  ServerIcon,
  QuestionMarkCircleIcon,
  VideoCameraIcon,
  TableCellsIcon,
  Bars3Icon,
  XMarkIcon,
  MoonIcon,
  SunIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  BellIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import Button from '../UI/Button';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const navigation: NavItem[] = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: HomeIcon },
    { name: t('nav.documents'), href: '/documents', icon: DocumentIcon, badge: 3 },
    { name: t('nav.analytics'), href: '/analytics', icon: ChartBarIcon },
    { name: t('nav.jobs'), href: '/jobs', icon: CogIcon },
    { name: t('nav.proxies'), href: '/proxies', icon: ServerIcon },
    { name: t('nav.system'), href: '/system', icon: Cog6ToothIcon },
    { name: t('nav.recording'), href: '/recording', icon: VideoCameraIcon },
    { name: t('nav.data'), href: '/data', icon: TableCellsIcon },
    { name: t('nav.settings'), href: '/settings', icon: CogIcon },
    { name: t('nav.help'), href: '/help', icon: QuestionMarkCircleIcon },
  ];

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  const overlayVariants = {
    open: { opacity: 1, display: 'block' },
    closed: { opacity: 0, transitionEnd: { display: 'none' } },
  };

  const renderSidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Premium Logo Section */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center">
          <motion.div 
            className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-white font-bold text-lg">LD</span>
          </motion.div>
          <div className="ml-3">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Legal Dashboard
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Premium Platform
            </p>
          </div>
        </div>
      </div>

      {/* Premium Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <motion.div
              key={item.name}
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
                <span className="flex-1 persian-text">{item.name}</span>
                {item.badge && (
                  <motion.span 
                    className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    {item.badge}
                  </motion.span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Premium User Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="flex items-center">
          <motion.img
            className="h-10 w-10 rounded-full ring-2 ring-white shadow-md"
            src={user?.avatar || '/api/placeholder/40/40'}
            alt={user?.name || 'User'}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          />
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              variants={sidebarVariants}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-80 premium-sidebar"
            >
              <div className="absolute top-4 right-4">
                <motion.button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => setSidebarOpen(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <XMarkIcon className="h-5 w-5 text-gray-600" />
                </motion.button>
              </div>
              {renderSidebarContent()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="premium-sidebar">
          {renderSidebarContent()}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:pl-80">
        {/* Premium Header */}
        <header className="premium-nav">
          <div className="flex h-16 items-center justify-between px-6">
            {/* Mobile Menu Button */}
            <motion.button
              type="button"
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setSidebarOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bars3Icon className="h-6 w-6" />
            </motion.button>

            {/* Premium Search Bar */}
            <div className="flex-1 max-w-lg mx-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="جستجو در داشبورد..."
                  className="premium-input pl-10 pr-4 w-full"
                />
              </div>
            </div>

            {/* Premium Header Actions */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {theme === 'dark' ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </motion.button>

              {/* Notifications */}
              <motion.button 
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BellIcon className="h-5 w-5" />
                <motion.span 
                  className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  3
                </motion.span>
              </motion.button>

              {/* Premium User Menu */}
              <div className="relative">
                <motion.button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img
                    className="h-8 w-8 rounded-full ring-2 ring-white shadow-md"
                    src={user?.avatar || '/api/placeholder/32/32'}
                    alt={user?.name}
                  />
                  <span className="hidden md:block text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-56 premium-card shadow-xl z-50"
                    >
                      <div className="py-2">
                        <Link
                          to="/settings"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <UserCircleIcon className="mr-3 h-4 w-4" />
                          Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Cog6ToothIcon className="mr-3 h-4 w-4" />
                          Settings
                        </Link>
                        <hr className="my-2 border-gray-200 dark:border-gray-700" />
                        <motion.button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="flex w-full items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          whileHover={{ x: 4 }}
                        >
                          <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                          Sign out
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Premium Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full premium-container py-6"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;