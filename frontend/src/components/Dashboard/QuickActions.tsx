import { useNavigate } from 'react-router-dom';
import { CaretRightOutlined, ExperimentOutlined, FileTextOutlined, BarChartOutlined, SettingOutlined, ExclamationOutlined } from '@ant-design/icons';
import { Play, FlaskConical, FileText, BarChart3, Settings, OctagonAlert } from '../../utils/iconRegistry';
import { Button } from '../ui/button';

interface Props {
    onStartScraping?: () => void;
    onTestProxy?: () => void;
    onEmergencyStop?: () => void;
}

export default function QuickActions({ onStartScraping, onTestProxy, onEmergencyStop }: Props) {
    const navigate = useNavigate();
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button className="w-full" onClick={() => onStartScraping ? onStartScraping() : navigate('/scraping')}>
                <Play size={16} className="ml-2" /> شروع اسکرپ جدید
            </Button>
            <Button className="w-full" variant="secondary" onClick={() => onTestProxy ? onTestProxy() : navigate('/proxies')}>
                <FlaskConical size={16} className="ml-2" /> تست سامانه پروکسی
            </Button>
            <Button className="w-full" variant="outline" onClick={() => navigate('/data')}>
                <FileText size={16} className="ml-2" /> مشاهده اسناد اخیر
            </Button>
            <Button className="w-full" variant="ghost" onClick={() => navigate('/analytics')}>
                <BarChart3 size={16} className="ml-2" /> باز کردن تحلیل‌ها
            </Button>
            <Button className="w-full" variant="outline" onClick={() => navigate('/settings')}>
                <Settings size={16} className="ml-2" /> تنظیمات سیستم
            </Button>
            <Button className="w-full" variant="destructive" onClick={onEmergencyStop}>
                <OctagonAlert size={16} className="ml-2" /> توقف اضطراری همه
            </Button>
        </div>
    );
}


