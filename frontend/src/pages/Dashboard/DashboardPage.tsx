import KeyMetrics from './components/KeyMetrics';
import WeeklyProcessingChart from './charts/WeeklyProcessingChart';
import RecentActivityFeed from './components/RecentActivityFeed';
import QuickActions from './components/QuickActions';
import SystemHealthPanel from './components/SystemHealthPanel';
import { apiClient } from '../../services/apiClient';

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
      <SystemHealthPanel />

      {/* Statistics Cards */}
      <KeyMetrics />

      {/* Charts Section */}
      <WeeklyProcessingChart />

      {/* Recent Activity */}
      <RecentActivityFeed />
    </div>
  );
}