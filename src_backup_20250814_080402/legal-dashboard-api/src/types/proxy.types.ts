export interface ProxyTestResult {
  success: boolean;
  error?: string;
  responseTime?: number;
  statusCode?: number;
  [key: string]: unknown;
}

export interface ProxySettings {
  [key: string]: unknown;
}

export interface ProxyAuth {
  username: string;
  password: string;
}

export interface ProxyConfig {
  host: string;
  port: number;
  protocol: string;
  auth?: ProxyAuth;
}