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
import MetricCard from '../components/UI/MetricCard';
import { LineChart, BarChart } from '../components/UI/Chart';
import { GridLayout, GridItem, DashboardSection, DashboardGrids } from '../components/UI/GridLayout';
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

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <DashboardSection
        title={t('dashboard.title')}
        description="Welcome back! Here's what's happening with your legal analytics platform."
        headerActions={
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" size="sm">
              <QuestionMarkCircleIcon className="h-4 w-4 mr-2" />
              Help
            </Button>
            <Button size="sm">
              <PlusIcon className="h-4 w-4 mr-2" />
              Quick Action
            </Button>
          </div>
        }
      />

      {/* Key Metrics */}
      <DashboardSection>
        <GridLayout {...DashboardGrids.metrics}>
          <MetricCard
            title="Total Documents"
            value={stats.totalDocuments}
            change={{
              value: "+12%",
              type: "increase",
              label: "from last month"
            }}
            icon={DocumentIcon}
            iconColor="blue"
            delay={0}
            loading={analyticsLoading}
          />
          <MetricCard
            title="Active Jobs"
            value={stats.totalJobs}
            change={{
              value: "-3",
              type: "decrease",
              label: "from yesterday"
            }}
            icon={CogIcon}
            iconColor="green"
            delay={0.1}
            loading={analyticsLoading}
          />
          <MetricCard
            title="Success Rate"
            value={`${stats.successRate}%`}
            change={{
              value: "+2.3%",
              type: "increase",
              label: "improvement"
            }}
            icon={ChartBarIcon}
            iconColor="purple"
            delay={0.2}
            loading={analyticsLoading}
          />
          <MetricCard
            title="System Health"
            value={stats.systemHealth === 'good' ? 'Healthy' : 'Issues'}
            change={{
              value: "All systems operational",
              type: "neutral"
            }}
            icon={getHealthIcon(stats.systemHealth)}
            iconColor={stats.systemHealth === 'good' ? 'green' : 'red'}
            delay={0.3}
            loading={systemLoading}
          />
        </GridLayout>
      </DashboardSection>

      {/* Charts Section */}
      <DashboardSection
        title="Analytics Overview"
        description="Performance trends and insights"
      >
        <GridLayout {...DashboardGrids.twoColumn}>
          <GridItem span={{ default: 1, lg: 2 }}>
            <Card variant="elevated" padding="lg" hover>
              <CardHeader>
                <CardTitle>Activity Trends</CardTitle>
                <CardDescription>
                  Daily activity volume over the past week
                </CardDescription>
              </CardHeader>
              <CardBody>
                <div className="h-64">
                  <LineChart 
                    data={activityTrendData}
                    animate={true}
                    className="w-full h-full"
                  />
                </div>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem>
            <Card variant="elevated" padding="lg" hover>
              <CardHeader>
                <CardTitle>Document Types</CardTitle>
                <CardDescription>
                  Distribution of processed documents
                </CardDescription>
              </CardHeader>
              <CardBody>
                <div className="h-64">
                  <BarChart
                    data={documentTypeData}
                    animate={true}
                    className="w-full h-full"
                  />
                </div>
              </CardBody>
            </Card>
          </GridItem>
        </GridLayout>
      </DashboardSection>

      {/* Quick Actions */}
      <DashboardSection
        title="Quick Actions"
        description="Common tasks to get you started quickly"
      >
        <Card variant="elevated" padding="lg">
          <CardBody>
            <GridLayout {...DashboardGrids.metrics}>
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={action.href}
                    className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`h-10 w-10 ${action.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
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
            </GridLayout>
          </CardBody>
        </Card>
      </DashboardSection>

      <GridLayout {...DashboardGrids.twoColumn}>
        {/* Navigation Cards */}
        <GridItem span={{ default: 1, lg: 2 }}>
          <DashboardSection
            title="Application Modules"
            description="Navigate to different parts of the application"
          >
            <Card variant="elevated" padding="lg">
              <CardBody>
                <GridLayout cols={{ default: 1, md: 2 }} gap="md">
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
                              <span className={`text-xs ml-1 ${
                                item.trend.isPositive 
                                  ? 'text-green-600 dark:text-green-400' 
                                  : 'text-red-600 dark:text-red-400'
                              }`}>
                                {item.trend.isPositive ? '↗' : '↘'} {item.trend.value}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </GridLayout>
              </CardBody>
            </Card>
          </DashboardSection>
        </GridItem>

        {/* Recent Activity */}
        <GridItem>
          <DashboardSection
            title="Recent Activity"
            description="Latest system events and user actions"
          >
            <Card variant="elevated" padding="lg">
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
          </DashboardSection>
        </GridItem>
      </GridLayout>
    </div>
  );
};

export default DashboardPage;