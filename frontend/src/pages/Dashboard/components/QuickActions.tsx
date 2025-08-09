import { useNavigate } from 'react-router-dom';
import { 
  CaretRightOutlined, 
  ExperimentOutlined, 
  FileTextOutlined, 
  BarChartOutlined, 
  SettingOutlined, 
  ExclamationOutlined 
} from '@ant-design/icons';
import { Button } from '../../../components/ui/button';

interface Props {
    onStartScraping?: () => void;
    onTestProxy?: () => void;
    onEmergencyStop?: () => void;
}

export default function QuickActions({ onStartScraping, onTestProxy, onEmergencyStop }: Props) {
    const navigate = useNavigate();
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button className="w-full" onClick={() => onStartScraping ? onStartScraping() : navigate('/jobs')}>
                <CaretRightOutlined className="ml-2" /> شروع اسکرپ جدید
            </Button>
            <Button className="w-full" variant="secondary" onClick={() => onTestProxy ? onTestProxy() : navigate('/proxies')}>
                <ExperimentOutlined className="ml-2" /> تست سامانه پروکسی
            </Button>
            <Button className="w-full" variant="outline" onClick={() => navigate('/documents')}>
                <FileTextOutlined className="ml-2" /> مشاهده اسناد اخیر
            </Button>
            <Button className="w-full" variant="ghost" onClick={() => navigate('/system')}>
                <BarChartOutlined className="ml-2" /> باز کردن تحلیل‌ها
            </Button>
            <Button className="w-full" variant="outline" onClick={() => navigate('/settings')}>
                <SettingOutlined className="ml-2" /> تنظیمات سیستم
            </Button>
            <Button className="w-full" variant="destructive" onClick={onEmergencyStop}>
                <ExclamationOutlined className="ml-2" /> توقف اضطراری همه
            </Button>
        </div>
    );
}


