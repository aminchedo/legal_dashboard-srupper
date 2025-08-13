import React, { useEffect, useMemo, useState } from 'react';
import { ProxyRecord, ProxyTestResult } from '../../../types';
import Card from '../../../components/ui/Card';
import { MetricCard } from '../../../components/ui/Card';
import ScoreIndicator from '../../../components/ScoreIndicator';
import { databaseService } from '../../../services/database';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Activity, 
  Globe, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Clock,
  Shield,
  Target,
  BarChart3
} from 'lucide-react';

interface Props {
  proxies: ProxyRecord[];
  mode?: 'simple' | 'comprehensive';
  showCharts?: boolean;
  showTopPerformers?: boolean;
  className?: string;
}

interface AnalyticsSummary {
  total: number;
  successRate: number;
  avgLatency: number;
  lastTests: ProxyTestResult[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

/**
 * Enhanced proxy analytics panel with both simple and comprehensive modes
 * Combines functionality from both the simple and advanced analytics components
 */
export default function ProxyAnalyticsPanel({ 
  proxies, 
  mode = 'comprehensive',
  showCharts = true,
  showTopPerformers = true,
  className = ''
}: Props): JSX.Element {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(false);

  // Simple mode: Load test results from database
  useEffect(() => {
    if (mode === 'simple') {
      let alive = true;
      const load = async () => {
        setLoading(true);
        try {
          const tests = await databaseService.listProxyTestResults(100);
          if (!alive) return;
          const total = tests.length;
          const successes = tests.filter(t => t.success).length;
          const successRate = total ? Math.round((successes / total) * 100) : 0;
          const latencies = tests.filter(t => t.success).map(t => t.latencyMs);
          const avgLatency = latencies.length ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0;
          setSummary({ total, successRate, avgLatency, lastTests: tests.slice(0, 5) });
        } finally {
          if (alive) setLoading(false);
        }
      };
      load();
      const t = setInterval(load, 5000);
      return () => { alive = false; clearInterval(t); };
    }
  }, [mode]);

  // Comprehensive analytics calculations
  const analytics = useMemo(() => {
    if (!proxies.length) {
      return {
        totalProxies: 0,
        onlineProxies: 0,
        offlineProxies: 0,
        avgLatency: 0,
        statusDistribution: [],
        typeDistribution: [],
        countryDistribution: [],
        latencyDistribution: [],
        uptime: 0,
        performanceScore: 0,
        topPerformers: [],
        recentTests: [],
      };
    }

    const totalProxies = proxies.length;
    const onlineProxies = proxies.filter(p => p.status === 'online').length;
    const offlineProxies = proxies.filter(p => p.status === 'offline').length;
    
    // Calculate average latency for online proxies
    const onlineWithLatency = proxies.filter(p => p.status === 'online' && p.lastLatencyMs);
    const avgLatency = onlineWithLatency.length > 0
      ? Math.round(onlineWithLatency.reduce((sum, p) => sum + (p.lastLatencyMs || 0), 0) / onlineWithLatency.length)
      : 0;

    // Status distribution
    const statusCounts = proxies.reduce((acc, proxy) => {
      acc[proxy.status] = (acc[proxy.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      percentage: Math.round((count / totalProxies) * 100),
    }));

    // Type distribution
    const typeCounts = proxies.reduce((acc, proxy) => {
      acc[proxy.type] = (acc[proxy.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const typeDistribution = Object.entries(typeCounts).map(([type, count]) => ({
      name: type,
      value: count,
      percentage: Math.round((count / totalProxies) * 100),
    }));

    // Country distribution (top 10)
    const countryCounts = proxies.reduce((acc, proxy) => {
      if (proxy.country) {
        acc[proxy.country] = (acc[proxy.country] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const countryDistribution = Object.entries(countryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([country, count]) => ({
        name: country,
        value: count,
        percentage: Math.round((count / totalProxies) * 100),
      }));

    // Latency distribution
    const latencyRanges = [
      { range: '0-100ms', min: 0, max: 100 },
      { range: '100-300ms', min: 100, max: 300 },
      { range: '300-500ms', min: 300, max: 500 },
      { range: '500-1000ms', min: 500, max: 1000 },
      { range: '1000ms+', min: 1000, max: Infinity },
    ];

    const latencyDistribution = latencyRanges.map(({ range, min, max }) => {
      const count = proxies.filter(p => 
        p.lastLatencyMs && p.lastLatencyMs >= min && p.lastLatencyMs < max
      ).length;
      return {
        name: range,
        value: count,
        percentage: totalProxies > 0 ? Math.round((count / totalProxies) * 100) : 0,
      };
    });

    // Calculate uptime percentage
    const uptime = totalProxies > 0 ? Math.round((onlineProxies / totalProxies) * 100) : 0;

    // Calculate performance score based on uptime and latency
    const latencyScore = avgLatency > 0 ? Math.max(0, 100 - (avgLatency / 10)) : 0;
    const performanceScore = Math.round((uptime * 0.7) + (latencyScore * 0.3));

    // Top performers (online proxies with best latency)
    const topPerformers = proxies
      .filter(p => p.status === 'online' && p.lastLatencyMs)
      .sort((a, b) => (a.lastLatencyMs || 0) - (b.lastLatencyMs || 0))
      .slice(0, 5)
      .map(p => ({
        id: p.id,
        ip: p.ip,
        port: p.port,
        latency: p.lastLatencyMs,
        country: p.country,
        type: p.type,
      }));

    // Recent test activity (mock data based on lastTestedAt)
    const recentTests = proxies
      .filter(p => p.lastTestedAt)
      .sort((a, b) => new Date(b.lastTestedAt!).getTime() - new Date(a.lastTestedAt!).getTime())
      .slice(0, 24)
      .map((p, index) => ({
        time: new Date(p.lastTestedAt!).getHours(),
        tests: Math.max(1, Math.floor(Math.random() * 10)),
        successful: p.status === 'online' ? Math.max(1, Math.floor(Math.random() * 8)) : 0,
      }));

    return {
      totalProxies,
      onlineProxies,
      offlineProxies,
      avgLatency,
      statusDistribution,
      typeDistribution,
      countryDistribution,
      latencyDistribution,
      uptime,
      performanceScore,
      topPerformers,
      recentTests,
    };
  }, [proxies]);

  // Simple mode rendering
  if (mode === 'simple') {
    if (loading && !summary) {
      return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-sm text-gray-500 ${className}`}>
          در حال بارگذاری تحلیل...
        </div>
      );
    }

    if (!summary) {
      return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-sm text-gray-500 ${className}`}>
          داده‌ای برای تحلیل وجود ندارد
        </div>
      );
    }

    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 ${className}`}>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 inline-flex items-center gap-2">
          <BarChart3 size={16} /> تحلیل عملکرد پروکسی
        </h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border p-3">
            <div className="text-xs text-gray-500 mb-1">کل تست‌ها</div>
            <div className="text-lg font-semibold">{summary.total.toLocaleString('fa-IR')}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-gray-500 mb-1">نرخ موفقیت</div>
            <div className="text-lg font-semibold">{summary.successRate}%</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-gray-500 mb-1">میانگین تاخیر</div>
            <div className="text-lg font-semibold">{summary.avgLatency} ms</div>
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-600 mb-2">آخرین نتایج</div>
          <div className="space-y-2">
            {summary.lastTests.map(t => (
              <div key={t.id} className="flex items-center justify-between text-sm">
                <div className="truncate max-w-[50%] text-gray-700">{t.proxyId}</div>
                <div className={t.success ? 'text-green-700' : 'text-red-700'}>
                  {t.success ? 'موفق' : 'ناموفق'}
                </div>
                <div className="text-gray-600">{t.latencyMs} ms</div>
                <div className="text-gray-500 truncate max-w-[30%]">
                  {t.statusCode || t.errorMessage || ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Comprehensive mode rendering
  if (proxies.length === 0) {
    return (
      <Card title="Proxy Analytics" className={`h-96 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <Activity size={48} className="mx-auto mb-4 text-gray-300" />
          <div className="text-lg font-medium mb-2">No Data Available</div>
          <div className="text-sm">Add some proxies to see analytics</div>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Globe className="h-6 w-6 text-blue-600" />}
          label="Total Proxies"
          value={analytics.totalProxies}
          variant="default"
        />
        <MetricCard
          icon={<Activity className="h-6 w-6 text-green-600" />}
          label="Online"
          value={analytics.onlineProxies}
          trend={`${analytics.uptime}% uptime`}
          variant="success"
        />
        <MetricCard
          icon={<Zap className="h-6 w-6 text-yellow-600" />}
          label="Avg Latency"
          value={`${analytics.avgLatency}ms`}
          trend={analytics.avgLatency < 200 ? "Excellent" : analytics.avgLatency < 500 ? "Good" : "Needs attention"}
          variant={analytics.avgLatency < 200 ? "success" : analytics.avgLatency < 500 ? "warning" : "error"}
        />
        <MetricCard
          icon={<Target className="h-6 w-6 text-purple-600" />}
          label="Performance Score"
          value={`${analytics.performanceScore}%`}
          variant={analytics.performanceScore > 80 ? "success" : analytics.performanceScore > 60 ? "warning" : "error"}
        />
      </div>

      {/* Performance Overview */}
      {showCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <Card title="Status Distribution" padding="md">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Latency Distribution */}
          <Card title="Latency Distribution" padding="md">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.latencyDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* Protocol Types and Countries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Protocol Types */}
        <Card title="Protocol Types" padding="md">
          <div className="space-y-3">
            {analytics.typeDistribution.map((type, index) => (
              <div key={type.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-medium">{type.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{type.value}</span>
                  <span className="text-xs text-gray-500">({type.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Countries */}
        <Card title="Top Countries" padding="md">
          <div className="space-y-3">
            {analytics.countryDistribution.slice(0, 8).map((country, index) => (
              <div key={country.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-gray-400" />
                  <span className="font-medium">{country.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{country.value}</span>
                  <span className="text-xs text-gray-500">({country.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Score */}
        <Card title="Overall Performance" padding="md">
          <div className="flex items-center justify-center p-6">
            <div className="text-center">
              <ScoreIndicator
                score={analytics.performanceScore}
                variant="ring"
                size="lg"
                color={analytics.performanceScore > 80 ? 'success' : analytics.performanceScore > 60 ? 'warning' : 'error'}
                animated
              />
              <div className="mt-4">
                <div className="text-lg font-semibold text-gray-900">
                  Performance Score
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Based on uptime and latency metrics
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Top Performers */}
        {showTopPerformers && (
          <Card title="Top Performers" padding="md">
            <div className="space-y-3">
              {analytics.topPerformers.length > 0 ? (
                analytics.topPerformers.map((proxy, index) => (
                  <div key={proxy.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-mono text-sm font-medium">
                        {proxy.ip}:{proxy.port}
                      </div>
                      <div className="text-xs text-gray-500">
                        {proxy.type} • {proxy.country || 'Unknown'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">
                        {proxy.latency}ms
                      </div>
                      <div className="text-xs text-gray-500">
                        #{index + 1}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Shield size={32} className="mx-auto mb-2 text-gray-300" />
                  <div className="text-sm">No online proxies available</div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Test Activity Timeline */}
      {showCharts && analytics.recentTests.length > 0 && (
        <Card title="Recent Test Activity (24h)" padding="md">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.recentTests}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => `Hour: ${value}`}
                  formatter={(value, name) => [value, name === 'tests' ? 'Total Tests' : 'Successful']}
                />
                <Area 
                  type="monotone" 
                  dataKey="tests" 
                  stackId="1" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="successful" 
                  stackId="2" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.8}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}