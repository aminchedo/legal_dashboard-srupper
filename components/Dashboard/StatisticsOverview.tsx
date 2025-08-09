import { FileTextOutlined, FolderOpenOutlined, StarOutlined, AreaChartOutlined, DashboardOutlined } from '@ant-design/icons';
import MetricCard from '../MetricCard';

export default function StatisticsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <MetricCard icon={<FileTextOutlined />} label="اسناد" value={0} />
      <MetricCard icon={<FolderOpenOutlined />} label="پوشه‌ها" value={0} />
      <MetricCard icon={<StarOutlined />} label="امتیاز متوسط" value={'-'} />
      <MetricCard icon={<AreaChartOutlined />} label="نمودارها" value={'-'} />
      <MetricCard icon={<DashboardOutlined />} label="وضعیت" value={'-'} />
    </div>
  );
}