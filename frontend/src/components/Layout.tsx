import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
// import Sidebar from './Sidebar'; // اگر سایدبار می‌خواهید

// تعریف نوع برای props کامپوننت
interface LayoutProps {
  showSidebar?: boolean;
  className?: string;
}

// کامپوننت لایوت اصلی
const Layout: React.FC<LayoutProps> = ({ 
  showSidebar = false, 
  className = '' 
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* ناوبری بالا */}
      <Navigation />
      
      {/* محتوای اصلی */}
      <div className="flex">
        {/* سایدبار (اختیاری) */}
        {showSidebar && (
          <>
            {/* 
            <Sidebar />
            <main className="flex-1">
              <Outlet />
            </main>
            */}
          </>
        )}
        
        {/* بدون سایدبار */}
        {!showSidebar && (
          <main className="flex-1">
            <Outlet />
          </main>
        )}
      </div>
    </div>
  );
};

export default Layout;