import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
// import Sidebar from './Sidebar'; // اگر sidebar می‌خواهید

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* اگر sidebar می‌خواهید، uncomment کنید */}
      {/* 
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      */}
      
      {/* بدون sidebar */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;