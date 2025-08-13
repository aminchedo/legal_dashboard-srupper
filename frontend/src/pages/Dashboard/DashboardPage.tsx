import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Activity, 
  Server, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Database,
  Globe,
  Cpu,
  HardDrive,
  Wifi,
  Users,
  Download,
  Upload,
  Search,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  Button, 
  StatusBadge,
  cn
} from '../../components/ui';
import LEGAL_TERMINOLOGY from '../../lib/terminology';
import { formatPersianNumber, formatNumber, formatRelativeTime } from '../../lib/utils';

// Types for better TypeScript support
interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'success' | 'warning' | 'error';
  trend?: number;
}

interface DocumentStats {
  totalDocuments: number;
  newToday: number;
  processing: number;
  categories: Array<{
    name: string;
    count: number;
    color: string;
  }>;
}

interface RecentDocument {
  id: string;
  title: string;
  category: string;
  source: string;
  createdAt: Date;
  status: 'published' | 'draft' | 'processing';
  wordCount: number;
  url: string;
}

interface SystemStatus {
  cpu: number;
  memory: number;
  storage: number;
  network: {
    upload: number;
    download: number;
  };
  services: Array<{
    name: string;
    status: 'operational' | 'degraded' | 'down';
    responseTime: string;
  }>;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    cpu: 68,
    memory: 84,
    storage: 73,
    network: { upload: 1.2, download: 15.8 },
    services: [
      { name: 'Gateway API', status: 'operational', responseTime: '120ms' },
      { name: 'پایگاه داده', status: 'operational', responseTime: '45ms' },
      { name: 'واحد استخراج', status: 'operational', responseTime: 'N/A' },
      { name: 'مدیریت پروکسی', status: 'degraded', responseTime: '350ms' },
      { name: 'احراز هویت', status: 'operational', responseTime: '80ms' },
    ]
  });

  const [documentStats] = useState<DocumentStats>({
    totalDocuments: 12450,
    newToday: 152,
    processing: 12,
    categories: [
      { name: 'حقوق مدنی', count: 4500, color: '#3B82F6' },
      { name: 'حقوق تجاری', count: 3200, color: '#10B981' },
      { name: 'حقوق کیفری', count: 2100, color: '#F59E0B' },
      { name: 'آیین دادرسی', count: 1850, color: '#EF4444' },
      { name: 'سایر', count: 800, color: '#8B5CF6' },
    ]
  });

  const [recentDocuments] = useState<RecentDocument[]>([
    {
      id: 'doc-001',
      title: 'رای وحدت رویه شماره ۸۲۰ هیات عمومی دیوان عالی کشور',
      category: 'آیین دادرسی',
      source: 'rrk.ir',
      createdAt: new Date(2024, 0, 15),
      status: 'published',
      wordCount: 1250,
      url: 'https://rrk.ir/Laws/ShowLaw.aspx?Code=820'
    },
    {
      id: 'doc-002',
      title: 'قانون اصلاح قانون مبارزه با قاچاق کالا و ارز',
      category: 'حقوق کیفری',
      source: 'majlis.ir',
      createdAt: new Date(2024, 0, 12),
      status: 'published',
      wordCount: 8500,
      url: 'https://majlis.ir/fa/law/show/1024867'
    },
    {
      id: 'doc-003',
      title: 'بخشنامه جدید مالیات بر ارزش افزوده برای سال ۱۴۰۳',
      category: 'حقوق مالیاتی',
      source: 'intamedia.ir',
      createdAt: new Date(2024, 0, 10),
      status: 'processing',
      wordCount: 2100,
      url: 'https://intamedia.ir/circular/2023/28'
    },
    {
      id: 'doc-004',
      title: 'آیین‌نامه اجرایی قانون حمایت از خانواده و جوانی جمعیت',
      category: 'حقوق مدنی',
      source: 'dotic.ir',
      createdAt: new Date(2024, 0, 8),
      status: 'published',
      wordCount: 5400,
      url: 'https://dotic.ir/regulation/family-support'
    },
  ]);

  // Simulate real-time data updates
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        cpu: Math.max(20, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(40, Math.min(95, prev.memory + (Math.random() - 0.5) * 5)),
      }));
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const MetricCard: React.FC<{
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: string;
    description: string;
    trend?: number;
    onClick?: () => void;
  }> = ({ icon: Icon, title, value, description, trend, onClick }) => (
    <Card 
      variant="elevated" 
      interactive={!!onClick}
      onClick={onClick}
      className="hover:border-primary-300 transition-all duration-200"
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-primary-100 rounded-lg">
            <Icon className="w-6 h-6 text-primary-600" />
          </div>
          {trend !== undefined && (
            <div className={cn(
              'flex items-center gap-1 text-sm font-medium',
              trend >= 0 ? 'text-success-600' : 'text-error-600'
            )}>
              <TrendingUp className={cn('w-4 h-4', trend < 0 && 'rotate-180')} />
              {trend >= 0 ? '+' : ''}{formatPersianNumber(trend)}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-neutral-900 persian-numbers">
            {value}
          </h3>
          <p className="text-sm font-medium text-neutral-700">{title}</p>
          <p className="text-xs text-neutral-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  );

  const QuickActionsSection = () => (
    <Card>
      <CardHeader>
        <CardTitle>دسترسی سریع</CardTitle>
        <CardDescription>عملیات پرکاربرد سیستم</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Button 
            variant="primary" 
            className="h-12"
            onClick={() => navigate('/documents/upload')}
          >
            <Upload className="w-4 h-4" />
            بارگذاری سند
          </Button>
          <Button 
            variant="secondary" 
            className="h-12"
            onClick={() => navigate('/jobs/new')}
          >
            <Activity className="w-4 h-4" />
            پروژه جدید
          </Button>
          <Button 
            variant="outline" 
            className="h-12"
            onClick={() => navigate('/documents')}
          >
            <Search className="w-4 h-4" />
            جستجو اسناد
          </Button>
          <Button 
            variant="ghost" 
            className="h-12"
            onClick={() => navigate('/analytics')}
          >
            <BarChart3 className="w-4 h-4" />
            گزارش‌ها
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const SystemHealthSection = () => {
    const systemMetrics: SystemMetric[] = [
      { name: 'CPU', value: systemStatus.cpu, unit: '%', status: systemStatus.cpu > 80 ? 'warning' : 'success' },
      { name: 'حافظه', value: systemStatus.memory, unit: '%', status: systemStatus.memory > 90 ? 'error' : systemStatus.memory > 80 ? 'warning' : 'success' },
      { name: 'ذخیره‌سازی', value: systemStatus.storage, unit: '%', status: systemStatus.storage > 85 ? 'warning' : 'success' },
      { name: 'شبکه', value: systemStatus.network.download, unit: 'MB/s', status: 'success' },
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            وضعیت سلامت سیستم
          </CardTitle>
          <CardDescription>نظارت بر عملکرد و منابع سیستم</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {systemMetrics.map((metric) => (
              <div key={metric.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-600">{metric.name}</span>
                  <StatusBadge variant={metric.status} size="sm">
                    {formatPersianNumber(metric.value)}{metric.unit}
                  </StatusBadge>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div 
                    className={cn(
                      'h-2 rounded-full transition-all duration-1000',
                      metric.status === 'success' && 'bg-success-500',
                      metric.status === 'warning' && 'bg-warning-500',
                      metric.status === 'error' && 'bg-error-500'
                    )}
                    style={{ width: `${Math.min(100, metric.value)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-neutral-900">وضعیت سرویس‌ها</h4>
            {systemStatus.services.map((service) => (
              <div key={service.name} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <StatusBadge 
                    variant={
                      service.status === 'operational' ? 'success' : 
                      service.status === 'degraded' ? 'warning' : 'error'
                    }
                    size="sm"
                  >
                    {service.status === 'operational' ? 'عملیاتی' : 
                     service.status === 'degraded' ? 'کاهش عملکرد' : 'خارج از سرویس'}
                  </StatusBadge>
                  <span className="font-medium text-neutral-900">{service.name}</span>
                </div>
                <span className="text-sm text-neutral-500 persian-numbers">
                  {service.responseTime}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const DocumentStatsSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>توزیع دسته‌بندی اسناد</CardTitle>
            <CardDescription>نمایش آماری اسناد بر اساس موضوع حقوقی</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={documentStats.categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {documentStats.categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [formatNumber(value as number), 'تعداد']}
                    labelFormatter={(label) => `${label}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {documentStats.categories.map((category) => (
                <div key={category.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm text-neutral-600">{category.name}</span>
                  <span className="text-sm font-medium text-neutral-900 persian-numbers">
                    {formatNumber(category.count)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>آخرین فعالیت‌ها</CardTitle>
            <CardDescription>اسناد اخیراً پردازش شده</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDocuments.map((doc) => (
                <div key={doc.id} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-neutral-900 text-sm line-clamp-2 mb-1">
                      {doc.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                      <span>{doc.category}</span>
                      <span>•</span>
                      <span>{doc.source}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <StatusBadge 
                        variant={
                          doc.status === 'published' ? 'success' :
                          doc.status === 'processing' ? 'warning' : 'info'
                        }
                        size="sm"
                      >
                        {doc.status === 'published' ? 'منتشر شده' :
                         doc.status === 'processing' ? 'در حال پردازش' : 'پیش‌نویس'}
                      </StatusBadge>
                      <span className="text-xs text-neutral-400 persian-numbers">
                        {formatRelativeTime(doc.createdAt)}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate('/documents')}
            >
              مشاهده همه اسناد
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto" />
          <p className="text-neutral-600">در حال بارگذاری داشبورد...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-l from-primary-600 to-primary-800 rounded-2xl text-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {LEGAL_TERMINOLOGY.overview}
            </h1>
            <p className="text-primary-100 mb-4">
              سیستم جامع مدیریت اطلاعات حقوقی جمهوری اسلامی ایران
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>امروز {new Intl.DateTimeFormat('fa-IR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }).format(new Date())}</span>
              </div>
              <StatusBadge variant="success" size="sm">
                سیستم عملیاتی
              </StatusBadge>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Activity className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={FileText}
          title={LEGAL_TERMINOLOGY.allDocuments}
          value={formatNumber(documentStats.totalDocuments)}
          description="مجموع اسناد در سیستم"
          trend={documentStats.newToday}
          onClick={() => navigate('/documents')}
        />
        <MetricCard
          icon={Activity}
          title="پروژه‌های فعال"
          value={formatNumber(12450)}
          description="در حال پردازش"
          trend={1}
          onClick={() => navigate('/jobs')}
        />
        <MetricCard
          icon={Server}
          title="پروکسی‌های فعال"
          value={formatNumber(2847583)}
          description="آماده برای استفاده"
          trend={-3}
          onClick={() => navigate('/proxies')}
        />
        <MetricCard
          icon={AlertTriangle}
          title="هشدارهای سیستم"
          value={formatPersianNumber(2)}
          description="نیاز به بررسی"
          onClick={() => navigate('/system')}
        />
      </div>

      {/* Quick Actions */}
      <QuickActionsSection />

      {/* System Health */}
      <SystemHealthSection />

      {/* Document Statistics */}
      <DocumentStatsSection />
    </div>
  );
};

export default DashboardPage;
