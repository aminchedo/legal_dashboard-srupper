import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  BarChart3,
  Download,
  Upload,
  Search,
  Scale,
  Gavel,
  BookOpen,
  Shield,
  Settings,
  RefreshCw,
  Plus,
  Globe,
  HeartPulse,
  FolderKanban,
  Zap,
  Eye,
  Users,
  Database,
  CheckCircle2,
  XCircle,
  Wifi,
  Server,
  Calendar,
  Bell
} from 'lucide-react';

import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useDatabase, useStatistics, useScrapingStats } from '../../hooks/useDatabase';
import { cn, formatPersianNumber, formatNumber, formatRelativeTime } from '../../lib/utils';
import LEGAL_TERMINOLOGY from '../../lib/terminology';

// Enhanced Statistics Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<{ className?: string }>;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  description?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'blue',
  description,
  onClick 
}) => {
  const colorVariants = {
    blue: 'from-blue-500/10 to-blue-600/20 border-blue-200 dark:border-blue-800',
    green: 'from-emerald-500/10 to-emerald-600/20 border-emerald-200 dark:border-emerald-800',
    purple: 'from-purple-500/10 to-purple-600/20 border-purple-200 dark:border-purple-800',
    orange: 'from-orange-500/10 to-orange-600/20 border-orange-200 dark:border-orange-800',
    red: 'from-red-500/10 to-red-600/20 border-red-200 dark:border-red-800'
  };

  const iconColors = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-emerald-600 dark:text-emerald-400',
    purple: 'text-purple-600 dark:text-purple-400',
    orange: 'text-orange-600 dark:text-orange-400',
    red: 'text-red-600 dark:text-red-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'relative overflow-hidden rounded-xl border bg-gradient-to-br p-6 shadow-sm transition-all duration-200',
        colorVariants[color],
        onClick && 'cursor-pointer hover:shadow-md hover:-translate-y-0.5'
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {typeof value === 'number' ? formatPersianNumber(value) : value}
            </p>
            {change !== undefined && (
              <span className={cn(
                'flex items-center text-sm font-medium',
                change >= 0 ? 'text-emerald-600' : 'text-red-600'
              )}>
                <TrendingUp className={cn('mr-1 h-3 w-3', change < 0 && 'rotate-180')} />
                {change >= 0 ? '+' : ''}{formatPersianNumber(change)}%
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              {description}
            </p>
          )}
        </div>
        <div className={cn(
          'rounded-lg bg-white/50 p-3 dark:bg-neutral-800/50',
          iconColors[color]
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
};

// Quick Action Button Component
interface QuickActionProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  onClick?: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({ label, icon: Icon, color = 'blue', onClick }) => {
  const colorVariants = {
    blue: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    green: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    purple: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
    orange: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'flex flex-col items-center gap-3 rounded-xl border p-4 transition-all duration-200',
        colorVariants[color]
      )}
      onClick={onClick}
    >
      <Icon className="h-8 w-8" />
      <span className="text-sm font-medium">{label}</span>
    </motion.button>
  );
};

// Recent Activity Item Component
interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  icon: React.ComponentType<{ className?: string }>;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ title, description, time, type, icon: Icon }) => {
  const typeStyles = {
    info: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    success: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    warning: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    error: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
    >
      <div className={cn('rounded-lg p-2', typeStyles[type])}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{title}</p>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">{description}</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">{time}</p>
      </div>
    </motion.div>
  );
};

// System Health Indicator Component
interface HealthIndicatorProps {
  label: string;
  status: 'healthy' | 'warning' | 'error';
  value?: string;
}

