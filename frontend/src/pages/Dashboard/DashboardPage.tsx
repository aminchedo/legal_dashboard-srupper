import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend, LineChart, Line } from 'recharts';
import {
  Activity, BarChart3, Bell, Briefcase, Calendar, CheckCircle, ChevronDown, ChevronRight,
  CloudLightning, Code, Database, Download, Edit, ExternalLink, FileText, Filter, Folder,
  HardDrive, Home, Info, Layers, LogIn, Maximize2, Menu, MessageSquare, Minimize2, Moon,
  MoreVertical, Pause, Play, Plus, PowerOff, RefreshCw, Search, Settings, Server, Shield,
  Sun, Tag, Terminal, Trash2, TrendingUp, Upload, Users, X, XCircle, Zap, AlertTriangle, 
  Cpu, Wifi, Clock, Eye, AlertCircle, CheckSquare, MemoryStick, Power, Globe
} from 'lucide-react';

// Enhanced types for better TypeScript support
interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  change: number;
  colorClass: string;
}

interface NavigationCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  count?: number;
  status?: string;
  onClick: () => void;
}

interface SystemMetric {
  name: string;
  value: number;
  color: string;
}

// Enhanced date formatting functions
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }).format(date);
};

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
};

const formatDistanceToNow = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes} دقیقه پیش`;
  if (hours < 24) return `${hours} ساعت پیش`;
  return `${days} روز پیش`;
};

// Enhanced mock data with real-time updates
const useDashboardData = () => {
  const [mockStats, setMockStats] = useState({
    totalItems: 12450,
    dailyChange: 152,
    activeJobs: 12,
    activeProxies: 128,
    errors24h: 7,
    categories: { 
      'حقوق مدنی': 4500, 
      'حقوق تجارت': 3200, 
      'حقوق جزا': 2100, 
      'آیین دادرسی': 1850, 
      'سایر': 800 
    },
    topDomains: { 
      'dadgostary.ir': 5200, 
      'majlis.ir': 3100, 
      'tccim.ir': 1500, 
      'intamedia.ir': 950, 
      'rrk.ir': 700, 
      'adliran.ir': 500 
    },
    dailyScraped: [
      { name: 'شنبه', count: 300 }, 
      { name: 'یکشنبه', count: 450 }, 
      { name: 'دوشنبه', count: 600 },
      { name: 'سه‌شنبه', count: 520 }, 
      { name: 'چهارشنبه', count: 780 }, 
      { name: 'پنجشنبه', count: 900 },
      { name: 'جمعه', count: 400 },
    ],
    systemHealth: {
      cpu: [...Array(30)].map((_, i) => ({ x: i, y: Math.random() * 60 + 20 })),
      memory: [...Array(30)].map((_, i) => ({ x: i, y: Math.random() * 40 + 50 })),
      disk: 73,
      network: { up: 1.2, down: 15.8 },
      services: [
        { name: 'API Gateway', status: 'Operational', responseTime: '120ms' },
        { name: 'Database Service', status: 'Operational', responseTime: '45ms' },
        { name: 'Scraping Workers', status: 'Operational', responseTime: 'N/A' },
        { name: 'Proxy Manager', status: 'Degraded Performance', responseTime: '350ms' },
        { name: 'Authentication', status: 'Operational', responseTime: '80ms' },
      ]
    },
    analytics: {
      documentGrowth: [...Array(12)].map((_, i) => ({ 
        month: `${i+1} ماه`, 
        total: 1000 * (i+1) + Math.random() * 1000 
      })),
      sourceComparison: { 'dadgostary.ir': 45, 'majlis.ir': 30, 'tccim.ir': 15, 'other': 10 },
      keywordTrends: {
        'مالیات': [...Array(12)].map(() => Math.floor(Math.random() * 100)),
        'قاچاق': [...Array(12)].map(() => Math.floor(Math.random() * 80)),
        'خانواده': [...Array(12)].map(() => Math.floor(Math.random() * 60)),
      }
    }
  });

  const [recentDocuments] = useState([
    { 
      id: 'doc-001', 
      title: 'رای وحدت رویه شماره ۸۲۰ هیات عمومی دیوان عالی کشور', 
      source: 'rrk.ir', 
      category: 'آیین دادرسی', 
      createdAt: new Date(2023, 10, 5), 
      wordCount: 1250, 
      status: 'Published',
      url: 'https://rrk.ir/Laws/ShowLaw.aspx?Code=820',
      ratingScore: 0.95,
      domain: 'rrk.ir'
    },
    { 
      id: 'doc-002', 
      title: 'قانون اصلاح قانون مبارزه با قاچاق کالا و ارز', 
      source: 'majlis.ir', 
      category: 'حقوق جزا', 
      createdAt: new Date(2023, 10, 2), 
      wordCount: 8500, 
      status: 'Published',
      url: 'https://majlis.ir/fa/law/show/1024867',
      ratingScore: 0.89,
      domain: 'majlis.ir'
    },
    { 
      id: 'doc-003', 
      title: 'بخشنامه جدید مالیات بر ارزش افزوده برای سال ۱۴۰۲', 
      source: 'intamedia.ir', 
      category: 'مالیاتی', 
      createdAt: new Date(2023, 9, 28), 
      wordCount: 2100, 
      status: 'Archived',
      url: 'https://intamedia.ir/circular/2023/28',
      ratingScore: 0.78,
      domain: 'intamedia.ir'
    },
    { 
      id: 'doc-004', 
      title: 'آیین‌نامه اجرایی قانون حمایت از خانواده و جوانی جمعیت', 
      source: 'dotic.ir', 
      category: 'حقوق مدنی', 
      createdAt: new Date(2023, 9, 15), 
      wordCount: 5400, 
      status: 'Published',
      url: 'https://dotic.ir/regulation/family-support',
      ratingScore: 0.92,
      domain: 'dotic.ir'
    },
    { 
      id: 'doc-005', 
      title: 'دستورالعمل نحوه شناسایی و توقیف اموال مدیونین', 
      source: 'adliran.ir', 
      category: 'آیین دادرسی', 
      createdAt: new Date(2023, 9, 11), 
      wordCount: 3300, 
      status: 'Draft',
      url: 'https://adliran.ir/instructions/asset-seizure',
      ratingScore: 0.85,
      domain: 'adliran.ir'
    },
  ]);

  // Real-time data update simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setMockStats(prev => ({
        ...prev,
        totalItems: prev.totalItems + Math.floor(Math.random() * 5),
        activeJobs: prev.activeJobs + (Math.random() > 0.7 ? 1 : 0),
        systemHealth: {
          ...prev.systemHealth,
          cpu: [...prev.systemHealth.cpu.slice(1), { 
            x: prev.systemHealth.cpu.length, 
            y: Math.random() * 60 + 20 
          }],
          memory: [...prev.systemHealth.memory.slice(1), { 
            x: prev.systemHealth.memory.length, 
            y: Math.random() * 40 + 50 
          }]
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return { mockStats, recentDocuments };
};

// Helper Components with Enhanced Responsive Design
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '', 
  ...props 
}) => (
  <div className={`bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-elegant hover:shadow-glass transition-all duration-300 ${className}`} {...props}>
    {children}
  </div>
);

const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'destructive';
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}> = ({ children, variant = 'primary', icon: Icon, className = '', onClick, disabled, ...props }) => {
  const baseClasses = "btn-responsive focus-ring transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600',
    secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600',
    ghost: 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
    outline: 'bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600',
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`} 
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon style={{ width: 'var(--space-4)', height: 'var(--space-4)' }} />}
      <span>{children}</span>
    </button>
  );
};

