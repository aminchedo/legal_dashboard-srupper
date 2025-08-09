import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';
import {
  CaretRightOutlined,
  ExperimentOutlined,
  FileTextOutlined as AntFileTextOutlined,
  BarChartOutlined,
  SettingOutlined,
  ExclamationOutlined,
  FolderOpenOutlined,
  StarOutlined,
  AreaChartOutlined,
  DashboardOutlined,
} from '@ant-design/icons';

// External UI and icons
import { Button } from '../../components/ui/button';
import Card from '../../components/ui/Card';
import {
  FileText as FileTextIcon,
  Briefcase,
  Server as ServerIcon,
  Activity as ActivityIcon,
  Settings as LucideSettings,
  ExternalLink,
  Calendar,
  Tag,
  Star,
  PlugZap,
  CloudLightning,
  HardDrive,
  MemoryStick,
} from 'lucide-react';

// Hooks and API
import { useScrapedItems, useStatistics, useScrapingJobs } from '../../hooks/useDatabase';
import { useProxies } from '../../hooks/useProxies';
import { apiClient } from '../../services/apiClient';

// Charts
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ========================================
// MERGED FROM: frontend/src/pages/Dashboard/DashboardPage.tsx
// ORIGINAL LINES: 1 to 43
// FUNCTIONALITY: Original dashboard composition importing sub-components
// ========================================
// import KeyMetrics from './components/KeyMetrics';
// import WeeklyProcessingChart from './charts/WeeklyProcessingChart';
// import RecentActivityFeed from './components/RecentActivityFeed';
// import QuickActions from './components/QuickActions';
// import SystemHealthPanel from './components/SystemHealthPanel';
// import { apiClient } from '../../services/apiClient';
// 
// export default function DashboardPage() {
//   return (
//     <div className="space-y-6">
//       {/* Page Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">نمای کلی سیستم</h1>
//         <p className="text-gray-600">آمار و گزارش کلی از وضعیت داده‌های جمع‌آوری شده</p>
//       </div>
// 
//       {/* Quick Actions */}
//       <QuickActions
//         onEmergencyStop={async () => {
//           try {
//             const base = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
//             await fetch(`${base}/scraping/stop`, { method: 'POST' });
//             alert('همه‌ی کارها متوقف شد');
//           } catch (e) {
//             alert('خطا در توقف اضطراری');
//           }
//         }}
//       />
// 
//       {/* System Health */}
//       <SystemHealthPanel />
// 
//       {/* Statistics Cards */}
//       <KeyMetrics />
// 
//       {/* Charts Section */}
//       <WeeklyProcessingChart />
// 
//       {/* Recent Activity */}
//       <RecentActivityFeed />
//     </div>
//   );
// }
// ========================================
// END MERGE FROM: frontend/src/pages/Dashboard/DashboardPage.tsx
// ========================================

// ========================================
// MERGED FROM: frontend/src/pages/Dashboard/components/KeyMetrics.tsx
// ORIGINAL LINES: 1 to 14
// FUNCTIONALITY: Small metrics card grid
// ========================================
// import { FileTextOutlined, FolderOpenOutlined, StarOutlined, AreaChartOutlined, DashboardOutlined } from '@ant-design/icons';
// import Card from '../../../components/ui/Card';
// 
// export default function KeyMetrics() {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//       <Card icon={<FileTextOutlined />} label="اسناد" value={0} />
//       <Card icon={<FolderOpenOutlined />} label="پوشه‌ها" value={0} />
//       <Card icon={<StarOutlined />} label="امتیاز متوسط" value={'-'} />
//       <Card icon={<AreaChartOutlined />} label="نمودارها" value={'-'} />
//       <Card icon={<DashboardOutlined />} label="وضعیت" value={'-'} />
//     </div>
//   );
// }
// ========================================
// END MERGE FROM: frontend/src/pages/Dashboard/components/KeyMetrics.tsx
// ========================================

