import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  CardTitle, 
  CardDescription 
} from '../components/UI/Card';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
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
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
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
      color: 'bg-blue-500',
      action: 'upload',
    },
    {
      title: 'Create Scraping Job',
      description: 'Set up a new web scraping task',
      href: '/jobs',
      icon: CogIcon,
      color: 'bg-green-500',
      action: 'create',
    },
    {
      title: 'View Analytics',
      description: 'Check performance metrics and insights',
      href: '/analytics',
      icon: ChartBarIcon,
      color: 'bg-purple-500',
      action: 'view',
    },
    {
      title: 'System Health',
      description: 'Monitor system status and performance',
      href: '/system',
      icon: ServerIcon,
      color: 'bg-orange-500',
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
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <CheckCircleIcon className="h-5 w-5 text-gray-500" />;
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('dashboard.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your legal analytics platform.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <QuestionMarkCircleIcon className="h-4 w-4 mr-2" />
            Help
          </Button>
          <Button size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            Quick Action
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Documents
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalDocuments.toLocaleString()}
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <DocumentIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowUpIcon className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-600 dark:text-green-400">
              +12% from last month
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Jobs
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalJobs}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CogIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-600 dark:text-red-400">
              -3 from yesterday
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Success Rate
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.successRate}%
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowUpIcon className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-600 dark:text-green-400">
              +2.3% improvement
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                System Health
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.systemHealth === 'good' ? 'Healthy' : 'Issues'}
              </p>
            </div>
            <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              {getHealthIcon(stats.systemHealth)}
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getHealthIcon(stats.systemHealth)}
            <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
              All systems operational
            </span>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to get you started quickly
          </CardDescription>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={action.href}
                  className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 ${action.color} rounded-lg flex items-center justify-center`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {action.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation Cards */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Application Modules</CardTitle>
              <CardDescription>
                Navigate to different parts of the application
              </CardDescription>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {navigationCards.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.href}
                      className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                            <item.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                              {item.title}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium text-gray-900 dark:text-white">
                            {item.stats}
                          </p>
                          <div className="flex items-center justify-end mt-1">
                            {item.trend.isPositive ? (
                              <ArrowUpIcon className="h-3 w-3 text-green-500" />
                            ) : (
                              <ArrowDownIcon className="h-3 w-3 text-red-500" />
                            )}
                            <span className={`text-xs ml-1 ${
                              item.trend.isPositive 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {item.trend.value}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest system events and user actions
              </CardDescription>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.status === 'success' 
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                        : activity.status === 'error'
                        ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {formatTime(activity.timestamp)} • {activity.user}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link
                  to="/system"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 font-medium"
                >
                  View all activity →
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;