// Enhanced Dashboard Components with Full Responsive Design
const StatisticsOverview: React.FC<{ stats: any }> = ({ stats }) => {
  const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, change, colorClass }) => (
    <Card className="p-4 hover:shadow-xl transition-all duration-300 hover:scale-105 touch-target">
      <div className="flex justify-between items-start mb-3">
        <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10 dark:bg-opacity-20`}>
          {React.createElement(icon, { style: { width: 'var(--text-lg)', height: 'var(--text-lg)' } })}
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center ${
          change >= 0 ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
        }`}>
          {change >= 0 ? `+${change}` : change}
        </div>
      </div>
      <p className="font-bold text-gray-800 dark:text-white mb-2 persian-numbers" style={{ fontSize: 'var(--text-2xl)' }}>
        {value.toLocaleString('fa-IR')}
      </p>
      <p className="text-gray-500 dark:text-gray-400" style={{ fontSize: 'var(--text-sm)' }}>{label}</p>
    </Card>
  );

  return (
    <div className="responsive-grid responsive-grid-auto tablet:grid-cols-2 desktop:grid-cols-4 mb-6">
      <MetricCard 
        icon={FileText} 
        label="کل اسناد" 
        value={stats.totalItems} 
        change={stats.dailyChange} 
        colorClass="text-blue-500" 
      />
      <MetricCard 
        icon={Briefcase} 
        label="پروژه‌های فعال" 
        value={stats.activeJobs} 
        change={1} 
        colorClass="text-green-500" 
      />
      <MetricCard 
        icon={Server} 
        label="پروکسی‌ها" 
        value={stats.activeProxies} 
        change={-3} 
        colorClass="text-yellow-500" 
      />
      <MetricCard 
        icon={AlertTriangle} 
        label="خطاهای ۲۴ ساعت" 
        value={stats.errors24h} 
        change={2} 
        colorClass="text-red-500" 
      />
    </div>
  );
};