const HealthIndicator: React.FC<HealthIndicatorProps> = ({ label, status, value }) => {
  const statusStyles = {
    healthy: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
    warning: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  };

  const statusIcons = {
    healthy: CheckCircle2,
    warning: AlertTriangle,
    error: XCircle
  };

  const StatusIcon = statusIcons[status];

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-white dark:bg-neutral-800 dark:border-neutral-700">
      <div className="flex items-center gap-2">
        <StatusIcon className={cn('h-4 w-4', statusStyles[status].split(' ')[1])} />
        <span className="text-sm font-medium text-neutral-900 dark:text-white">{label}</span>
      </div>
      {value && (
        <span className="text-sm text-neutral-600 dark:text-neutral-400">{value}</span>
      )}
    </div>
  );
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { data: statistics, isLoading: statsLoading, error: statsError } = useStatistics();
  const { data: scrapingStats, isLoading: scrapingLoading } = useScrapingStats();

  // Navigation handlers for QuickAction buttons
  const handleUploadDocument = () => navigate('/documents');
  const handleAdvancedSearch = () => navigate('/documents');
  const handleGenerateReport = () => navigate('/analytics');
  const handleSystemSettings = () => navigate('/settings');

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Mock data (replace with real API data)
  const mockStats = {
    totalDocuments: 45230,
    totalLaws: 8450,
    courtDecisions: 12100,
    legalArticles: 3890,
    recentActivities: [
      {
        title: 'سند حقوقی جدید افزوده شد',
        description: 'اصلاحیه قانون تجارت - ماده ۱۲۵',
        time: '۱۰ دقیقه پیش',
        type: 'info' as const,
        icon: FileText
      },
      {
        title: 'تکمیل فرآیند استخراج',
        description: 'استخراج ۲۳۴ سند از منابع حقوقی',
        time: '۳۰ دقیقه پیش',
        type: 'success' as const,
        icon: CheckCircle2
      },
      {
        title: 'بروزرسانی سیستم',
        description: 'بروزرسانی نسخه ۲.۱.۴ اعمال شد',
        time: '۲ ساعت پیش',
        type: 'info' as const,
        icon: RefreshCw
      },
      {
        title: 'نیاز به بررسی',
        description: 'پردازش ۵ سند نیازمند تأیید است',
        time: '۵ ساعت پیش',
        type: 'warning' as const,
        icon: AlertTriangle
      }
    ]
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" text="در حال بارگذاری داشبورد..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            {LEGAL_TERMINOLOGY.dashboard}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            سامانه جامع مدیریت اطلاعات حقوقی جمهوری اسلامی ایران
          </p>
          <div className="flex items-center gap-2 mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            <Calendar className="h-4 w-4" />
            <span>
              {new Intl.DateTimeFormat('fa-IR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }).format(currentTime)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            گزارش خلاصه
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            عملیات جدید
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="اسناد حقوقی"
          value={statistics?.totalDocuments || mockStats.totalDocuments}
          change={12}
          icon={FileText}
          color="blue"
          description="مجموع اسناد در سیستم"
        />
        <StatCard
          title="قوانین فعال"
          value={statistics?.totalLaws || mockStats.totalLaws}
          change={3}
          icon={Scale}
          color="green"
          description="قوانین در حال اجرا"
        />
        <StatCard
          title="آرای قضایی"
          value={statistics?.courtDecisions || mockStats.courtDecisions}
          change={18}
          icon={Gavel}
          color="purple"
          description="آرای دادگاه‌ها"
        />
        <StatCard
          title="مقالات حقوقی"
          value={statistics?.legalArticles || mockStats.legalArticles}
          change={7}
          icon={BookOpen}
          color="orange"
          description="مقالات تخصصی"
        />
      </div>

      {/* Quick Actions & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              دسترسی‌های سریع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <QuickAction
                label="بارگذاری سند"
                icon={Upload}
                color="blue"
                onClick={handleUploadDocument}
              />
              <QuickAction
                label="جستجوی پیشرفته"
                icon={Search}
                color="green"
                onClick={handleAdvancedSearch}
              />
              <QuickAction
                label="تولید گزارش"
                icon={BarChart3}
                color="purple"
                onClick={handleGenerateReport}
              />
              <QuickAction
                label="تنظیمات سیستم"
                icon={Settings}
                color="orange"
                onClick={handleSystemSettings}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartPulse className="h-5 w-5" />
              وضعیت سیستم
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <HealthIndicator
              label="پایگاه داده"
              status="healthy"
              value="فعال"
            />
            <HealthIndicator
              label="سرویس استخراج"
              status="healthy"
              value="عملیاتی"
            />
            <HealthIndicator
              label="اتصال شبکه"
              status="warning"
              value="۹۸٪"
            />
            <HealthIndicator
              label="فضای ذخیره"
              status="healthy"
              value="۷۵٪ استفاده"
            />
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Categories Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              دسته‌بندی اسناد حقوقی
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'حقوق مدنی', count: 15230, percentage: 33.6, color: '#3B82F6' },
                { name: 'حقوق کیفری', count: 12450, percentage: 27.5, color: '#10B981' },
                { name: 'حقوق تجاری', count: 8900, percentage: 19.7, color: '#F59E0B' },
                { name: 'حقوق اداری', count: 6780, percentage: 15.0, color: '#EF4444' },
                { name: 'حقوق بین‌الملل', count: 2340, percentage: 5.2, color: '#8B5CF6' }
              ].map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {category.name}
                    </span>
                    <div className="text-left">
                      <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {formatPersianNumber(category.count)} سند
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 block">
                        {formatPersianNumber(category.percentage)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${category.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-2 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              فعالیت‌های اخیر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockStats.recentActivities.map((activity, index) => (
                <ActivityItem
                  key={index}
                  title={activity.title}
                  description={activity.description}
                  time={activity.time}
                  type={activity.type}
                  icon={activity.icon}
                />
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <Button variant="ghost" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                مشاهده تمام فعالیت‌ها
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
