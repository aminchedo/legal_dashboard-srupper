import React, { useState, useEffect } from 'react';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // فراخوانی API برای دریافت آمار
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // تغییر method از POST به GET
      const response = await fetch('/api/analytics', {
        method: 'GET', // ✅ تغییر از POST به GET
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        throw new Error(`خطای API: ${response.status}`);
      }
    } catch (err) {
      setError(err.message);
      console.error('خطا در دریافت آمار:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <h1 className="text-2xl font-bold mb-4">📊 آنالیز و آمار</h1>
          <div className="space-y-4">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">📊 آنالیز و آمار</h1>
        <div className="bg-red-50 border border-red-200 p-4 rounded">
          <h3 className="text-red-800 font-semibold">خطا در بارگذاری داده‌ها</h3>
          <p className="text-red-600 mt-1">{error}</p>
          <button 
            onClick={fetchAnalytics}
            className="mt-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            🔄 تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📊 آنالیز و آمار</h1>
      
      {data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* کارت آمار کلی */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              📄 کل اسناد
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {data.total_documents || 'N/A'}
            </p>
          </div>

          {/* کارت دسته‌بندی‌ها */}
          {data.categories?.map((category, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {category.name}
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {category.count}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">داده‌ای برای نمایش وجود ندارد</p>
        </div>
      )}
    </div>
  );
};

export default Analytics;