const QuickActions: React.FC<{ onEmergencyStop: () => Promise<void> }> = ({ onEmergencyStop }) => {
  const [currentTab, setCurrentTab] = useState('dashboard');

  return (
    <div className="responsive-grid responsive-grid-2 tablet:grid-cols-3 desktop:grid-cols-6 mb-6">
      <Button className="w-full touch-target" variant="primary" onClick={() => setCurrentTab('scraping')}>
        <Play style={{ width: 'var(--space-4)', height: 'var(--space-4)' }} />
        <span className="tablet-up:hidden">اسکرپ</span>
        <span className="mobile-only:hidden">شروع اسکرپ جدید</span>
      </Button>
      <Button className="w-full touch-target" variant="secondary" onClick={() => setCurrentTab('proxies')}>
        <Server style={{ width: 'var(--space-4)', height: 'var(--space-4)' }} />
        <span className="tablet-up:hidden">پروکسی</span>
        <span className="mobile-only:hidden">تست پروکسی‌ها</span>
      </Button>
      <Button className="w-full touch-target" variant="outline" onClick={() => setCurrentTab('documents')}>
        <FileText style={{ width: 'var(--space-4)', height: 'var(--space-4)' }} />
        <span className="tablet-up:hidden">اسناد</span>
        <span className="mobile-only:hidden">مشاهده اسناد</span>
      </Button>
      <Button className="w-full touch-target" variant="ghost" onClick={() => setCurrentTab('analytics')}>
        <BarChart3 style={{ width: 'var(--space-4)', height: 'var(--space-4)' }} />
        <span className="tablet-up:hidden">تحلیل</span>
        <span className="mobile-only:hidden">تحلیل‌ها</span>
      </Button>
      <Button className="w-full touch-target" variant="outline" onClick={() => setCurrentTab('settings')}>
        <Settings style={{ width: 'var(--space-4)', height: 'var(--space-4)' }} />
        <span className="tablet-up:hidden">تنظیمات</span>
        <span className="mobile-only:hidden">تنظیمات</span>
      </Button>
      <Button className="w-full touch-target" variant="danger" onClick={onEmergencyStop}>
        <PowerOff style={{ width: 'var(--space-4)', height: 'var(--space-4)' }} />
        <span className="tablet-up:hidden">توقف</span>
        <span className="mobile-only:hidden">توقف اضطراری</span>
      </Button>
    </div>
  );
};

