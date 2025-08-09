import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Award, BookOpen, Globe } from 'lucide-react';
import { useDocuments, useStatistics } from '../../hooks/useDatabase';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { faIR } from 'date-fns/locale';
import MetricCard from '../MetricCard';
import ScoreIndicator from '../ScoreIndicator';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'];

export default function AnalyticsPage() {
  const { data: documentsData, isLoading: documentsLoading } = useDocuments({ limit: 1000 });
  const { data: stats, isLoading: statsLoading } = useStatistics();

  const isLoading = documentsLoading || statsLoading;
  const items = documentsData?.items || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری تحلیل‌ها...</p>
        </div>
      </div>
    );
  }

  if (!items.length || !stats) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">تحلیل و گزارش</h1>
          <p className="text-gray-600">آنالیز جامع داده‌های جمع‌آوری شده</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-12 text-center">
          <BookOpen size={48} className="text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-yellow-800 mb-2">هنوز داده‌ای برای تحلیل وجود ندارد</h3>
          <p className="text-yellow-600">ابتدا از بخش وب اسکرپینگ داده‌هایی را جمع‌آوری کنید</p>
        </div>
      </div>
    );
  }

  // Prepare time series data
  const last30Days = eachDayOfInterval({
    start: subDays(new Date(), 29),
    end: new Date()
  });

  const timeSeriesData = last30Days.map((date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayItems = items.filter((item: any) =>
      format(new Date(item.createdAt), 'yyyy-MM-dd') === dateStr
    );

    return {
      date: format(date, 'MM/dd', { locale: faIR }),
      fullDate: dateStr,
      count: dayItems.length,
      avgRating: dayItems.length > 0 ? dayItems.reduce((acc: number, item: any) => acc + item.ratingScore, 0) / dayItems.length : 0
    };
  });

  // Category analysis
  const categoryData = Object.entries(stats.categories).map(([name, value]) => ({
    name,
    value,
    percentage: ((value / stats.totalItems) * 100).toFixed(1)
  }));

  // Domain analysis with additional metrics
  const domainAnalysis = Object.entries(stats.topDomains).slice(0, 8).map(([domain, count]) => {
    const domainItems = items.filter((item: any) => item.domain === domain);
    const avgRating = domainItems.length > 0 ? domainItems.reduce((acc: number, item: any) => acc + item.ratingScore, 0) / domainItems.length : 0;
    const avgWordCount = domainItems.length > 0 ? domainItems.reduce((acc: number, item: any) => acc + item.wordCount, 0) / domainItems.length : 0;

    return {
      domain: domain.replace('www.', ''),
      count,
      avgRating: avgRating * 100,
      avgWordCount: Math.round(avgWordCount)
    };
  });

  const contentLengthRanges = [
    { range: '0-100', min: 0, max: 100 },
    { range: '101-500', min: 101, max: 500 },
    { range: '501-1000', min: 501, max: 1000 },
    { range: '1001-2000', min: 1001, max: 2000 },
    { range: '2000+', min: 2001, max: Infinity }
  ];

  const contentLengthData = contentLengthRanges.map(range => ({
    range: range.range,
    count: items.filter((item: any) => item.wordCount >= range.min && item.wordCount <= range.max).length
  }));

  const qualityRanges = [
    { label: 'ضعیف (0-20%)', min: 0, max: 0.2 },
    { label: 'متوسط (21-40%)', min: 0.21, max: 0.4 },
    { label: 'خوب (41-60%)', min: 0.41, max: 0.6 },
    { label: 'عالی (61-80%)', min: 0.61, max: 0.8 },
    { label: 'فوق‌العاده (81-100%)', min: 0.81, max: 1 }
  ];

  const qualityData = qualityRanges.map(range => ({
    label: range.label,
    count: items.filter((item: any) => item.ratingScore >= range.min && item.ratingScore <= range.max).length
  }));

  // Insights calculations
  const topCategory = categoryData.length > 0 ? categoryData.reduce((prev, current) => prev.value > current.value ? prev : current) : { name: 'N/A' };
  const avgWordsPerItem = items.length > 0 ? Math.round(items.reduce((acc: any, item: any) => acc + item.wordCount, 0) / items.length) : 0;
  const highQualityCount = items.filter((item: any) => item.ratingScore >= 0.7).length;
  const highQualityPercentage = items.length > 0 ? (highQualityCount / items.length * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">تحلیل و گزارش</h1>
        <p className="text-gray-600">آنالیز جامع داده‌های جمع‌آوری شده و بینش‌های کلیدی</p>
      </div>

      {/* Key Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="دسته‌بندی پربازدید"
          value={topCategory.name}
          icon={Award}
          color="blue"
        />

        <MetricCard
          title="میانگین کلمات"
          value={avgWordsPerItem}
          icon={BookOpen}
          color="green"
        />

        <MetricCard
          title="محتوای با کیفیت"
          value={`${highQualityPercentage}%`}
          icon={TrendingUp}
          color="yellow"
        />

        <MetricCard
          title="منابع فعال"
          value={Object.keys(stats.topDomains).length}
          icon={Globe}
          color="purple"
        />
      </div>

      {/* Time Series Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">روند زمانی جمع‌آوری (30 روز گذشته)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={timeSeriesData}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" />
            <Tooltip
              formatter={(value: any) => [`${value} آیتم`, 'تعداد']}
              labelStyle={{ color: '#374151' }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#colorCount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">توزیع دسته‌بندی‌ها</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any, name: any) => [`${value} مورد (${categoryData.find(d => d.name === name)?.percentage}%)`, name]}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex flex-wrap gap-2 mt-4">
            {categoryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-gray-600">{entry.name} ({entry.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">توزیع کیفیت محتوا</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={qualityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="label"
                stroke="#6B7280"
                fontSize={10}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#6B7280" />
              <Tooltip formatter={(value: any) => [`${value} مورد`, 'تعداد']} />
              <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Domain Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">تحلیل عملکرد منابع</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 font-semibold text-gray-900">منبع</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">تعداد آیتم‌ها</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">میانگین کیفیت</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">میانگین طول</th>
              </tr>
            </thead>
            <tbody>
              {domainAnalysis.map((domain, index) => (
                <tr key={domain.domain} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-3 px-4 font-medium text-gray-900">{domain.domain}</td>
                  <td className="py-3 px-4 text-gray-700">{domain.count.toLocaleString('fa-IR')}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <ScoreIndicator score={domain.avgRating} maxScore={100} variant="bar" size="sm" color="primary" animated />
                      <span className="text-sm font-medium text-gray-700">{domain.avgRating.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {domain.avgWordCount.toLocaleString('fa-IR')} کلمه
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Content Length Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">توزیع طول محتوا (بر اساس تعداد کلمات)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={contentLengthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="range" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip formatter={(value: any) => [`${value} مورد`, 'تعداد']} />
            <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}