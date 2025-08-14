import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  Filter,
  RefreshCw,
  Eye,
  FileText,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Loader2
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { LEGAL_TERMINOLOGY } from '../../lib/terminology';
import { cn, formatPersianNumber, formatRelativeTime } from '../../lib/utils';

// Types for analytics data
interface AnalyticsMetric {
  id: string;
  label: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'stable';
  icon: React.ElementType;
  color: string;
  format?: 'number' | 'percentage' | 'currency' | 'duration';
}

interface ChartDataPoint {
  period: string;
  [key: string]: string | number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface ActivityItem {
  id: string;
  action: string;
  description: string;
  user: string;
  timestamp: Date;
  type: 'upload' | 'review' | 'edit';
  status: 'success' | 'pending' | 'error';
}

interface StatusData {
  period: string;
  value: number;
  color: string;
}

// Mock data
const mockMetrics: AnalyticsMetric[] = [
  {
    id: 'total_documents',
    label: 'کل اسناد',
    value: 1247,
    change: 12.5,
    changeType: 'increase',
    icon: FileText,
    color: 'text-blue-600',
    format: 'number'
  },
  {
    id: 'active_cases',
    label: 'پرونده‌های فعال',
    value: 89,
    change: -3.2,
    changeType: 'decrease',
    icon: Activity,
    color: 'text-yellow-600',
    format: 'number'
  },
  {
    id: 'completion_rate',
    label: 'نرخ تکمیل',
    value: 87.5,
    change: 5.8,
    changeType: 'increase',
    icon: CheckCircle2,
    color: 'text-green-600',
    format: 'percentage'
  },
  {
    id: 'avg_processing_time',
    label: 'متوسط زمان پردازش',
    value: 2.4,
    change: -12.1,
    changeType: 'decrease',
    icon: Clock,
    color: 'text-blue-600',
    format: 'duration'
  },
  {
    id: 'pending_reviews',
    label: 'بررسی‌های معلق',
    value: 23,
    change: 8.7,
    changeType: 'increase',
    icon: AlertTriangle,
    color: 'text-red-600',
    format: 'number'
  },
  {
    id: 'user_activity',
    label: 'فعالیت کاربران',
    value: 156,
    change: 15.3,
    changeType: 'increase',
    icon: Users,
    color: 'text-purple-600',
    format: 'number'
  }
];

const mockTimeSeriesData: ChartDataPoint[] = [
  { period: 'دی ۱۴۰۲', documents: 98, cases: 23, reviews: 45, users: 12 },
  { period: 'بهمن ۱۴۰۲', documents: 112, cases: 28, reviews: 52, users: 15 },
  { period: 'اسفند ۱۴۰۲', documents: 89, cases: 19, reviews: 38, users: 11 },
  { period: 'فروردین ۱۴۰۳', documents: 134, cases: 35, reviews: 67, users: 18 },
  { period: 'اردیبهشت ۱۴۰۳', documents: 156, cases: 42, reviews: 78, users: 22 },
  { period: 'خرداد ۱۴۰۳', documents: 187, cases: 48, reviews: 89, users: 25 },
  { period: 'تیر ۱۴۰۳', documents: 203, cases: 52, reviews: 94, users: 28 },
  { period: 'مرداد ۱۴۰۳', documents: 178, cases: 38, reviews: 82, users: 24 },
  { period: 'شهریور ۱۴۰۳', documents: 195, cases: 45, reviews: 87, users: 26 },
  { period: 'مهر ۱۴۰۳', documents: 212, cases: 58, reviews: 95, users: 31 },
  { period: 'آبان ۱۴۰۳', documents: 189, cases: 41, reviews: 78, users: 27 },
  { period: 'آذر ۱۴۰۳', documents: 225, cases: 63, reviews: 102, users: 34 }
];

const mockCategoryData: CategoryData[] = [
  { name: 'قراردادها', value: 485, color: '#3B82F6', percentage: 38.9 },
  { name: 'آراء قضایی', value: 298, color: '#10B981', percentage: 23.9 },
  { name: 'نظریات حقوقی', value: 187, color: '#F59E0B', percentage: 15.0 },
  { name: 'قوانین و مقررات', value: 156, color: '#EF4444', percentage: 12.5 },
  { name: 'مکاتبات', value: 89, color: '#8B5CF6', percentage: 7.1 },
  { name: 'سایر', value: 32, color: '#6B7280', percentage: 2.6 }
];

const mockStatusData: StatusData[] = [
  { period: 'فعال', value: 687, color: '#10B981' },
  { period: 'بایگانی شده', value: 423, color: '#6B7280' },
  { period: 'در انتظار بررسی', value: 89, color: '#F59E0B' },
  { period: 'در حال ویرایش', value: 48, color: '#EF4444' }
];

const mockRecentActivities: ActivityItem[] = [
  {
    id: '1',
    action: 'آپلود سند جدید',
    description: 'قرارداد خدمات حقوقی شرکت آلفا',
    user: 'احمد محمدی',
    timestamp: new Date('2024-01-20T10:30:00'),
    type: 'upload',
    status: 'success'
  },
  {
    id: '2',
    action: 'بررسی و تایید',
    description: 'نظریه حقوقی در خصوص مالکیت فکری',
    user: 'مریم احمدی',
    timestamp: new Date('2024-01-20T09:15:00'),
    type: 'review',
    status: 'success'
  },
  {
    id: '3',
    action: 'درخواست ویرایش',
    description: 'رای دیوان عدالت اداری - پرونده ۱۴۰۳۰۱۲۳۴',
    user: 'سعید رضایی',
    timestamp: new Date('2024-01-20T08:45:00'),
    type: 'edit',
    status: 'pending'
  }
];

// Sub-components
const MetricCard: React.FC<{ metric: AnalyticsMetric }> = ({ metric }) => {
  const IconComponent = metric.icon;
  
  const getBackgroundColor = (color: string) => {
    const colorMap: Record<string, string> = {
      'text-blue-600': 'bg-blue-50',
      'text-green-600': 'bg-green-50',
      'text-yellow-600': 'bg-yellow-50',
      'text-red-600': 'bg-red-50',
      'text-purple-600': 'bg-purple-50'
    };
    return colorMap[color] || 'bg-gray-50';
  };

  const getChangeIcon = (changeType: 'increase' | 'decrease' | 'stable') => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'decrease':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <TrendingUp className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatValue = (value: number, format?: string) => {
    switch (format) {
      case 'percentage':
        return `${formatPersianNumber(value)}%`;
      case 'currency':
        return `${formatPersianNumber(value)} تومان`;
      case 'duration':
        return `${formatPersianNumber(value)} روز`;
      default:
        return formatPersianNumber(value);
    }
  };
  
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <Card.Body className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-3 rounded-lg", getBackgroundColor(metric.color))}>
              <IconComponent className={cn("w-6 h-6", metric.color)} />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">
                {metric.label}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatValue(metric.value, metric.format)}
              </p>
            </div>
          </div>
          
