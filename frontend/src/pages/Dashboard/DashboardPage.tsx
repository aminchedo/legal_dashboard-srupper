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
  Bell,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  UserIcon,
  QuestionMarkCircleIcon,
} from 'lucide-react';

import Card, { MetricCard, StatCard, InfoCard } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useDatabase, useStatistics, useScrapingStats } from '../../hooks/useDatabase';
import { cn, formatPersianNumber, formatNumber, formatRelativeTime } from '../../lib/utils';
import LEGAL_TERMINOLOGY from '../../lib/terminology';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { data: databaseData, isLoading: dbLoading } = useDatabase();
  const { data: statistics, isLoading: statsLoading } = useStatistics();
  const { data: scrapingStats, isLoading: scrapingLoading } = useScrapingStats();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || dbLoading || statsLoading || scrapingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner variant="progress" size="lg" text="در حال بارگذاری داشبورد..." />
      </div>
    );
  }

  // Mock data for demonstration
  const mockStats = {
    totalDocuments: 12450,
    activeJobs: 12,
    systemHealth: 98,
    recentActivity: 234,
    documentsChange: 12.5,
    jobsChange: -3.2,
    healthChange: 1.8,
    activityChange: 8.7
  };

  const recentActivities = [
    {
      id: 1,
      type: 'document',
      title: 'سند جدید آپلود شد',
      description: 'اصلاحیه قانون تجارت',
      time: '۵ دقیقه پیش',
      user: 'احمد محمدی',
      status: 'success'
    },
    {
      id: 2,
      type: 'job',
      title: 'وظیفه جدید ایجاد شد',
      description: 'پردازش ۲۳۴ سند',
      time: '۱۵ دقیقه پیش',
      user: 'فاطمه احمدی',
      status: 'processing'
    },
    {
      id: 3,
      type: 'system',
      title: 'بروزرسانی سیستم',
      description: 'نسخه ۲.۱.۰ نصب شد',
      time: '۱ ساعت پیش',
      user: 'سیستم',
      status: 'info'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 persian-text">
            {LEGAL_TERMINOLOGY.dashboard}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 persian-text">
            خوش آمدید! اینجا آنچه در پلتفرم تحلیل حقوقی شما اتفاق می‌افتد را مشاهده می‌کنید.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" size="md">
            <QuestionMarkCircleIcon className="h-4 w-4 mr-2" />
            راهنما
          </Button>
          <Button variant="primary" size="md" gradient>
            <Plus className="h-4 w-4 mr-2" />
            سند جدید
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="premium-grid">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <MetricCard
            title="کل اسناد"
            value={formatPersianNumber(mockStats.totalDocuments)}
            change={mockStats.documentsChange}
            trend="up"
            icon={<FileText className="w-6 h-6" />}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <MetricCard
            title="وظایف فعال"
            value={mockStats.activeJobs}
            change={mockStats.jobsChange}
            trend="down"
            icon={<Activity className="w-6 h-6" />}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <MetricCard
            title="سلامت سیستم"
            value={`${mockStats.systemHealth}%`}
            change={mockStats.healthChange}
            trend="up"
            icon={<HeartPulse className="w-6 h-6" />}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <MetricCard
            title="فعالیت اخیر"
            value={formatPersianNumber(mockStats.recentActivity)}
            change={mockStats.activityChange}
            trend="up"
            icon={<TrendingUp className="w-6 h-6" />}
          />
        </motion.div>
      </div>

      {/* Analytics Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card variant="elevated" size="lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white persian-text">
                نمای کلی تحلیل‌ها
              </h2>
              <p className="text-gray-600 dark:text-gray-400 persian-text">
                آمار و نمودارهای کلیدی سیستم
              </p>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              بروزرسانی
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 persian-text">اسناد پردازش شده</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white persian-numbers">۸۵٪</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 persian-text">دقت استخراج</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white persian-numbers">۹۲٪</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 persian-text">سرعت پردازش</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white persian-numbers">۷۸٪</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 persian-text">رضایت کاربران</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white persian-numbers">۹۶٪</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '96%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card variant="elevated">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white persian-text">
                عملیات سریع
              </h2>
              <p className="text-gray-600 dark:text-gray-400 persian-text">
                دسترسی سریع به مهم‌ترین عملیات
              </p>
            </div>
          </div>

          <div className="premium-grid">
            <Button
              variant="outline"
              size="lg"
              className="h-24 flex-col gap-2"
              onClick={() => navigate('/documents')}
            >
              <Upload className="h-8 w-8" />
              <span className="persian-text">آپلود سند</span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-24 flex-col gap-2"
              onClick={() => navigate('/analytics')}
            >
              <BarChart3 className="h-8 w-8" />
              <span className="persian-text">گزارش‌گیری</span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-24 flex-col gap-2"
              onClick={() => navigate('/jobs')}
            >
              <Activity className="h-8 w-8" />
              <span className="persian-text">مدیریت وظایف</span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-24 flex-col gap-2"
              onClick={() => navigate('/settings')}
            >
              <Settings className="h-8 w-8" />
              <span className="persian-text">تنظیمات</span>
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Application Modules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card variant="elevated">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white persian-text">
                ماژول‌های کاربردی
              </h2>
              <p className="text-gray-600 dark:text-gray-400 persian-text">
                دسترسی به تمام بخش‌های سیستم
              </p>
            </div>
          </div>

          <div className="premium-grid">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 persian-text">مدیریت اسناد</h3>
                  <p className="text-sm text-gray-600 persian-text">۱۲,۴۵۰ سند</p>
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 persian-text">تحلیل و گزارش</h3>
                  <p className="text-sm text-gray-600 persian-text">۲۳۴ گزارش</p>
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 persian-text">مدیریت وظایف</h3>
                  <p className="text-sm text-gray-600 persian-text">۱۲ وظیفه فعال</p>
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Server className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 persian-text">سلامت سیستم</h3>
                  <p className="text-sm text-gray-600 persian-text">۹۸٪ عملیاتی</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card variant="elevated">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white persian-text">
                فعالیت‌های اخیر
              </h2>
              <p className="text-gray-600 dark:text-gray-400 persian-text">
                آخرین فعالیت‌های انجام شده در سیستم
              </p>
            </div>
            <Button variant="outline" size="sm">
              مشاهده همه
            </Button>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activity.status === 'success' ? 'bg-green-100' :
                  activity.status === 'processing' ? 'bg-blue-100' :
                  'bg-gray-100'
                }`}>
                  {activity.type === 'document' && <FileText className="w-5 h-5 text-green-600" />}
                  {activity.type === 'job' && <Activity className="w-5 h-5 text-blue-600" />}
                  {activity.type === 'system' && <Server className="w-5 h-5 text-gray-600" />}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 persian-text">{activity.title}</h3>
                  <p className="text-sm text-gray-600 persian-text">{activity.description}</p>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ClockIcon className="w-4 h-4" />
                    <span className="persian-numbers">{activity.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <UserIcon className="w-4 h-4" />
                    <span className="persian-text">{activity.user}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
