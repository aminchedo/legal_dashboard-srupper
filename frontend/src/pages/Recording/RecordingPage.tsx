import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Square, 
  Settings, 
  Globe, 
  Database,
  Activity,
  Zap,
  Search,
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  BarChart3,
  Server,
  Plus,
  RefreshCw,
  Target,
  Gauge,
  Wrench
} from 'lucide-react';

// Import new components and types
import Header from '../../components/Recording/Header';
import Button from '../../components/Recording/Button';
import Card from '../../components/Recording/Card';
import Modal from '../../components/Recording/Modal';
import { Input, Select, Textarea } from '../../components/Recording/FormField';
import { colors, spacing, componentStyles, breakpoints } from '../../components/Recording/theme';
import {
  ScrapingJob,
  ScrapingSource,
  ScrapingLog,
  ScrapingSettings,
  SystemHealth,
  CreateSourceForm
} from '../../components/Recording/types';

const API_BASE = 'http://localhost:3000/api';

// Helper function to get auth headers
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
    setScrapingLogs(prev => [newLog, ...prev.slice(0, 199)]);
  };

  // Auto-scroll logs to bottom only if user is near bottom
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
      case 'success': return <CheckCircle size={16} style={{ color: colors.status.success.bg }} />;
      case 'error': return <XCircle size={16} style={{ color: colors.status.error.bg }} />;
      case 'warning': return <AlertCircle size={16} style={{ color: colors.status.warning.bg }} />;
      default: return <Activity size={16} style={{ color: colors.status.info.bg }} />;
    }
  };

  const getLogBgColor = (type: ScrapingLog['type']) => {
    switch (type) {
      case 'success': return { backgroundColor: colors.status.success.lighter, borderColor: colors.status.success.light };
      case 'error': return { backgroundColor: colors.status.error.lighter, borderColor: colors.status.error.light };
      case 'warning': return { backgroundColor: colors.status.warning.lighter, borderColor: colors.status.warning.light };
      default: return { backgroundColor: colors.status.info.lighter, borderColor: colors.status.info.light };
    }
  };

  const clearLogs = () => {
    setScrapingLogs([]);
    addLog('info', 'لاگ‌ها پاک شدند', 'تاریخچه عملیات پاک گردید');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return colors.status.success.bg;
      case 'running': return colors.status.info.bg;
      case 'failed': return colors.status.error.bg;
      case 'pending': return colors.status.warning.bg;
      default: return colors.text.muted;
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

  // Responsive grid styles
  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    background: '#ffffff',
    padding: spacing.lg,
  };

  const maxWidthContainerStyles: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.lg,
  };

  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: spacing.lg,
  };

  const responsiveGridStyles = `
    @media (min-width: ${breakpoints.xl}) {
      .main-grid {
        grid-template-columns: 2fr 1fr;
      }
    }
    
    @media (max-width: ${breakpoints.md}) {
      .system-health-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .sources-grid {
        grid-template-columns: 1fr;
      }
    }
    
    @media (max-width: ${breakpoints.sm}) {
      .system-health-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  return (
    <>
      <style>{responsiveGridStyles}</style>
      <div style={containerStyles}>
        <div style={maxWidthContainerStyles}>
          
          {/* Header */}
          <Header isConnected={isConnected} />

          {/* System Health Dashboard */}
          {systemHealth && (
            <div 
              className="system-health-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: spacing.md,
                marginBottom: spacing.lg,
              }}
            >
              <Card hover={false} padding="md">
                <div style={{ textAlign: 'center' }}>
                  <Server size={24} style={{ color: colors.accent.success, margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.text.primary }}>
                    {systemHealth.queue.active}
                  </div>
                  <div style={{ fontSize: '12px', color: colors.text.muted }}>فعال</div>
                </div>
              </Card>
              
              <Card hover={false} padding="md">
                <div style={{ textAlign: 'center' }}>
                  <Clock size={24} style={{ color: colors.accent.warning, margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.text.primary }}>
                    {systemHealth.queue.waiting}
                  </div>
                  <div style={{ fontSize: '12px', color: colors.text.muted }}>در انتظار</div>
                </div>
              </Card>
              
              <Card hover={false} padding="md">
                <div style={{ textAlign: 'center' }}>
                  <CheckCircle size={24} style={{ color: colors.status.success.bg, margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.text.primary }}>
                    {systemHealth.queue.completed}
                  </div>
                  <div style={{ fontSize: '12px', color: colors.text.muted }}>تکمیل شده</div>
                </div>
              </Card>
              
              <Card hover={false} padding="md">
                <div style={{ textAlign: 'center' }}>
                  <XCircle size={24} style={{ color: colors.status.error.bg, margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.text.primary }}>
                    {systemHealth.queue.failed}
                  </div>
                  <div style={{ fontSize: '12px', color: colors.text.muted }}>ناموفق</div>
                </div>
              </Card>
              
              <Card hover={false} padding="md">
                <div style={{ textAlign: 'center' }}>
                  <Gauge size={24} style={{ color: colors.accent.secondary, margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.text.primary }}>
                    {Math.floor((systemHealth.uptime || 0) / 3600)}h
                  </div>
                  <div style={{ fontSize: '12px', color: colors.text.muted }}>آپتایم</div>
                </div>
              </Card>
            </div>
          )}

          {/* Main Grid */}
          <div className="main-grid" style={gridStyles}>
            
            {/* Control Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
              
              {/* Quick Action Buttons */}
              <Card title="عملیات سریع" icon={Zap}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: spacing.lg,
                  gap: spacing.md,
                  flexWrap: 'wrap'
                }}>
                  {/* Document Stats */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: spacing.lg, 
                    fontSize: '14px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                      <Database size={16} style={{ color: colors.accent.primary }} />
                      <span style={{ color: colors.text.muted }}>اسناد کل:</span>
                      <span style={{ color: colors.text.primary, fontWeight: '600' }}>
                        {systemHealth?.perSource.reduce((total, source) => total + source.count, 0) || 0}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                      <Activity size={16} style={{ color: colors.accent.warning }} />
                      <span style={{ color: colors.text.muted }}>در حال پردازش:</span>
                      <span style={{ color: colors.text.primary, fontWeight: '600' }}>
                        {systemHealth?.queue.active || 0}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  gap: spacing.md,
                  flexWrap: 'wrap'
                }}>
                  <Button
                    onClick={startRealScraping}
                    disabled={selectedSources.length === 0 || isScrapingActive}
                    variant="success"
                    icon={isScrapingActive ? undefined : Zap}
                    loading={isScrapingActive}
                    aria-label="شروع عملیات اسکریپینگ"
                  >
                    شروع اسکریپینگ
                  </Button>

                  <Button
                    onClick={runGovernmentScrapers}
                    disabled={isScrapingActive}
                    variant="primary"
                    icon={Target}
                    aria-label="اجرای اسکریپرهای دولتی"
                  >
                    اسکریپرهای دولتی
                  </Button>

                  <Button
                    onClick={stopAllJobs}
                    disabled={!isScrapingActive && systemHealth?.queue.active === 0}
                    variant="danger"
                    icon={Square}
                    aria-label="توقف همه عملیات"
                  >
                    توقف همه
                  </Button>
                </div>
              </Card>

              {/* Active Jobs */}
              {activeJobs.length > 0 && (
                <Card title="Job های فعال" icon={Activity}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: spacing.sm,
                    marginBottom: spacing.md
                  }}>
                    <span style={{
                      backgroundColor: colors.status.success.bg + '30',
                      color: colors.status.success.text,
                      padding: `${spacing.xs} ${spacing.sm}`,
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {activeJobs.length}
                    </span>
                  </div>
                  
                  <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing.md,
                    maxHeight: '300px',
                    overflowY: 'auto',
                    ...componentStyles.scrollbar
                  } as React.CSSProperties}>
                    {activeJobs.slice(0, 10).map((job) => (
                      <div key={job.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: spacing.md,
                        background: colors.background.tertiary + '50',
                        borderRadius: '8px',
                        border: `1px solid ${colors.border.primary}`
                      }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: spacing.sm, 
                            marginBottom: spacing.xs 
                          }}>
                            <span style={{ color: getStatusColor(job.status) }}>
                              {getStatusIcon(job.status)}
                            </span>
                            <p style={{ 
                              fontWeight: '500', 
                              color: colors.text.primary, 
                              margin: 0,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {job.url}
                            </p>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: spacing.md, 
                            fontSize: '12px', 
                            color: colors.text.muted,
                            flexWrap: 'wrap'
                          }}>
                            <span>پیشرفت: {job.progress}%</span>
                            <span>وضعیت: {job.status}</span>
                            {job.result && (
                              <span>اسناد: {job.result.documentsCreated}</span>
                            )}
                          </div>
                          {job.progress > 0 && job.progress < 100 && (
                            <div style={{
                              width: '100%',
                              background: colors.background.surface,
                              borderRadius: '4px',
                              height: '4px',
                              marginTop: spacing.sm,
                              overflow: 'hidden'
                            }}>
                              <div 
                                style={{
                                  background: `linear-gradient(90deg, ${colors.accent.primary}, ${colors.accent.secondary})`,
                                  height: '100%',
                                  borderRadius: '4px',
                                  transition: 'width 500ms ease',
                                  width: `${job.progress}%`
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Source Selection */}
              <Card title="منابع موجود" icon={Globe}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: spacing.sm,
                  marginBottom: spacing.md
                }}>
                  <span style={{
                    backgroundColor: colors.accent.primary + '30',
                    color: colors.text.primary,
                    padding: `${spacing.xs} ${spacing.sm}`,
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {availableSources.length}
                  </span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  gap: spacing.sm, 
                  marginBottom: spacing.lg,
                  flexWrap: 'wrap'
                }}>
                  <Button
                    onClick={() => setShowCreateSource(true)}
                    variant="secondary"
                    icon={Plus}
                    size="sm"
                    aria-label="افزودن منبع جدید"
                  >
                    منبع جدید
                  </Button>
                  
                  <Button
                    onClick={loadSources}
                    variant="secondary"
                    icon={RefreshCw}
                    size="sm"
                    aria-label="بروزرسانی منابع"
                  >
                    بروزرسانی
                  </Button>
                </div>
                
                <div className="sources-grid" style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: spacing.md,
                  maxHeight: '400px',
                  overflowY: 'auto',
                  ...componentStyles.scrollbar
                } as React.CSSProperties}>
                  {availableSources.map((source) => (
                    <label 
                      key={source.id} 
                      style={{
                        position: 'relative',
                        padding: spacing.md,
                        borderRadius: '12px',
                        border: `2px solid ${
                          selectedSources.includes(source.id)
                            ? colors.accent.primary
                            : colors.border.primary
                        }`,
                        background: selectedSources.includes(source.id)
                          ? colors.accent.primary + '20'
                          : colors.background.tertiary + '50',
                        cursor: 'pointer',
                        transition: 'all 150ms ease',
                        display: 'block'
                      }}
                      onMouseEnter={(e) => {
                        if (!selectedSources.includes(source.id)) {
                          e.currentTarget.style.background = colors.background.tertiary;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!selectedSources.includes(source.id)) {
                          e.currentTarget.style.background = colors.background.tertiary + '50';
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSources.includes(source.id)}
                        onChange={() => handleSourceSelection(source.id)}
                        style={{
                          position: 'absolute',
                          top: spacing.md,
                          right: spacing.md,
                          width: '18px',
                          height: '18px',
                          accentColor: colors.accent.primary,
                          borderRadius: '4px'
                        }}
                        aria-label={`انتخاب منبع ${source.name}`}
                      />
                      
                      <div style={{ marginLeft: spacing.xl }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: spacing.sm, 
                          marginBottom: spacing.sm,
                          flexWrap: 'wrap'
                        }}>
                          <h4 style={{ 
                            fontWeight: '600', 
                            color: colors.text.primary, 
                            fontSize: '14px',
                            margin: 0
                          }}>
                            {source.name}
                          </h4>
                          <span style={{
                            padding: `${spacing.xs} ${spacing.sm}`,
                            fontSize: '11px',
                            borderRadius: '8px',
                            backgroundColor: source.status === 'active' 
                              ? colors.status.success.bg + '30' 
                              : colors.status.error.bg + '30',
                            color: source.status === 'active' 
                              ? colors.status.success.text 
                              : colors.status.error.text
                          }}>
                            {source.status === 'active' ? 'فعال' : 'غیرفعال'}
                          </span>
                        </div>
                        
                        <div style={{ 
                          fontSize: '11px', 
                          color: colors.text.muted, 
                          display: 'flex',
                          flexDirection: 'column',
                          gap: spacing.xs
                        }}>
                          <div>دسته: {source.category || 'نامعلوم'}</div>
                          <div style={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            URL: {source.url || source.base_url}
                          </div>
                          <div>اولویت: {source.priority || 2}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {selectedSources.length > 0 && (
                  <div style={{
                    marginTop: spacing.md,
                    padding: spacing.md,
                    background: colors.accent.primary + '10',
                    border: `1px solid ${colors.accent.primary}30`,
                    borderRadius: '8px'
                  }}>
                    <p style={{ 
                      fontSize: '14px', 
                      color: colors.accent.primary,
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.sm
                    }}>
                      <Globe size={16} />
                      {selectedSources.length} منبع انتخاب شده
                    </p>
                  </div>
                )}
              </Card>

            </div>

            {/* Settings Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
              
              {/* Settings */}
              <Card title="تنظیمات" icon={Settings}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: colors.text.secondary,
                      marginBottom: spacing.sm
                    }}>
                      حداکثر صفحات: {settings.maxPages}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={settings.maxPages}
                      onChange={(e) => setSettings(prev => ({ ...prev, maxPages: parseInt(e.target.value) }))}
                      disabled={isScrapingActive}
                      style={{
                        width: '100%',
                        height: '6px',
                        background: colors.background.surface,
                        borderRadius: '3px',
                        outline: 'none',
                        cursor: isScrapingActive ? 'not-allowed' : 'pointer'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: colors.text.secondary,
                      marginBottom: spacing.sm
                    }}>
                      عمق اسکریپینگ: {settings.depth}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={settings.depth}
                      onChange={(e) => setSettings(prev => ({ ...prev, depth: parseInt(e.target.value) }))}
                      disabled={isScrapingActive}
                      style={{
                        width: '100%',
                        height: '6px',
                        background: colors.background.surface,
                        borderRadius: '3px',
                        outline: 'none',
                        cursor: isScrapingActive ? 'not-allowed' : 'pointer'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: colors.text.secondary,
                      marginBottom: spacing.sm
                    }}>
                      تأخیر (ثانیه): {settings.delay}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={settings.delay}
                      onChange={(e) => setSettings(prev => ({ ...prev, delay: parseInt(e.target.value) }))}
                      disabled={isScrapingActive}
                      style={{
                        width: '100%',
                        height: '6px',
                        background: colors.background.surface,
                        borderRadius: '3px',
                        outline: 'none',
                        cursor: isScrapingActive ? 'not-allowed' : 'pointer'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.sm,
                      fontSize: '14px',
                      color: colors.text.secondary,
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={settings.intelligentMode}
                        onChange={(e) => setSettings(prev => ({ ...prev, intelligentMode: e.target.checked }))}
                        disabled={isScrapingActive}
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: colors.accent.primary,
                          borderRadius: '4px'
                        }}
                      />
                      حالت هوشمند
                    </label>

                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.sm,
                      fontSize: '14px',
                      color: colors.text.secondary,
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={settings.useProxies}
                        onChange={(e) => setSettings(prev => ({ ...prev, useProxies: e.target.checked }))}
                        disabled={isScrapingActive}
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: colors.accent.primary,
                          borderRadius: '4px'
                        }}
                      />
                      استفاده از پروکسی
                    </label>

                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.sm,
                      fontSize: '14px',
                      color: colors.text.secondary,
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={settings.enableRating}
                        onChange={(e) => setSettings(prev => ({ ...prev, enableRating: e.target.checked }))}
                        disabled={isScrapingActive}
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: colors.accent.primary,
                          borderRadius: '4px'
                        }}
                      />
                      رتبه‌بندی کیفیت
                    </label>
                  </div>

                  <Button
                    onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                    variant="secondary"
                    icon={Wrench}
                    aria-label="نمایش تنظیمات پیشرفته"
                  >
                    تنظیمات پیشرفته
                  </Button>
                </div>
              </Card>

              {/* System Stats */}
              {systemHealth && systemHealth.perSource.length > 0 && (
                <Card title="آمار منابع" icon={BarChart3}>
                  <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing.sm,
                    maxHeight: '200px',
                    overflowY: 'auto',
                    ...componentStyles.scrollbar
                  } as React.CSSProperties}>
                    {systemHealth.perSource.map((stat, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: spacing.sm,
                        background: colors.background.tertiary + '50',
                        borderRadius: '8px'
                      }}>
                        <span style={{ 
                          fontSize: '14px', 
                          color: colors.text.secondary,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1
                        }}>
                          {stat.source}
                        </span>
                        <span style={{ 
                          fontSize: '14px', 
                          fontWeight: '500', 
                          color: colors.text.primary,
                          marginLeft: spacing.sm
                        }}>
                          {stat.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Control Buttons */}
              <Card>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                  <Button
                    onClick={clearLogs}
                    variant="secondary"
                    icon={Trash2}
                    aria-label="پاک کردن لاگ‌ها"
                  >
                    پاک کردن لاگ‌ها
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Live Logs Section */}
          <Card>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: spacing.lg,
              flexWrap: 'wrap',
              gap: spacing.md
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: '700', 
                  color: colors.text.primary,
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm
                }}>
                  <Activity size={24} style={{ color: colors.accent.success }} />
                  لاگ‌های زنده سیستم
                </h3>
                <span style={{
                  backgroundColor: colors.accent.success + '30',
                  color: colors.status.success.text,
                  padding: `${spacing.xs} ${spacing.sm}`,
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {scrapingLogs.length}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <select
                  value={filterLogs}
                  onChange={(e) => setFilterLogs(e.target.value)}
                  style={{
                    background: colors.background.tertiary,
                    color: colors.text.primary,
                    border: `1px solid ${colors.border.primary}`,
                    borderRadius: '8px',
                    padding: `${spacing.sm} ${spacing.md}`,
                    fontSize: '14px'
                  }}
                  aria-label="فیلتر نوع لاگ"
                >
                  <option value="all">همه</option>
                  <option value="info">اطلاعات</option>
                  <option value="success">موفقیت</option>
                  <option value="warning">هشدار</option>
                  <option value="error">خطا</option>
                </select>
              </div>
            </div>
            
            <div style={{
              height: '400px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.sm,
              background: `linear-gradient(135deg, ${colors.status.info.lighter}40, ${colors.text.primary}70, ${colors.status.info.lighter}30)`,
              backdropFilter: 'blur(8px)',
              borderRadius: '12px',
              border: `1px solid ${colors.border.secondary}20`,
              padding: spacing.md,
              ...componentStyles.scrollbar
            } as React.CSSProperties}>
              {filteredLogs.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  color: colors.text.muted, 
                  padding: spacing.xl
                }}>
                  <Search size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                  <p style={{ fontWeight: '500', margin: '0 0 8px' }}>هنوز لاگی ثبت نشده است</p>
                  <p style={{ fontSize: '14px', margin: 0 }}>پس از شروع عملیات، فعالیت‌ها اینجا نمایش داده می‌شوند</p>
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    style={{
                      padding: spacing.md,
                      borderRadius: '8px',
                      border: `1px solid`,
                      transition: 'all 150ms ease',
                      backdropFilter: 'blur(4px)',
                      ...getLogBgColor(log.type)
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.md }}>
                      {getLogIcon(log.type)}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          marginBottom: spacing.xs,
                          gap: spacing.md
                        }}>
                          <p style={{ 
                            fontWeight: '500', 
                            color: colors.text.inverse,
                            margin: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            flex: 1
                          }}>
                            {log.message}
                          </p>
                          <span style={{ 
                            fontSize: '12px', 
                            color: colors.text.inverse + '80',
                            whiteSpace: 'nowrap',
                            marginLeft: spacing.sm
                          }}>
                            {log.timestamp.toLocaleTimeString('fa-IR')}
                          </span>
                        </div>
                        {log.details && (
                          <p style={{ 
                            fontSize: '14px', 
                            color: colors.text.inverse + 'C0',
                            margin: `${spacing.xs} 0 0`
                          }}>
                            {log.details}
                          </p>
                        )}
                        {log.source && (
                          <p style={{ 
                            fontSize: '12px', 
                            color: colors.text.inverse + '80',
                            margin: `${spacing.xs} 0 0`
                          }}>
                            منبع: {log.source}
                          </p>
                        )}
                        {log.jobId && (
                          <p style={{ 
                            fontSize: '12px', 
                            color: colors.text.inverse + '80',
                            margin: `${spacing.xs} 0 0`
                          }}>
                            Job ID: {log.jobId}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>
          </Card>

          {/* Create Source Modal */}
          <Modal
            isOpen={showCreateSource}
            onClose={() => setShowCreateSource(false)}
            title="افزودن منبع جدید"
            maxWidth="800px"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
              <Input
                label="نام منبع"
                value={createSourceForm.name}
                onChange={(e) => setCreateSourceForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="مثال: دادگستری ایران"
                required
              />
              
              <Input
                label="URL پایه"
                type="url"
                value={createSourceForm.base_url}
                onChange={(e) => setCreateSourceForm(prev => ({ ...prev, base_url: e.target.value }))}
                placeholder="https://example.com"
                required
              />
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: spacing.md 
              }}>
                <Select
                  label="دسته‌بندی"
                  value={createSourceForm.category}
                  onChange={(e) => setCreateSourceForm(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="دادگستری">دادگستری</option>
                  <option value="قانون">قانون</option>
                  <option value="وکالت">وکالت</option>
                  <option value="دولتی">دولتی</option>
                  <option value="اقتصادی">اقتصادی</option>
                </Select>
                
                <Input
                  label="اولویت"
                  type="number"
                  min="1"
                  max="10"
                  value={createSourceForm.priority.toString()}
                  onChange={(e) => setCreateSourceForm(prev => ({ ...prev, priority: parseInt(e.target.value) || 2 }))}
                />
              </div>
              
              <Input
                label="Selector محتوا"
                value={createSourceForm.selectors.content}
                onChange={(e) => setCreateSourceForm(prev => ({ 
                  ...prev, 
                  selectors: { ...prev.selectors, content: e.target.value }
                }))}
                placeholder="article, main, .content, #content"
                description="Selector CSS برای استخراج محتوای اصلی"
              />
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: spacing.md 
              }}>
                <Input
                  label="Selector عنوان"
                  value={createSourceForm.selectors.title}
                  onChange={(e) => setCreateSourceForm(prev => ({ 
                    ...prev, 
                    selectors: { ...prev.selectors, title: e.target.value }
                  }))}
                  placeholder="h1, h2, title"
                />
                
                <Input
                  label="Selector تاریخ"
                  value={createSourceForm.selectors.date}
                  onChange={(e) => setCreateSourceForm(prev => ({ 
                    ...prev, 
                    selectors: { ...prev.selectors, date: e.target.value }
                  }))}
                  placeholder="time, .date, .publish-date"
                />
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: spacing.md, 
              marginTop: spacing.xl,
              justifyContent: 'flex-end',
              flexWrap: 'wrap'
            }}>
              <Button
                onClick={createNewSource}
                disabled={!createSourceForm.name || !createSourceForm.base_url}
                variant="success"
                aria-label="ایجاد منبع جدید"
              >
                ایجاد منبع
              </Button>
              
              <Button
                onClick={() => setShowCreateSource(false)}
                variant="secondary"
                aria-label="انصراف از ایجاد منبع"
              >
                انصراف
              </Button>
            </div>
          </Modal>

          {/* Advanced Settings Modal */}
          <Modal
            isOpen={showAdvancedSettings}
            onClose={() => setShowAdvancedSettings(false)}
            title="تنظیمات پیشرفته"
            maxWidth="600px"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: colors.text.secondary,
                  marginBottom: spacing.sm
                }}>
                  Job های موازی: {settings.parallelJobs}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={settings.parallelJobs}
                  onChange={(e) => setSettings(prev => ({ ...prev, parallelJobs: parseInt(e.target.value) }))}
                  style={{
                    width: '100%',
                    height: '6px',
                    background: colors.background.surface,
                    borderRadius: '3px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
              </div>
              
              <Textarea
                label="User Agent"
                value={settings.userAgent}
                onChange={(e) => setSettings(prev => ({ ...prev, userAgent: e.target.value }))}
                placeholder="Mozilla/5.0..."
                style={{ height: '80px' }}
              />
              
              <Select
                label="زبان پردازش"
                value={settings.language}
                onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value as 'fa' | 'en' | 'auto' }))}
              >
                <option value="auto">تشخیص خودکار</option>
                <option value="fa">فارسی</option>
                <option value="en">انگلیسی</option>
              </Select>
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: spacing.md, 
              marginTop: spacing.xl,
              justifyContent: 'flex-end'
            }}>
              <Button
                onClick={() => setShowAdvancedSettings(false)}
                variant="primary"
                aria-label="ذخیره تنظیمات پیشرفته"
              >
                ذخیره تنظیمات
              </Button>
              
              <Button
                onClick={() => setShowAdvancedSettings(false)}
                variant="secondary"
                aria-label="انصراف از تنظیمات پیشرفته"
              >
                انصراف
              </Button>
            </div>
          </Modal>

          {/* Warning for no selection */}
          {selectedSources.length === 0 && !isScrapingActive && (
            <Card>
              <div style={{
                background: `linear-gradient(135deg, ${colors.background.secondary}, ${colors.accent.primary}20, ${colors.background.secondary})`,
                border: `1px solid ${colors.border.primary}`,
                borderRadius: '16px',
                padding: spacing.xl,
                textAlign: 'center'
              }}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: spacing.md, 
                  color: colors.text.primary 
                }}>
                  <div style={{
                    padding: spacing.md,
                    background: colors.status.warning.bg + '30',
                    borderRadius: '50%'
                  }}>
                    <AlertCircle size={32} style={{ color: colors.status.warning.bg }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                    <h3 style={{ fontWeight: '700', fontSize: '20px', margin: 0 }}>انتخاب منبع ضروری است</h3>
                    <p style={{ 
                      color: colors.text.secondary, 
                      fontSize: '16px', 
                      maxWidth: '600px', 
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      لطفاً حداقل یک منبع را انتخاب کنید تا بتوانید عملیات اسکریپینگ را آغاز نمایید
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default AdvancedScrapingDashboard;
