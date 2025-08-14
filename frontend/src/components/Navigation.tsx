import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// تعریف نوع برای آیتم‌های ناوبری
interface NavigationItem {
  name: string;
  path: string;
  icon: string;
  description: string;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'error' | 'info';
  };
}

// کامپوننت ناوبری اصلی
const Navigation: React.FC = () => {
  const location = useLocation();

  // تعریف آیتم‌های ناوبری با توضیحات کامل
  const navItems: NavigationItem[] = [
    {
      name: 'داشبورد',
      path: '/dashboard',
      icon: '🏠',
      description: 'صفحه اصلی و نمای کلی سیستم'
    },
    {
      name: 'اسکرپینگ',
      path: '/recording',
      icon: '📡',
      description: 'ضبط و استخراج اطلاعات',
      badge: {
        text: 'فعال',
        variant: 'success'
      }
    },
    {
      name: 'آنالیز',
      path: '/analytics',
      icon: '📊',
      description: 'آمار و تحلیل‌های پیشرفته'
    },
    {
      name: 'مستندات',
      path: '/documents',
      icon: '📄',
      description: 'مدیریت اسناد حقوقی',
      badge: {
        text: '۱۲,۴۵۰',
        variant: 'info'
      }
    },
    {
      name: 'داده‌ها',
      path: '/data',
      icon: '💾',
      description: 'مدیریت داده‌های استخراج‌شده'
    },
    {
      name: 'وضعیت سیستم',
      path: '/system',
      icon: '⚡',
      description: 'نظارت بر سلامت سیستم'
    },
    {
      name: 'تنظیمات عمومی',
      path: '/settings',
      icon: '⚙️',
      description: 'تنظیمات سیستم و کاربری'
    }
  ];

  // بررسی مسیر فعال
  const isActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // کامپوننت نمایش badge
  const Badge: React.FC<{ badge: NavigationItem['badge'] }> = ({ badge }) => {
    if (!badge) return null;
    
    const variantClasses = {
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800'
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variantClasses[badge.variant]}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* لوگو و نام سیستم */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2 space-x-reverse">
              <span className="text-2xl">📋</span>
              <h1 className="text-xl font-bold text-gray-800">
                سیستم مدیریت حقوقی
              </h1>
            </Link>
          </div>

          {/* لینک‌های ناوبری */}
          <div className="flex items-center space-x-6 space-x-reverse">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                title={item.description}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
                {item.badge && <Badge badge={item.badge} />}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;