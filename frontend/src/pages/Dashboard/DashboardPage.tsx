import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Scale, 
  FileText, 
  Users, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Database, 
  Activity, 
  Zap, 
  Monitor, 
  Shield, 
  AlertTriangle,
  Home,
  FolderOpen,
  Briefcase,
  Server,
  Settings,
  HardDrive,
  MemoryStick,
  Gavel,
  CheckCircle,
  Clock,
  UserCheck,
  FileCheck,
  Search,
  Download,
  Share2,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';

// Persian number conversion utility
const toPersianNumber = (num: number | string): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (digit: string) => persianDigits[parseInt(digit)]);
};

// Format Persian date
const formatPersianDate = (): string => {
  const now = new Date();
  const hours = toPersianNumber(now.getHours().toString().padStart(2, '0'));
  const minutes = toPersianNumber(now.getMinutes().toString().padStart(2, '0'));
  return `امروز ${hours}:${minutes}`;
};

// Legal Dashboard Data Types
interface LegalMetrics {
  totalCases: number;
  newCasesToday: number;
  averageProgress: number;
  activeLawyers: number;
  pendingDocuments: number;
  completedToday: number;
}

interface SystemHealth {
  legalDatabase: 'سالم' | 'هشدار' | 'خطا';
  documentProcessor: 'سالم' | 'هشدار' | 'خطا';
  legalProxies: 'سالم' | 'هشدار' | 'خطا';
  serverLoad: number;
  storageUsed: number;
  activeConnections: number;
}

interface ChartDataPoint {
  date: string;
  cases: number;
  progress: number;
  label: string;
}

interface CaseTypeData {
  type: string;
  count: number;
  color: string;
}

interface LegalActivity {
  id: number;
  action: string;
  caseNumber: string;
  lawyer: string;
  timestamp: string;
  icon: string;
  status: 'success' | 'pending' | 'warning';
}

interface LegalDashboardData {
  metrics: LegalMetrics;
  systemHealth: SystemHealth;
  charts: {
    weeklyCaseProgress: ChartDataPoint[];
    caseTypeDistribution: CaseTypeData[];
    topLegalSources: { name: string; value: number }[];
    monthlyTrends: { month: string; cases: number; completed: number }[];
  };
  recentActivity: LegalActivity[];
  lastUpdated: string;
}

// Mock Legal Data - Comprehensive and Realistic
const mockLegalData: LegalDashboardData = {
  metrics: {
    totalCases: 15420,
    newCasesToday: 847,
    averageProgress: 94.2,
    activeLawyers: 23,
    pendingDocuments: 156,
    completedToday: 72
  },
  systemHealth: {
    legalDatabase: 'سالم',
    documentProcessor: 'سالم',
    legalProxies: 'سالم',
    serverLoad: 68,
    storageUsed: 73,
    activeConnections: 234
  },
  charts: {
    weeklyCaseProgress: [
      { date: '۱۴۰۳/۱۰/۰۱', cases: 1200, progress: 94.5, label: 'دوشنبه' },
      { date: '۱۴۰۳/۱۰/۰۲', cases: 1340, progress: 93.8, label: 'سه‌شنبه' },
      { date: '۱۴۰۳/۱۰/۰۳', cases: 1180, progress: 95.2, label: 'چهارشنبه' },
      { date: '۱۴۰۳/۱۰/۰۴', cases: 1290, progress: 92.7, label: 'پنج‌شنبه' },
      { date: '۱۴۰۳/۱۰/۰۵', cases: 1420, progress: 96.1, label: 'جمعه' },
      { date: '۱۴۰۳/۱۰/۰۶', cases: 980, progress: 89.3, label: 'شنبه' },
      { date: '۱۴۰۳/۱۰/۰۷', cases: 1100, progress: 91.8, label: 'یکشنبه' }
    ],
    caseTypeDistribution: [
      { type: 'پرونده‌های مدنی', count: 4520, color: '#1e40af' },
      { type: 'پرونده‌های کیفری', count: 3280, color: '#dc2626' },
      { type: 'پرونده‌های خانوادگی', count: 2890, color: '#059669' },
      { type: 'پرونده‌های تجاری', count: 1950, color: '#7c3aed' },
      { type: 'پرونده‌های اداری', count: 1420, color: '#ea580c' },
      { type: 'پرونده‌های املاک', count: 1360, color: '#0891b2' }
    ],
    topLegalSources: [
      { name: 'دادگاه‌های عمومی', value: 3240 },
      { name: 'دادگاه‌های انقلاب', value: 2180 },
      { name: 'شورای حل اختلاف', value: 1890 },
      { name: 'دادگاه‌های خانواده', value: 1560 },
      { name: 'دیوان عدالت اداری', value: 1240 },
      { name: 'دادگاه‌های تجاری', value: 980 }
    ],
    monthlyTrends: [
      { month: 'فروردین', cases: 12450, completed: 11800 },
      { month: 'اردیبهشت', cases: 13200, completed: 12600 },
      { month: 'خرداد', cases: 14100, completed: 13400 },
      { month: 'تیر', cases: 15420, completed: 14520 },
      { month: 'مرداد', cases: 16200, completed: 15100 },
      { month: 'شهریور', cases: 15800, completed: 15200 }
    ]
  },
  recentActivity: [
    {
      id: 1,
      action: 'پرونده جدید ثبت شد',
      caseNumber: 'P-۱۴۰۳-۰۰۱۲۳۴',
      lawyer: 'دکتر احمد محمدی',
      timestamp: '۵ دقیقه پیش',
      icon: 'FileText',
      status: 'success'
    },
    {
      id: 2,
      action: 'سند حقوقی بررسی شد',
      caseNumber: 'P-۱۴۰۳-۰۰۱۲۳۳',
      lawyer: 'خانم فاطمه رضایی',
      timestamp: '۱۵ دقیقه پیش',
      icon: 'CheckCircle',
      status: 'success'
    },
    {
      id: 3,
      action: 'در انتظار تأیید وکیل',
      caseNumber: 'P-۱۴۰۳-۰۰۱۲۳۲',
      lawyer: 'آقای حسن کریمی',
      timestamp: '۳۰ دقیقه پیش',
      icon: 'Clock',
      status: 'pending'
    },
    {
      id: 4,
      action: 'مدارک تکمیلی دریافت شد',
      caseNumber: 'P-۱۴۰۳-۰۰۱۲۳۱',
      lawyer: 'دکتر زهرا احمدی',
      timestamp: '۴۵ دقیقه پیش',
      icon: 'FileCheck',
      status: 'success'
    },
    {
      id: 5,
      action: 'نیاز به بررسی بیشتر',
      caseNumber: 'P-۱۴۰۳-۰۰۱۲۳۰',
      lawyer: 'آقای علی موسوی',
      timestamp: '۱ ساعت پیش',
      icon: 'AlertTriangle',
      status: 'warning'
    }
  ],
  lastUpdated: formatPersianDate()
};

// Custom Hook for Dashboard Data
const useDashboardData = () => {
  const [data, setData] = useState<LegalDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call with realistic delay
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setData({
          ...mockLegalData,
          lastUpdated: formatPersianDate()
        });
      } catch (err) {
        setError('خطا در بارگذاری داده‌ها');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
};

// Stunning Header Component
const DashboardHeader: React.FC<{ onMenuToggle: () => void; isSidebarOpen: boolean }> = ({ onMenuToggle, isSidebarOpen }) => {
  const [notifications, setNotifications] = useState(3);

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white shadow-xl relative overflow-hidden"
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 animate-pulse"></div>
      </div>
      
      <div className="relative px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <Scale size={32} className="text-yellow-300" />
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0"
                >
                  <Scale size={32} className="text-yellow-300" />
                </motion.div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-white bg-clip-text text-transparent">
                  سامانه هوشمند جمع‌آوری اطلاعات حقوقی
                </h1>
                <p className="text-blue-100 text-sm">داشبورد مدیریت و نظارت</p>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-4">
            {/* Smart Search */}
            <div className="hidden md:flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 min-w-[300px]">
              <Search size={20} className="text-blue-200 ml-3" />
              <input
                type="text"
                placeholder="جستجو در ۱۵۰۰۰+ پرونده..."
                className="bg-transparent text-white placeholder-blue-200 border-none outline-none flex-1 text-sm"
              />
            </div>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <Bell size={20} />
              {notifications > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {toPersianNumber(notifications)}
                </motion.span>
              )}
            </motion.button>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                title="دریافت گزارش"
              >
                <Download size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                title="اشتراک‌گذاری"
              >
                <Share2 size={18} />
              </motion.button>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 bg-white/10 rounded-full px-3 py-2">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <UserCheck size={16} className="text-white" />
              </div>
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium">دکتر احمد محمدی</div>
                <div className="text-xs text-blue-200">مدیر سیستم</div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-3 flex items-center justify-between text-sm text-blue-100">
          <div className="flex items-center gap-6">
            <span>{toPersianNumber(12)} کاربر آنلاین</span>
            <span>آخرین به‌روزرسانی: {toPersianNumber(2)} دقیقه پیش</span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              سیستم عملیاتی
            </span>
          </div>
          <div className="text-xs">
            {formatPersianDate()}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

// Magnetic Sidebar Navigation
const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('/dashboard');

  const navigationItems = [
    { path: '/dashboard', label: 'داشبورد اصلی', icon: Home, badge: null },
    { path: '/documents', label: 'مدیریت اسناد', icon: FolderOpen, badge: 156 },
    { path: '/jobs', label: 'پردازش پرونده‌ها', icon: Briefcase, badge: 23 },
    { path: '/proxies', label: 'مدیریت پروکسی', icon: Server, badge: null },
    { path: '/system', label: 'سلامت سیستم', icon: Activity, badge: null },
    { path: '/settings', label: 'تنظیمات سیستم', icon: Settings, badge: 2 }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="lg:translate-x-0 lg:static fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 lg:z-0"
      >
        <div className="p-6 h-full flex flex-col">
          {/* Logo Section */}
          <div className="mb-8 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Gavel size={24} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">پنل مدیریت</h2>
                <p className="text-sm text-gray-500">سیستم حقوقی</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.path;
              
              return (
                <motion.button
                  key={item.path}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveItem(item.path);
                    navigate(item.path);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-r-4 border-blue-600 text-blue-700 shadow-lg shadow-blue-500/10' 
                      : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'} />
                  <span className="font-medium flex-1 text-right">{item.label}</span>
                  {item.badge && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center"
                    >
                      {toPersianNumber(item.badge)}
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Quick Stats */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                <div className="text-xs text-green-600 mb-1">پرونده‌های امروز</div>
                <div className="text-lg font-bold text-green-700">{toPersianNumber(847)}</div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
                <div className="text-xs text-blue-600 mb-1">وکلای فعال</div>
                <div className="text-lg font-bold text-blue-700">{toPersianNumber(23)}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

// Hero Metrics Cards
const MetricsSection: React.FC<{ data: LegalDashboardData }> = ({ data }) => {
  const metrics = [
    {
      title: 'کل پرونده‌ها',
      value: data.metrics.totalCases,
      icon: Scale,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      change: '+۱۲.۵%'
    },
    {
      title: 'پرونده‌های جدید امروز',
      value: data.metrics.newCasesToday,
      icon: FileText,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      change: '+۸.۳%'
    },
    {
      title: 'میانگین پیشرفت',
      value: `${data.metrics.averageProgress}%`,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      change: '+۳.۲%'
    },
    {
      title: 'وکلای فعال',
      value: data.metrics.activeLawyers,
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100',
      change: '+۲ نفر'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className={`bg-gradient-to-br ${metric.bgColor} p-6 rounded-2xl shadow-xl border border-white/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <Icon size={24} className="text-white" />
              </div>
              <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {metric.change}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
              <p className="text-3xl font-bold text-gray-900">
                {typeof metric.value === 'number' ? toPersianNumber(metric.value) : metric.value}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Interactive Charts Section
const ChartsSection: React.FC<{ data: LegalDashboardData }> = ({ data }) => {
  const COLORS = ['#1e40af', '#dc2626', '#059669', '#7c3aed', '#ea580c', '#0891b2'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Case Type Distribution */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <PieChart size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">توزیع انواع پرونده</h3>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPieChart>
            <Pie
              data={data.charts.caseTypeDistribution}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="count"
            >
              {data.charts.caseTypeDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => [`${toPersianNumber(value)} مورد`, 'تعداد']}
              labelStyle={{ color: '#374151', fontWeight: 'bold' }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-2 gap-2 mt-4">
          {data.charts.caseTypeDistribution.map((entry, index) => (
            <div key={entry.type} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm text-gray-600">{entry.type}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Weekly Progress Chart */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
            <BarChart3 size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">روند پیشرفت هفتگی</h3>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.charts.weeklyCaseProgress}>
            <defs>
              <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="label" 
              fontSize={12} 
              stroke="#6B7280" 
            />
            <YAxis stroke="#6B7280" />
            <Tooltip
              formatter={(value: any) => [`${toPersianNumber(value)} مورد`, 'تعداد پرونده']}
              labelStyle={{ color: '#374151', fontWeight: 'bold' }}
            />
            <Area
              type="monotone"
              dataKey="cases"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorCases)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

// Activity & Actions Section
const ActivitySection: React.FC<{ data: LegalDashboardData }> = ({ data }) => {
  const navigate = useNavigate();

  const quickActions = [
    { label: 'شروع پرونده جدید', icon: FileText, color: 'from-blue-500 to-blue-600', action: () => navigate('/jobs') },
    { label: 'جستجو در اسناد', icon: Search, color: 'from-green-500 to-green-600', action: () => navigate('/documents') },
    { label: 'مدیریت وکلا', icon: Users, color: 'from-purple-500 to-purple-600', action: () => navigate('/system') },
    { label: 'گزارش سیستم', icon: BarChart3, color: 'from-orange-500 to-orange-600', action: () => navigate('/system') }
  ];

  const getActivityIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return FileText;
      case 'CheckCircle': return CheckCircle;
      case 'Clock': return Clock;
      case 'FileCheck': return FileCheck;
      case 'AlertTriangle': return AlertTriangle;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'warning': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Activity size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">فعالیت‌های اخیر</h3>
          </div>
          <div className="text-sm text-gray-500">{data.lastUpdated}</div>
        </div>

        <div className="space-y-4">
          {data.recentActivity.map((activity) => {
            const Icon = getActivityIcon(activity.icon);
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: activity.id * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(activity.status)}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>پرونده: {activity.caseNumber}</span>
                    <span>•</span>
                    <span>{activity.lawyer}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-400">{activity.timestamp}</div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">اقدامات سریع</h3>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.action}
                className={`w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r ${action.color} text-white hover:shadow-lg transition-all duration-200`}
              >
                <Icon size={20} />
                <span className="font-medium">{action.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* System Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-4">آمار سیستم</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">بار سرور</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    style={{ width: `${data.systemHealth.serverLoad}%` }}
                  />
                </div>
                <span className="text-gray-700 font-medium">{toPersianNumber(data.systemHealth.serverLoad)}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">فضای ذخیره</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                    style={{ width: `${data.systemHealth.storageUsed}%` }}
                  />
                </div>
                <span className="text-gray-700 font-medium">{toPersianNumber(data.systemHealth.storageUsed)}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">اتصالات فعال</span>
              <span className="text-gray-700 font-medium">{toPersianNumber(data.systemHealth.activeConnections)}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// System Health Pulse
const SystemHealthSection: React.FC<{ data: LegalDashboardData }> = ({ data }) => {
  const healthItems = [
    {
      title: 'پایگاه داده حقوقی',
      status: data.systemHealth.legalDatabase,
      icon: Database,
      description: 'اتصال به پایگاه داده اصلی'
    },
    {
      title: 'پردازشگر اسناد',
      status: data.systemHealth.documentProcessor,
      icon: FileText,
      description: 'واحد پردازش و تحلیل اسناد'
    },
    {
      title: 'شبکه پروکسی',
      status: data.systemHealth.legalProxies,
      icon: Server,
      description: 'سرویس‌های پروکسی و VPN'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'سالم': return 'text-green-700 bg-green-50 border-green-200';
      case 'هشدار': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'خطا': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
          <Shield size={20} className="text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">نظارت بر سلامت سیستم</h3>
        <div className="flex items-center gap-1 text-sm text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          عملیاتی
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {healthItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border ${getStatusColor(item.status)} transition-all duration-200 hover:shadow-lg`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon size={20} />
                <span className="font-medium">{item.title}</span>
              </div>
              <p className="text-sm opacity-75">{item.description}</p>
              <div className="mt-2">
                <span className="text-xs font-medium">{item.status}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

// Main Dashboard Component
export default function DashboardPage() {
  const { data, loading, error } = useDashboardData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 font-medium">در حال بارگذاری داده‌های حقوقی...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white p-8 rounded-2xl shadow-xl"
        >
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">خطا در بارگذاری داده‌ها</h2>
          <p className="text-gray-600">{error || 'اتصال به سرور برقرار نشد'}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex" dir="rtl">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader 
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen}
        />
        
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto space-y-8"
          >
            {/* Hero Metrics */}
            <MetricsSection data={data} />
            
            {/* Interactive Charts */}
            <ChartsSection data={data} />
            
            {/* System Health */}
            <SystemHealthSection data={data} />
            
            {/* Activity & Actions */}
            <ActivitySection data={data} />
          </motion.div>
        </main>
      </div>
    </div>
  );
}