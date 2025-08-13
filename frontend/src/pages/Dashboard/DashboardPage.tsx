import React, { useState, useEffect } from 'react';
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
  Home,
  Settings,
  LogOut,
  Menu,
  PieChart,
  Bell,
  User,
  Calendar,
  RefreshCw,
  Plus,
  X,
  Globe,
  HeartPulse,
  FolderKanban,
  ChevronRight,
  Zap,
  Eye
} from 'lucide-react';

// Helper functions
const formatPersianNumber = (num) => {
  return num.toLocaleString('fa-IR');
};

const formatNumber = (num) => {
  if (num >= 1000000) {
    return `${formatPersianNumber((num / 1000000).toFixed(1))}M`;
  }
  if (num >= 1000) {
    return `${formatPersianNumber((num / 1000).toFixed(1))}K`;
  }
  return formatPersianNumber(num);
};

// Enhanced Loading Skeleton Components
const SkeletonCard = () => (
  <div className="bg-slate-800/20 border border-slate-600/30 rounded-2xl p-7 animate-pulse backdrop-blur-sm">
    <div className="space-y-4">
      <div className="h-5 bg-slate-600/50 rounded-lg w-3/4"></div>
      <div className="h-10 bg-slate-600/50 rounded-lg w-1/2"></div>
      <div className="h-3 bg-slate-600/50 rounded w-2/3"></div>
    </div>
  </div>
);

const SkeletonChart = () => (
  <div className="bg-slate-800/20 border border-slate-600/30 rounded-2xl p-7 animate-pulse backdrop-blur-sm">
    <div className="h-7 bg-slate-600/50 rounded-lg w-1/3 mb-8"></div>
    <div className="space-y-6">
      <div className="h-40 bg-slate-600/50 rounded-xl"></div>
      <div className="grid grid-cols-3 gap-4">
        <div className="h-4 bg-slate-600/50 rounded"></div>
        <div className="h-4 bg-slate-600/50 rounded"></div>
        <div className="h-4 bg-slate-600/50 rounded"></div>
      </div>
    </div>
  </div>
);

// Enhanced Standard Card Component
const StandardCard = ({ title, children, icon: Icon, headerColor = "border-slate-500/30", className = "", variant = "default" }) => {
  const variants = {
    default: "from-slate-900/70 via-slate-800/60 to-slate-900/70",
    legal: "from-slate-900/70 via-purple-900/40 to-slate-900/70",
    technical: "from-slate-900/70 via-blue-900/40 to-slate-900/70",
    security: "from-slate-900/70 via-green-900/40 to-slate-900/70"
  };

  return (
    <div className={`bg-gradient-to-br ${variants[variant]} border border-slate-600/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}>
      <div className={`border-b ${headerColor} bg-slate-900/50 p-6 backdrop-blur-sm`}>
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="w-11 h-11 bg-gradient-to-br from-purple-500/80 to-purple-700/80 rounded-xl flex items-center justify-center shadow-md">
              <Icon className="w-5 h-5 text-white" />
            </div>
          )}
          <h3 className="font-bold text-white text-lg">{title}</h3>
        </div>
      </div>
      <div className="p-7">
        {children}
      </div>
    </div>
  );
};

// Enhanced Metric Card Component with better contrast and effects
const MetricCard = ({ icon: Icon, title, value, description, trend, onClick, color = "purple" }) => {
  const colorVariants = {
    purple: "from-purple-500/80 to-purple-700/80",
    blue: "from-blue-500/80 to-blue-700/80", 
    emerald: "from-emerald-500/80 to-emerald-700/80",
    orange: "from-orange-500/80 to-orange-700/80"
  };

  return (
    <div 
      className="group bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/60 border border-slate-500/20 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer backdrop-blur-sm"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-5">
        <div className={`p-3 bg-gradient-to-br ${colorVariants[color]} rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300 backdrop-blur-sm`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full backdrop-blur-sm ${
            trend >= 0 ? 'text-emerald-100 bg-emerald-500/20 border border-emerald-400/20' : 'text-red-100 bg-red-500/20 border border-red-400/20'
          }`}>
            <TrendingUp className={`w-4 h-4 ${trend < 0 && 'rotate-180'}`} />
            {trend >= 0 ? '+' : ''}{formatPersianNumber(trend)}%
          </div>
        )}
      </div>
      <div className="space-y-2">
        <div className="text-3xl font-bold text-white">{value}</div>
        <p className="text-sm font-semibold text-slate-100">{title}</p>
        <p className="text-xs text-slate-200 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

