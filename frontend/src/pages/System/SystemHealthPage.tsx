import React, { useState, useEffect } from 'react';
import {
  Cpu,
  HardDrive,
  MemoryStick,
  Wifi,
  Server,
  Database,
  Shield,
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Settings,
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  Globe
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  StatusBadge,
  Select
} from '../../components/ui';
import { LEGAL_TERMINOLOGY } from '../../lib/terminology';
import { cn, formatPersianNumber, formatBytes, formatRelativeTime } from '../../lib/utils';

// Types for system monitoring
interface SystemMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  icon: React.ElementType;
  color: string;
  limit?: number;
  trend: number; // percentage change
}

interface ServiceStatus {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance' | 'degraded';
  uptime: number; // in hours
  responseTime: number; // in ms
  lastCheck: Date;
  version?: string;
  description: string;
}

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  service: string;
  message: string;
  details?: string;
}

const SystemHealthPage: React.FC = () => {
  const [refreshInterval, setRefreshInterval] = useState('30s');
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock system metrics
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([
    {
      id: 'cpu',
      label: 'پردازنده',
      value: 24.6,
      unit: '%',
      status: 'healthy',
      icon: Cpu,
      color: 'text-blue-600',
      limit: 80,
      trend: -2.3
    },
    {
      id: 'memory',
      label: 'حافظه RAM',
      value: 8.2,
      unit: 'GB',
      status: 'healthy',
      icon: MemoryStick,
      color: 'text-green-600',
      limit: 16,
      trend: 1.8
    },
    {
      id: 'disk',
      label: 'فضای دیسک',
      value: 45.8,
      unit: 'GB',
      status: 'warning',
      icon: HardDrive,
      color: 'text-yellow-600',
      limit: 100,
      trend: 3.2
    },
    {
      id: 'network',
      label: 'ترافیک شبکه',
      value: 125.4,
      unit: 'Mbps',
      status: 'healthy',
      icon: Wifi,
      color: 'text-purple-600',
      limit: 1000,
      trend: -5.7
    },
    {
      id: 'database',
      label: 'اتصالات دیتابیس',
      value: 47,
      unit: 'اتصال',
      status: 'healthy',
      icon: Database,
      color: 'text-indigo-600',
      limit: 100,
      trend: 0.9
    },
    {
      id: 'requests',
      label: 'درخواست‌ها در دقیقه',
      value: 1847,
      unit: 'req/min',
      status: 'healthy',
      icon: Activity,
      color: 'text-emerald-600',
      limit: 5000,
      trend: 12.4
    }
  ]);

  // Mock service statuses
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      id: 'web',
      name: 'سرور وب',
      status: 'online',
      uptime: 720.5,
      responseTime: 45,
      lastCheck: new Date(),
      version: '2.4.1',
      description: 'سرور اصلی وب اپلیکیشن'
    },
    {
      id: 'api',
      name: 'API Gateway',
      status: 'online',
      uptime: 720.5,
      responseTime: 23,
      lastCheck: new Date(),
      version: '1.8.3',
      description: 'درگاه API اصلی سیستم'
    },
    {
      id: 'database',
      name: 'پایگاه داده',
      status: 'online',
      uptime: 1440.2,
      responseTime: 12,
      lastCheck: new Date(),
      version: 'PostgreSQL 14.2',
      description: 'پایگاه داده اصلی'
    },
    {
      id: 'auth',
      name: 'سرویس احراز هویت',
      status: 'degraded',
      uptime: 715.8,
      responseTime: 156,
      lastCheck: new Date(),
      version: '3.1.0',
      description: 'سیستم احراز هویت و مجوزها'
    },
    {
      id: 'storage',
      name: 'ذخیره‌سازی فایل',
      status: 'online',
      uptime: 720.5,
      responseTime: 67,
      lastCheck: new Date(),
      version: '2.0.1',
      description: 'سیستم ذخیره‌سازی اسناد'
    },
    {
      id: 'backup',
      name: 'پشتیبان‌گیری',
      status: 'maintenance',
      uptime: 0,
      responseTime: 0,
      lastCheck: new Date(Date.now() - 3600000), // 1 hour ago
      version: '1.5.2',
      description: 'سیستم پشتیبان‌گیری خودکار'
    }
  ]);

  // Mock recent logs
  const [recentLogs, setRecentLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      level: 'warning',
      service: 'Auth Service',
      message: 'زمان پاسخ‌دهی بالا تر از حد طبیعی',
      details: 'Average response time: 156ms (threshold: 100ms)'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 600000), // 10 minutes ago
      level: 'info',
      service: 'Backup Service',
      message: 'شروع پشتیبان‌گیری روزانه',
      details: 'Daily backup started at 02:00 AM'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      level: 'info',
      service: 'Web Server',
      message: 'پیک ترافیک شناسایی شد',
      details: '1847 requests/minute detected'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 1200000), // 20 minutes ago
      level: 'error',
      service: 'Database',
      message: 'خطا در اتصال موقت',
      details: 'Connection timeout resolved after 2.3 seconds'
    }
  ]);

  // Auto-refresh logic
  useEffect(() => {
    if (!isAutoRefresh) return;

    const interval = parseInt(refreshInterval.replace('s', '')) * 1000;
    const timer = setInterval(() => {
      handleRefresh();
    }, interval);

    return () => clearInterval(timer);
  }, [isAutoRefresh, refreshInterval]);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update metrics with slight variations
    setSystemMetrics(prev => prev.map(metric => ({
      ...metric,
      value: metric.value + (Math.random() - 0.5) * 2,
      trend: (Math.random() - 0.5) * 10
    })));

    setLastUpdated(new Date());
    setIsLoading(false);
  };

  const getStatusBadge = (status: ServiceStatus['status']) => {
    const statusMap = {
      online: { variant: 'success' as const, label: 'فعال' },
      offline: { variant: 'error' as const, label: 'غیرفعال' },
      maintenance: { variant: 'warning' as const, label: 'تعمیرات' },
      degraded: { variant: 'warning' as const, label: 'کاهش عملکرد' }
    };
    return statusMap[status];
  };

  const getMetricStatus = (metric: SystemMetric) => {
    if (metric.limit) {
      const percentage = (metric.value / metric.limit) * 100;
      if (percentage >= 90) return 'critical';
      if (percentage >= 70) return 'warning';
    }
    return 'healthy';
  };

  const getLogLevelBadge = (level: LogEntry['level']) => {
    const levelMap = {
      info: { variant: 'secondary' as const, label: 'اطلاعات' },
      warning: { variant: 'warning' as const, label: 'هشدار' },
      error: { variant: 'error' as const, label: 'خطا' },
      debug: { variant: 'secondary' as const, label: 'دیباگ' }
    };
    return levelMap[level];
  };

  const formatUptime = (hours: number) => {
    const days = Math.floor(hours / 24);
    const remainingHours = Math.floor(hours % 24);
    const minutes = Math.floor((hours % 1) * 60);
    
    if (days > 0) {
      return `${formatPersianNumber(days)} روز ${formatPersianNumber(remainingHours)} ساعت`;
    } else if (remainingHours > 0) {
      return `${formatPersianNumber(remainingHours)} ساعت ${formatPersianNumber(minutes)} دقیقه`;
    } else {
      return `${formatPersianNumber(minutes)} دقیقه`;
    }
  };

  const MetricCard: React.FC<{ metric: SystemMetric }> = ({ metric }) => {
    const IconComponent = metric.icon;
    const currentStatus = getMetricStatus(metric);
    const percentage = metric.limit ? (metric.value / metric.limit) * 100 : 0;
    
    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-3 rounded-lg bg-opacity-10", metric.color.replace('text-', 'bg-'))}>
                <IconComponent className={cn("w-6 h-6", metric.color)} />
              </div>
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {metric.label}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {formatPersianNumber(metric.value.toFixed(1))}
                  </p>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    {metric.unit}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-left rtl:text-right">
              <StatusBadge 
                variant={currentStatus === 'healthy' ? 'success' : currentStatus === 'warning' ? 'warning' : 'error'}
                size="sm"
              >
                {currentStatus === 'healthy' ? 'سالم' : currentStatus === 'warning' ? 'هشدار' : 'بحرانی'}
              </StatusBadge>
              <div className="flex items-center gap-1 mt-2">
                {metric.trend > 0 ? (
                  <TrendingUp className="w-4 h-4 text-success-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-error-600" />
                )}
                <span className={cn(
                  "text-sm font-medium",
                  metric.trend > 0 ? 'text-success-600' : 'text-error-600'
                )}>
                  {formatPersianNumber(Math.abs(metric.trend).toFixed(1))}%
                </span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          {metric.limit && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>استفاده شده</span>
                <span>{formatPersianNumber(percentage.toFixed(1))}%</span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                <div
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    currentStatus === 'healthy' && 'bg-success-500',
                    currentStatus === 'warning' && 'bg-warning-500',
                    currentStatus === 'critical' && 'bg-error-500'
                  )}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const ServiceCard: React.FC<{ service: ServiceStatus }> = ({ service }) => {
    const statusBadge = getStatusBadge(service.status);
    
    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                {service.name}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {service.description}
              </p>
            </div>
            <StatusBadge variant={statusBadge.variant} size="sm">
              {statusBadge.label}
            </StatusBadge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-neutral-500 dark:text-neutral-400">زمان فعالیت:</span>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                {formatUptime(service.uptime)}
              </p>
            </div>
            <div>
              <span className="text-neutral-500 dark:text-neutral-400">زمان پاسخ:</span>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                {formatPersianNumber(service.responseTime)}ms
              </p>
            </div>
            <div>
              <span className="text-neutral-500 dark:text-neutral-400">نسخه:</span>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                {service.version}
              </p>
            </div>
            <div>
              <span className="text-neutral-500 dark:text-neutral-400">آخرین بررسی:</span>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                {formatRelativeTime(service.lastCheck)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {LEGAL_TERMINOLOGY.pages.system}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            نظارت بر سلامت و عملکرد سیستم
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            options={[
              { value: '10s', label: '۱۰ ثانیه' },
              { value: '30s', label: '۳۰ ثانیه' },
              { value: '60s', label: '۱ دقیقه' },
              { value: '300s', label: '۵ دقیقه' }
            ]}
            value={refreshInterval}
            onChange={setRefreshInterval}
            size="sm"
          />
          <Button
            variant={isAutoRefresh ? 'primary' : 'outline'}
            icon={RefreshCw}
            size="sm"
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
          >
            {isAutoRefresh ? 'خودکار' : 'دستی'}
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
            variant="outline"
            icon={Download}
            size="sm"
          >
            گزارش
          </Button>
        </div>
      </div>

      {/* Last Updated */}
      <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <Clock className="w-4 h-4" />
        <span>آخرین به‌روزرسانی: {formatRelativeTime(lastUpdated)}</span>
      </div>

      {/* System Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          منابع سیستم
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemMetrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </div>

      {/* Services Status */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          وضعیت سرویس‌ها
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>

      {/* Recent Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>گزارش‌های اخیر</CardTitle>
            <Button variant="outline" size="sm" icon={Eye}>
              مشاهده همه
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentLogs.map((log) => {
              const levelBadge = getLogLevelBadge(log.level);
              return (
                <div key={log.id} className="flex items-start gap-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <div className={cn(
                    "p-2 rounded-lg",
                    log.level === 'error' && 'bg-red-100 dark:bg-red-900/30',
                    log.level === 'warning' && 'bg-yellow-100 dark:bg-yellow-900/30',
                    log.level === 'info' && 'bg-blue-100 dark:bg-blue-900/30',
                    log.level === 'debug' && 'bg-gray-100 dark:bg-gray-900/30'
                  )}>
                    {log.level === 'error' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                    {log.level === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                    {log.level === 'info' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    {log.level === 'debug' && <Settings className="w-4 h-4 text-gray-600" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                        {log.message}
                      </h4>
                      <StatusBadge variant={levelBadge.variant} size="sm">
                        {levelBadge.label}
                      </StatusBadge>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {log.service}
                    </p>
                    {log.details && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-mono">
                        {log.details}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                      <span>{formatRelativeTime(log.timestamp)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemHealthPage;