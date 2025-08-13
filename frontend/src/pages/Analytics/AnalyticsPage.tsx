import React from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Users, FileText, Activity, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { AnimatedCard } from '../../components/ui/animations';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'];

export default function AnalyticsPage() {
  // Mock data for analytics
  const stats = {
    totalDocuments: 15420,
    totalCategories: 8,
    averageScore: 85,
    weeklyGrowth: 12.5,
    activeUsers: 48,
    processingJobs: 12
  };

  // Mock time series data
  const dailyData = Array.from({ length: 30 }, (_, i) => ({
    date: `${i + 1}/12`,
    count: Math.floor(Math.random() * 100) + 50,
    score: 70 + Math.random() * 25
  }));

  // Category distribution
  const categoryData = [
    { name: 'حقوق مدنی', value: 4200, percentage: '35.0' },
    { name: 'حقوق جزا', value: 3100, percentage: '26.0' },
    { name: 'حقوق تجارت', value: 2800, percentage: '23.0' },
    { name: 'آیین دادرسی', value: 1900, percentage: '16.0' }
  ];

  // Domain analysis
  const domainData = [
    { domain: 'dadgostary.ir', count: 5200, avgScore: 89 },
    { domain: 'majlis.ir', count: 3100, avgScore: 92 },
    { domain: 'tccim.ir', count: 1500, avgScore: 76 },
    { domain: 'intamedia.ir', count: 950, avgScore: 83 },
    { domain: 'rrk.ir', count: 700, avgScore: 88 }
  ];

  // Quality distribution
  const qualityData = [
    { range: 'عالی (90-100%)', count: 8500, color: '#10B981' },
    { range: 'خوب (80-89%)', count: 4200, color: '#3B82F6' },
    { range: 'متوسط (70-79%)', count: 1900, color: '#F59E0B' },
    { range: 'ضعیف (60-69%)', count: 820, color: '#EF4444' }
  ];

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    change: number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }> = ({ title, value, change, icon: Icon, color }) => (
    <AnimatedCard className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          <div className={`flex items-center mt-2 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <span>{change >= 0 ? '+' : ''}{change}%</span>
            <span className="text-gray-500 dark:text-gray-400 mr-2">نسبت به هفته قبل</span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </AnimatedCard>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto p-6 space-y-6"
      dir="rtl"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">تحلیل و گزارش‌گیری</h1>
        <p className="text-blue-100">تحلیل جامع داده‌های جمع‌آوری شده و عملکرد سیستم</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="کل اسناد"
          value={stats.totalDocuments.toLocaleString('fa-IR')}
          change={12.5}
          icon={FileText}
          color="bg-blue-500"
        />
        <MetricCard
          title="دسته‌بندی‌ها"
          value={stats.totalCategories}
          change={8.2}
          icon={PieChartIcon}
          color="bg-green-500"
        />
        <MetricCard
          title="میانگین کیفیت"
          value={`${stats.averageScore}%`}
          change={5.1}
          icon={TrendingUp}
          color="bg-yellow-500"
        />
        <MetricCard
          title="کاربران فعال"
          value={stats.activeUsers}
          change={-2.1}
          icon={Users}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Series Chart */}
        <AnimatedCard className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            روند جمع‌آوری اسناد (۳۰ روز اخیر)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.3}
                  name="تعداد اسناد"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AnimatedCard>

        {/* Category Distribution */}
        <AnimatedCard className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            توزیع دسته‌بندی‌ها
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </AnimatedCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Domain Performance */}
        <AnimatedCard className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            عملکرد منابع داده
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="domain" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" name="تعداد اسناد" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AnimatedCard>

        {/* Quality Distribution */}
        <AnimatedCard className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            توزیع کیفیت اسناد
          </h3>
          <div className="space-y-4">
            {qualityData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.range}</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.count.toLocaleString('fa-IR')}
                  </span>
                  <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        backgroundColor: item.color,
                        width: `${(item.count / stats.totalDocuments) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </div>

      {/* Daily Activity */}
      <AnimatedCard className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          نمودار کیفیت اسناد (۳۰ روز اخیر)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value: any) => [`${value}%`, 'میانگین کیفیت']}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </AnimatedCard>
    </motion.div>
  );
}