const NavigationHub: React.FC<{ stats: any }> = ({ stats }) => {
  const [currentTab, setCurrentTab] = useState('dashboard');

  const navigationCards: NavigationCardProps[] = [
    {
      title: 'مدیریت اسناد',
      icon: FileText,
      description: 'مدیریت و بررسی اسناد حقوقی',
      count: stats.totalItems,
      onClick: () => setCurrentTab('documents')
    },
    {
      title: 'پردازش پرونده‌ها',
      icon: Briefcase,
      description: 'مدیریت پرونده‌ها و وضعیت پردازش',
      count: stats.activeJobs,
      onClick: () => setCurrentTab('jobs')
    },
    {
      title: 'مدیریت پروکسی',
      icon: Server,
      description: 'تنظیمات و وضعیت پروکسی‌ها',
      count: stats.activeProxies,
      onClick: () => setCurrentTab('proxies')
    },
    {
      title: 'سلامت سیستم',
      icon: Activity,
      description: 'نظارت بر عملکرد سیستم',
      status: 'healthy',
      onClick: () => setCurrentTab('system')
    },
    {
      title: 'تحلیل و گزارش',
      icon: BarChart3,
      description: 'تحلیل‌های پیشرفته و گزارش‌ها',
      onClick: () => setCurrentTab('analytics')
    },
    {
      title: 'تنظیمات',
      icon: Settings,
      description: 'تنظیمات سیستم و کاربری',
      onClick: () => setCurrentTab('settings')
    },
  ];

  return (
    <div className="mb-6">
      <h2 className="font-bold mb-4 text-gray-900 dark:text-white" style={{ fontSize: 'var(--text-xl)' }}>
        دسترسی سریع به بخش‌ها
      </h2>
      <div className="responsive-grid responsive-grid-auto tablet:grid-cols-2 desktop:grid-cols-3">
        {navigationCards.map((item) => (
          <div
            key={item.title}
            onClick={item.onClick}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-elegant hover:shadow-glass transition-all duration-300 cursor-pointer p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:-translate-y-1 group touch-target animate-fade-in"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <item.icon style={{ width: 'var(--text-lg)', height: 'var(--text-lg)' }} className="text-white" />
              </div>
              {typeof item.count === 'number' && (
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full font-medium persian-numbers" style={{ fontSize: 'var(--text-sm)' }}>
                  {item.count.toLocaleString('fa-IR')}
                </span>
              )}
              {item.status && (
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full font-medium" style={{ fontSize: 'var(--text-sm)' }}>
                  سالم
                </span>
              )}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2" style={{ fontSize: 'var(--text-lg)' }}>{item.title}</h3>
            <p className="text-gray-600 dark:text-gray-400" style={{ fontSize: 'var(--text-sm)' }}>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChartsSection: React.FC<{ stats: any }> = ({ stats }) => {
  const categoryData = Object.entries(stats.categories).map(([name, value]) => ({ name, value }));
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="responsive-grid responsive-grid-auto desktop:grid-cols-12 mb-6 space-y-4 desktop:space-y-0">
      <div className="desktop:col-span-8">
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4" style={{ fontSize: 'var(--text-lg)' }}>
            اسناد جمع‌آوری شده (هفته اخیر)
          </h3>
          <div className="h-64 tablet:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyScraped} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'currentColor', fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fill: 'currentColor', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    backdropFilter: 'blur(5px)', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '0.75rem',
                    fontSize: '14px'
                  }} 
                />
                <Area type="monotone" dataKey="count" stroke="#3B82F6" fill="url(#colorUv)" strokeWidth={2} name="تعداد اسناد" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="desktop:col-span-4">
        <Card className="p-4 h-full flex flex-col">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4" style={{ fontSize: 'var(--text-lg)' }}>
            توزیع دسته‌بندی‌ها
          </h3>
          <div className="flex-grow min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={categoryData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={50} 
                  outerRadius={80} 
                  paddingAngle={3} 
                  dataKey="value" 
                  labelLine={false}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  iconType="circle" 
                  layout="vertical" 
                  align="right" 
                  verticalAlign="middle" 
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

const SystemHealth: React.FC<{ stats: any }> = ({ stats }) => {
  const systemMetrics: SystemMetric[] = [
    { name: 'CPU', value: 68, color: 'bg-blue-500' },
    { name: 'RAM', value: 84, color: 'bg-green-500' },
    { name: 'Disk', value: 73, color: 'bg-yellow-500' },
    { name: 'Network', value: 45, color: 'bg-purple-500' }
  ];

  return (
    <div className="responsive-grid responsive-grid-auto desktop:grid-cols-4 mb-6 space-y-4 desktop:space-y-0">
      <div className="desktop:col-span-3">
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4" style={{ fontSize: 'var(--text-lg)' }}>
            مصرف منابع (لحظه‌ای)
          </h3>
          <div className="h-48 tablet:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.systemHealth.cpu} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="x" hide />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fill: 'currentColor', fontSize: 12 }}
                />
                <Tooltip />
                <Line type="monotone" dataKey="y" stroke="#3B82F6" strokeWidth={2} dot={false} name="CPU" />
                <Line type="monotone" dataKey="y" data={stats.systemHealth.memory} stroke="#10B981" strokeWidth={2} dot={false} name="Memory" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      <div className="desktop:col-span-1">
        <Card className="p-4 h-full">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4" style={{ fontSize: 'var(--text-lg)' }}>
            وضعیت سیستم
          </h3>
          <div className="space-y-4">
            {systemMetrics.map((metric) => (
              <div key={metric.name} className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400 min-w-0 flex-shrink-0" style={{ fontSize: 'var(--text-sm)' }}>
                  {metric.name}
                </span>
                <div className="flex-1 mx-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`${metric.color} h-2 rounded-full transition-all duration-1000`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
                <span className="text-gray-600 dark:text-gray-400 font-medium flex-shrink-0 persian-numbers" style={{ fontSize: 'var(--text-sm)' }}>
                  {metric.value}%
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
            <div className="flex items-center space-x-reverse space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
              <span className="font-medium text-green-800 dark:text-green-300" style={{ fontSize: 'var(--text-sm)' }}>
                سیستم فعال
              </span>
            </div>
            <p className="text-green-600 dark:text-green-400 mt-1" style={{ fontSize: 'var(--text-xs)' }}>
              تمام سرویس‌ها عملیاتی
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

const RecentActivity: React.FC<{ documents: any[] }> = ({ documents }) => (
  <Card className="p-4">
    <h3 className="font-semibold text-gray-900 dark:text-white mb-6" style={{ fontSize: 'var(--text-lg)' }}>
      آخرین فعالیت‌ها
    </h3>
    <div className="space-y-4">
      {documents.slice(0, 5).map((item) => (
        <div key={item.id} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0 pb-4 last:pb-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 dark:text-white truncate mb-1" style={{ fontSize: 'var(--text-md)' }}>
                {item.title}
              </h4>
              <div className="flex flex-col tablet:flex-row tablet:items-center gap-2 text-gray-500 dark:text-gray-400 mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                <div className="flex items-center gap-1">
                  <ExternalLink style={{ width: 'var(--space-3)', height: 'var(--space-3)' }} />
                  <span>{item.source}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar style={{ width: 'var(--space-3)', height: 'var(--space-3)' }} />
                  <span>{formatDate(item.createdAt)}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800" style={{ fontSize: 'var(--text-xs)' }}>
                  <Tag style={{ width: 'var(--space-3)', height: 'var(--space-3)' }} />
                  {item.category}
                </span>
                <span className="text-gray-500 dark:text-gray-400 persian-numbers" style={{ fontSize: 'var(--text-xs)' }}>
                  {item.wordCount.toLocaleString('fa-IR')} کلمه
                </span>
              </div>
            </div>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center touch-target text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex-shrink-0"
            >
              <ExternalLink style={{ width: 'var(--space-4)', height: 'var(--space-4)' }} />
            </a>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

// Main Dashboard Page Component with Enhanced Mobile Navigation
export default function DashboardPage() {
  const { mockStats, recentDocuments } = useDashboardData();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleEmergencyStop = async () => {
    try {
      const base = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      await fetch(`${base}/scraping/stop`, { method: 'POST' });
      alert('همه‌ی کارها متوقف شد');
    } catch (e) {
      alert('خطا در توقف اضطراری');
    }
  };

  return (
    <div className="responsive-container prevent-horizontal-scroll safe-area-inset" dir="rtl">
      <div className="space-y-6 min-h-screen bg-gray-50 dark:bg-gray-900">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700;800&display=swap');
          body, html { 
            font-family: 'Vazirmatn', var(--font-family); 
          }
        `}</style>

        {/* Enhanced Mobile-First Page Header */}
        <div className="mb-6 bg-gradient-mobile rounded-xl shadow-glass p-4 text-white animate-fade-in">
          <div className="flex-responsive-between">
            <div className="min-w-0 flex-1">
              <h1 className="font-bold mb-2 text-white" style={{ fontSize: 'var(--text-3xl)' }}>
                نمای کلی سیستم
              </h1>
              <p className="text-blue-100" style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--leading-relaxed)' }}>
                سیستم جامع مدیریت اطلاعات حقوقی جمهوری اسلامی ایران
              </p>
              <p className="text-blue-200 mt-2" style={{ fontSize: 'var(--text-sm)' }}>
                {`امروز ${formatDateTime(new Date())}`}
              </p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="text-center tablet:text-left">
                <div className="text-blue-100" style={{ fontSize: 'var(--text-sm)' }}>آخرین بروزرسانی</div>
                <div className="font-bold persian-numbers" style={{ fontSize: 'var(--text-xl)' }}>
                  {formatDate(new Date())}
                </div>
              </div>
              <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Quick Actions with Responsive Grid */}
        <QuickActions onEmergencyStop={handleEmergencyStop} />

        {/* Navigation Hub with Enhanced Cards */}
        <NavigationHub stats={mockStats} />

        {/* System Health with Real-time Updates */}
        <SystemHealth stats={mockStats} />

        {/* Statistics Cards with Hover Effects */}
        <StatisticsOverview stats={mockStats} />

        {/* Charts Section with Responsive Layout */}
        <ChartsSection stats={mockStats} />

        {/* Recent Activity with Mobile Optimization */}
        <RecentActivity documents={recentDocuments} />
      </div>
    </div>
  );
}
