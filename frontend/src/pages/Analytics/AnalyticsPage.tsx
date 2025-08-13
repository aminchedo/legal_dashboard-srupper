import React, { useState, useMemo } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, Activity, 
  Calendar, Download, Filter, RefreshCw, Users,
  FileText, Scale, Gavel, AlertTriangle, CheckCircle,
  Clock, Target, PieChart, LineChart as LineChartIcon,
  MoreVertical, Eye, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, StatusBadge } from '../../components/ui';
import { LEGAL_TERMINOLOGY } from '../../lib/terminology';
import { formatPersianNumber, formatNumber, cn } from '../../lib/utils';

// Types
interface AnalyticsData {
  caseAnalysis: {
    totalCases: number;
    activeCases: number;
    closedCases: number;
    winRate: number;
    monthlyChange: number;
  };
  documentStats: {
    totalDocuments: number;
    processedToday: number;
    avgProcessingTime: number;
    categories: Array<{
      name: string;
      count: number;
      percentage: number;
    }>;
  };
  timeTracking: {
    totalHours: number;
    billableHours: number;
    efficiency: number;
    monthlyTrend: Array<{
      month: string;
      hours: number;
      billable: number;
    }>;
  };
  financialOverview: {
    totalRevenue: number;
    pendingInvoices: number;
    collections: number;
    monthlyRevenue: Array<{
      month: string;
      revenue: number;
      expenses: number;
    }>;
  };
}

// Mock data
const mockAnalyticsData: AnalyticsData = {
  caseAnalysis: {
    totalCases: 1247,
    activeCases: 89,
    closedCases: 1158,
    winRate: 87.5,
    monthlyChange: 12.3
  },
  documentStats: {
    totalDocuments: 12450,
    processedToday: 45,
    avgProcessingTime: 2.4,
    categories: [
      { name: 'قراردادها', count: 3450, percentage: 27.7 },
      { name: 'آرا قضایی', count: 2890, percentage: 23.2 },
      { name: 'قوانین', count: 2150, percentage: 17.3 },
      { name: 'گزارشات', count: 1960, percentage: 15.7 },
      { name: 'مدارک', count: 1450, percentage: 11.6 },
      { name: 'سایر', count: 550, percentage: 4.4 }
    ]
  },
  timeTracking: {
    totalHours: 2840,
    billableHours: 2150,
    efficiency: 75.7,
    monthlyTrend: [
      { month: 'فروردین', hours: 220, billable: 165 },
      { month: 'اردیبهشت', hours: 240, billable: 180 },
      { month: 'خرداد', hours: 260, billable: 195 },
      { month: 'تیر', hours: 235, billable: 175 },
      { month: 'مرداد', hours: 275, billable: 210 },
      { month: 'شهریور', hours: 290, billable: 220 }
    ]
  },
  financialOverview: {
    totalRevenue: 2450000000,
    pendingInvoices: 890000000,
    collections: 85.2,
    monthlyRevenue: [
      { month: 'فروردین', revenue: 380000000, expenses: 120000000 },
      { month: 'اردیبهشت', revenue: 420000000, expenses: 135000000 },
      { month: 'خرداد', revenue: 450000000, expenses: 145000000 },
      { month: 'تیر', revenue: 410000000, expenses: 125000000 },
      { month: 'مرداد', revenue: 480000000, expenses: 155000000 },
      { month: 'شهریور', revenue: 520000000, expenses: 165000000 }
    ]
  }
};

const caseTypeData = [
  { name: 'مدنی', value: 45, color: '#3B82F6' },
  { name: 'کیفری', value: 25, color: '#EF4444' },
  { name: 'اداری', value: 20, color: '#10B981' },
  { name: 'تجاری', value: 10, color: '#F59E0B' }
];

