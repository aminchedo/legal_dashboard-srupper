import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      category: 'اصلی',
      items: [
        { name: 'داشبورد', path: '/', icon: '🏠' },
        { name: 'آنالیز', path: '/analytics', icon: '📊' },
      ]
    },
    {
      category: 'مدیریت',
      items: [
        { name: 'تنظیمات عمومی', path: '/settings', icon: '⚙️' },
        { name: 'گزارش‌ها', path: '/reports', icon: '📈' },
      ]
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-white shadow-lg h-screen">
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-6">
          📋 پنل مدیریت
        </h2>
        
        {menuItems.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {category.category}
            </h3>
            
            <ul className="space-y-1">
              {category.items.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 space-x-reverse px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;