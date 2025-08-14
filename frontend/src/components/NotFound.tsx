import React from 'react';
import { Link } from 'react-router-dom';

// تعریف نوع برای props کامپوننت
interface NotFoundProps {
  title?: string;
  message?: string;
  showNavigation?: boolean;
}

// کامپوننت صفحه 404 بهبود یافته
const NotFound: React.FC<NotFoundProps> = ({ 
  title = 'صفحه مورد نظر یافت نشد',
  message = 'متأسفانه صفحه‌ای که دنبال آن می‌گردید وجود ندارد.',
  showNavigation = true 
}) => {
  // لینک‌های ناوبری سریع
  const quickLinks = [
    { name: '🏠 داشبورد', path: '/dashboard', color: 'bg-blue-500 hover:bg-blue-600' },
    { name: '📊 آنالیز', path: '/analytics', color: 'bg-green-500 hover:bg-green-600' },
    { name: '⚙️ تنظیمات', path: '/settings', color: 'bg-purple-500 hover:bg-purple-600' },
    { name: '📄 مستندات', path: '/documents', color: 'bg-orange-500 hover:bg-orange-600' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-4">
        {/* آیکون و شماره خطا */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
          </div>
          <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
        </div>

        {/* متن خطا */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 persian-text">
            {title}
          </h2>
          <p className="text-gray-600 persian-text leading-relaxed">
            {message}
          </p>
        </div>

        {/* لینک‌های ناوبری سریع */}
        {showNavigation && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4 persian-text">
              لینک‌های مفید:
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${link.color} text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* دکمه بازگشت */}
        <div className="space-y-3">
          <Link 
            to="/dashboard" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            🏠 بازگشت به داشبورد
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="block w-full text-gray-600 hover:text-gray-800 transition-colors text-sm"
          >
            ← بازگشت به صفحه قبل
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;