const recentActivities = [
  {
    id: '1',
    type: 'case_update',
    title: 'به‌روزرسانی پرونده کیفری',
    description: 'پرونده شماره ۱۲۳۴ در مرحله بررسی قرار گرفت',
    timestamp: new Date('2024-01-15T10:30:00'),
    status: 'success'
  },
  {
    id: '2',
    type: 'document_processed',
    title: 'پردازش سند جدید',
    description: 'قرارداد خرید املاک با موفقیت پردازش شد',
    timestamp: new Date('2024-01-15T09:15:00'),
    status: 'success'
  },
  {
    id: '3',
    type: 'deadline_warning',
    title: 'هشدار مهلت',
    description: 'مهلت ارائه دفاعیه در پرونده ۹۸۷۶ نزدیک است',
    timestamp: new Date('2024-01-15T08:45:00'),
    status: 'warning'
  },
  {
    id: '4',
    type: 'payment_received',
    title: 'دریافت پرداخت',
    description: 'حق‌الوکاله پرونده ۵۶۷۸ دریافت شد',
    timestamp: new Date('2024-01-14T16:20:00'),
    status: 'success'
  }
];

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
}> = ({ title, value, change, icon: Icon, color, trend }) => {
  const getTrendIcon = () => {
    if (!change) return null;
    if (trend === 'up') return <ArrowUpRight className="w-4 h-4 text-success-600" />;
    if (trend === 'down') return <ArrowDownRight className="w-4 h-4 text-error-600" />;
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success-600';
    if (trend === 'down') return 'text-error-600';
    return 'text-neutral-600';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-600 mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-neutral-900 mb-1">
              {typeof value === 'number' ? formatPersianNumber(value) : value}
            </p>
            {change !== undefined && (
              <div className={cn("flex items-center gap-1 text-sm", getTrendColor())}>
                {getTrendIcon()}
                <span>
                  {change > 0 ? '+' : ''}{formatPersianNumber(Math.abs(change))}%
                </span>
                <span className="text-neutral-500">نسبت به ماه قبل</span>
              </div>
            )}
          </div>
          <div className={cn("p-3 rounded-lg", color)}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ActivityItem: React.FC<{
  activity: typeof recentActivities[0];
}> = ({ activity }) => {
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'case_update': return <Gavel className="w-4 h-4" />;
      case 'document_processed': return <FileText className="w-4 h-4" />;
      case 'deadline_warning': return <AlertTriangle className="w-4 h-4" />;
      case 'payment_received': return <CheckCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = () => {
    switch (activity.status) {
      case 'success': return 'bg-success-100 text-success-600';
      case 'warning': return 'bg-warning-100 text-warning-600';
      case 'error': return 'bg-error-100 text-error-600';
      default: return 'bg-neutral-100 text-neutral-600';
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('fa-IR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex items-start gap-3 p-3 hover:bg-neutral-50 rounded-lg transition-colors">
      <div className={cn("p-2 rounded-lg flex-shrink-0", getActivityColor())}>
        {getActivityIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-neutral-900 text-sm line-clamp-1">
          {activity.title}
        </h4>
        <p className="text-sm text-neutral-600 line-clamp-2 mt-1">
          {activity.description}
        </p>
        <p className="text-xs text-neutral-500 mt-1">
          {formatTime(activity.timestamp)}
        </p>
      </div>
    </div>
  );
};

const AnalyticsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const data = mockAnalyticsData;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fa-IR', {
      style: 'currency',
      currency: 'IRR',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {LEGAL_TERMINOLOGY.analytics.title}
          </h1>
          <p className="text-neutral-600 mt-1">
            تحلیل عملکرد و گزارش‌های جامع سیستم
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-neutral-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="1month">یک ماه اخیر</option>
            <option value="3month">سه ماه اخیر</option>
            <option value="6month">شش ماه اخیر</option>
            <option value="1year">یک سال اخیر</option>
          </select>
          <Button variant="outline" size="sm" icon={RefreshCw}>
            به‌روزرسانی
          </Button>
          <Button variant="primary" size="sm" icon={Download}>
            دانلود گزارش
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="کل پرونده‌ها"
          value={data.caseAnalysis.totalCases}
          change={data.caseAnalysis.monthlyChange}
          trend="up"
          icon={Scale}
          color="bg-primary-100 text-primary-600"
        />
        <MetricCard
          title="پرونده‌های فعال"
          value={data.caseAnalysis.activeCases}
          icon={Activity}
          color="bg-warning-100 text-warning-600"
        />
        <MetricCard
          title="نرخ موفقیت"
          value={`${formatPersianNumber(data.caseAnalysis.winRate)}%`}
          trend="up"
          icon={Target}
          color="bg-success-100 text-success-600"
        />
        <MetricCard
          title="درآمد کل"
          value={formatCurrency(data.financialOverview.totalRevenue)}
          change={15.8}
          trend="up"
          icon={TrendingUp}
          color="bg-emerald-100 text-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>درآمد و هزینه‌ها</CardTitle>
              <CardDescription>
                مقایسه درآمد و هزینه‌های ماهانه
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.financialOverview.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(Number(value)), '']}
                    labelStyle={{ direction: 'rtl' }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stackId="1" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.6}
                    name="درآمد"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expenses" 
                    stackId="2" 
                    stroke="#EF4444" 
                    fill="#EF4444" 
                    fillOpacity={0.6}
                    name="هزینه‌ها"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Time Tracking Chart */}
          <Card>
            <CardHeader>
              <CardTitle>ردیابی زمان</CardTitle>
              <CardDescription>
                ساعات کاری و قابل صورتحساب
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.timeTracking.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip labelStyle={{ direction: 'rtl' }} />
                  <Legend />
                  <Bar dataKey="hours" fill="#3B82F6" name="کل ساعات" />
                  <Bar dataKey="billable" fill="#10B981" name="ساعات قابل صورتحساب" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Document Categories */}
          <Card>
            <CardHeader>
              <CardTitle>دسته‌بندی اسناد</CardTitle>
              <CardDescription>
                توزیع اسناد بر اساس نوع
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Tooltip 
                      formatter={(value, name) => [formatPersianNumber(Number(value)), name]}
                    />
                    <RechartsPieChart data={data.documentStats.categories}>
                      {data.documentStats.categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={caseTypeData[index % caseTypeData.length]?.color || '#8B5CF6'} />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
                
                <div className="space-y-3">
                  {data.documentStats.categories.map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: caseTypeData[index % caseTypeData.length]?.color || '#8B5CF6' }}
                        />
                        <span className="text-sm text-neutral-700">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-neutral-900">
                          {formatPersianNumber(category.count)}
                        </span>
                        <span className="text-xs text-neutral-500 block">
                          {formatPersianNumber(category.percentage)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>آمار سریع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">اسناد پردازش شده امروز</span>
                <span className="font-semibold text-neutral-900">
                  {formatPersianNumber(data.documentStats.processedToday)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">میانگین زمان پردازش</span>
                <span className="font-semibold text-neutral-900">
                  {formatPersianNumber(data.documentStats.avgProcessingTime)} ساعت
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">راندمان زمان</span>
                <span className="font-semibold text-success-600">
                  {formatPersianNumber(data.timeTracking.efficiency)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">میزان وصولی</span>
                <span className="font-semibold text-success-600">
                  {formatPersianNumber(data.financialOverview.collections)}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Case Types */}
          <Card>
            <CardHeader>
              <CardTitle>انواع پرونده</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPieChart>
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, name]}
                  />
                  <RechartsPieChart data={caseTypeData}>
                    {caseTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsPieChart>
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {caseTypeData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-neutral-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-neutral-900">
                      {formatPersianNumber(item.value)}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>فعالیت‌های اخیر</CardTitle>
              <CardDescription>
                آخرین به‌روزرسانی‌های سیستم
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-neutral-200">
                {recentActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
              <div className="p-4 border-t">
                <Button variant="ghost" size="sm" className="w-full">
                  <Eye className="w-4 h-4 ml-1" />
                  مشاهده همه فعالیت‌ها
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;