import { FileTextOutlined, FolderOpenOutlined, StarOutlined, AreaChartOutlined, DashboardOutlined } from '@ant-design/icons';
import Card from '../../../components/ui/Card';

export default function KeyMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card icon={<FileTextOutlined />} label="اسناد" value={0} />
      <Card icon={<FolderOpenOutlined />} label="پوشه‌ها" value={0} />
      <Card icon={<StarOutlined />} label="امتیاز متوسط" value={'-'} />
      <Card icon={<AreaChartOutlined />} label="نمودارها" value={'-'} />
      <Card icon={<DashboardOutlined />} label="وضعیت" value={'-'} />
    </div>
  );
}