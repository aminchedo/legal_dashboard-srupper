import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Card, 
  MetricCard, 
  StatCard, 
  InfoCard 
} from '../components/UI/Card';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { LineChart, BarChart } from '../components/UI/Chart';
import { useAnalyticsDashboard, useSystemHealth } from '../hooks/api';
import {
  DocumentIcon,
  ChartBarIcon,
  CogIcon,
  ServerIcon,
  QuestionMarkCircleIcon,
  VideoCameraIcon,
  TableCellsIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

// Mock data for demonstration
const mockStats = {
  totalDocuments: 1247,
  totalJobs: 23,
  activeProxies: 8,
  systemHealth: 'good' as const,
  documentsProcessed: 89,
  jobsCompleted: 18,
  successRate: 94.2,
  avgProcessingTime: 3.4,
};

const mockActivities = [
  {
    id: '1',
    type: 'document' as const,
    action: 'Document uploaded',
    description: 'contract_agreement.pdf successfully processed',
    timestamp: '2024-01-15T10:30:00Z',
    status: 'success' as const,
    user: 'John Doe',
  },
  {
    id: '2',
    type: 'job' as const,
    action: 'Scraping job completed',
    description: 'Legal database scraping finished with 152 new records',
    timestamp: '2024-01-15T09:45:00Z',
    status: 'success' as const,
    user: 'System',
  },
  {
    id: '3',
    type: 'proxy' as const,
    action: 'Proxy health check',
    description: 'Proxy server proxy-us-01 failed health check',
    timestamp: '2024-01-15T09:15:00Z',
    status: 'error' as const,
    user: 'System',
  },
  {
    id: '4',
    type: 'system' as const,
    action: 'System maintenance',
    description: 'Database optimization completed successfully',
    timestamp: '2024-01-15T08:00:00Z',
    status: 'success' as const,
    user: 'System',
  },
];

// Mock chart data
const activityTrendData = [
  { label: 'Mon', value: 120 },
  { label: 'Tue', value: 150 },
  { label: 'Wed', value: 100 },
  { label: 'Thu', value: 180 },
  { label: 'Fri', value: 160 },
  { label: 'Sat', value: 90 },
  { label: 'Sun', value: 110 },
];

const documentTypeData = [
  { label: 'Contracts', value: 89, color: '#3b82f6' },
  { label: 'Reports', value: 43, color: '#ef4444' },
  { label: 'Legal Docs', value: 23, color: '#10b981' },
  { label: 'Others', value: 15, color: '#f59e0b' },
];

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: analyticsData, isLoading: analyticsLoading } = useAnalyticsDashboard();
  const { data: systemData, isLoading: systemLoading } = useSystemHealth();

  const stats = analyticsData?.data || mockStats;
  const activities = mockActivities; // Use mock data for now

  const quickActions = [
    {
      title: 'Upload Document',
      description: 'Upload and process new legal documents',
      href: '/documents',
      icon: DocumentIcon,
      color: 'blue',
      action: 'upload',
    },
    {
      title: 'Create Scraping Job',
      description: 'Set up a new web scraping task',
      href: '/jobs',
      icon: CogIcon,
      color: 'green',
      action: 'create',
    },
    {
      title: 'View Analytics',
      description: 'Check performance metrics and insights',
      href: '/analytics',
      icon: ChartBarIcon,
      color: 'purple',
      action: 'view',
    },
    {
      title: 'System Health',
      description: 'Monitor system status and performance',
      href: '/system',
      icon: ServerIcon,
      color: 'orange',
      action: 'monitor',
    },
  ];

  const navigationCards = [
    {
      title: 'Documents',
      description: 'Manage and process legal documents',
      href: '/documents',
      icon: DocumentIcon,
      stats: `${stats.totalDocuments} documents`,
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'Analytics',
      description: 'View performance metrics and insights',
      href: '/analytics',
      icon: ChartBarIcon,
      stats: `${stats.successRate}% success rate`,
      trend: { value: 2.3, isPositive: true },
    },
    {
      title: 'Jobs',
      description: 'Manage web scraping operations',
      href: '/jobs',
      icon: CogIcon,
      stats: `${stats.totalJobs} active jobs`,
      trend: { value: 3, isPositive: false },
    },
    {
      title: 'Proxies',
      description: 'Configure and monitor proxy servers',
      href: '/proxies',
      icon: ServerIcon,
      stats: `${stats.activeProxies} active proxies`,
      trend: { value: 1, isPositive: true },
    },
    {
      title: 'Recording',
      description: 'Audio/video recording and processing',
      href: '/recording',
      icon: VideoCameraIcon,
      stats: '6 recordings',
      trend: { value: 2, isPositive: true },
    },
    {
      title: 'Data Tables',
      description: 'View and manage structured data',
      href: '/data',
      icon: TableCellsIcon,
      stats: '15 tables',
      trend: { value: 5, isPositive: true },
    },
  ];

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'good':
        return CheckCircleIcon;
      case 'warning':
        return ExclamationTriangleIcon;
      case 'critical':
        return ExclamationTriangleIcon;
      default:
        return CheckCircleIcon;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <DocumentIcon className="h-4 w-4" />;
      case 'job':
        return <CogIcon className="h-4 w-4" />;
      case 'proxy':
        return <ServerIcon className="h-4 w-4" />;
      case 'system':
        return <CheckCircleIcon className="h-4 w-4" />;
      default:
        return <CheckCircleIcon className="h-4 w-4" />;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (analyticsLoading || systemLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner variant="progress" size="lg" text="در حال بارگذاری داشبورد..." />
      </div>
    );
  }

  return (
    <div className="premium-container space-y-8">
      {/* Premium Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 persian-text">
            {t('dashboard.title')}
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
          <Button size="md" gradient>
            <PlusIcon className="h-4 w-4 mr-2" />
            عملیات سریع
          </Button>
        </div>
      </motion.div>

      {/* Premium Key Metrics */}
      <div className="premium-grid">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <MetricCard
            title="کل اسناد"
            value={stats.totalDocuments.toLocaleString()}
            change={12}
            trend="up"
            icon={<DocumentIcon className="h-6 w-6" />}
            loading={analyticsLoading}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <MetricCard
            title="کارهای فعال"
            value={stats.totalJobs}
            change={-3}
            trend="down"
            icon={<CogIcon className="h-6 w-6" />}
            loading={analyticsLoading}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <MetricCard
            title="نرخ موفقیت"
            value={`${stats.successRate}%`}
            change={2.3}
            trend="up"
            icon={<ChartBarIcon className="h-6 w-6" />}
            loading={analyticsLoading}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <MetricCard
            title="سلامت سیستم"
            value={stats.systemHealth === 'good' ? 'سالم' : 'مشکل'}
            change={0}
            trend="neutral"
            icon={<CheckCircleIcon className="h-6 w-6" />}
            loading={systemLoading}
          />
        </motion.div>
      </div>

      {/* Premium Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white persian-text">
              نمای کلی تحلیل
            </h2>
            <p className="text-gray-600 dark:text-gray-400 persian-text">
              روند عملکرد و بینش‌ها
            </p>
          </div>
        </div>
        
        <div className="premium-grid">
          <Card variant="elevated" size="lg" className="col-span-1 lg:col-span-2">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 persian-text">
                روند فعالیت
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 persian-text">
                حجم فعالیت روزانه در هفته گذشته
              </p>
              <div className="h-80">
                <LineChart 
                  data={activityTrendData}
                  animate={true}
                  className="w-full h-full"
                />
              </div>
            </div>
          </Card>
          
          <Card variant="elevated" size="lg">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 persian-text">
                انواع اسناد
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 persian-text">
                توزیع اسناد پردازش شده
              </p>
              <div className="h-80">
                <BarChart
                  data={documentTypeData}
                  animate={true}
                  className="w-full h-full"
                />
              </div>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Premium Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 persian-text">
            عملیات سریع
          </h2>
          <p className="text-gray-600 dark:text-gray-400 persian-text">
            کارهای رایج برای شروع سریع
          </p>
        </div>
        
        <div className="premium-grid">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
            >
              <Link to={action.href}>
                <Card 
                  variant="elevated" 
                  hover 
                  className="h-full cursor-pointer group"
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`h-12 w-12 bg-gradient-to-br from-${action.color}-500 to-${action.color}-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white persian-text group-hover:text-blue-600 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 persian-text">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Premium Content Grid */}
      <div className="premium-grid">
        {/* Navigation Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="col-span-1 lg:col-span-2"
        >
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 persian-text">
                ماژول‌های برنامه
              </h2>
              <p className="text-gray-600 dark:text-gray-400 persian-text">
                به بخش‌های مختلف برنامه بروید
              </p>
            </div>
            
            <div className="premium-grid compact">
              {navigationCards.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                >
                  <Link to={item.href}>
                    <Card variant="elevated" hover className="h-full cursor-pointer">
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl flex items-center justify-center">
                              <item.icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white persian-text">
                                {item.title}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 persian-text">
                                {item.description}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900 dark:text-white persian-numbers">
                              {item.stats}
                            </p>
                            <div className="flex items-center justify-end mt-2">
                              {item.trend.isPositive ? (
                                <ArrowUpIcon className="h-4 w-4 text-green-600" />
                              ) : (
                                <ArrowDownIcon className="h-4 w-4 text-red-600" />
                              )}
                              <span className={`text-sm ml-1 ${
                                item.trend.isPositive 
                                  ? 'text-green-600' 
                                  : 'text-red-600'
                              } persian-numbers`}>
                                {item.trend.value}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 persian-text">
                فعالیت‌های اخیر
              </h2>
              <p className="text-gray-600 dark:text-gray-400 persian-text">
                آخرین رویدادهای سیستم و اقدامات کاربر
              </p>
            </div>
            
            <Card variant="elevated" size="lg">
              <div className="p-6">
                <div className="space-y-6">
                  {activities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 + index * 0.1, duration: 0.5 }}
                      className="flex items-start space-x-4"
                    >
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.status === 'success' 
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                          : activity.status === 'error'
                          ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white persian-text">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 persian-text">
                          {activity.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <ClockIcon className="h-3 w-3" />
                            <span className="persian-numbers">{formatTime(activity.timestamp)}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <UserIcon className="h-3 w-3" />
                            <span className="persian-text">{activity.user}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    to="/system"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 font-medium persian-text"
                  >
                    مشاهده تمام فعالیت‌ها →
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;