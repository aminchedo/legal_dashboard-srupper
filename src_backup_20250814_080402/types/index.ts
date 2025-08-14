// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Document types
export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  createdAt: string;
  updatedAt: string;
  status: 'processing' | 'completed' | 'failed' | 'pending';
  extractedText?: string;
  metadata?: {
    pages?: number;
    language?: string;
    author?: string;
    keywords?: string[];
  };
  tags?: string[];
}

// Analytics types
export interface AnalyticsData {
  id: string;
  metric: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  period: string;
  timestamp: string;
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
  category?: string;
}

// Job types
export interface ScrapingJob {
  id: string;
  name: string;
  url: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  progress: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  config: {
    depth: number;
    delay: number;
    respectRobots: boolean;
    userAgent: string;
    proxy?: string;
  };
  results?: {
    pagesScraped: number;
    dataExtracted: number;
    errors: number;
  };
  logs?: string[];
}

// Proxy types
export interface Proxy {
  id: string;
  name: string;
  host: string;
  port: number;
  username?: string;
  password?: string;
  type: 'http' | 'https' | 'socks4' | 'socks5';
  status: 'active' | 'inactive' | 'error';
  location?: string;
  responseTime?: number;
  lastChecked?: string;
  usage: {
    requests: number;
    successRate: number;
    avgResponseTime: number;
  };
}

// System types
export interface SystemHealth {
  cpu: {
    usage: number;
    cores: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
  network: {
    rx: number;
    tx: number;
  };
  services: {
    name: string;
    status: 'running' | 'stopped' | 'error';
    uptime: number;
  }[];
  alerts: SystemAlert[];
}

export interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

// Filter and pagination types
export interface FilterOptions {
  search?: string;
  status?: string;
  type?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface DocumentUploadForm {
  files: File[];
  tags?: string[];
  processImmediately?: boolean;
}

export interface ProxyForm {
  name: string;
  host: string;
  port: number;
  username?: string;
  password?: string;
  type: 'http' | 'https' | 'socks4' | 'socks5';
}

export interface JobForm {
  name: string;
  url: string;
  depth: number;
  delay: number;
  respectRobots: boolean;
  userAgent: string;
  proxy?: string;
}

// Dashboard types
export interface DashboardStats {
  totalDocuments: number;
  totalJobs: number;
  activeProxies: number;
  systemHealth: 'good' | 'warning' | 'critical';
  documentsProcessed: number;
  jobsCompleted: number;
  successRate: number;
  avgProcessingTime: number;
}

export interface DashboardActivity {
  id: string;
  type: 'document' | 'job' | 'proxy' | 'system';
  action: string;
  description: string;
  timestamp: string;
  status: 'success' | 'error' | 'warning' | 'info';
  user?: string;
}

// Settings types
export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    jobCompletion: boolean;
    systemAlerts: boolean;
  };
  display: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    dateFormat: string;
  };
  performance: {
    autoRefresh: boolean;
    refreshInterval: number;
    maxConcurrentJobs: number;
  };
}

export interface SystemSettings {
  general: {
    siteName: string;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
  };
  security: {
    sessionTimeout: number;
    passwordPolicy: {
      minLength: number;
      requireSpecialChars: boolean;
      requireNumbers: boolean;
    };
    rateLimiting: {
      enabled: boolean;
      requestsPerMinute: number;
    };
  };
  storage: {
    maxFileSize: number;
    allowedFileTypes: string[];
    retentionPeriod: number;
  };
}