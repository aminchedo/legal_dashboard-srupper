import React from 'react';
import { MetricCard, SystemHealthCard, ActionCard, DataTable } from './molecules';
import { Button, Card } from './atoms';

// ORGANISMS: Complete page sections following atomic design

export interface ProfessionalHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  }>;
  className?: string;
}

export const ProfessionalHeader: React.FC<ProfessionalHeaderProps> = ({
  title = "سیستم حقوقی",
  subtitle = "سامانه هوشمند مدیریت اطلاعات حقوقی",
  actions = [],
  className = ''
}) => {
  return (
    <header className={`bg-white border-b-2 border-gray-200 shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8 rtl:space-x-reverse">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <div className="mr-3">
                <h1 className="text-lg font-bold text-gray-900">{title}</h1>
                <p className="text-sm text-gray-600">{subtitle}</p>
              </div>
            </div>
            
            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
              <a href="/proxies" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                مدیریت پروکسی‌ها
              </a>
              <a href="/health" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                وضعیت سیستم
              </a>
              <a href="/projects" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                پروژه‌ها
              </a>
            </nav>
          </div>
          
          {/* Actions and User Avatar */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                size="sm"
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-xs">👤</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export interface DashboardOverviewProps {
  systemMetrics?: Array<{
    name: string;
    value: number;
    status?: 'normal' | 'warning' | 'danger';
  }>;
  keyMetrics?: Array<{
    title: string;
    value: number;
    unit?: string;
    trend?: number;
    status?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
    formatType?: 'number' | 'bytes' | 'percentage' | 'currency';
  }>;
  quickActions?: Array<{
    title: string;
    description: string;
    actions: Array<{
      label: string;
      onClick: () => void;
      variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    }>;
    icon?: React.ReactNode;
  }>;
  className?: string;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  systemMetrics = [
    { name: 'CPU', value: 60, status: 'normal' },
    { name: 'RAM', value: 80, status: 'warning' },
    { name: 'شبکه', value: 50, status: 'normal' }
  ],
  keyMetrics = [
    { title: 'کل اسناد', value: 1234567, formatType: 'number', trend: 12, status: 'success' },
    { title: 'اسناد پردازش شده', value: 856432, formatType: 'number', trend: 8, status: 'success' },
    { title: 'درصد موفقیت', value: 94.2, formatType: 'percentage', trend: 2, status: 'success' },
    { title: 'حافظه استفاده شده', value: 2147483648, formatType: 'bytes', trend: -5, status: 'info' }
  ],
  quickActions = [],
  className = ''
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* System Health Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SystemHealthCard 
            title="وضعیت سلامت سیستم"
            metrics={systemMetrics}
          />
        </div>
        
        {/* Key Metrics Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {keyMetrics.map((metric, index) => (
              <MetricCard
                key={index}
                title={metric.title}
                value={metric.value}
                unit={metric.unit}
                trend={metric.trend}
                status={metric.status}
                formatType={metric.formatType}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <ActionCard
              key={index}
              title={action.title}
              description={action.description}
              actions={action.actions}
              icon={action.icon}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export interface SystemHealthPageOrgProps {
  realTimeMetrics?: {
    cpu: { usage: number; status: string };
    memory: { usage: number; status: string };
    disk: { usage: number; status: string };
    network: { latency: number; status: string };
  };
  services?: Array<{
    name: string;
    status: 'online' | 'offline' | 'warning' | 'error';
    uptime: string;
    lastCheck: string;
  }>;
  alerts?: Array<{
    id: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: string;
  }>;
}

export const SystemHealthPageOrg: React.FC<SystemHealthPageOrgProps> = ({
  realTimeMetrics = {
    cpu: { usage: 45, status: 'normal' },
    memory: { usage: 68, status: 'normal' },
    disk: { usage: 34, status: 'good' },
    network: { latency: 12, status: 'excellent' }
  },
  services = [
    { name: 'API Server', status: 'online', uptime: '99.9%', lastCheck: '2 دقیقه پیش' },
    { name: 'Database', status: 'online', uptime: '99.8%', lastCheck: '1 دقیقه پیش' },
    { name: 'Cache Server', status: 'warning', uptime: '95.2%', lastCheck: '5 دقیقه پیش' },
    { name: 'File Storage', status: 'online', uptime: '99.9%', lastCheck: '1 دقیقه پیش' }
  ],
  alerts = [
    { id: '1', severity: 'medium', message: 'استفاده از حافظه بالا رفته است', timestamp: '5 دقیقه پیش' },
    { id: '2', severity: 'low', message: 'یکی از سرورهای cache در حال بازآغازی است', timestamp: '15 دقیقه پیش' }
  ]
}) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">سلامت سیستم</h1>
      
      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="استفاده از CPU"
          value={realTimeMetrics.cpu.usage}
          formatType="percentage"
          status={realTimeMetrics.cpu.usage > 80 ? 'error' : realTimeMetrics.cpu.usage > 60 ? 'warning' : 'success'}
        />
        <MetricCard
          title="استفاده از حافظه"
          value={realTimeMetrics.memory.usage}
          formatType="percentage"
          status={realTimeMetrics.memory.usage > 85 ? 'error' : realTimeMetrics.memory.usage > 70 ? 'warning' : 'success'}
        />
        <MetricCard
          title="استفاده از دیسک"
          value={realTimeMetrics.disk.usage}
          formatType="percentage"
          status={realTimeMetrics.disk.usage > 90 ? 'error' : realTimeMetrics.disk.usage > 75 ? 'warning' : 'success'}
        />
        <MetricCard
          title="تأخیر شبکه"
          value={realTimeMetrics.network.latency}
          unit="ms"
          status={realTimeMetrics.network.latency > 100 ? 'error' : realTimeMetrics.network.latency > 50 ? 'warning' : 'success'}
        />
      </div>

      {/* Services Status */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">وضعیت سرویس‌ها</h2>
        <DataTable
          headers={['نام سرویس', 'وضعیت', 'زمان فعالیت', 'آخرین بررسی']}
          rows={services.map(service => [
            service.name,
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              service.status === 'online' ? 'bg-green-100 text-green-800' :
              service.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              service.status === 'error' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {service.status === 'online' ? 'آنلاین' : 
               service.status === 'warning' ? 'هشدار' :
               service.status === 'error' ? 'خطا' : 'آفلاین'}
            </span>,
            service.uptime,
            service.lastCheck
          ])}
        />
      </Card>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">هشدارهای سیستم</h2>
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className={`p-3 rounded-md border-r-4 ${
                alert.severity === 'critical' ? 'bg-red-50 border-red-500' :
                alert.severity === 'high' ? 'bg-orange-50 border-orange-500' :
                alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                'bg-blue-50 border-blue-500'
              }`}>
                <div className="flex justify-between items-start">
                  <p className="text-sm text-gray-900">{alert.message}</p>
                  <span className="text-xs text-gray-500">{alert.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};