// ========================================
// MERGED FROM: frontend/src/pages/Dashboard/components/QuickActions.tsx
// ORIGINAL LINES: 1 to 45
// FUNCTIONALITY: Quick navigation and action buttons
// ========================================
// import { useNavigate } from 'react-router-dom';
// import { 
//   CaretRightOutlined, 
//   ExperimentOutlined, 
//   FileTextOutlined, 
//   BarChartOutlined, 
//   SettingOutlined, 
//   ExclamationOutlined 
// } from '@ant-design/icons';
// import { Button } from '../../../components/ui/button';
// 
// interface Props {
//     onStartScraping?: () => void;
//     onTestProxy?: () => void;
//     onEmergencyStop?: () => void;
// }
// 
// export default function QuickActions({ onStartScraping, onTestProxy, onEmergencyStop }: Props) {
//     const navigate = useNavigate();
//     return (
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
//             <Button className="w-full" onClick={() => onStartScraping ? onStartScraping() : navigate('/jobs')}>
//                 <CaretRightOutlined className="ml-2" /> شروع اسکرپ جدید
//             </Button>
//             <Button className="w-full" variant="secondary" onClick={() => onTestProxy ? onTestProxy() : navigate('/proxies')}>
//                 <ExperimentOutlined className="ml-2" /> تست سامانه پروکسی
//             </Button>
//             <Button className="w-full" variant="outline" onClick={() => navigate('/documents')}>
//                 <FileTextOutlined className="ml-2" /> مشاهده اسناد اخیر
//             </Button>
//             <Button className="w-full" variant="ghost" onClick={() => navigate('/system')}>
//                 <BarChartOutlined className="ml-2" /> باز کردن تحلیل‌ها
//             </Button>
//             <Button className="w-full" variant="outline" onClick={() => navigate('/settings')}>
//                 <SettingOutlined className="ml-2" /> تنظیمات سیستم
//             </Button>
//             <Button className="w-full" variant="destructive" onClick={onEmergencyStop}>
//                 <ExclamationOutlined className="ml-2" /> توقف اضطراری همه
//             </Button>
//         </div>
//     );
// }
// ========================================
// END MERGE FROM: frontend/src/pages/Dashboard/components/QuickActions.tsx
// ========================================

// ========================================
// MERGED FROM: frontend/src/pages/Dashboard/components/RecentActivityFeed.tsx
// ORIGINAL LINES: 1 to 105
// FUNCTIONALITY: Displays last scraped items list
// ========================================
// import { LinkOutlined, CalendarOutlined, TagOutlined, StarOutlined } from '@ant-design/icons';
// import { useScrapedItems } from '../../hooks/useDatabase';
// import { format } from 'date-fns';
// import { faIR } from 'date-fns/locale';
// 
// export default function RecentActivity() {
//   const { data: items, isLoading } = useScrapedItems(10);
// 
//   if (isLoading) {
//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">آخرین فعالیت‌ها</h3>
//         <div className="space-y-4">
//           {[1, 2, 3].map(i => (
//             <div key={i} className="animate-pulse border-b border-gray-100 pb-4">
//               <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//               <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }
// 
//   if (!items || items.length === 0) {
//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">آخرین فعالیت‌ها</h3>
//         <div className="text-center py-8">
//           <p className="text-gray-500">هنوز آیتمی جمع‌آوری نشده است.</p>
//           <p className="text-sm text-gray-400 mt-2">از بخش وب اسکرپینگ استفاده کنید.</p>
//         </div>
//       </div>
//     );
//   }
// 
//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//       <h3 className="text-lg font-semibold text-gray-900 mb-6">آخرین فعالیت‌ها</h3>
//       
//       <div className="space-y-4">
//         {items.slice(0, 5).map((item, index) => (
//           <div key={item.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
//             <div className="flex items-start justify-between gap-4">
//               <div className="flex-1 min-w-0">
//                 <h4 className="font-medium text-gray-900 truncate mb-1">
//                   {item.title}
//                 </h4>
//                 
//                 <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
//                   <div className="flex items-center gap-1">
//                     <ExternalLink size={14} />
//                     <span className="truncate max-w-32">{item.domain}</span>
//                   </div>
//                   
//                   <div className="flex items-center gap-1">
//                     <Calendar size={14} />
//                     <span>{format(new Date(item.createdAt), 'yyyy/MM/dd', { locale: faIR })}</span>
//                   </div>
//                   
//                   <div className="flex items-center gap-1">
//                     <Star size={14} />
//                     <span>{(item.ratingScore * 100).toFixed(0)}%</span>
//                   </div>
//                 </div>
//                 
//                 <div className="flex items-center gap-2">
//                   <span className={`
//                     inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
//                     bg-blue-50 text-blue-700 border border-blue-200
//                   `}>
//                     <Tag size={12} />
//                     {item.category}
//                   </span>
//                   
//                   <span className="text-xs text-gray-500">
//                     {item.wordCount.toLocaleString('fa-IR')} کلمه
//                   </span>
//                 </div>
//               </div>
//               
//               <a
//                 href={item.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                 title="مشاهده اصل"
//               >
//                 <LinkOutlined />
//               </a>
//             </div>
//           </div>
//         ))}
//       </div>
//       
//       {items.length > 5 && (
//         <div className="mt-4 pt-4 border-t border-gray-100">
//           <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
//             مشاهده همه ({items.length.toLocaleString('fa-IR')} مورد)
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
// ========================================
// END MERGE FROM: frontend/src/pages/Dashboard/components/RecentActivityFeed.tsx
// ========================================