          <div className="text-left">
            <div className="flex items-center gap-1 mb-1">
              {getChangeIcon(metric.changeType)}
              <span className={cn(
                "text-sm font-medium",
                metric.changeType === 'increase' ? 'text-green-600' :
                metric.changeType === 'decrease' ? 'text-red-600' : 'text-gray-500'
              )}>
                {formatPersianNumber(Math.abs(metric.change))}%
              </span>
            </div>
            <p className="text-xs text-gray-500">
              از ماه قبل
            </p>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900 mb-2">
          {label}
        </p>
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-600">
              {item.name}:
            </span>
            <span className="font-medium text-gray-900">
              {formatPersianNumber(item.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ChartRenderer: React.FC<{
  type: 'line' | 'bar' | 'area';
  data: ChartDataPoint[];
}> = ({ type, data }) => {
  const chartProps = {
    data,
    margin: { top: 5, right: 30, left: 20, bottom: 5 }
  };

  switch (type) {
    case 'bar':
      return (
        <BarChart {...chartProps}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="documents" fill="#3B82F6" name="اسناد" />
          <Bar dataKey="cases" fill="#10B981" name="پرونده‌ها" />
          <Bar dataKey="reviews" fill="#F59E0B" name="بررسی‌ها" />
        </BarChart>
      );
    
    case 'area':
      return (
        <AreaChart {...chartProps}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="documents" 
            stackId="1" 
            stroke="#3B82F6" 
            fill="#3B82F6" 
            fillOpacity={0.3}
            name="اسناد"
          />
          <Area 
            type="monotone" 
            dataKey="cases" 
            stackId="1" 
            stroke="#10B981" 
            fill="#10B981" 
            fillOpacity={0.3}
            name="پرونده‌ها"
          />
        </AreaChart>
      );
    
    default:
      return (
        <LineChart {...chartProps}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="documents" 
            stroke="#3B82F6" 
            strokeWidth={3}
            name="اسناد"
          />
          <Line 
            type="monotone" 
            dataKey="cases" 
            stroke="#10B981" 
            strokeWidth={3}
            name="پرونده‌ها"
          />
          <Line 
            type="monotone" 
            dataKey="reviews" 
            stroke="#F59E0B" 
            strokeWidth={3}
            name="بررسی‌ها"
          />
        </LineChart>
      );
  }
};

const PeriodSelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const options = [
    { value: '3months', label: '۳ ماه اخیر' },
    { value: '6months', label: '۶ ماه اخیر' },
    { value: '12months', label: '۱۲ ماه اخیر' },
    { value: 'custom', label: 'سفارشی' }
  ];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

const ChartTypeSelector: React.FC<{
  value: 'line' | 'bar' | 'area';
  onChange: (value: 'line' | 'bar' | 'area') => void;
}> = ({ value, onChange }) => {
  return (
    <div className="flex rounded-lg border border-gray-200 p-1">
      <Button
        variant={value === 'line' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => onChange('line')}
        className="h-8 px-3"
      >
        خطی
      </Button>
      <Button
        variant={value === 'bar' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => onChange('bar')}
        className="h-8 px-3"
      >
        ستونی
      </Button>
      <Button
        variant={value === 'area' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => onChange('area')}
        className="h-8 px-3"
      >
        ناحیه‌ای
      </Button>
    </div>
  );
};

const StatusBadge: React.FC<{
  status: 'success' | 'pending' | 'error';
  children: React.ReactNode;
}> = ({ status, children }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
      getStatusStyles()
    )}>
      {children}
    </span>
  );
};

