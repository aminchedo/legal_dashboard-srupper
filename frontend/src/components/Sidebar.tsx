import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// تعریف نوع برای آیتم‌های منو
interface MenuItem {
  name: string;
  path: string;
  icon: string;
  description?: string;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'error' | 'info';
  };
}

// تعریف نوع برای دسته‌بندی منو
interface MenuCategory {
  category: string;
  items: MenuItem[];
}

// کامپوننت سایدبار
const Sidebar: React.FC = () => {
  const location = useLocation();

  // تعریف آیتم‌های منو با دسته‌بندی
  const menuItems: MenuCategory[] = [
    {
      category: 'اصلی',
      items: [
        { 
          name: 'داشبورد', 
          path: '/dashboard', 
          icon: '🏠',
          description: 'صفحه اصلی و نمای کلی'
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
        }
      ]
    },
    {
      category: 'مدیریت',
      items: [
        { 
          name: 'تنظیمات عمومی', 
          path: '/settings', 
          icon: '⚙️',
          description: 'تنظیمات سیستم و کاربری'
        },
        { 
          name: 'وضعیت سیستم', 
          path: '/system', 
          icon: '⚡',
          description: 'نظارت بر سلامت سیستم'
        },
        { 
          name: 'داده‌ها', 
          path: '/data', 
          icon: '💾',
          description: 'مدیریت داده‌های استخراج‌شده'
        }
      ]
    },
    {
      category: 'عملیات',
      items: [
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
          name: 'وظایف', 
          path: '/jobs', 
          icon: '🔧',
          description: 'مدیریت وظایف و پروژه‌ها'
        },
        { 
          name: 'پروکسی‌ها', 
          path: '/proxies', 
          icon: '🌐',
          description: 'مدیریت پروکسی‌ها'
        }
      ]
    }
  ];

  // بررسی مسیر فعال
  const isActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // کامپوننت نمایش badge
  const Badge: React.FC<{ badge: MenuItem['badge'] }> = ({ badge }) => {
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
    <div className="w-64 bg-white shadow-lg h-screen overflow-y-auto">
      <div className="p-4">
        {/* هدر سایدبار */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 persian-text">
            📋 پنل مدیریت
          </h2>
          <p className="text-sm text-gray-600 persian-text mt-1">
            سیستم مدیریت حقوقی
          </p>
        </div>
        
        {/* منوهای دسته‌بندی شده */}
        {menuItems.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 persian-text">
              {category.category}
            </h3>
            
            <ul className="space-y-1">
              {category.items.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center justify-between space-x-3 space-x-reverse px-3 py-2 rounded-lg text-sm font-medium transition-colors group ${
                      isActive(item.path)
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                    title={item.description}
                  >
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <span className="text-lg">{item.icon}</span>
                      <span className="persian-text">{item.name}</span>
                    </div>
                    {item.badge && <Badge badge={item.badge} />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* بخش راهنما */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link
            to="/help"
            className="flex items-center space-x-3 space-x-reverse px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg">❓</span>
            <span className="persian-text">راهنما و پشتیبانی</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;