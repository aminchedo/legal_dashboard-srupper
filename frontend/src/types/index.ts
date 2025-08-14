export interface ScrapedItem {
  id: string;
  url: string;
  title: string;
  content: string;
  domain: string;
  category: string;
  ratingScore: number;
  wordCount: number;
  createdAt: Date;
  status: 'completed' | 'processing' | 'failed';
}

export interface LegalSite {
  id: number;
  name: string;
  url: string;
  category: string;
  active: boolean;
  lastScraped?: Date;
}

export interface DatabaseStats {
  totalItems: number;
  categories: Record<string, number>;
  avgRating: number;
  topDomains: Record<string, number>;
  recentItems: number;
}

export interface ScrapingSettings {
  maxPages: number;
  delay: number;
  minContentLength: number;
  enableRating: boolean;
}

export type PageType = 'dashboard' | 'analytics' | 'recording' | 'jobs' | 'documents' | 'system' | 'proxies' | 'settings' | 'help' | 'data';

export type ProxyType = 'HTTP' | 'HTTPS' | 'SOCKS4' | 'SOCKS5';

export interface ProxyRecord {
  id: string;
  ip: string;
  port: number;
  type: ProxyType;
  username?: string;
  password?: string;
  country?: string;
  region?: string;
  labels?: string[];
  timeoutMs?: number;
  status: 'online' | 'offline' | 'testing' | 'unknown';
  lastTestedAt?: Date;
  lastLatencyMs?: number;
  anonymity?: 'transparent' | 'anonymous' | 'elite' | 'unknown';
}

export interface ProxyTestResult {
  id: string; // uuid
  proxyId: string;
  testedAt: Date;
  success: boolean;
  latencyMs: number;
  statusCode?: number;
  errorMessage?: string;
  testUrl: string;
  geoIp?: {
    ip?: string;
    country?: string;
    region?: string;
    city?: string;
  };
}

export interface ProxyRotationSettings {
  strategy: 'sequential' | 'random' | 'roundrobin';
  intervalSeconds: number; // time-based
  requestsPerProxy: number; // request-based
  failureThreshold: number; // consecutive failures before disable
  stickySessionSeconds: number;
  siteSpecificAssignments: Record<string, string[]>; // site -> proxyIds
  geoRestrictions: Record<string, string[]>; // site -> allowed countries
}