const ActivityList: React.FC<{ activities: ActivityItem[] }> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'review':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'edit':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case 'upload':
        return 'bg-blue-50';
      case 'review':
        return 'bg-green-50';
      case 'edit':
        return 'bg-yellow-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
          <div className={cn(
            "p-2 rounded-lg",
            getActivityBgColor(activity.type)
          )}>
            {getActivityIcon(activity.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900">
              {activity.action}
            </h4>
            <p className="text-sm text-gray-600 truncate">
              {activity.description}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <span>{activity.user}</span>
              <span>•</span>
              <span>{formatRelativeTime(activity.timestamp)}</span>
            </div>
          </div>
          
          <StatusBadge status={activity.status}>
            {activity.status === 'success' ? 'تکمیل شده' : 
             activity.status === 'pending' ? 'در انتظار' : 'خطا'}
          </StatusBadge>
        </div>
      ))}
    </div>
  );
};

// Main Component
const AnalyticsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('12months');
  const [selectedChart, setSelectedChart] = useState<'line' | 'bar' | 'area'>('line');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Here you would typically call your analytics API
    } catch (err) {
      setError('خطا در بارگذاری داده‌های تحلیلی');
      console.error('Analytics refresh error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleExportReport = useCallback(() => {
    // Handle report export
    console.log('Exporting report...');
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">خطا در بارگذاری داده‌ها</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={handleRefresh} variant="primary">
            تلاش مجدد
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              تحلیل و گزارشات
            </h1>
            <p className="text-gray-600 mt-1">
              تحلیل و گزارش‌گیری از عملکرد سیستم حقوقی
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              loading={isLoading}
              disabled={isLoading}
            >
              <RefreshCw size={16} />
              به‌روزرسانی
            </Button>
            <Button
              variant="outline"
              onClick={handleExportReport}
            >
              <Download size={16} />
              دانلود گزارش
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="large" message="در حال بارگذاری داده‌های تحلیلی..." />
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {mockMetrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>

        {/* Time Series Chart */}
        <Card>
          <Card.Header>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-gray-900">روند زمانی فعالیت‌ها</h2>
              
              <div className="flex items-center gap-3">
                <PeriodSelector
                  value={selectedPeriod}
                  onChange={setSelectedPeriod}
                />
                <ChartTypeSelector
                  value={selectedChart}
                  onChange={setSelectedChart}
                />
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ChartRenderer type={selectedChart} data={mockTimeSeriesData} />
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>

        {/* Category Distribution and Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">توزیع دسته‌بندی اسناد</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {/* Pie Chart */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockCategoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {mockCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Legend */}
                <div className="grid grid-cols-1 gap-2">
                  {mockCategoryData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-gray-700">
                          {category.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {formatPersianNumber(category.value)}
                        </span>
                        <span className="text-gray-500">
                          ({formatPersianNumber(category.percentage)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Status Overview */}
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">وضعیت اسناد</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {/* Horizontal Bar Chart */}
                <div className="space-y-3">
                  {mockStatusData.map((status, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">
                          {status.period}
                        </span>
                        <span className="font-medium text-gray-900">
                          {formatPersianNumber(status.value)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: status.color,
                            width: `${(status.value / Math.max(...mockStatusData.map(s => s.value))) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Summary */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      مجموع کل:
                    </span>
                    <span className="font-bold text-gray-900">
                      {formatPersianNumber(mockStatusData.reduce((sum, item) => sum + item.value, 0))} سند
                    </span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">آخرین فعالیت‌ها</h2>
              <Button variant="outline" size="sm">
                <Eye size={16} />
                مشاهده همه
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <ActivityList activities={mockRecentActivities} />
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
