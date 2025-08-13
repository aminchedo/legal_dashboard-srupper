import React, { useState, useMemo } from 'react';
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
  Activity
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Select,
  StatusBadge
} from '../../components/ui';
import { LEGAL_TERMINOLOGY } from '../../lib/terminology';
import { cn, formatPersianNumber, formatRelativeTime } from '../../lib/utils';

// Types for analytics data
interface AnalyticsMetric {
  id: string;
  label: string;
  value: number;
  change: number; // percentage change
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

// Mock analytics data
const mockMetrics: AnalyticsMetric[] = [
  {
    id: 'total_documents',
    label: 'کل اسناد',
    value: 1247,
    change: 12.5,
    changeType: 'increase',
    icon: FileText,
    color: 'text-primary-600',
    format: 'number'
  },
  {
    id: 'active_cases',
    label: 'پرونده‌های فعال',
    value: 89,
    change: -3.2,
    changeType: 'decrease',
    icon: Activity,
    color: 'text-warning-600',
    format: 'number'
  },
  {
    id: 'completion_rate',
    label: 'نرخ تکمیل',
    value: 87.5,
    change: 5.8,
    changeType: 'increase',
    icon: CheckCircle2,
    color: 'text-success-600',
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
    color: 'text-error-600',
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

const mockStatusData: ChartDataPoint[] = [
  { period: 'فعال', value: 687, color: '#10B981' },
  { period: 'بایگانی شده', value: 423, color: '#6B7280' },
  { period: 'در انتظار بررسی', value: 89, color: '#F59E0B' },
  { period: 'در حال ویرایش', value: 48, color: '#EF4444' }
];

const AnalyticsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('12months');
  const [selectedChart, setSelectedChart] = useState<'line' | 'bar' | 'area'>('line');
  const [showComparison, setShowComparison] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
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

  const getChangeIcon = (changeType: 'increase' | 'decrease' | 'stable') => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-4 h-4 text-success-600" />;
      case 'decrease':
        return <TrendingDown className="w-4 h-4 text-error-600" />;
      default:
        return <TrendingUp className="w-4 h-4 text-neutral-400" />;
    }
  };

  const MetricCard: React.FC<{ metric: AnalyticsMetric }> = ({ metric }) => {
    const IconComponent = metric.icon;
    
    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("p-3 rounded-lg bg-opacity-10", metric.color.replace('text-', 'bg-'))}>
                <IconComponent className={cn("w-6 h-6", metric.color)} />
              </div>
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  {metric.label}
                </p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {formatValue(metric.value, metric.format)}
                </p>
              </div>
            </div>
            
            <div className="text-left rtl:text-right">
              <div className="flex items-center gap-1 mb-1">
                {getChangeIcon(metric.changeType)}
                <span className={cn(
                  "text-sm font-medium",
                  metric.changeType === 'increase' ? 'text-success-600' :
                  metric.changeType === 'decrease' ? 'text-error-600' : 'text-neutral-500'
                )}>
                  {formatPersianNumber(Math.abs(metric.change))}%
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                از ماه قبل
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-neutral-800 p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            {label}
          </p>
          {payload.map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-neutral-600 dark:text-neutral-400">
                {item.name}:
              </span>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {formatPersianNumber(item.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const chartProps = {
      data: mockTimeSeriesData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (selectedChart) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {LEGAL_TERMINOLOGY.pages.analytics}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            تحلیل و گزارش‌گیری از عملکرد سیستم حقوقی
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            icon={Filter}
            size="sm"
          >
            فیلترها
          </Button>
          <Button
            variant="outline"
            icon={RefreshCw}
            size="sm"
            loading={isLoading}
            onClick={handleRefresh}
          >
            به‌روزرسانی
          </Button>
          <Button
            variant="primary"
            icon={Download}
            size="sm"
          >
            دانلود گزارش
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {mockMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Time Series Chart */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>روند زمانی فعالیت‌ها</CardTitle>
            
            <div className="flex items-center gap-2">
              <Select
                options={[
                  { value: '3months', label: '۳ ماه اخیر' },
                  { value: '6months', label: '۶ ماه اخیر' },
                  { value: '12months', label: '۱۲ ماه اخیر' },
                  { value: 'custom', label: 'سفارشی' }
                ]}
                value={selectedPeriod}
                onChange={setSelectedPeriod}
                size="sm"
              />
              
              <div className="flex rounded-lg border border-neutral-200 dark:border-neutral-700 p-1">
                <Button
                  variant={selectedChart === 'line' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedChart('line')}
                  className="h-8 px-2"
                >
                  خطی
                </Button>
                <Button
                  variant={selectedChart === 'bar' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedChart('bar')}
                  className="h-8 px-2"
                >
                  ستونی
                </Button>
                <Button
                  variant={selectedChart === 'area' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedChart('area')}
                  className="h-8 px-2"
                >
                  ناحیه‌ای
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Distribution and Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>توزیع دسته‌بندی اسناد</CardTitle>
          </CardHeader>
          <CardContent>
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
                      <span className="text-neutral-700 dark:text-neutral-300">
                        {category.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-neutral-900 dark:text-neutral-100">
                        {formatPersianNumber(category.value)}
                      </span>
                      <span className="text-neutral-500 dark:text-neutral-400">
                        ({formatPersianNumber(category.percentage)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle>وضعیت اسناد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Horizontal Bar Chart */}
              <div className="space-y-3">
                {mockStatusData.map((status, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-700 dark:text-neutral-300">
                        {status.period}
                      </span>
                      <span className="font-medium text-neutral-900 dark:text-neutral-100">
                        {formatPersianNumber(status.value)}
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
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
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    مجموع کل:
                  </span>
                  <span className="font-bold text-neutral-900 dark:text-neutral-100">
                    {formatPersianNumber(mockStatusData.reduce((sum, item) => sum + item.value, 0))} سند
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>آخرین فعالیت‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
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
            ].map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <div className={cn(
                  "p-2 rounded-lg",
                  activity.type === 'upload' && 'bg-blue-100 dark:bg-blue-900/30',
                  activity.type === 'review' && 'bg-green-100 dark:bg-green-900/30',
                  activity.type === 'edit' && 'bg-yellow-100 dark:bg-yellow-900/30'
                )}>
                  {activity.type === 'upload' && <FileText className="w-4 h-4 text-blue-600" />}
                  {activity.type === 'review' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                  {activity.type === 'edit' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                    {activity.action}
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <span>{activity.user}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(activity.timestamp)}</span>
                  </div>
                </div>
                
                <StatusBadge 
                  variant={activity.status === 'success' ? 'success' : 'warning'}
                  size="sm"
                >
                  {activity.status === 'success' ? 'تکمیل شده' : 'در انتظار'}
                </StatusBadge>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm" icon={Eye}>
              مشاهده همه فعالیت‌ها
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;