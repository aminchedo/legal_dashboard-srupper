import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Square, 
  Settings, 
  Globe, 
  Database,
  Activity,
  Zap,
  Brain,
  Search,
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  BarChart3,
  Server,
  Wifi,
  WifiOff,
  Plus,
  RefreshCw,
  Gauge,
  Target,
  Wrench,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  Layers
} from 'lucide-react';

// Types based on actual backend API
interface ScrapingJob {
  id: string;
  url: string;
  source_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  result?: {
    documentsCreated: number;
    pagesProcessed: number;
    bytesProcessed: number;
  };
  error?: string;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
  created_by: string;
}

interface ScrapingSource {
  id: string;
  name: string;
  base_url: string;
  url?: string;
  category?: string;
  priority?: number;
  status?: string;
  selectors: {
    content: string;
    title?: string;
    date?: string;
    category?: string;
    next_page?: string;
  };
  headers?: Record<string, string>;
  created_at: string;
  updated_at?: string;
}

interface ScrapingLog {
  id: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  details?: string;
  source?: string;
  jobId?: string;
}

interface ScrapingSettings {
  maxPages: number;
  delay: number;
  minContentLength: number;
  enableRating: boolean;
  intelligentMode: boolean;
  useProxies: boolean;
  parallelJobs: number;
  contentFilter: string[];
  language: 'fa' | 'en' | 'auto';
  depth: number;
  userAgent: string;
}

interface SystemHealth {
  status: string;
  queue: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  };
  perSource: Array<{
    source: string;
    count: number;
  }>;
  uptime: number;
}

// Sub-components for better organization
const ConnectionStatus: React.FC<{ isConnected: boolean }> = ({ isConnected }) => (
  <div
    className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium ${
      isConnected
        ? 'bg-green-100 text-green-800 border border-green-200'
        : 'bg-red-100 text-red-800 border border-red-200'
    }`}
  >
    {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
    <span>{isConnected ? 'متصل' : 'قطع'}</span>
  </div>
);

const SystemHealthCard: React.FC<{ 
  icon: React.ReactNode; 
  value: number; 
  label: string; 
  color: string;
}> = ({ icon, value, label, color }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className={`p-2 rounded-lg ${color}`}>
        {icon}
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-600">{label}</div>
      </div>
    </div>
  </div>
);

const LogEntry: React.FC<{ log: ScrapingLog }> = ({ log }) => {
  const getLogStyle = (type: ScrapingLog['type']) => {
    switch (type) {
      case 'success': 
        return {
          icon: <CheckCircle size={16} className="text-green-600" />,
          bg: 'bg-green-50 border-green-200 text-green-800'
        };
      case 'error': 
        return {
          icon: <XCircle size={16} className="text-red-600" />,
          bg: 'bg-red-50 border-red-200 text-red-800'
        };
      case 'warning': 
        return {
          icon: <AlertCircle size={16} className="text-yellow-600" />,
          bg: 'bg-yellow-50 border-yellow-200 text-yellow-800'
        };
      default: 
        return {
          icon: <Activity size={16} className="text-blue-600" />,
          bg: 'bg-blue-50 border-blue-200 text-blue-800'
        };
    }
  };

  const style = getLogStyle(log.type);

  return (
    <div className={`p-4 rounded-lg border ${style.bg} transition-all duration-200 hover:shadow-sm`}>
      <div className="flex items-start gap-3">
        {style.icon}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium truncate">{log.message}</h4>
            <span className="text-xs opacity-75 whitespace-nowrap mr-2">
              {log.timestamp.toLocaleTimeString('fa-IR')}
            </span>
          </div>
          {log.details && (
            <p className="text-sm opacity-90">{log.details}</p>
          )}
          {(log.source || log.jobId) && (
            <div className="flex gap-4 mt-2 text-xs opacity-75">
              {log.source && <span>منبع: {log.source}</span>}
              {log.jobId && <span>Job: {log.jobId}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SourceSelector: React.FC<{
  sources: ScrapingSource[];
  selectedSources: string[];
  onSelectionChange: (sourceId: string) => void;
  disabled?: boolean;
}> = ({ sources, selectedSources, onSelectionChange, disabled = false }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Globe size={20} className="text-blue-600" />
        منابع موجود
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
          {sources.length}
        </span>
      </h3>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
      {sources.map((source) => (
        <label 
          key={source.id} 
          className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          } ${
            selectedSources.includes(source.id)
              ? 'border-blue-500 bg-blue-50 shadow-sm'
              : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
          }`}
        >
          <input
            type="checkbox"
            checked={selectedSources.includes(source.id)}
            onChange={() => !disabled && onSelectionChange(source.id)}
            disabled={disabled}
            className="absolute top-3 left-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            aria-labelledby={`source-${source.id}-label`}
          />
          
          <div className="mr-8">
            <div className="flex items-center gap-2 mb-2">
              <h4 id={`source-${source.id}-label`} className="font-medium text-gray-900 text-sm">
                {source.name}
              </h4>
              <span className={`px-2 py-1 text-xs rounded-full border ${
                source.status === 'active' 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}>
                {source.status === 'active' ? 'فعال' : 'غیرفعال'}
              </span>
            </div>
            
            <div className="text-xs text-gray-600 space-y-1">
              <div>دسته: {source.category || 'نامعلوم'}</div>
              <div className="truncate">URL: {source.url || source.base_url}</div>
              <div>اولویت: {source.priority || 2}</div>
            </div>
          </div>
        </label>
      ))}
    </div>
  </div>
);

const SettingsPanel: React.FC<{
  settings: ScrapingSettings;
  onSettingsChange: (settings: ScrapingSettings) => void;
  disabled?: boolean;
}> = ({ settings, onSettingsChange, disabled = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateSetting = (key: keyof ScrapingSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-lg font-semibold text-gray-900 mb-4"
      >
        <div className="flex items-center gap-2">
          <Settings size={20} className="text-gray-600" />
          تنظیمات
        </div>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isExpanded && (
        <div className="space-y-6">
          {/* Basic Settings */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                حداکثر صفحات هر منبع: {settings.maxPages}
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={settings.maxPages}
                onChange={(e) => updateSetting('maxPages', parseInt(e.target.value))}
                disabled={disabled}
                className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عمق اسکریپینگ: {settings.depth}
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={settings.depth}
                onChange={(e) => updateSetting('depth', parseInt(e.target.value))}
                disabled={disabled}
                className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تأخیر (ثانیه): {settings.delay}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={settings.delay}
                onChange={(e) => updateSetting('delay', parseInt(e.target.value))}
                disabled={disabled}
                className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer disabled:opacity-50"
              />
            </div>
          </div>

          {/* Advanced Options */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">گزینه‌های پیشرفته</h4>
            
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.intelligentMode}
                onChange={(e) => updateSetting('intelligentMode', e.target.checked)}
                disabled={disabled}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
              />
              <span className="text-sm text-gray-700">حالت هوشمند</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.useProxies}
                onChange={(e) => updateSetting('useProxies', e.target.checked)}
                disabled={disabled}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
              />
              <span className="text-sm text-gray-700">استفاده از پروکسی</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.enableRating}
                onChange={(e) => updateSetting('enableRating', e.target.checked)}
                disabled={disabled}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
              />
              <span className="text-sm text-gray-700">رتبه‌بندی کیفیت</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

const JobStatus: React.FC<{ 
  jobs: ScrapingJob[]; 
  isActive: boolean;
}> = ({ jobs, isActive }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'running': return 'text-blue-600';
      case 'failed': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} />;
      case 'running': return <Activity size={16} className="animate-spin" />;
      case 'failed': return <XCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  if (!jobs.length && !isActive) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Activity size={20} className="text-blue-600" />
        Jobs فعال
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
          {jobs.length}
        </span>
      </h3>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {jobs.slice(0, 10).map((job) => (
          <div key={job.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <span className={getStatusColor(job.status)}>
                {getStatusIcon(job.status)}
              </span>
              <p className="font-medium text-gray-900 truncate text-sm">{job.url}</p>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span>پیشرفت: {job.progress}%</span>
              <span>وضعیت: {job.status}</span>
              {job.result && <span>اسناد: {job.result.documentsCreated}</span>}
            </div>
            
            {job.progress > 0 && job.progress < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                <div 
                  className="bg-blue-600 h-1 rounded-full transition-all duration-500"
                  style={{ width: `${job.progress}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Component
const ScrapingPage: React.FC = () => {
  // State Management
  const [isScrapingActive, setIsScrapingActive] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [availableSources, setAvailableSources] = useState<ScrapingSource[]>([]);
  const [activeJobs, setActiveJobs] = useState<ScrapingJob[]>([]);
  const [scrapingLogs, setScrapingLogs] = useState<ScrapingLog[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [filterLogs, setFilterLogs] = useState<string>('all');
  
  const [settings, setSettings] = useState<ScrapingSettings>({
    maxPages: 10,
    delay: 2,
    minContentLength: 100,
    enableRating: true,
    intelligentMode: true,
    useProxies: true,
    parallelJobs: 3,
    contentFilter: ['article', 'news', 'legal'],
    language: 'auto',
    depth: 5,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });

  const logsEndRef = useRef<HTMLDivElement>(null);
  const ws = useRef<WebSocket | null>(null);

  // API Configuration
  const API_BASE = 'http://localhost:3000/api';
  
  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
          ...options.headers,
        },
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Call failed:', error);
      addLog('error', 'خطا در اتصال به سرور', error instanceof Error ? error.message : 'خطای ناشناخته');
      throw error;
    }
  };

  // Core Functions
  const addLog = useCallback((type: ScrapingLog['type'], message: string, details?: string, source?: string, jobId?: string) => {
    const newLog: ScrapingLog = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      type,
      message,
      details,
      source,
      jobId
    };
    setScrapingLogs(prev => [newLog, ...prev.slice(0, 199)]);
  }, []);

  const loadSources = async () => {
    try {
      const data = await apiCall('/scraping/sources');
      setAvailableSources(data.sources || []);
      addLog('success', 'منابع بارگذاری شدند', `${data.sources?.length || 0} منبع یافت شد`);
    } catch (error) {
      addLog('error', 'خطا در بارگذاری منابع', 'امکان دریافت لیست منابع وجود ندارد');
    }
  };

  const loadJobs = async () => {
    try {
      const data = await apiCall('/scraping/status?limit=50');
      setActiveJobs(data.jobs || []);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    }
  };

  const loadSystemHealth = async () => {
    try {
      const data = await apiCall('/scraping/health');
      setSystemHealth(data);
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
      console.error('Failed to load system health:', error);
    }
  };

  const startScraping = async () => {
    if (selectedSources.length === 0) {
      addLog('warning', 'لطفاً حداقل یک منبع انتخاب کنید', 'برای شروع عملیات اسکریپینگ باید منابع مورد نظر را انتخاب نمایید');
      return;
    }

    setIsScrapingActive(true);
    addLog('info', 'شروع عملیات اسکریپینگ واقعی', `${selectedSources.length} منبع انتخاب شده`);

    try {
      const jobPromises = selectedSources.map(async (sourceId) => {
        const source = availableSources.find(s => s.id === sourceId);
        if (!source) return null;

        const jobData = {
          url: source.url || source.base_url,
          sourceId: source.id,
          depth: settings.depth,
          filters: {
            contentTypes: settings.contentFilter,
            keywords: []
          }
        };

        const response = await apiCall('/scraping/start', {
          method: 'POST',
          body: JSON.stringify(jobData)
        });

        addLog('success', `شروع اسکریپینگ ${source.name}`, `Job ID: ${response.jobId}`);
        return response.jobId;
      });

      const jobIds = await Promise.all(jobPromises);
      const validJobIds = jobIds.filter(Boolean);

      addLog('info', 'همه job ها آغاز شدند', `${validJobIds.length} job در صف اجرا`);
      
      if (validJobIds.length > 0) {
        startJobMonitoring(validJobIds);
      }

    } catch (error) {
      addLog('error', 'خطا در شروع اسکریپینگ', error instanceof Error ? error.message : 'خطای ناشناخته');
      setIsScrapingActive(false);
    }
  };

  const startJobMonitoring = (jobIds: string[]) => {
    const monitorJobs = async () => {
      try {
        const jobStatuses = await Promise.all(
          jobIds.map(jobId => apiCall(`/scraping/status/${jobId}`))
        );

        let allCompleted = true;

        jobStatuses.forEach((job) => {
          if (job && job.status !== 'completed' && job.status !== 'failed') {
            allCompleted = false;
          }

          if (job?.status === 'completed') {
            const source = availableSources.find(s => s.id === job.source_id);
            addLog('success', `تکمیل ${source?.name || 'نامعلوم'}`, 
              `${job.result?.documentsCreated || 0} سند استخراج شد`);
          } else if (job?.status === 'failed') {
            const source = availableSources.find(s => s.id === job.source_id);
            addLog('error', `خطا در ${source?.name || 'نامعلوم'}`, job.error || 'خطای ناشناخته');
          }
        });

        if (allCompleted) {
          setIsScrapingActive(false);
          addLog('success', 'تمام عملیات تکمیل شدند', 'اسکریپینگ با موفقیت پایان یافت');
          await loadJobs();
        } else {
          setTimeout(monitorJobs, 2000);
        }
      } catch (error) {
        console.error('Job monitoring error:', error);
        setTimeout(monitorJobs, 5000);
      }
    };

    monitorJobs();
  };

  const stopAllJobs = async () => {
    try {
      await apiCall('/scraping/stop', { method: 'POST' });
      setIsScrapingActive(false);
      addLog('warning', 'تمام عملیات متوقف شدند', 'همه job های در حال اجرا لغو گردیدند');
      await loadJobs();
    } catch (error) {
      addLog('error', 'خطا در توقف عملیات', error instanceof Error ? error.message : 'خطای ناشناخته');
    }
  };

  const runGovernmentScrapers = async () => {
    try {
      addLog('info', 'شروع اسکریپرهای دولتی', 'اجرای تمام اسکریپرهای پیش‌تعریف شده');
      await apiCall('/scraping/rotate', { method: 'POST' });
      addLog('success', 'اسکریپرهای دولتی آغاز شدند', 'تمام سایت‌های دولتی در صف اجرا قرار گرفتند');
      setIsScrapingActive(true);
      await loadJobs();
    } catch (error) {
      addLog('error', 'خطا در اجرای اسکریپرهای دولتی', error instanceof Error ? error.message : 'خطای ناشناخته');
    }
  };

  const handleSourceSelection = (sourceId: string) => {
    setSelectedSources(prev =>
      prev.includes(sourceId)
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const clearLogs = () => {
    setScrapingLogs([]);
    addLog('info', 'لاگ‌ها پاک شدند', 'تاریخچه عملیات پاک گردید');
  };

  const filteredLogs = scrapingLogs.filter(log => {
    if (filterLogs === 'all') return true;
    return log.type === filterLogs;
  });

  // Effects
  useEffect(() => {
    const initialize = async () => {
      await Promise.all([
        loadSources(),
        loadJobs(),
        loadSystemHealth()
      ]);
    };

    initialize();

    const interval = setInterval(() => {
      loadJobs();
      loadSystemHealth();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const logsContainer = logsEndRef.current?.parentElement;
    if (logsContainer && scrapingLogs.length > 0) {
      const { scrollTop, scrollHeight, clientHeight } = logsContainer;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;
      
      if (isNearBottom) {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [scrapingLogs]);

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Brain className="text-blue-600" size={40} />
              <h1 className="text-4xl font-bold text-gray-900">سیستم اسکریپینگ هوشمند</h1>
              <ConnectionStatus isConnected={isConnected} />
            </div>
            <p className="text-gray-600 text-lg">پلتفرم پیشرفته جمع‌آوری خودکار اطلاعات حقوقی</p>
          </div>
        </div>

        {/* System Health Dashboard */}
        {systemHealth && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <SystemHealthCard
              icon={<Server size={20} className="text-white" />}
              value={systemHealth.queue.active}
              label="فعال"
              color="bg-green-500"
            />
            <SystemHealthCard
              icon={<Clock size={20} className="text-white" />}
              value={systemHealth.queue.waiting}
              label="در انتظار"
              color="bg-yellow-500"
            />
            <SystemHealthCard
              icon={<CheckCircle size={20} className="text-white" />}
              value={systemHealth.queue.completed}
              label="تکمیل شده"
              color="bg-blue-500"
            />
            <SystemHealthCard
              icon={<XCircle size={20} className="text-white" />}
              value={systemHealth.queue.failed}
              label="ناموفق"
              color="bg-red-500"
            />
            <SystemHealthCard
              icon={<Gauge size={20} className="text-white" />}
              value={Math.floor((systemHealth.uptime || 0) / 3600)}
              label="آپتایم (ساعت)"
              color="bg-purple-500"
            />
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Control Panel */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Zap className="text-yellow-500" size={20} />
                  عملیات سریع
                </h3>
                
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Database size={16} className="text-blue-500" />
                    <span>اسناد کل:</span>
                    <span className="font-semibold text-gray-900">
                      {systemHealth?.perSource.reduce((total, source) => total + source.count, 0) || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-green-500" />
                    <span>در حال پردازش:</span>
                    <span className="font-semibold text-gray-900">
                      {systemHealth?.queue.active || 0}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={startScraping}
                  disabled={selectedSources.length === 0 || isScrapingActive}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isScrapingActive ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Play size={18} />
                  )}
                  شروع اسکریپینگ
                </button>

                <button
                  onClick={runGovernmentScrapers}
                  disabled={isScrapingActive}
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <Target size={18} />
                  اسکریپرهای دولتی
                </button>

                <button
                  onClick={stopAllJobs}
                  disabled={!isScrapingActive && systemHealth?.queue.active === 0}
                  className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <Square size={18} />
                  توقف همه
                </button>

                <button
                  onClick={loadSources}
                  className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  <RefreshCw size={18} />
                  بروزرسانی
                </button>
              </div>
            </div>

            {/* Job Status */}
            <JobStatus jobs={activeJobs} isActive={isScrapingActive} />

            {/* Source Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <SourceSelector
                sources={availableSources}
                selectedSources={selectedSources}
                onSelectionChange={handleSourceSelection}
                disabled={isScrapingActive}
              />
              
              {selectedSources.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 flex items-center gap-2">
                    <Globe size={16} />
                    {selectedSources.length} منبع انتخاب شده
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Settings Panel */}
          <div className="space-y-6">
            
            <SettingsPanel
              settings={settings}
              onSettingsChange={setSettings}
              disabled={isScrapingActive}
            />

            {/* System Stats */}
            {systemHealth && systemHealth.perSource.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 size={20} className="text-purple-600" />
                  آمار منابع
                </h3>
                
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {systemHealth.perSource.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700 truncate">{stat.source}</span>
                      <span className="text-sm font-medium text-gray-900">{stat.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <button
                onClick={clearLogs}
                className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-4 rounded-lg font-medium hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <Trash2 size={20} />
                پاک کردن لاگ‌ها
              </button>
            </div>
          </div>
        </div>

        {/* Live Logs Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Activity size={20} className="text-blue-600" />
                لاگ‌های زنده سیستم
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {scrapingLogs.length}
                </span>
              </h3>
              
              <div className="flex items-center gap-2">
                <label htmlFor="log-filter" className="text-sm text-gray-600">فیلتر:</label>
                <select
                  id="log-filter"
                  value={filterLogs}
                  onChange={(e) => setFilterLogs(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">همه</option>
                  <option value="info">اطلاعات</option>
                  <option value="success">موفقیت</option>
                  <option value="warning">هشدار</option>
                  <option value="error">خطا</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="h-96 overflow-y-auto p-4 space-y-3">
            {filteredLogs.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Search size={48} className="mx-auto mb-4 opacity-50" />
                <p className="font-medium">هنوز لاگی ثبت نشده است</p>
                <p className="text-sm">پس از شروع عملیات، فعالیت‌ها اینجا نمایش داده می‌شوند</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <LogEntry key={log.id} log={log} />
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </div>

        {/* Warning for no selection */}
        {selectedSources.length === 0 && !isScrapingActive && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertCircle size={32} className="text-yellow-600" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-xl text-yellow-800">انتخاب منبع ضروری است</h3>
                <p className="text-yellow-700 text-lg max-w-2xl mx-auto">
                  لطفاً حداقل یک منبع را انتخاب کنید تا بتوانید عملیات اسکریپینگ را آغاز نمایید
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScrapingPage;
