import React from 'react';
import { DashboardOverview } from '../../components/ui/organisms';

export default function DashboardPage() {
  const systemMetrics = [
    { name: 'CPU', value: 60, status: 'normal' as const },
    { name: 'RAM', value: 80, status: 'warning' as const },
    { name: 'شبکه', value: 50, status: 'normal' as const }
  ];

  const keyMetrics = [
    { 
      title: 'کل اسناد', 
      value: 1234567, 
      formatType: 'number' as const, 
      trend: 12, 
      status: 'success' as const 
    },
    { 
      title: 'اسناد پردازش شده', 
      value: 856432, 
      formatType: 'number' as const, 
      trend: 8, 
      status: 'success' as const 
    },
    { 
      title: 'درصد موفقیت', 
      value: 94.2, 
      formatType: 'percentage' as const, 
      trend: 2, 
      status: 'success' as const 
    },
    { 
      title: 'حافظه استفاده شده', 
      value: 2147483648, 
      formatType: 'bytes' as const, 
      trend: -5, 
      status: 'info' as const 
    },
    { 
      title: 'پروکسی‌های فعال', 
      value: 24, 
      formatType: 'number' as const, 
      trend: 0, 
      status: 'success' as const 
    },
    { 
      title: 'سرعت پردازش', 
      value: 1250, 
      unit: 'سند/ساعت',
      formatType: 'number' as const, 
      trend: 15, 
      status: 'success' as const 
    }
  ];

  const quickActions = [
    {
      title: 'توقف اضطراری',
      description: 'متوقف کردن تمام عملیات جمع‌آوری و پردازش',
      icon: <span className="text-red-600 text-2xl">🛑</span>,
      actions: [
        {
          label: 'توقف فوری',
          onClick: async () => {
            try {
              const base = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
              await fetch(`${base}/scraping/stop`, { method: 'POST' });
              alert('همه‌ی کارها متوقف شد');
            } catch (e) {
              alert('خطا در توقف اضطراری');
            }
          },
          variant: 'danger' as const
        }
      ]
    },
    {
      title: 'شروع پردازش جدید',
      description: 'آغاز فرآیند جمع‌آوری و پردازش اسناد جدید',
      icon: <span className="text-green-600 text-2xl">▶️</span>,
      actions: [
        {
          label: 'شروع پردازش',
          onClick: () => alert('پردازش جدید آغاز شد'),
          variant: 'primary' as const
        },
        {
          label: 'تنظیمات',
          onClick: () => alert('تنظیمات پردازش'),
          variant: 'outline' as const
        }
      ]
    },
    {
      title: 'مانیتورینگ سیستم',
      description: 'نظارت بر وضعیت سرورها و عملکرد سیستم',
      icon: <span className="text-blue-600 text-2xl">📊</span>,
      actions: [
        {
          label: 'مشاهده جزئیات',
          onClick: () => window.location.href = '/health',
          variant: 'primary' as const
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">نمای کلی سیستم</h1>
        <p className="text-gray-600">آمار و گزارش کلی از وضعیت داده‌های جمع‌آوری شده</p>
      </div>

      {/* Dashboard Overview using new design system */}
      <DashboardOverview
        systemMetrics={systemMetrics}
        keyMetrics={keyMetrics}
        quickActions={quickActions}
      />
    </div>
  );
}