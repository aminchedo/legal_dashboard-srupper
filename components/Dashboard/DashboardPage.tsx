import StatisticsOverview from './StatisticsOverview';
import ChartsSection from './ChartsSection';
import RecentActivity from './RecentActivity';
import QuickActions from './QuickActions';
import SystemHealth from './SystemHealth';
import { apiClient } from '../../lib/apiClient';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">نمای کلی سیستم</h1>
        <p className="text-gray-600">آمار و گزارش کلی از وضعیت داده‌های جمع‌آوری شده</p>
      </div>

      {/* Quick Actions */}
      <QuickActions
        onEmergencyStop={async () => {
          try {
            const base = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
            await fetch(`${base}/scraping/stop`, { method: 'POST' });
            alert('همه‌ی کارها متوقف شد');
          } catch (e) {
            alert('خطا در توقف اضطراری');
          }
        }}
      />

      {/* System Health */}
      <SystemHealth />

      {/* Statistics Cards */}
      <StatisticsOverview />

      {/* Charts Section */}
      <ChartsSection />

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}