// ========================================
// MERGED FROM: frontend/src/pages/Dashboard/components/SystemHealthPanel.tsx
// ORIGINAL LINES: 1 to 118
// FUNCTIONALITY: Polls backend and displays health cards and resource gauges
// ========================================
// import { useEffect, useMemo, useState } from 'react';
// import { CloudServerOutlined, DatabaseOutlined, ThunderboltOutlined, CloudOutlined, HddOutlined, UsbOutlined } from '@ant-design/icons';
// 
// type Health = {
//     backend: 'online' | 'offline';
//     db: 'connected' | 'error' | 'unknown';
//     ws: 'connected' | 'disconnected';
//     proxy: 'good' | 'fair' | 'poor' | 'unknown';
//     storagePct: number;
//     memoryPct: number;
// };
// 
// export default function SystemHealth() {
//     const [health, setHealth] = useState<Health>({
//         backend: 'offline',
//         db: 'unknown',
//         ws: 'disconnected',
//         proxy: 'unknown',
//         storagePct: 0,
//         memoryPct: 0,
//     });
// 
//     useEffect(() => {
//         let alive = true;
//         async function poll() {
//             try {
//                 const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
//                 // Backend and DB via /health (root) and /scraping/health
//                 const [root, scraping] = await Promise.all([
//                     fetch(apiBase.replace('/api', '') + '/health').then(r => r.ok ? r.json() : Promise.reject()),
//                     fetch(`${apiBase}/scraping/health`).then(r => r.ok ? r.json() : Promise.reject()),
//                 ]);
//                 if (!alive) return;
//                 setHealth(prev => ({
//                     ...prev,
//                     backend: root?.status === 'ok' ? 'online' : 'offline',
//                     db: 'connected',
//                     proxy: (scraping?.queue?.failed || 0) > (scraping?.queue?.completed || 0) ? 'poor' : 'good',
//                     storagePct: Math.min(95, Math.max(5, Math.round(Math.random() * 70 + 20))),
//                     memoryPct: Math.min(98, Math.max(10, Math.round((scraping?.uptime || 0) % 70 + 20))),
//                 }));
//             } catch {
//                 if (!alive) return;
//                 setHealth(prev => ({ ...prev, backend: 'offline', db: 'error' }));
//             }
//         }
//         poll();
//         const t = setInterval(poll, 5000);
//         return () => { alive = false; clearInterval(t); };
//     }, []);
// 
//     const cards = useMemo(() => ([
//         {
//             title: 'سرور بک‌اند',
//             status: health.backend === 'online' ? 'آنلاین' : 'آفلاین',
//             icon: Server,
//             color: health.backend === 'online' ? 'text-green-700 bg-green-50 border-green-200' : 'text-red-700 bg-red-50 border-red-200',
//         },
//         {
//             title: 'اتصال دیتابیس',
//             status: health.db === 'connected' ? 'متصل' : health.db === 'error' ? 'خطا' : 'نامشخص',
//             icon: Database,
//             color: health.db === 'connected' ? 'text-green-700 bg-green-50 border-green-200' : 'text-yellow-700 bg-yellow-50 border-yellow-200',
//         },
//         {
//             title: 'اتصال وب‌سوکت',
//             status: health.ws === 'connected' ? 'متصل' : 'قطع',
//             icon: PlugZap,
//             color: health.ws === 'connected' ? 'text-green-700 bg-green-50 border-green-200' : 'text-gray-700 bg-gray-50 border-gray-200',
//         },
//         {
//             title: 'سلامت پروکسی',
//             status: health.proxy === 'good' ? 'خوب' : health.proxy === 'fair' ? 'متوسط' : health.proxy === 'poor' ? 'ضعیف' : 'نامشخص',
//             icon: CloudLightning,
//             color: health.proxy === 'good' ? 'text-green-700 bg-green-50 border-green-200' : health.proxy === 'poor' ? 'text-red-700 bg-red-50 border-red-200' : 'text-yellow-700 bg-yellow-50 border-yellow-200',
//         },
//     ]), [health]);
// 
//     return (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {cards.map((c) => {
//                 const Icon = c.icon;
//                 return (
//                     <div key={c.title} className={`rounded-xl border p-4 flex items-center gap-3 ${c.color}`}>
//                         <Icon size={20} />
//                         <div>
//                             <div className="text-sm font-medium">{c.title}</div>
//                             <div className="text-base">{c.status}</div>
//                         </div>
//                     </div>
//                 );
//             })}
//             <div className="rounded-xl border border-gray-200 p-4 bg-white flex items-center gap-3">
//                 <HardDrive size={20} className="text-gray-600" />
//                 <div className="flex-1">
//                     <div className="text-sm text-gray-600">فضای ذخیره‌سازی</div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                         <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${health.storagePct}%` }} />
//                     </div>
//                 </div>
//                 <div className="text-sm font-medium text-gray-700">{health.storagePct}%</div>
//             </div>
//             <div className="rounded-xl border border-gray-200 p-4 bg-white flex items-center gap-3">
//                 <MemoryStick size={20} className="text-gray-600" />
//                 <div className="flex-1">
//                     <div className="text-sm text-gray-600">مصرف حافظه</div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                         <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${health.memoryPct}%` }} />
//                     </div>
//                 </div>
//                 <div className="text-sm font-medium text-gray-700">{health.memoryPct}%</div>
//             </div>
//         </div>
//     );
// }
// ========================================
// END MERGE FROM: frontend/src/pages/Dashboard/components/SystemHealthPanel.tsx
// ========================================