// Enhanced Header Component
const Header = ({ isSidebarOpen, setSidebarOpen }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 border-b border-slate-600/30 shadow-lg backdrop-blur-lg">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo Section */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)} 
            className="lg:hidden p-3 text-slate-200 hover:text-white hover:bg-slate-700/30 rounded-xl transition-all duration-300"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600/90 to-blue-800/90 rounded-2xl flex items-center justify-center shadow-md border border-blue-400/20">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div className="text-xl font-bold text-white">سامانه حقوقی</div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-4">
          {/* Search Box */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input 
              type="text" 
              placeholder="جستجو..."
              className="w-64 h-11 bg-slate-800/50 border border-slate-500/30 rounded-xl px-12 pr-4 text-white placeholder-slate-300 focus:outline-none focus:border-blue-400/60 focus:bg-slate-800/70 transition-all duration-300 backdrop-blur-sm"
              dir="rtl"
              onFocus={() => window.open('/search', '_blank')}
              readOnly
            />
          </div>

          {/* Notifications */}
          <div 
            className="relative w-11 h-11 bg-slate-800/50 border border-slate-500/30 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-700/50 transition-all duration-300 backdrop-blur-sm"
            onClick={() => window.open('/notifications', '_blank')}
          >
            <Bell className="w-4 h-4 text-white" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
              {formatPersianNumber(3)}
            </div>
          </div>

          {/* User Profile */}
          <div 
            className="w-11 h-11 bg-gradient-to-br from-purple-600/90 to-purple-800/90 border border-purple-400/30 rounded-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300 shadow-md"
            onClick={() => window.open('/profile', '_blank')}
          >
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

// Enhanced Floating Menu positioned on left
const FloatingMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('داشبورد');

  const menuItems = [
    { 
      icon: Home, 
      text: 'داشبورد',
      link: '/',
      color: 'from-blue-500/90 to-blue-700/90'
    },
    { 
      icon: FileText, 
      text: 'اسناد حقوقی',
      link: '/documents',
      color: 'from-emerald-500/90 to-emerald-700/90'
    },
    { 
      icon: BarChart3, 
      text: 'تحلیل و گزارش',
      link: '/analytics',
      color: 'from-purple-500/90 to-purple-700/90'
    },
    { 
      icon: FolderKanban, 
      text: 'پروژه‌ها',
      link: '/projects',
      color: 'from-orange-500/90 to-orange-700/90'
    },
    { 
      icon: HeartPulse, 
      text: 'سلامت سیستم',
      link: '/system-health',
      color: 'from-green-500/90 to-green-700/90'
    },
    { 
      icon: Globe, 
      text: 'پروکسی',
      link: '/proxies',
      color: 'from-indigo-500/90 to-indigo-700/90'
    },
    { 
      icon: Settings, 
      text: 'تنظیمات',
      link: '/settings',
      color: 'from-gray-500/90 to-gray-700/90'
    },
  ];

  return (
    <>
      {/* Main Floating Button - Left positioned */}
      <div className="fixed bottom-8 left-8 z-50">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-14 h-14 bg-gradient-to-br from-purple-600/90 to-purple-800/90 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-105 transition-all duration-300 border border-purple-400/30 backdrop-blur-sm"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Vertical Menu Items - Left positioned */}
      {isMenuOpen && (
        <div className="fixed bottom-24 left-8 z-50 flex flex-col-reverse gap-3">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="group flex items-center gap-3 transition-all duration-300 hover:scale-[1.02]"
              style={{
                transitionDelay: `${index * 60}ms`
              }}
            >
              {/* Menu Item Button */}
              <button
                onClick={() => {
                  setActiveMenu(item.text);
                  window.open(item.link, '_blank');
                  setIsMenuOpen(false);
                }}
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.color} shadow-md flex items-center justify-center hover:scale-110 transition-all duration-300 border border-white/20 backdrop-blur-sm ${
                  item.text === activeMenu ? 'ring-2 ring-blue-400/60' : ''
                }`}
              >
                <item.icon className="w-5 h-5 text-white" />
              </button>
              
              {/* Menu Item Text - positioned for left side */}
              <div className="bg-slate-800/80 backdrop-blur-lg border border-slate-600/30 rounded-xl px-4 py-2 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0">
                <span className="text-white text-sm font-semibold whitespace-nowrap">{item.text}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

// Enhanced Quick Access Button with reduced effects
const QuickAccessButton = ({ icon: Icon, label, color, onClick }) => {
  const colorVariants = {
    purple: "from-purple-500/80 to-purple-700/80 border-purple-400/30",
    emerald: "from-emerald-500/80 to-emerald-700/80 border-emerald-400/30",
    blue: "from-blue-500/80 to-blue-700/80 border-blue-400/30",
    yellow: "from-yellow-500/80 to-yellow-700/80 border-yellow-400/30"
  };

  return (
    <button 
      className={`flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-slate-900/50 via-slate-800/40 to-slate-900/50 hover:from-slate-800/60 hover:to-slate-700/60 border border-slate-500/20 hover:border-${color}-400/40 rounded-2xl transition-all duration-300 hover:scale-[1.02] group backdrop-blur-sm`}
      onClick={onClick}
    >
      <div className={`w-14 h-14 bg-gradient-to-br ${colorVariants[color]} rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-md`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <span className="text-sm font-semibold text-slate-100 group-hover:text-white transition-colors duration-300">{label}</span>
    </button>
  );
};

// Main Enhanced Dashboard Component
export default function EnhancedLegalDashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const documentStats = {
    totalDocuments: 45230,
    categories: [
      { name: 'حقوق مدنی', count: 15230, color: '#3B82F6', percentage: 33.6 },
      { name: 'حقوق کیفری', count: 12450, color: '#10B981', percentage: 27.5 },
      { name: 'حقوق تجاری', count: 8900, color: '#F59E0B', percentage: 19.7 },
      { name: 'حقوق اداری', count: 6780, color: '#EF4444', percentage: 15.0 },
      { name: 'حقوق بین‌الملل', count: 2340, color: '#8B5CF6', percentage: 5.2 },
    ]
  };

  const recentActivities = [
    { 
      action: "سند حقوقی جدید: اصلاحیه قانون تجارت", 
      time: "۱۰ دقیقه پیش", 
      icon: FileText, 
      type: "info"
    },
    { 
      action: "بروزرسانی سیستم تکمیل شد", 
      time: "۱ ساعت پیش", 
      icon: RefreshCw, 
      type: "success"
    },
    { 
      action: "گزارش ماهانه تولید شد", 
      time: "۲ ساعت پیش", 
      icon: BarChart3, 
      type: "info"
    },
    { 
      action: "هشدار: بررسی سرور مورد نیاز", 
      time: "۳ ساعت پیش", 
      icon: AlertTriangle, 
      type: "warning"
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    const timeTimer = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(timeTimer);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" dir="rtl" style={{ fontFamily: "'Yekan', -apple-system, BlinkMacSystemFont, sans-serif" }}>
        <Header isSidebarOpen={false} setSidebarOpen={() => {}} />
        <div className="pt-20 p-6 space-y-8">
          {/* Hero Skeleton */}
          <div className="bg-slate-800/20 rounded-3xl p-8 animate-pulse backdrop-blur-sm">
            <div className="h-10 bg-slate-600/50 rounded-xl w-1/3 mb-6"></div>
            <div className="h-5 bg-slate-600/50 rounded-lg w-2/3 mb-3"></div>
            <div className="h-5 bg-slate-600/50 rounded-lg w-1/2"></div>
          </div>
          
          {/* Metrics Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
          
          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SkeletonChart />
            <SkeletonChart />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" dir="rtl" style={{ fontFamily: "'Yekan', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <Header isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <FloatingMenu />
      
      <main className="pt-20 p-6 space-y-8">
        {/* Enhanced Hero Section with better visual hierarchy */}
        <div className="bg-gradient-to-r from-slate-900/80 via-purple-900/30 to-slate-900/80 rounded-3xl text-white p-10 shadow-lg relative overflow-hidden border border-slate-600/20 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/3 to-transparent"></div>
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-6 mb-6">
                <div className="p-4 bg-gradient-to-br from-white/15 to-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                  <Gavel className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white leading-tight">داشبورد مدیریت حقوقی</h1>
              </div>
              <p className="text-slate-100 mb-6 text-lg font-medium leading-relaxed">
                سامانه جامع مدیریت اطلاعات حقوقی جمهوری اسلامی ایران
              </p>
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-3 bg-slate-800/30 px-4 py-3 rounded-xl backdrop-blur-sm border border-slate-600/20">
                  <Calendar className="w-5 h-5 text-white" />
                  <span className="text-slate-100 font-medium">
                    {new Intl.DateTimeFormat('fa-IR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric'
                    }).format(currentTime)}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-5 py-3 bg-emerald-500/80 rounded-xl text-white text-sm font-bold shadow-md backdrop-blur-sm border border-emerald-400/30">
                  <Zap className="w-4 h-4" />
                  سیستم فعال
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-28 h-28 bg-white/8 rounded-3xl flex items-center justify-center backdrop-blur-sm overflow-hidden border border-white/15 shadow-md">
                <Scale className="w-14 h-14 text-white/70" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Key Metrics with better spacing and colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            icon={FileText}
            title="اسناد حقوقی"
            value={formatNumber(documentStats.totalDocuments)}
            description="مجموع اسناد در سیستم"
            trend={12}
            color="purple"
            onClick={() => window.open('/documents', '_blank')}
          />
          <MetricCard
            icon={Scale}
            title="قوانین فعال"
            value={formatNumber(8450)}
            description="قوانین در حال اجرا"
            trend={3}
            color="blue"
            onClick={() => window.open('/laws', '_blank')}
          />
          <MetricCard
            icon={Gavel}
            title="آرای قضایی"
            value={formatNumber(12100)}
            description="آرای دادگاه‌ها"
            trend={18}
            color="emerald"
            onClick={() => window.open('/court-decisions', '_blank')}
          />
          <MetricCard
            icon={BookOpen}
            title="مقالات حقوقی"
            value={formatNumber(3890)}
            description="مقالات تخصصی"
            trend={7}
            color="orange"
            onClick={() => window.open('/articles', '_blank')}
          />
        </div>

        {/* Enhanced Quick Access with better contrast */}
        <StandardCard title="دسترسی‌های سریع" icon={Zap} variant="technical">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <QuickAccessButton 
              icon={Upload}
              label="بارگذاری سند"
              color="purple"
              onClick={() => window.open('/upload', '_blank')}
            />
            <QuickAccessButton 
              icon={FileText}
              label="پروژه جدید"
              color="emerald"
              onClick={() => window.open('/projects/new', '_blank')}
            />
            <QuickAccessButton 
              icon={Search}
              label="جستجوی پیشرفته"
              color="blue"
              onClick={() => window.open('/search', '_blank')}
            />
            <QuickAccessButton 
              icon={BarChart3}
              label="تولید گزارش"
              color="yellow"
              onClick={() => window.open('/reports', '_blank')}
            />
          </div>
        </StandardCard>

        {/* Enhanced Document Categories & Statistics with improved readability */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Legal Categories Chart */}
          <StandardCard title="دسته‌بندی اسناد حقوقی" icon={PieChart} variant="legal">
            <div className="space-y-5">
              {documentStats.categories.map((category, index) => (
                <div key={index} className="group p-5 bg-gradient-to-r from-slate-900/40 via-slate-800/30 to-slate-900/40 rounded-2xl hover:from-slate-800/50 hover:to-slate-700/50 transition-all duration-300 cursor-pointer border border-slate-500/15 hover:border-slate-400/25" onClick={() => window.open(`/categories/${category.name}`, '_blank')}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base font-bold text-white group-hover:text-slate-50 transition-colors">{category.name}</span>
                    <div className="text-left">
                      <span className="text-sm text-slate-100 font-semibold block">{formatNumber(category.count)} سند</span>
                      <span className="text-xs text-slate-200 font-medium">{formatPersianNumber(category.percentage)}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800/40 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-3 rounded-full transition-all duration-1000 shadow-sm"
                      style={{ 
                        backgroundColor: category.color,
                        width: `${category.percentage}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </StandardCard>

          {/* Enhanced Statistics Overview with Bar Chart */}
          <StandardCard title="آمار کلی سیستم" icon={BarChart3} variant="security">
            <div className="space-y-6">
              {/* Bar Chart */}
              <div className="space-y-4">
                {/* اسناد امروز */}
                <div className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-100">اسناد امروز</span>
                    <span className="text-lg font-bold text-white">{formatPersianNumber(152)}</span>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-4 overflow-hidden">
                    <div 
                      className="h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1500 shadow-lg"
                      style={{ width: '76%' }}
                    />
                  </div>
                </div>

                {/* در حال پردازش */}
                <div className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-100">در حال پردازش</span>
                    <span className="text-lg font-bold text-white">{formatPersianNumber(12)}</span>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-4 overflow-hidden">
                    <div 
                      className="h-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-1500 shadow-lg"
                      style={{ width: '24%' }}
                    />
                  </div>
                </div>

                {/* میانگین پردازش روزانه */}
                <div className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-100">میانگین پردازش روزانه</span>
                    <span className="text-lg font-bold text-white">{formatPersianNumber(245)} سند</span>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-4 overflow-hidden">
                    <div 
                      className="h-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-1500 shadow-lg"
                      style={{ width: '98%' }}
                    />
                  </div>
                </div>

                {/* سرعت استخراج */}
                <div className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-100">سرعت استخراج</span>
                    <span className="text-lg font-bold text-white">{formatPersianNumber(98)}%</span>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-4 overflow-hidden">
                    <div 
                      className="h-4 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full transition-all duration-1500 shadow-lg"
                      style={{ width: '98%' }}
                    />
                  </div>
                </div>

                {/* دقت تحلیل */}
                <div className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-100">دقت تحلیل</span>
                    <span className="text-lg font-bold text-white">{formatPersianNumber(96)}%</span>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-4 overflow-hidden">
                    <div 
                      className="h-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-1500 shadow-lg"
                      style={{ width: '96%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-4 bg-gradient-to-br from-slate-900/50 via-slate-800/40 to-slate-900/50 border border-green-400/15 rounded-xl hover:scale-[1.02] transition-transform duration-300 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-green-400 mb-1">{formatPersianNumber(98.5)}%</div>
                  <div className="text-xs text-slate-200 font-semibold">کارایی کلی</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-slate-900/50 via-slate-800/40 to-slate-900/50 border border-blue-400/15 rounded-xl hover:scale-[1.02] transition-transform duration-300 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-blue-400 mb-1">{formatPersianNumber(164)}</div>
                  <div className="text-xs text-slate-200 font-semibold">پردازش موفق</div>
                </div>
              </div>
            </div>
          </StandardCard>
        </div>

        {/* Enhanced Recent Activities with better contrast */}
        <StandardCard title="فعالیت‌های اخیر" icon={Activity} variant="default">
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="group flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900/40 via-slate-800/30 to-slate-900/40 hover:from-slate-800/50 hover:to-slate-700/50 transition-all duration-300 border border-slate-500/15 hover:border-purple-400/20 cursor-pointer" onClick={() => window.open('/activities', '_blank')}>
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300 ${
                  activity.type === 'warning' ? 'bg-gradient-to-br from-yellow-500/80 to-yellow-700/80' :
                  activity.type === 'success' ? 'bg-gradient-to-br from-emerald-500/80 to-emerald-700/80' : 
                  'bg-gradient-to-br from-purple-500/80 to-purple-700/80'
                }`}>
                  <activity.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white group-hover:text-slate-50 transition-colors leading-relaxed">{activity.action}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-200 font-semibold">{activity.time}</span>
                  <Eye className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </StandardCard>
      </main>
    </div>
  );
}
