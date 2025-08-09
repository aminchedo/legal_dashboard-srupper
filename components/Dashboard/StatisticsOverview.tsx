import { FileText, FolderOpen, Star, Activity, Gauge } from 'lucide-react';
import MetricCard from '../MetricCard';
import { useStatistics, useScrapingStats } from '../../hooks/useDatabase';

export default function StatisticsOverview() {
  const { data: stats, isLoading } = useStatistics();
  const { data: scrapingStats } = useScrapingStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <MetricCard
        title="کل اسناد"
        value={stats.totalItems}
        icon={FileText}
        color="blue"
      />

      <MetricCard
        title="اسناد امروز"
        value={stats.recentItems}
        icon={Activity}
        color="green"
      />

      <MetricCard
        title="دسته‌بندی‌ها"
        value={Object.keys(stats.categories).length}
        icon={FolderOpen}
        color="purple"
      />

      <MetricCard
        title="کیفیت متوسط"
        value={`${(stats.avgRating * 100).toFixed(0)}%`}
        icon={Star}
        color="yellow"
      />

      <MetricCard
        title="کارهای فعال"
        value={scrapingStats?.queue?.active ?? 0}
        icon={Gauge}
        color="red"
      />
    </div>
  );
}