// ========================================
// MERGED FROM: frontend/src/pages/Dashboard/charts/WeeklyProcessingChart.tsx
// ORIGINAL LINES: 1 to 122
// FUNCTIONALITY: Stats charts using Recharts
// ========================================
// // Charts temporarily disabled for build stability
// // import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { useStatistics } from '../../../hooks/useDatabase';
// 
// const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'];
// 
// export default function ChartsSection() {
//   const { data: stats, isLoading } = useStatistics();
// 
//   if (isLoading) {
//     return (
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-96 animate-pulse"></div>
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-96 animate-pulse"></div>
//       </div>
//     );
//   }
// 
//   if (!stats) {
//     return (
//       <div className="text-center col-span-2 p-12 bg-gray-50 rounded-lg">
//         <h3 className="text-lg font-medium text-gray-900">داده‌ای برای نمایش وجود ندارد</h3>
//         <p className="text-gray-500 mt-1">پس از جمع‌آوری داده، نمودارها در این بخش نمایش داده خواهند شد.</p>
//       </div>
//     );
//   }
// 
//   const categoryData = Object.entries(stats.categories).map(([name, value]) => ({
//     name,
//     value
//   }));
// 
//   const domainData = Object.entries(stats.topDomains).slice(0, 8).map(([name, value]) => ({
//     name: name.replace('www.', ''),
//     value
//   }));
// 
//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//       {/* Categories Pie Chart */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">توزیع دسته‌بندی‌ها</h3>
//         {categoryData.length > 0 ? (
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={categoryData}
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={60}
//                 outerRadius={120}
//                 paddingAngle={2}
//                 dataKey="value"
//               >
//                 {categoryData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip
//                 formatter={(value: any, name: any) => [`${value} مورد`, name]}
//                 labelStyle={{ color: '#374151' }}
//               />
//             </PieChart>
//           </ResponsiveContainer>
//         ) : (
//           <div className="flex items-center justify-center h-64 text-gray-500">
//             هنوز داده‌ای برای نمایش وجود ندارد
//           </div>
//         )}
// 
//         {/* Legend */}
//         {categoryData.length > 0 && (
//           <div className="flex flex-wrap gap-2 mt-4">
//             {categoryData.map((entry, index) => (
//               <div key={entry.name} className="flex items-center gap-2">
//                 <div
//                   className="w-3 h-3 rounded-full"
//                   style={{ backgroundColor: COLORS[index % COLORS.length] }}
//                 />
//                 <span className="text-sm text-gray-600">{entry.name}</span>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
// 
//       {/* Top Domains Bar Chart */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">برترین منابع</h3>
//         {domainData.length > 0 ? (
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={domainData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
//               <XAxis
//                 dataKey="name"
//                 angle={-45}
//                 textAnchor="end"
//                 height={80}
//                 fontSize={12}
//                 stroke="#6B7280"
//               />
//               <YAxis stroke="#6B7280" />
//               <Tooltip
//                 formatter={(value: any) => [`${value} مورد`, 'تعداد']}
//                 labelStyle={{ color: '#374151' }}
//               />
//               <Bar
//                 dataKey="value"
//                 fill="#3B82F6"
//                 radius={[4, 4, 0, 0]}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         ) : (
//           <div className="flex items-center justify-center h-64 text-gray-500">
//             هنوز داده‌ای برای نمایش وجود ندارد
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// ========================================
// END MERGE FROM: frontend/src/pages/Dashboard/charts/WeeklyProcessingChart.tsx
// ========================================

// Functional integrated components (non-exported), preserving original behavior

function QuickActions({ onStartScraping, onTestProxy, onEmergencyStop }: { onStartScraping?: () => void; onTestProxy?: () => void; onEmergencyStop?: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <Button className="w-full" onClick={() => (onStartScraping ? onStartScraping() : navigate('/jobs'))}>
        <CaretRightOutlined className="ml-2" /> شروع اسکرپ جدید
      </Button>
      <Button className="w-full" variant="secondary" onClick={() => (onTestProxy ? onTestProxy() : navigate('/proxies'))}>
        <ExperimentOutlined className="ml-2" /> تست سامانه پروکسی
      </Button>
      <Button className="w-full" variant="outline" onClick={() => navigate('/documents')}>
        <AntFileTextOutlined className="ml-2" /> مشاهده اسناد اخیر
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

function SystemHealthPanel() {
  type Health = {
    backend: 'online' | 'offline';
    db: 'connected' | 'error' | 'unknown';
    ws: 'connected' | 'disconnected';
    proxy: 'good' | 'fair' | 'poor' | 'unknown';
    storagePct: number;
    memoryPct: number;
  };

  const [health, setHealth] = useState<Health>({
    backend: 'offline',
    db: 'unknown',
    ws: 'disconnected',
    proxy: 'unknown',
    storagePct: 0,
    memoryPct: 0,
  });

  useEffect(() => {
    let alive = true;
    async function poll() {
      try {
        const apiBase = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';
        const [root, scraping] = await Promise.all([
          fetch(apiBase.replace('/api', '') + '/health').then((r) => (r.ok ? r.json() : Promise.reject())),
          fetch(`${apiBase}/scraping/health`).then((r) => (r.ok ? r.json() : Promise.reject())),
        ]);
        if (!alive) return;
        setHealth((prev) => ({
          ...prev,
          backend: root?.status === 'ok' ? 'online' : 'offline',
          db: 'connected',
          proxy: (scraping?.queue?.failed || 0) > (scraping?.queue?.completed || 0) ? 'poor' : 'good',
          storagePct: Math.min(95, Math.max(5, Math.round(Math.random() * 70 + 20))),
          memoryPct: Math.min(98, Math.max(10, Math.round((scraping?.uptime || 0) % 70 + 20))),
        }));
      } catch {
        if (!alive) return;
        setHealth((prev) => ({ ...prev, backend: 'offline', db: 'error' }));
      }
    }
    poll();
    const t = setInterval(poll, 5000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const cards = useMemo(
    () => [
      {
        title: 'سرور بک‌اند',
        status: health.backend === 'online' ? 'آنلاین' : 'آفلاین',
        icon: ServerIcon,
        color:
          health.backend === 'online'
            ? 'text-green-700 bg-green-50 border-green-200'
            : 'text-red-700 bg-red-50 border-red-200',
      },
      {
        title: 'اتصال دیتابیس',
        status: health.db === 'connected' ? 'متصل' : health.db === 'error' ? 'خطا' : 'نامشخص',
        icon: ServerIcon,
        color:
          health.db === 'connected'
            ? 'text-green-700 bg-green-50 border-green-200'
            : 'text-yellow-700 bg-yellow-50 border-yellow-200',
      },
      {
        title: 'اتصال وب‌سوکت',
        status: health.ws === 'connected' ? 'متصل' : 'قطع',
        icon: PlugZap,
        color:
          health.ws === 'connected'
            ? 'text-green-700 bg-green-50 border-green-200'
            : 'text-gray-700 bg-gray-50 border-gray-200',
      },
      {
        title: 'سلامت پروکسی',
        status:
          health.proxy === 'good' ? 'خوب' : health.proxy === 'fair' ? 'متوسط' : health.proxy === 'poor' ? 'ضعیف' : 'نامشخص',
        icon: CloudLightning,
        color:
          health.proxy === 'good'
            ? 'text-green-700 bg-green-50 border-green-200'
            : health.proxy === 'poor'
            ? 'text-red-700 bg-red-50 border-red-200'
            : 'text-yellow-700 bg-yellow-50 border-yellow-200',
      },
    ],
    [health]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon as any;
        return (
          <div key={c.title} className={`rounded-xl border p-4 flex items-center gap-3 ${c.color}`}>
            <Icon size={20} />
            <div>
              <div className="text-sm font-medium">{c.title}</div>
              <div className="text-base">{c.status}</div>
            </div>
          </div>
        );
      })}
      <div className="rounded-xl border border-gray-200 p-4 bg-white flex items-center gap-3">
        <HardDrive size={20} className="text-gray-600" />
        <div className="flex-1">
          <div className="text-sm text-gray-600">فضای ذخیره‌سازی</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${health.storagePct}%` }} />
          </div>
        </div>
        <div className="text-sm font-medium text-gray-700">{health.storagePct}%</div>
      </div>
      <div className="rounded-xl border border-gray-200 p-4 bg-white flex items-center gap-3">
        <MemoryStick size={20} className="text-gray-600" />
        <div className="flex-1">
          <div className="text-sm text-gray-600">مصرف حافظه</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${health.memoryPct}%` }} />
          </div>
        </div>
        <div className="text-sm font-medium text-gray-700">{health.memoryPct}%</div>
      </div>
    </div>
  );
}

function KeyMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card icon={<AntFileTextOutlined />} label="اسناد" value={0} />
      <Card icon={<FolderOpenOutlined />} label="پوشه‌ها" value={0} />
      <Card icon={<StarOutlined />} label="امتیاز متوسط" value={'-'} />
      <Card icon={<AreaChartOutlined />} label="نمودارها" value={'-'} />
      <Card icon={<DashboardOutlined />} label="وضعیت" value={'-'} />
    </div>
  );
}

function RecentActivityFeed() {
  const { data: items, isLoading } = useScrapedItems(10);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">آخرین فعالیت‌ها</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse border-b border-gray-100 pb-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">آخرین فعالیت‌ها</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">هنوز آیتمی جمع‌آوری نشده است.</p>
          <p className="text-sm text-gray-400 mt-2">از بخش وب اسکرپینگ استفاده کنید.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">آخرین فعالیت‌ها</h3>
      <div className="space-y-4">
        {items.slice(0, 5).map((item: any) => (
          <div key={item.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate mb-1">{item.title}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                  <div className="flex items-center gap-1">
                    <ExternalLink size={14} />
                    <span className="truncate max-w-32">{item.domain}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{format(new Date(item.createdAt), 'yyyy/MM/dd', { locale: faIR })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={14} />
                    <span>{(item.ratingScore * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    <Tag size={12} />
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-500">{item.wordCount.toLocaleString('fa-IR')} کلمه</span>
                </div>
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="مشاهده اصل"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>
      {items.length > 5 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            مشاهده همه ({items.length.toLocaleString('fa-IR')} مورد)
          </button>
        </div>
      )}
    </div>
  );
}

function WeeklyProcessingChart() {
  const { data: stats, isLoading } = useStatistics();
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-96 animate-pulse"></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-96 animate-pulse"></div>
      </div>
    );
  }
  if (!stats) {
    return (
      <div className="text-center col-span-2 p-12 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900">داده‌ای برای نمایش وجود ندارد</h3>
        <p className="text-gray-500 mt-1">پس از جمع‌آوری داده، نمودارها در این بخش نمایش داده خواهند شد.</p>
      </div>
    );
  }
  const categoryData = Object.entries(stats.categories).map(([name, value]) => ({ name, value }));
  const domainData = Object.entries(stats.topDomains)
    .slice(0, 8)
    .map(([name, value]) => ({ name: (name as string).replace('www.', ''), value }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">توزیع دسته‌بندی‌ها</h3>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={120} paddingAngle={2} dataKey="value">
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any, name: any) => [`${value} مورد`, name]} labelStyle={{ color: '#374151' }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">هنوز داده‌ای برای نمایش وجود ندارد</div>
        )}
        {categoryData.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {categoryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm text-gray-600">{entry.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">برترین منابع</h3>
        {domainData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={domainData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip formatter={(value: any) => [`${value} مورد`, 'تعداد']} labelStyle={{ color: '#374151' }} />
              <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">هنوز داده‌ای برای نمایش وجود ندارد</div>
        )}
      </div>
    </div>
  );
}

// Navigation Card for the hub
interface NavigationCardProps {
  title: string;
  path: string;
  icon: React.ComponentType<any>;
  description: string;
  count?: number;
  status?: string;
  onClick: () => void;
}

function NavigationCard({ title, icon: Icon, description, count, status, onClick }: NavigationCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-4 border border-gray-200 hover:border-blue-300" onClick={onClick}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-6 h-6 text-blue-600" />
        {typeof count === 'number' && (
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{count}</span>
        )}
        {status && (
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              status === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {status === 'healthy' ? 'سالم' : 'خطا'}
          </span>
        )}
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function NavigationHub({ documentsCount, activeJobsCount, activeProxiesCount, systemStatus }: { documentsCount: number; activeJobsCount: number; activeProxiesCount: number; systemStatus: string }) {
  const navigate = useNavigate();
  const navigationItems = [
    {
      title: 'مدیریت اسناد',
      path: '/documents',
      icon: FileTextIcon,
      description: 'مدیریت و بررسی اسناد حقوقی',
      count: documentsCount,
    },
    {
      title: 'پردازش پرونده‌ها',
      path: '/jobs',
      icon: Briefcase,
      description: 'مدیریت پرونده‌ها و وضعیت پردازش',
      count: activeJobsCount,
    },
    {
      title: 'مدیریت پروکسی',
      path: '/proxies',
      icon: ServerIcon,
      description: 'تنظیمات و وضعیت پروکسی‌ها',
      count: activeProxiesCount,
    },
    {
      title: 'سلامت سیستم',
      path: '/system',
      icon: ActivityIcon,
      description: 'نظارت بر عملکرد سیستم',
      status: systemStatus,
    },
    {
      title: 'تنظیمات',
      path: '/settings',
      icon: LucideSettings,
      description: 'تنظیمات سیستم و کاربری',
    },
  ];

  return (
    <div className="navigation-hub-section">
      <h2 className="text-xl font-bold mb-4">دسترسی سریع به بخش‌ها</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {navigationItems.map((item) => (
          <NavigationCard key={item.path} {...item} onClick={() => navigate(item.path)} />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  // Queries for NavigationHub counts
  const { data: stats } = useStatistics();
  const { data: jobsData } = useScrapingJobs({});
  const { data: proxies } = useProxies({});

  const documentsCount = stats?.totalItems || 0;
  const activeJobsCount = (jobsData as any)?.jobs?.length || 0;
  const activeProxiesCount = (proxies || []).length;
  const systemStatus = stats ? 'healthy' : 'unknown';

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">نمای کلی سیستم</h1>
        <p className="text-gray-600">آمار و گزارش کلی از وضعیت داده‌های جمع‌آوری شده</p>
      </div>

      <QuickActions
        onEmergencyStop={async () => {
          try {
            const base = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';
            await fetch(`${base}/scraping/stop`, { method: 'POST' });
            alert('همه‌ی کارها متوقف شد');
          } catch (e) {
            alert('خطا در توقف اضطراری');
          }
        }}
      />

      <NavigationHub
        documentsCount={documentsCount}
        activeJobsCount={activeJobsCount}
        activeProxiesCount={activeProxiesCount}
        systemStatus={systemStatus}
      />

      <SystemHealthPanel />
      <KeyMetrics />
      <WeeklyProcessingChart />
      <RecentActivityFeed />
    </div>
  );
}