import { useEffect, useMemo, useState } from 'react';
import { BarChart3, Gauge, LineChart, PieChart } from 'lucide-react';
import { ProxyRecord, ProxyTestResult } from '../../types';
import { databaseService } from '../../lib/database';

interface AnalyticsSummary {
    total: number;
    successRate: number;
    avgLatency: number;
    lastTests: ProxyTestResult[];
}

export default function ProxyAnalyticsPanel() {
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
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
    }, []);

    if (loading && !summary) {
        return <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-sm text-gray-500">در حال بارگذاری تحلیل...</div>;
    }

    if (!summary) {
        return <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-sm text-gray-500">داده‌ای برای تحلیل وجود ندارد</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 inline-flex items-center gap-2"><BarChart3 size={16} /> تحلیل عملکرد پروکسی</h3>
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
                            <div className={t.success ? 'text-green-700' : 'text-red-700'}>{t.success ? 'موفق' : 'ناموفق'}</div>
                            <div className="text-gray-600">{t.latencyMs} ms</div>
                            <div className="text-gray-500 truncate max-w-[30%]">{t.statusCode || t.errorMessage || ''}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


