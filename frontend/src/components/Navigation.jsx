import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    {
      name: 'داشبورد',
      path: '/',
      icon: '🏠',
      description: 'صفحه اصلی'
    },
    {
      name: 'آنالیز',
      path: '/analytics',
      icon: '📊',
      description: 'آمار و تحلیل‌ها'
    },
    {
      name: 'تنظیمات عمومی',
      path: '/settings',
      icon: '⚙️',
      description: 'تنظیمات سیستم'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 space-x-reverse">
              <span className="text-2xl">📋</span>
              <h1 className="text-xl font-bold text-gray-800">
                سیستم مدیریت حقوقی
              </h1>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6 space-x-reverse">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                title={item.description}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;