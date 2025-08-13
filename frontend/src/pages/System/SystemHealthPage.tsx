import React, { useState, useEffect, useCallback } from 'react';
import { 
  Server, Cpu, HardDrive, Memory, Network, Database,
  Activity, AlertTriangle, CheckCircle, Clock, Zap,
  RefreshCw, Settings, Download, TrendingUp, TrendingDown,
  Wifi, Shield, Globe, MonitorSpeaker, Thermometer,
  Battery, Signal, AlertCircle, Info, Eye, MoreVertical
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, StatusBadge } from '../../components/ui';
import { LEGAL_TERMINOLOGY } from '../../lib/terminology';
import { formatPersianNumber, cn } from '../../lib/utils';

// Types
interface SystemMetrics {
  cpu: {
    usage: number;
    temperature: number;
    cores: number;
    model: string;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
    swap: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
    readSpeed: number;
    writeSpeed: number;
  };
  network: {
    downloadSpeed: number;
    uploadSpeed: number;
    latency: number;
    packetsLost: number;
  };
  database: {
    connections: number;
    queryTime: number;
    size: number;
    status: 'healthy' | 'warning' | 'error';
  };
  services: Array<{
    name: string;
    status: 'running' | 'stopped' | 'error';
    uptime: number;
    memory: number;
    cpu: number;
  }>;
}

interface AlertItem {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: Date;
  acknowledged: boolean;
}

// Mock real-time data
const generateMetrics = (): SystemMetrics => ({
  cpu: {
    usage: Math.floor(Math.random() * 40) + 20, // 20-60%
    temperature: Math.floor(Math.random() * 20) + 45, // 45-65°C
    cores: 8,
    model: 'Intel Xeon E5-2686 v4'
  },
  memory: {
    used: Math.floor(Math.random() * 4) + 6, // 6-10 GB
    total: 16,
    percentage: 0,
    swap: Math.floor(Math.random() * 2) + 1 // 1-3 GB
  },
  disk: {
    used: Math.floor(Math.random() * 20) + 180, // 180-200 GB
    total: 500,
    percentage: 0,
    readSpeed: Math.floor(Math.random() * 50) + 100, // 100-150 MB/s
    writeSpeed: Math.floor(Math.random() * 30) + 80 // 80-110 MB/s
  },
  network: {
    downloadSpeed: Math.floor(Math.random() * 20) + 80, // 80-100 Mbps
    uploadSpeed: Math.floor(Math.random() * 10) + 40, // 40-50 Mbps
    latency: Math.floor(Math.random() * 10) + 15, // 15-25 ms
    packetsLost: Math.random() * 0.5 // 0-0.5%
  },
  database: {
    connections: Math.floor(Math.random() * 50) + 20,
    queryTime: Math.random() * 100 + 50, // 50-150 ms
    size: Math.floor(Math.random() * 5) + 45, // 45-50 GB
    status: Math.random() > 0.9 ? 'warning' : 'healthy'
  },
  services: [
    {
      name: 'وب سرور',
      status: Math.random() > 0.95 ? 'error' : 'running',
      uptime: Math.floor(Math.random() * 1000) + 8000,
      memory: Math.floor(Math.random() * 200) + 300,
      cpu: Math.floor(Math.random() * 20) + 5
    },
    {
      name: 'پایگاه داده',
      status: Math.random() > 0.98 ? 'warning' : 'running',
      uptime: Math.floor(Math.random() * 500) + 7500,
      memory: Math.floor(Math.random() * 500) + 1000,
      cpu: Math.floor(Math.random() * 30) + 10
    },
    {
      name: 'سیستم اسکرپینگ',
      status: 'running',
      uptime: Math.floor(Math.random() * 200) + 6000,
      memory: Math.floor(Math.random() * 300) + 400,
      cpu: Math.floor(Math.random() * 25) + 15
    },
    {
      name: 'پردازش اسناد',
      status: 'running',
      uptime: Math.floor(Math.random() * 300) + 5500,
      memory: Math.floor(Math.random() * 400) + 600,
      cpu: Math.floor(Math.random() * 35) + 20
    }
  ]
});

const mockAlerts: AlertItem[] = [
  {
    id: '1',
    type: 'warning',
    title: 'استفاده بالای CPU',
    description: 'استفاده از پردازنده به ۸۵% رسیده است',
    timestamp: new Date('2024-01-15T10:30:00'),
    acknowledged: false
  },
  {
    id: '2',
    type: 'error',
    title: 'اتصال پایگاه داده',
    description: 'تعداد اتصالات پایگاه داده از حد مجاز فراتر رفته',
    timestamp: new Date('2024-01-15T09:15:00'),
    acknowledged: false
  },
  {
    id: '3',
    type: 'info',
    title: 'به‌روزرسانی سیستم',
    description: 'نسخه جدید سیستم آماده نصب است',
    timestamp: new Date('2024-01-15T08:45:00'),
    acknowledged: true
  }
];

