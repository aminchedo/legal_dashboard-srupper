import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Server,
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  Database,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  Zap,
  RefreshCw,
  Settings,
  Download,
  Filter,
  Eye,
  TrendingUp,
  TrendingDown,
  Wifi,
  Users,
  FileText,
  Cloud
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
  name: string;
  value: number;
  maxValue: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
  color: string;
}

interface ServiceStatus {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance' | 'degraded';
  uptime: number; // in hours
  lastCheck: Date;
  responseTime: number; // in ms
  version: string;
  description: string;
}

interface SystemEvent {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  description: string;
  timestamp: Date;
  source: string;
  resolved?: boolean;
}

interface PerformanceData {
  timestamp: string;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  responseTime: number;
  throughput: number;
}

// Mock data
const mockSystemMetrics: SystemMetric[] = [
  {
    id: 'cpu',
    name: 'پردازنده',
    value: 45.2,
    maxValue: 100,
    unit: '%',
    status: 'healthy',
    trend: 'stable',
    icon: Cpu,
    color: 'text-blue-600'
  },
  {
    id: 'memory',
    name: 'حافظه',
    value: 68.7,
    maxValue: 100,
    unit: '%',
    status: 'warning',
    trend: 'up',
         icon: MemoryStick,
    color: 'text-orange-600'
  },
  {
    id: 'disk',
    name: 'فضای ذخیره',
    value: 342.5,
    maxValue: 500,
    unit: 'GB',
    status: 'healthy',
    trend: 'up',
    icon: HardDrive,
    color: 'text-green-600'
  },
  {
    id: 'network',
    name: 'شبکه',
    value: 125.3,
    maxValue: 1000,
    unit: 'Mbps',
    status: 'healthy',
    trend: 'stable',
    icon: Network,
    color: 'text-purple-600'
  }
];

const mockServices: ServiceStatus[] = [
  {
    id: 'web_server',
    name: 'سرور وب',
    status: 'online',
    uptime: 720.5,
    lastCheck: new Date(),
    responseTime: 45,
    version: '2.4.1',
    description: 'سرور اصلی ارائه خدمات وب'
  },
  {
    id: 'database',
    name: 'پایگاه داده',
    status: 'online',
    uptime: 1440.2,
    lastCheck: new Date(),
    responseTime: 12,
    version: '14.2',
    description: 'پایگاه داده اصلی سیستم'
  },
  {
    id: 'auth_service',
    name: 'سرویس احراز هویت',
    status: 'degraded',
    uptime: 168.7,
    lastCheck: new Date(),
    responseTime: 89,
    version: '1.8.3',
    description: 'سرویس مدیریت کاربران و احراز هویت'
  },
  {
    id: 'file_storage',
    name: 'ذخیره‌سازی فایل',
    status: 'online',
    uptime: 2160.0,
    lastCheck: new Date(),
    responseTime: 23,
    version: '3.1.0',
    description: 'سیستم ذخیره‌سازی و مدیریت فایل‌ها'
  },
  {
    id: 'notification',
    name: 'سرویس اطلاع‌رسانی',
    status: 'maintenance',
    uptime: 0,
    lastCheck: new Date(),
    responseTime: 0,
    version: '2.0.1',
    description: 'سیستم ارسال اطلاعیه و پیام‌ها'
  }
];

const mockSystemEvents: SystemEvent[] = [
  {
    id: '1',
    type: 'warning',
    title: 'استفاده بالای حافظه',
    description: 'استفاده از حافظه به ۷۵٪ رسیده است',
    timestamp: new Date('2024-01-20T14:30:00'),
    source: 'Memory Monitor'
  },
  {
    id: '2',
    type: 'success',
    title: 'بک‌آپ موفق',
    description: 'بک‌آپ روزانه با موفقیت انجام شد',
    timestamp: new Date('2024-01-20T03:00:00'),
    source: 'Backup Service',
    resolved: true
  },
  {
    id: '3',
    type: 'error',
    title: 'خطا در اتصال پایگاه داده',
    description: 'اتصال موقت به پایگاه داده قطع شد',
    timestamp: new Date('2024-01-19T16:45:00'),
    source: 'Database Monitor',
    resolved: true
  },
  {
    id: '4',
    type: 'info',
    title: 'به‌روزرسانی سیستم',
    description: 'نسخه جدید سیستم نصب شد',
    timestamp: new Date('2024-01-19T12:00:00'),
    source: 'System Updater',
    resolved: true
  }
];

const mockPerformanceData: PerformanceData[] = Array.from({ length: 24 }, (_, i) => {
  const hour = 23 - i;
  return {
    timestamp: `${hour.toString().padStart(2, '0')}:00`,
    cpu: Math.random() * 80 + 10,
    memory: Math.random() * 90 + 5,
    disk: Math.random() * 20 + 70,
    network: Math.random() * 800 + 100,
    responseTime: Math.random() * 100 + 20,
    throughput: Math.random() * 1000 + 500
  };
}).reverse();

const SystemHealthPage: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Here you would normally fetch real data from your API
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastUpdate(new Date());
    setIsLoading(false);
  };

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'online':
        return 'text-success-600 bg-success-100 dark:bg-success-900/20';
      case 'degraded':
        return 'text-warning-600 bg-warning-100 dark:bg-warning-900/20';
      case 'maintenance':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'offline':
        return 'text-error-600 bg-error-100 dark:bg-error-900/20';
      default:
        return 'text-neutral-600 bg-neutral-100 dark:bg-neutral-900/20';
    }
  };

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'online':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4" />;
      case 'maintenance':
        return <Settings className="w-4 h-4" />;
      case 'offline':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: ServiceStatus['status']) => {
    const labels = {
      online: 'آنلاین',
      offline: 'آفلاین',
      maintenance: 'تعمیرات',
      degraded: 'کاهش عملکرد'
    };
    return labels[status];
  };

  const getEventIcon = (type: SystemEvent['type']) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-error-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning-600" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-success-600" />;
      default:
        return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  const SystemMetricCard: React.FC<{ metric: SystemMetric }> = ({ metric }) => {
    const IconComponent = metric.icon;
    const percentage = (metric.value / metric.maxValue) * 100;
    
    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-3 rounded-lg bg-opacity-10", metric.color.replace('text-', 'bg-'))}>
                <IconComponent className={cn("w-6 h-6", metric.color)} />
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                  {metric.name}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {formatPersianNumber(metric.value)} {metric.unit}
                  {metric.maxValue && ` / ${formatPersianNumber(metric.maxValue)} ${metric.unit}`}
                </p>
              </div>
            </div>
            
            <StatusBadge 
              variant={
                metric.status === 'healthy' ? 'success' :
                metric.status === 'warning' ? 'warning' : 'error'
              }
              size="sm"
            >
              {metric.status === 'healthy' ? 'سالم' :
               metric.status === 'warning' ? 'هشدار' : 'بحرانی'}
            </StatusBadge>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
              <div
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  metric.status === 'healthy' ? 'bg-success-500' :
                  metric.status === 'warning' ? 'bg-warning-500' : 'bg-error-500'
                )}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <span>۰{metric.unit}</span>
              <span>{formatPersianNumber(percentage.toFixed(1))}%</span>
              <span>{formatPersianNumber(metric.maxValue)}{metric.unit}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ServiceCard: React.FC<{ service: ServiceStatus }> = ({ service }) => {
    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", getStatusColor(service.status))}>
                {getStatusIcon(service.status)}
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                  {service.name}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  نسخه {service.version}
                </p>
              </div>
            </div>
            
            <StatusBadge 
              variant={
                service.status === 'online' ? 'success' :
                service.status === 'degraded' ? 'warning' :
                service.status === 'maintenance' ? 'secondary' : 'error'
              }
              size="sm"
            >
              {getStatusLabel(service.status)}
            </StatusBadge>
          </div>
          
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
            {service.description}
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-neutral-500 dark:text-neutral-400">آپتایم:</span>
              <span className="font-medium text-neutral-900 dark:text-neutral-100 mr-1">
                {formatPersianNumber(service.uptime.toFixed(1))} ساعت
              </span>
            </div>
            <div>
              <span className="text-neutral-500 dark:text-neutral-400">پاسخ:</span>
              <span className="font-medium text-neutral-900 dark:text-neutral-100 mr-1">
                {formatPersianNumber(service.responseTime)} ms
              </span>
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
                {formatPersianNumber(item.value.toFixed(1))}
                {item.name === 'responseTime' ? 'ms' : 
                 item.name === 'network' ? 'Mbps' : 
                 item.name === 'throughput' ? 'req/s' : '%'}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const overallSystemHealth = useMemo(() => {
    const onlineServices = mockServices.filter(s => s.status === 'online').length;
    const totalServices = mockServices.length;
    const healthyMetrics = mockSystemMetrics.filter(m => m.status === 'healthy').length;
    const totalMetrics = mockSystemMetrics.length;
    
    const serviceHealth = (onlineServices / totalServices) * 100;
    const metricHealth = (healthyMetrics / totalMetrics) * 100;
    const overallHealth = (serviceHealth + metricHealth) / 2;
    
    return {
      percentage: overallHealth,
      status: overallHealth >= 90 ? 'healthy' : overallHealth >= 70 ? 'warning' : 'critical'
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {LEGAL_TERMINOLOGY.pages.system}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            نظارت بر وضعیت سیستم و عملکرد منابع
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <Clock className="w-4 h-4" />
            <span>آخرین به‌روزرسانی: {formatRelativeTime(lastUpdate)}</span>
          </div>
          
          <Button
            variant="outline"
            icon={autoRefresh ? Zap : RefreshCw}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'text-success-600 border-success-200' : ''}
          >
            {autoRefresh ? 'خودکار' : 'دستی'}
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
            گزارش سیستم
          </Button>
        </div>
      </div>

      {/* Overall Health */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-4 rounded-lg",
                overallSystemHealth.status === 'healthy' ? 'bg-success-100 dark:bg-success-900/20' :
                overallSystemHealth.status === 'warning' ? 'bg-warning-100 dark:bg-warning-900/20' :
                'bg-error-100 dark:bg-error-900/20'
              )}>
                <Server className={cn(
                  "w-8 h-8",
                  overallSystemHealth.status === 'healthy' ? 'text-success-600' :
                  overallSystemHealth.status === 'warning' ? 'text-warning-600' :
                  'text-error-600'
                )} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  وضعیت کلی سیستم
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {overallSystemHealth.status === 'healthy' ? 'همه سیستم‌ها عملکرد مطلوبی دارند' :
                   overallSystemHealth.status === 'warning' ? 'برخی سیستم‌ها نیاز به توجه دارند' :
                   'سیستم‌ها با مشکل مواجه هستند'}
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                {formatPersianNumber(overallSystemHealth.percentage.toFixed(1))}%
              </div>
              <StatusBadge 
                variant={
                  overallSystemHealth.status === 'healthy' ? 'success' :
                  overallSystemHealth.status === 'warning' ? 'warning' : 'error'
                }
              >
                {overallSystemHealth.status === 'healthy' ? 'سالم' :
                 overallSystemHealth.status === 'warning' ? 'هشدار' : 'بحرانی'}
              </StatusBadge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          منابع سیستم
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockSystemMetrics.map((metric) => (
            <SystemMetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </div>

      {/* Performance Charts */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>عملکرد سیستم</CardTitle>
            
            <div className="flex items-center gap-2">
              <Select
                options={[
                  { value: '1h', label: '۱ ساعت اخیر' },
                  { value: '6h', label: '۶ ساعت اخیر' },
                  { value: '24h', label: '۲۴ ساعت اخیر' },
                  { value: '7d', label: '۷ روز اخیر' }
                ]}
                value={selectedTimeRange}
                onChange={setSelectedTimeRange}
                size="sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockPerformanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="cpu"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                  name="پردازنده"
                />
                <Area
                  type="monotone"
                  dataKey="memory"
                  stackId="2"
                  stroke="#F59E0B"
                  fill="#F59E0B"
                  fillOpacity={0.3}
                  name="حافظه"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Services and Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Services Status */}
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            وضعیت سرویس‌ها
          </h2>
          <div className="space-y-4">
            {mockServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>

        {/* System Events */}
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            رویدادهای سیستم
          </h2>
          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {mockSystemEvents.map((event, index) => (
                  <div 
                    key={event.id}
                    className={cn(
                      "flex items-start gap-4 p-4",
                      index < mockSystemEvents.length - 1 && "border-b border-neutral-100 dark:border-neutral-800"
                    )}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getEventIcon(event.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                            {event.title}
                          </h4>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                            {event.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                            <span>{event.source}</span>
                            <span>•</span>
                            <span>{formatRelativeTime(event.timestamp)}</span>
                          </div>
                        </div>
                        
                        {event.resolved && (
                          <StatusBadge variant="success" size="sm">
                            حل شده
                          </StatusBadge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-neutral-100 dark:border-neutral-800">
                <Button variant="outline" size="sm" className="w-full" icon={Eye}>
                  مشاهده همه رویدادها
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthPage;