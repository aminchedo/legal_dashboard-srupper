import React, { useState } from 'react';
import { Card, Button, Input } from '../../../components/ui/atoms';
import { DataTable, ActionCard } from '../../../components/ui/molecules';
import { formatPersianDate } from '../../../lib/formatters';

export default function ReportsPage() {
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    {
      id: 'daily-summary',
      title: 'گزارش روزانه',
      description: 'خلاصه فعالیت‌های روزانه سیستم و آمار کلی',
      format: ['PDF', 'Excel', 'CSV']
    },
    {
      id: 'document-analysis',
      title: 'تحلیل اسناد',
      description: 'گزارش تفصیلی از اسناد پردازش شده و نتایج تحلیل',
      format: ['PDF', 'Word']
    },
    {
      id: 'system-performance',
      title: 'عملکرد سیستم',
      description: 'آمار و گزارش عملکرد سرورها و منابع سیستم',
      format: ['PDF', 'Excel']
    },
    {
      id: 'user-activity',
      title: 'فعالیت کاربران',
      description: 'گزارش فعالیت‌ها و دسترسی‌های کاربران',
      format: ['PDF', 'CSV']
    },
    {
      id: 'scraping-results',
      title: 'نتایج استخراج',
      description: 'گزارش عملیات وب اسکرپینگ و داده‌های جمع‌آوری شده',
      format: ['Excel', 'CSV', 'JSON']
    },
    {
      id: 'audit-log',
      title: 'گزارش حسابرسی',
      description: 'لاگ کامل تمام فعالیت‌ها و تغییرات سیستم',
      format: ['PDF', 'CSV']
    }
  ];

  const recentReports = [
    {
      id: '1',
      name: 'گزارش روزانه - 1403/08/15',
      type: 'روزانه',
      generatedDate: new Date('2024-11-06'),
      size: '2.3 MB',
      format: 'PDF',
      status: 'completed'
    },
    {
      id: '2',
      name: 'تحلیل اسناد - هفته گذشته',
      type: 'تحلیل اسناد',
      generatedDate: new Date('2024-11-05'),
      size: '5.7 MB',
      format: 'Excel',
      status: 'completed'
    },
    {
      id: '3',
      name: 'عملکرد سیستم - ماه گذشته',
      type: 'عملکرد',
      generatedDate: new Date('2024-11-01'),
      size: '1.8 MB',
      format: 'PDF',
      status: 'completed'
    }
  ];

  const handleGenerateReport = async (reportId: string, format: string) => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      alert(`گزارش ${reportTypes.find(r => r.id === reportId)?.title} در فرمت ${format} تولید شد`);
    }, 2000);
  };

  const handleDownload = (reportId: string) => {
    alert(`دانلود گزارش ${reportId}`);
  };

  const handleDelete = (reportId: string) => {
    if (confirm('آیا از حذف این گزارش مطمئن هستید؟')) {
      alert(`گزارش ${reportId} حذف شد`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">گزارشات جامع</h1>
        <p className="text-gray-600">تولید و مدیریت گزارشات مختلف سیستم</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">گزارش سریع</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                label="از تاریخ"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
              <Input
                type="date"
                label="تا تاریخ"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="primary" onClick={() => handleGenerateReport('daily-summary', 'PDF')}>
                گزارش روزانه
              </Button>
              <Button variant="secondary" onClick={() => handleGenerateReport('system-performance', 'PDF')}>
                عملکرد سیستم
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">آمار کلی</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">گزارشات تولید شده امروز:</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">گزارشات این ماه:</span>
              <span className="font-medium">245</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">حجم کل گزارشات:</span>
              <span className="font-medium">1.2 GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">آخرین گزارش:</span>
              <span className="font-medium">2 ساعت پیش</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Report Types */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">انواع گزارشات</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report) => (
            <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-gray-900 mb-2">{report.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{report.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {report.format.map((format) => (
                  <span key={format} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {format}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                {report.format.map((format) => (
                  <Button
                    key={format}
                    size="sm"
                    variant="outline"
                    disabled={isGenerating}
                    onClick={() => handleGenerateReport(report.id, format)}
                  >
                    {format}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Reports */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">گزارشات اخیر</h2>
        <DataTable
          headers={['نام گزارش', 'نوع', 'تاریخ تولید', 'حجم', 'فرمت', 'عملیات']}
          rows={recentReports.map(report => [
            report.name,
            report.type,
            formatPersianDate(report.generatedDate),
            report.size,
            report.format,
            <div key={report.id} className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownload(report.id)}
              >
                دانلود
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDelete(report.id)}
              >
                حذف
              </Button>
            </div>
          ])}
        />
      </Card>

      {/* Scheduled Reports */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">گزارشات زمان‌بندی شده</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">گزارش روزانه خودکار</p>
              <p className="text-sm text-gray-600">هر روز ساعت 8 صبح</p>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                فعال
              </span>
              <Button size="sm" variant="outline">ویرایش</Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">گزارش هفتگی عملکرد</p>
              <p className="text-sm text-gray-600">هر دوشنبه ساعت 9 صبح</p>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                فعال
              </span>
              <Button size="sm" variant="outline">ویرایش</Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">گزارش ماهانه جامع</p>
              <p className="text-sm text-gray-600">اول هر ماه ساعت 10 صبح</p>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                غیرفعال
              </span>
              <Button size="sm" variant="outline">ویرایش</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}