// Components
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'good' | 'warning' | 'critical';
  trend?: number;
}> = ({ title, value, unit, icon: Icon, status, trend }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'good': return 'text-success-600 bg-success-100';
      case 'warning': return 'text-warning-600 bg-warning-100';
      case 'critical': return 'text-error-600 bg-error-100';
      default: return 'text-neutral-600 bg-neutral-100';
    }
  };

  const getStatusBorder = () => {
    switch (status) {
      case 'good': return 'border-success-200';
      case 'warning': return 'border-warning-200';
      case 'critical': return 'border-error-200';
      default: return 'border-neutral-200';
    }
  };

  return (
    <Card className={cn("transition-all duration-200", getStatusBorder())}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-3 rounded-lg", getStatusColor())}>
            <Icon className="w-6 h-6" />
          </div>
          {trend !== undefined && (
            <div className={cn("flex items-center gap-1 text-sm", 
              trend > 0 ? 'text-error-600' : trend < 0 ? 'text-success-600' : 'text-neutral-600'
            )}>
              {trend > 0 ? <TrendingUp className="w-4 h-4" /> : 
               trend < 0 ? <TrendingDown className="w-4 h-4" /> : null}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <h3 className="text-sm font-medium text-neutral-600 mb-1">
          {title}
        </h3>
        <p className="text-2xl font-bold text-neutral-900">
          {typeof value === 'number' ? formatPersianNumber(value) : value}
          {unit && <span className="text-sm font-normal text-neutral-500 mr-1">{unit}</span>}
        </p>
      </CardContent>
    </Card>
  );
};

const ProgressBar: React.FC<{
  label: string;
  value: number;
  max: number;
  unit: string;
  color?: string;
}> = ({ label, value, max, unit, color = 'bg-primary-600' }) => {
  const percentage = (value / max) * 100;
  const getProgressColor = () => {
    if (percentage >= 90) return 'bg-error-600';
    if (percentage >= 70) return 'bg-warning-500';
    return color;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-neutral-700">{label}</span>
        <span className="text-neutral-600">
          {formatPersianNumber(value)} / {formatPersianNumber(max)} {unit}
        </span>
      </div>
      <div className="w-full bg-neutral-200 rounded-full h-2">
        <div 
          className={cn("h-2 rounded-full transition-all duration-300", getProgressColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-right">
        <span className="text-xs text-neutral-500">
          {formatPersianNumber(percentage.toFixed(1))}%
        </span>
      </div>
    </div>
  );
};

const ServiceItem: React.FC<{
  service: SystemMetrics['services'][0];
  onRestart: (name: string) => void;
}> = ({ service, onRestart }) => {
  const getStatusBadge = () => {
    switch (service.status) {
      case 'running': return { variant: 'success' as const, label: 'در حال اجرا' };
      case 'stopped': return { variant: 'secondary' as const, label: 'متوقف' };
      case 'error': return { variant: 'error' as const, label: 'خطا' };
      default: return { variant: 'secondary' as const, label: 'نامشخص' };
    }
  };

  const status = getStatusBadge();
  const uptimeHours = Math.floor(service.uptime / 3600);
  const uptimeDays = Math.floor(uptimeHours / 24);

  return (
    <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h4 className="font-medium text-neutral-900">{service.name}</h4>
          <StatusBadge variant={status.variant} size="sm">
            {status.label}
          </StatusBadge>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm text-neutral-600">
          <div>
            <span className="block text-xs text-neutral-500">زمان اجرا</span>
            <span>{uptimeDays > 0 ? `${formatPersianNumber(uptimeDays)} روز` : `${formatPersianNumber(uptimeHours)} ساعت`}</span>
          </div>
          <div>
            <span className="block text-xs text-neutral-500">حافظه</span>
            <span>{formatPersianNumber(service.memory)} MB</span>
          </div>
          <div>
            <span className="block text-xs text-neutral-500">CPU</span>
            <span>{formatPersianNumber(service.cpu)}%</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRestart(service.name)}
          disabled={service.status === 'running'}
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

const AlertItem: React.FC<{
  alert: AlertItem;
  onAcknowledge: (id: string) => void;
  onDismiss: (id: string) => void;
}> = ({ alert, onAcknowledge, onDismiss }) => {
  const getAlertIcon = () => {
    switch (alert.type) {
      case 'error': return <AlertCircle className="w-5 h-5 text-error-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-warning-600" />;
      case 'info': return <Info className="w-5 h-5 text-primary-600" />;
      default: return <Info className="w-5 h-5 text-neutral-600" />;
    }
  };

  const getAlertColor = () => {
    switch (alert.type) {
      case 'error': return 'border-error-200 bg-error-50';
      case 'warning': return 'border-warning-200 bg-warning-50';
      case 'info': return 'border-primary-200 bg-primary-50';
      default: return 'border-neutral-200 bg-neutral-50';
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    }).format(date);
  };

  return (
    <div className={cn("p-4 border rounded-lg", getAlertColor(), alert.acknowledged && 'opacity-60')}>
      <div className="flex items-start gap-3">
        {getAlertIcon()}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-neutral-900 line-clamp-1">
            {alert.title}
          </h4>
          <p className="text-sm text-neutral-600 line-clamp-2 mt-1">
            {alert.description}
          </p>
          <p className="text-xs text-neutral-500 mt-2">
            {formatTime(alert.timestamp)}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {!alert.acknowledged && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAcknowledge(alert.id)}
            >
              <CheckCircle className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDismiss(alert.id)}
          >
            ×
          </Button>
        </div>
      </div>
    </div>
  );
};

const SystemHealthPage: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>(generateMetrics());
  const [alerts, setAlerts] = useState<AlertItem[]>(mockAlerts);
  const [historicalData, setHistoricalData] = useState<Array<{
    time: string;
    cpu: number;
    memory: number;
    disk: number;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate percentages
  metrics.memory.percentage = (metrics.memory.used / metrics.memory.total) * 100;
  metrics.disk.percentage = (metrics.disk.used / metrics.disk.total) * 100;

  // Generate historical data
  useEffect(() => {
    const generateHistoricalData = () => {
      const data = [];
      const now = new Date();
      for (let i = 29; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60000);
        data.push({
          time: time.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
          cpu: Math.floor(Math.random() * 40) + 20,
          memory: Math.floor(Math.random() * 30) + 40,
          disk: Math.floor(Math.random() * 20) + 30
        });
      }
      setHistoricalData(data);
    };

    generateHistoricalData();
  }, []);

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(generateMetrics());
      
      // Update historical data
      setHistoricalData(prev => {
        const newData = [...prev.slice(1)];
        const now = new Date();
        newData.push({
          time: now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
          cpu: Math.floor(Math.random() * 40) + 20,
          memory: Math.floor(Math.random() * 30) + 40,
          disk: Math.floor(Math.random() * 20) + 30
        });
        return newData;
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMetrics(generateMetrics());
    setIsLoading(false);
  }, []);

  const handleServiceRestart = useCallback((serviceName: string) => {
    console.log('Restarting service:', serviceName);
  }, []);

  const handleAcknowledgeAlert = useCallback((id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, acknowledged: true } : alert
      )
    );
  }, []);

  const handleDismissAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const getCpuStatus = (): 'good' | 'warning' | 'critical' => {
    if (metrics.cpu.usage >= 80) return 'critical';
    if (metrics.cpu.usage >= 60) return 'warning';
    return 'good';
  };

  const getMemoryStatus = (): 'good' | 'warning' | 'critical' => {
    if (metrics.memory.percentage >= 90) return 'critical';
    if (metrics.memory.percentage >= 70) return 'warning';
    return 'good';
  };

  const getDiskStatus = (): 'good' | 'warning' | 'critical' => {
    if (metrics.disk.percentage >= 90) return 'critical';
    if (metrics.disk.percentage >= 80) return 'warning';
    return 'good';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {LEGAL_TERMINOLOGY.system.title}
          </h1>
          <p className="text-neutral-600 mt-1">
            نظارت بر وضعیت سیستم و منابع سرور
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
            <span>به‌روزرسانی زنده</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            icon={RefreshCw} 
            onClick={handleRefresh}
            loading={isLoading}
          >
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
          title="استفاده از پردازنده"
          value={metrics.cpu.usage}
          unit="%"
          icon={Cpu}
          status={getCpuStatus()}
        />
        <MetricCard
          title="استفاده از حافظه"
          value={metrics.memory.percentage.toFixed(1)}
          unit="%"
          icon={Memory}
          status={getMemoryStatus()}
        />
        <MetricCard
          title="فضای دیسک"
          value={metrics.disk.percentage.toFixed(1)}
          unit="%"
          icon={HardDrive}
          status={getDiskStatus()}
        />
        <MetricCard
          title="اتصالات پایگاه داده"
          value={metrics.database.connections}
          icon={Database}
          status={metrics.database.status === 'healthy' ? 'good' : 'warning'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resource Usage Chart */}
          <Card>
            <CardHeader>
              <CardTitle>استفاده از منابع (۳۰ دقیقه اخیر)</CardTitle>
              <CardDescription>
                نمودار زمان واقعی استفاده از منابع سیستم
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, name]}
                    labelStyle={{ direction: 'rtl' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cpu" 
                    stackId="1" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.6}
                    name="پردازنده"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="memory" 
                    stackId="2" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.6}
                    name="حافظه"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="disk" 
                    stackId="3" 
                    stroke="#F59E0B" 
                    fill="#F59E0B" 
                    fillOpacity={0.6}
                    name="دیسک"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Detailed Resources */}
          <Card>
            <CardHeader>
              <CardTitle>جزئیات منابع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ProgressBar
                label="حافظه RAM"
                value={metrics.memory.used}
                max={metrics.memory.total}
                unit="GB"
                color="bg-primary-600"
              />
              <ProgressBar
                label="فضای ذخیره‌سازی"
                value={metrics.disk.used}
                max={metrics.disk.total}
                unit="GB"
                color="bg-warning-600"
              />
              <ProgressBar
                label="حافظه Swap"
                value={metrics.memory.swap}
                max={4}
                unit="GB"
                color="bg-purple-600"
              />
            </CardContent>
          </Card>

          {/* Services Status */}
          <Card>
            <CardHeader>
              <CardTitle>وضعیت سرویس‌ها</CardTitle>
              <CardDescription>
                مدیریت و نظارت بر سرویس‌های در حال اجرا
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {metrics.services.map((service, index) => (
                <ServiceItem
                  key={index}
                  service={service}
                  onRestart={handleServiceRestart}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* System Info */}
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات سیستم</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">پردازنده</span>
                  <span className="text-neutral-900 text-right">{metrics.cpu.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">تعداد هسته‌ها</span>
                  <span className="text-neutral-900">{formatPersianNumber(metrics.cpu.cores)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">دمای CPU</span>
                  <span className="text-neutral-900">{formatPersianNumber(metrics.cpu.temperature)}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">سرعت خواندن دیسک</span>
                  <span className="text-neutral-900">{formatPersianNumber(metrics.disk.readSpeed)} MB/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">سرعت نوشتن دیسک</span>
                  <span className="text-neutral-900">{formatPersianNumber(metrics.disk.writeSpeed)} MB/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">تأخیر شبکه</span>
                  <span className="text-neutral-900">{formatPersianNumber(metrics.network.latency)} ms</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Network Stats */}
          <Card>
            <CardHeader>
              <CardTitle>آمار شبکه</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Network className="w-4 h-4 text-primary-600" />
                  <span className="text-sm text-neutral-600">دانلود</span>
                </div>
                <span className="font-medium text-neutral-900">
                  {formatPersianNumber(metrics.network.downloadSpeed)} Mbps
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Network className="w-4 h-4 text-success-600" />
                  <span className="text-sm text-neutral-600">آپلود</span>
                </div>
                <span className="font-medium text-neutral-900">
                  {formatPersianNumber(metrics.network.uploadSpeed)} Mbps
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Signal className="w-4 h-4 text-warning-600" />
                  <span className="text-sm text-neutral-600">بسته‌های گم شده</span>
                </div>
                <span className="font-medium text-neutral-900">
                  {formatPersianNumber(metrics.network.packetsLost.toFixed(2))}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>هشدارهای سیستم</CardTitle>
              <CardDescription>
                {formatPersianNumber(alerts.filter(a => !a.acknowledged).length)} هشدار جدید
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-neutral-200 max-h-96 overflow-y-auto">
                {alerts.length > 0 ? (
                  alerts.map((alert) => (
                    <div key={alert.id} className="p-4">
                      <AlertItem
                        alert={alert}
                        onAcknowledge={handleAcknowledgeAlert}
                        onDismiss={handleDismissAlert}
                      />
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-neutral-500">
                    هیچ هشداری وجود ندارد
                  </div>
                )}
              </div>
              {alerts.length > 0 && (
                <div className="p-4 border-t">
                  <Button variant="ghost" size="sm" className="w-full">
                    <Eye className="w-4 h-4 ml-1" />
                    مشاهده همه هشدارها
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthPage;