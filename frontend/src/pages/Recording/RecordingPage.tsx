import React, { useState, useEffect, useRef } from 'react';
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
  Download,
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Filter,
  Eye,
  BarChart3,
  Layers,
  Server,
  Wifi,
  WifiOff,
  Plus,
  RefreshCw,
  Code,
  Cpu,
  HardDrive,
  Network,
  Monitor,
  Archive,
  FileText,
  Image,
  Calendar,
  User,
  Shield,
  Gauge,
  Target,
  Wrench
} from 'lucide-react';

// Real API Types based on actual backend
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

interface CreateSourceForm {
  name: string;
  base_url: string;
  category: string;
  priority: number;
  status: string;
  selectors: {
    content: string;
    title: string;
    date: string;
    category: string;
    next_page: string;
  };
  headers: Record<string, string>;
}

const API_BASE = 'http://localhost:3000/api';

// Helper function to get auth headers (replace with your auth implementation)
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const AdvancedScrapingDashboard: React.FC = () => {
  // State Management
  const [isScrapingActive, setIsScrapingActive] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [availableSources, setAvailableSources] = useState<ScrapingSource[]>([]);
  const [activeJobs, setActiveJobs] = useState<ScrapingJob[]>([]);
  const [scrapingLogs, setScrapingLogs] = useState<ScrapingLog[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
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

  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showCreateSource, setShowCreateSource] = useState(false);
  const [filterLogs, setFilterLogs] = useState<string>('all');
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  
  const [createSourceForm, setCreateSourceForm] = useState<CreateSourceForm>({
    name: '',
    base_url: '',
    category: 'دادگستری',
    priority: 2,
    status: 'active',
    selectors: {
      content: 'article, main, .content, #content',
      title: 'h1, h2, title',
      date: 'time, .date, .publish-date',
      category: '.category, .cat',
      next_page: 'a[rel="next"], .pagination a.next'
    },
    headers: {}
  });
  
  const logsEndRef = useRef<HTMLDivElement>(null);
  const ws = useRef<WebSocket | null>(null);

  // API Functions
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

  // Real API Integration
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

  const startRealScraping = async () => {
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
      
      // Start monitoring jobs
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
        let totalProgress = 0;

        jobStatuses.forEach((job, index) => {
          if (job && job.status !== 'completed' && job.status !== 'failed') {
            allCompleted = false;
          }
          totalProgress += job?.progress || 0;

          if (job?.status === 'completed') {
            const source = availableSources.find(s => s.id === job.source_id);
            addLog('success', `تکمیل ${source?.name || 'نامعلوم'}`, 
              `${job.result?.documentsCreated || 0} سند استخراج شد`);
          } else if (job?.status === 'failed') {
            const source = availableSources.find(s => s.id === job.source_id);
            addLog('error', `خطا در ${source?.name || 'نامعلوم'}`, job.error || 'خطای ناشناخته');
          }
        });

        const avgProgress = totalProgress / jobIds.length;
        
        if (allCompleted) {
          setIsScrapingActive(false);
          addLog('success', 'تمام عملیات تکمیل شدند', 'اسکریپینگ با موفقیت پایان یافت');
          await loadJobs(); // Refresh job list
        } else {
          // Continue monitoring
          setTimeout(monitorJobs, 2000);
        }
      } catch (error) {
        console.error('Job monitoring error:', error);
        setTimeout(monitorJobs, 5000); // Retry after longer delay
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

  const createNewSource = async () => {
    try {
      const sourceData = {
        name: createSourceForm.name,
        baseUrl: createSourceForm.base_url,
        category: createSourceForm.category,
        priority: createSourceForm.priority,
        status: createSourceForm.status,
        selectors: createSourceForm.selectors,
        headers: createSourceForm.headers
      };

      await apiCall('/scraping/sources', {
        method: 'POST',
        body: JSON.stringify(sourceData)
      });

      addLog('success', 'منبع جدید اضافه شد', `${createSourceForm.name} با موفقیت ثبت شد`);
      setShowCreateSource(false);
      await loadSources();
      
      // Reset form
      setCreateSourceForm({
        name: '',
        base_url: '',
        category: 'دادگستری',
        priority: 2,
        status: 'active',
        selectors: {
          content: 'article, main, .content, #content',
          title: 'h1, h2, title',
          date: 'time, .date, .publish-date',
          category: '.category, .cat',
          next_page: 'a[rel="next"], .pagination a.next'
        },
        headers: {}
      });
    } catch (error) {
      addLog('error', 'خطا در ایجاد منبع', error instanceof Error ? error.message : 'خطای ناشناخته');
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

  // Utility Functions
  const addLog = (type: ScrapingLog['type'], message: string, details?: string, source?: string, jobId?: string) => {
    const newLog: ScrapingLog = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      type,
      message,
      details,
      source,
      jobId
    };
    setScrapingLogs(prev => [newLog, ...prev.slice(0, 199)]); // Keep last 200 logs
  };

  // Auto-scroll logs to bottom only if user is near bottom
  useEffect(() => {
    const logsContainer = logsEndRef.current?.parentElement;
    if (logsContainer && scrapingLogs.length > 0) {
      const { scrollTop, scrollHeight, clientHeight } = logsContainer;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50; // 50px threshold
      
      if (isNearBottom) {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [scrapingLogs]);

  // Initial load and periodic refresh
  useEffect(() => {
    const initialize = async () => {
      await Promise.all([
        loadSources(),
        loadJobs(),
        loadSystemHealth()
      ]);
    };

    initialize();

    // Set up periodic refresh
    const interval = setInterval(() => {
      loadJobs();
      loadSystemHealth();
    }, 5000);

    setRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const connectWebSocket = () => {
      const wsUrl = API_BASE.replace('/api', '').replace('http', 'ws');
      ws.current = new WebSocket(`${wsUrl}/ws`);

      ws.current.onopen = () => {
        console.log('WebSocket connected');
        addLog('success', 'اتصال زنده برقرار شد', 'WebSocket متصل شد');
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'scraping_update') {
            addLog('info', `بروزرسانی ${data.jobId}`, 
              `Progress: ${data.progress}% - ${data.url}`);
          } else if (data.type === 'job_completed') {
            addLog('success', 'Job تکمیل شد', `${data.jobId} با موفقیت پایان یافت`);
            loadJobs();
          } else if (data.type === 'job_failed') {
            addLog('error', 'Job ناموفق', `${data.jobId}: ${data.error}`);
            loadJobs();
          }
        } catch (error) {
          console.error('WebSocket message parse error:', error);
        }
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
        addLog('warning', 'اتصال زنده قطع شد', 'WebSocket متصل نیست');
        // Attempt to reconnect after 5 seconds
        setTimeout(connectWebSocket, 5000);
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        addLog('error', 'خطا در اتصال زنده', 'مشکل در WebSocket');
      };
    };

    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleSourceSelection = (sourceId: string) => {
    setSelectedSources(prev =>
      prev.includes(sourceId)
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const filteredLogs = scrapingLogs.filter(log => {
    if (filterLogs === 'all') return true;
    return log.type === filterLogs;
  });

  const getLogIcon = (type: ScrapingLog['type']) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} className="text-green-500" />;
      case 'error': return <XCircle size={16} className="text-red-500" />;
      case 'warning': return <AlertCircle size={16} className="text-yellow-500" />;
      default: return <Activity size={16} className="text-blue-500" />;
    }
  };

  const getLogBgColor = (type: ScrapingLog['type']) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const clearLogs = () => {
    setScrapingLogs([]);
    addLog('info', 'لاگ‌ها پاک شدند', 'تاریخچه عملیات پاک گردید');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-500';
      case 'running': return 'text-cyan-500';
      case 'failed': return 'text-rose-500';
      case 'pending': return 'text-amber-500';
      default: return 'text-slate-500';
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

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header with Connection Status */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-3xl p-8 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Brain className="text-blue-400" size={40} />
              <h1 className="text-4xl font-bold text-white">سیستم اسکریپینگ هوشمند</h1>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                isConnected ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
              }`}>
                {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
                {isConnected ? 'متصل' : 'قطع'}
              </div>
            </div>
            <p className="text-blue-200 text-lg">پلتفرم پیشرفته جمع‌آوری خودکار اطلاعات حقوقی</p>
          </div>
        </div>

        {/* System Health Dashboard */}
        {systemHealth && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-slate-800 backdrop-blur-lg rounded-2xl p-4 text-center border border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
              <Server className="mx-auto mb-2 text-emerald-400" size={24} />
              <div className="text-2xl font-bold text-white">{systemHealth.queue.active}</div>
              <div className="text-sm text-slate-300">فعال</div>
            </div>
            
            <div className="bg-slate-800 backdrop-blur-lg rounded-2xl p-4 text-center border border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
              <Clock className="mx-auto mb-2 text-amber-400" size={24} />
              <div className="text-2xl font-bold text-white">{systemHealth.queue.waiting}</div>
              <div className="text-sm text-slate-300">در انتظار</div>
            </div>
            
            <div className="bg-slate-800 backdrop-blur-lg rounded-2xl p-4 text-center border border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
              <CheckCircle className="mx-auto mb-2 text-green-400" size={24} />
              <div className="text-2xl font-bold text-white">{systemHealth.queue.completed}</div>
              <div className="text-sm text-slate-300">تکمیل شده</div>
            </div>
            
            <div className="bg-slate-800 backdrop-blur-lg rounded-2xl p-4 text-center border border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
              <XCircle className="mx-auto mb-2 text-rose-400" size={24} />
              <div className="text-2xl font-bold text-white">{systemHealth.queue.failed}</div>
              <div className="text-sm text-slate-300">ناموفق</div>
            </div>
            
            <div className="bg-slate-800 backdrop-blur-lg rounded-2xl p-4 text-center border border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
              <Gauge className="mx-auto mb-2 text-purple-400" size={24} />
              <div className="text-2xl font-bold text-white">{Math.floor((systemHealth.uptime || 0) / 3600)}h</div>
              <div className="text-sm text-slate-300">آپتایم</div>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Control Panel */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Quick Action Buttons */}
            <div className="bg-slate-800 backdrop-blur-lg rounded-2xl p-6 border border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Zap className="text-yellow-400" size={24} />
                  عملیات سریع
                </h3>
                
                {/* Document Stats */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Database className="text-cyan-400" size={16} />
                    <span className="text-slate-300">اسناد کل:</span>
                    <span className="text-white font-semibold">
                      {systemHealth?.perSource.reduce((total, source) => total + source.count, 0) || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="text-orange-400" size={16} />
                    <span className="text-slate-300">در حال پردازش:</span>
                    <span className="text-white font-semibold">
                      {systemHealth?.queue.active || 0}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={startRealScraping}
                  disabled={selectedSources.length === 0 || isScrapingActive}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl"
                >
                  {isScrapingActive ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Zap size={18} />
                  )}
                  شروع اسکریپینگ
                </button>

                <button
                  onClick={runGovernmentScrapers}
                  disabled={isScrapingActive}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl"
                >
                  <Target size={18} />
                  اسکریپرهای دولتی
                </button>

                <button
                  onClick={stopAllJobs}
                  disabled={!isScrapingActive && systemHealth?.queue.active === 0}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:from-red-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none shadow-lg hover:shadow-xl"
                >
                  <Square size={18} />
                  توقف همه
                </button>
              </div>
            </div>

            {/* Active Jobs */}
            {activeJobs.length > 0 && (
              <div className="bg-slate-800 backdrop-blur-lg rounded-2xl p-6 border border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Activity className="text-emerald-400" size={24} />
                  Job های فعال
                  <span className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full text-sm">
                    {activeJobs.length}
                  </span>
                </h3>
                
                <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                  {activeJobs.slice(0, 10).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`${getStatusColor(job.status)}`}>
                            {getStatusIcon(job.status)}
                          </span>
                          <p className="font-medium text-white truncate">{job.url}</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-300">
                          <span>پیشرفت: {job.progress}%</span>
                          <span>وضعیت: {job.status}</span>
                          {job.result && (
                            <span>اسناد: {job.result.documentsCreated}</span>
                          )}
                        </div>
                        {job.progress > 0 && job.progress < 100 && (
                          <div className="w-full bg-slate-600 rounded-full h-1 mt-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full transition-all duration-500"
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Source Selection */}
            <div className="bg-slate-800 backdrop-blur-lg rounded-2xl p-6 border border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Globe className="text-cyan-400" size={24} />
                  منابع موجود
                  <span className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full text-sm">
                    {availableSources.length}
                  </span>
                </h3>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCreateSource(true)}
                    className="flex items-center gap-2 bg-white text-slate-800 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <Plus size={16} className="text-purple-600" />
                    <span className="text-slate-800">منبع جدید</span>
                  </button>
                  
                  <button
                    onClick={loadSources}
                    className="flex items-center gap-2 bg-white text-slate-800 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <RefreshCw size={16} className="text-blue-600" />
                    <span className="text-slate-800">بروزرسانی</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto custom-scrollbar">
                {availableSources.map((source) => (
                  <label 
                    key={source.id} 
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedSources.includes(source.id)
                        ? 'border-cyan-400 bg-cyan-400/20 shadow-md'
                        : 'border-slate-600 bg-slate-700/50 hover:bg-slate-700 hover:shadow-md'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSources.includes(source.id)}
                      onChange={() => handleSourceSelection(source.id)}
                      className="absolute top-3 right-3 w-5 h-5 text-cyan-600 rounded"
                    />
                    
                    <div className="ml-8">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-white text-sm">{source.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          source.status === 'active' 
                            ? 'bg-emerald-500/20 text-emerald-300' 
                            : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {source.status === 'active' ? 'فعال' : 'غیرفعال'}
                        </span>
                      </div>
                      
                      <div className="text-xs text-slate-300 space-y-1">
                        <div>دسته: {source.category || 'نامعلوم'}</div>
                        <div>URL: {source.url || source.base_url}</div>
                        <div>اولویت: {source.priority || 2}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {selectedSources.length > 0 && (
                <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-400/30 rounded-lg">
                  <p className="text-sm text-cyan-300">
                    <Globe className="inline ml-2" size={16} />
                    {selectedSources.length} منبع انتخاب شده
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Settings Panel */}
          <div className="space-y-6">
            
            {/* Settings */}
            <div className="bg-slate-800 backdrop-blur-lg rounded-2xl p-6 border border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Settings className="text-indigo-400" size={20} />
                تنظیمات
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    حداکثر صفحات: {settings.maxPages}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={settings.maxPages}
                    onChange={(e) => setSettings(prev => ({ ...prev, maxPages: parseInt(e.target.value) }))}
                    disabled={isScrapingActive}
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    عمق اسکریپینگ: {settings.depth}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={settings.depth}
                    onChange={(e) => setSettings(prev => ({ ...prev, depth: parseInt(e.target.value) }))}
                    disabled={isScrapingActive}
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    تأخیر (ثانیه): {settings.delay}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={settings.delay}
                    onChange={(e) => setSettings(prev => ({ ...prev, delay: parseInt(e.target.value) }))}
                    disabled={isScrapingActive}
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={settings.intelligentMode}
                      onChange={(e) => setSettings(prev => ({ ...prev, intelligentMode: e.target.checked }))}
                      disabled={isScrapingActive}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    حالت هوشمند
                  </label>

                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={settings.useProxies}
                      onChange={(e) => setSettings(prev => ({ ...prev, useProxies: e.target.checked }))}
                      disabled={isScrapingActive}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    استفاده از پروکسی
                  </label>

                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={settings.enableRating}
                      onChange={(e) => setSettings(prev => ({ ...prev, enableRating: e.target.checked }))}
                      disabled={isScrapingActive}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    رتبه‌بندی کیفیت
                  </label>
                </div>

                <button
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                  className="w-full flex items-center justify-center gap-2 bg-slate-700 text-slate-300 px-4 py-3 rounded-xl hover:bg-slate-600 transition-colors font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <Wrench size={16} className="text-orange-400" />
                  تنظیمات پیشرفته
                </button>
              </div>
            </div>

            {/* System Stats */}
            {systemHealth && systemHealth.perSource.length > 0 && (
              <div className="bg-slate-800 backdrop-blur-lg rounded-2xl p-6 border border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="text-violet-400" size={20} />
                  آمار منابع
                </h3>
                
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {systemHealth.perSource.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg">
                      <span className="text-sm text-slate-300 truncate">{stat.source}</span>
                      <span className="text-sm font-medium text-white">{stat.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div className="bg-slate-800 backdrop-blur-lg rounded-2xl p-6 border border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
              <div className="space-y-3">
                <button
                  onClick={clearLogs}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gray-600 to-slate-600 text-white px-6 py-4 rounded-xl font-medium transition-all duration-300 hover:from-gray-700 hover:to-slate-700 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Trash2 size={20} className="text-red-400" />
                  پاک کردن لاگ‌ها
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Logs Section */}
        <div className="bg-slate-800 backdrop-blur-lg rounded-2xl border border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="text-emerald-400" size={24} />
                لاگ‌های زنده سیستم
                <span className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full text-sm">
                  {scrapingLogs.length}
                </span>
              </h3>
              
              <div className="flex items-center gap-2">
                <select
                  value={filterLogs}
                  onChange={(e) => setFilterLogs(e.target.value)}
                  className="bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-1 text-sm"
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
          
          <div className="h-96 overflow-y-auto p-4 space-y-2 custom-scrollbar bg-gradient-to-br from-blue-50/40 via-white/70 to-blue-100/30 backdrop-blur-md rounded-b-2xl border-t border-slate-600/20">
            {filteredLogs.length === 0 ? (
              <div className="text-center text-slate-600 py-8">
                <Search size={48} className="mx-auto mb-4 opacity-50" />
                <p className="font-medium">هنوز لاگی ثبت نشده است</p>
                <p className="text-sm">پس از شروع عملیات، فعالیت‌ها اینجا نمایش داده می‌شوند</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-3 rounded-lg border transition-all duration-300 hover:scale-[1.01] shadow-sm backdrop-blur-sm ${getLogBgColor(log.type)}`}
                >
                  <div className="flex items-start gap-3">
                    {getLogIcon(log.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-800 truncate">{log.message}</p>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {log.timestamp.toLocaleTimeString('fa-IR')}
                        </span>
                      </div>
                      {log.details && (
                        <p className="text-sm text-gray-600">{log.details}</p>
                      )}
                      {log.source && (
                        <p className="text-xs text-gray-500 mt-1">منبع: {log.source}</p>
                      )}
                      {log.jobId && (
                        <p className="text-xs text-gray-500 mt-1">Job ID: {log.jobId}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </div>

        {/* Create Source Modal */}
        {showCreateSource && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 backdrop-blur-lg rounded-2xl border border-slate-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Plus className="text-emerald-400" size={24} />
                افزودن منبع جدید
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">نام منبع</label>
                  <input
                    type="text"
                    value={createSourceForm.name}
                    onChange={(e) => setCreateSourceForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400"
                    placeholder="مثال: دادگستری ایران"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">URL پایه</label>
                  <input
                    type="url"
                    value={createSourceForm.base_url}
                    onChange={(e) => setCreateSourceForm(prev => ({ ...prev, base_url: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400"
                    placeholder="https://example.com"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">دسته‌بندی</label>
                    <select
                      value={createSourceForm.category}
                      onChange={(e) => setCreateSourceForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="دادگستری">دادگستری</option>
                      <option value="قانون">قانون</option>
                      <option value="وکالت">وکالت</option>
                      <option value="دولتی">دولتی</option>
                      <option value="اقتصادی">اقتصادی</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">اولویت</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={createSourceForm.priority}
                      onChange={(e) => setCreateSourceForm(prev => ({ ...prev, priority: parseInt(e.target.value) || 2 }))}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Selector محتوا</label>
                  <input
                    type="text"
                    value={createSourceForm.selectors.content}
                    onChange={(e) => setCreateSourceForm(prev => ({ 
                      ...prev, 
                      selectors: { ...prev.selectors, content: e.target.value }
                    }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400"
                    placeholder="article, main, .content, #content"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Selector عنوان</label>
                    <input
                      type="text"
                      value={createSourceForm.selectors.title}
                      onChange={(e) => setCreateSourceForm(prev => ({ 
                        ...prev, 
                        selectors: { ...prev.selectors, title: e.target.value }
                      }))}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400"
                      placeholder="h1, h2, title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Selector تاریخ</label>
                    <input
                      type="text"
                      value={createSourceForm.selectors.date}
                      onChange={(e) => setCreateSourceForm(prev => ({ 
                        ...prev, 
                        selectors: { ...prev.selectors, date: e.target.value }
                      }))}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400"
                      placeholder="time, .date, .publish-date"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={createNewSource}
                  disabled={!createSourceForm.name || !createSourceForm.base_url}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl font-medium transition-all duration-300 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  ایجاد منبع
                </button>
                
                <button
                  onClick={() => setShowCreateSource(false)}
                  className="px-8 py-4 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600 transition-colors shadow-md hover:shadow-lg"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Settings Modal */}
        {showAdvancedSettings && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 backdrop-blur-lg rounded-2xl border border-slate-700 p-6 w-full max-w-lg shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Wrench className="text-orange-400" size={24} />
                تنظیمات پیشرفته
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Job های موازی: {settings.parallelJobs}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={settings.parallelJobs}
                    onChange={(e) => setSettings(prev => ({ ...prev, parallelJobs: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">User Agent</label>
                  <textarea
                    value={settings.userAgent}
                    onChange={(e) => setSettings(prev => ({ ...prev, userAgent: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm h-20 resize-none"
                    placeholder="Mozilla/5.0..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">زبان پردازش</label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value as 'fa' | 'en' | 'auto' }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="auto">تشخیص خودکار</option>
                    <option value="fa">فارسی</option>
                    <option value="en">انگلیسی</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAdvancedSettings(false)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-4 rounded-xl font-medium transition-all duration-300 hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  ذخیره تنظیمات
                </button>
                
                <button
                  onClick={() => setShowAdvancedSettings(false)}
                  className="px-8 py-4 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600 transition-colors shadow-md hover:shadow-lg"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Warning for no selection */}
        {selectedSources.length === 0 && !isScrapingActive && (
          <div className="bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl text-center">
            <div className="flex flex-col items-center justify-center gap-4 text-white">
              <div className="p-3 bg-amber-500/20 rounded-full">
                <AlertCircle size={32} className="text-amber-400" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-xl">انتخاب منبع ضروری است</h3>
                <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                  لطفاً حداقل یک منبع را انتخاب کنید تا بتوانید عملیات اسکریپینگ را آغاز نمایید
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(100, 116, 139, 0.5) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(100, 116, 139, 0.5);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(100, 116, 139, 0.7);
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border: 2px solid white;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border: 2px solid white;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default AdvancedScrapingDashboard;
