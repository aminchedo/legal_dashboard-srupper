import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          صفحه مورد نظر یافت نشد
        </h2>
        <p className="text-gray-600 mb-8">
          متأسفانه صفحه‌ای که دنبال آن می‌گردید وجود ندارد.
        </p>
        <div className="space-x-4 space-x-reverse">
          <Link 
            to="/" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition"
          >
            🏠 بازگشت به خانه
          </Link>
          <Link 
            to="/analytics" 
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition"
          >
            📊 آنالیز
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;