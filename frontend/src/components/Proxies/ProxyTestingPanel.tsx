import { useState } from 'react';
import { ThunderboltOutlined, GlobalOutlined, LoadingOutlined, ClusterOutlined, PlayCircleOutlined, SettingOutlined } from '../../icons/antd-stub';
import { PlayCircle, Activity, Loader2 } from '../../utils/iconRegistry';
import { ProxyRecord } from '../../types';
import { databaseService } from '../../services/database';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface Props {
    items: ProxyRecord[];
    onAfterTest?: () => void;
}

async function testProxy(proxy: ProxyRecord, testUrl: string, _concurrentAbortSignal: AbortSignal): Promise<{ success: boolean; latency: number; statusCode?: number; errorMessage?: string; geo?: any }> {
    const proxyUrl = proxy.username || proxy.password
        ? `${proxy.type.toLowerCase()}://${encodeURIComponent(proxy.username || '')}:${encodeURIComponent(proxy.password || '')}@${proxy.ip}:${proxy.port}`
        : `${proxy.type.toLowerCase()}://${proxy.ip}:${proxy.port}`;
    const res = await fetch(`${API_BASE}/proxy/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proxy: proxyUrl, testUrl, timeoutMs: proxy.timeoutMs ?? 8000 })
    });
    const data = await res.json();
    return { success: !!data.success, latency: Math.round(data.latencyMs || 0), statusCode: data.statusCode, errorMessage: data.error };
}

export default function ProxyTestingPanel({ items, onAfterTest }: Props) {
    const [testUrl, setTestUrl] = useState('https://httpbin.org/status/204');
    const [concurrency, setConcurrency] = useState(5);
    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState(0);

    const runAll = async () => {
        if (isRunning || items.length === 0) return;
        setIsRunning(true);
        setProgress(0);
        const abort = new AbortController();
        let completed = 0;
        const queue = [...items];
        const workers = new Array(Math.min(concurrency, items.length)).fill(null).map(async () => {
            while (queue.length) {
                const p = queue.shift()!;
                // update status to testing
                await databaseService.addOrUpdateProxy({ ...p, status: 'testing' });
                const result = await testProxy(p, testUrl, abort.signal);
                await databaseService.addProxyTestResult({
                    id: `${p.id}-${Date.now()}`,
                    proxyId: p.id,
                    testedAt: new Date(),
                    success: result.success,
                    latencyMs: result.latency,
                    statusCode: result.statusCode ?? 0,
                    errorMessage: result.errorMessage ?? '',
                    testUrl,
                });
                completed++;
                setProgress(Math.round((completed / items.length) * 100));
            }
        });
        await Promise.all(workers);
        setIsRunning(false);
        onAfterTest?.();
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 inline-flex items-center gap-2"><Activity size={16} /> تست گروهی پروکسی</h3>
                {isRunning ? <span className="text-xs text-blue-700 inline-flex items-center gap-1"><Loader2 className="animate-spin" size={14} /> درحال تست ({progress}%)</span> : null}
            </div>
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">آدرس تست</label>
                    <input value={testUrl} onChange={e => setTestUrl(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-600">همزمانی</label>
                    <input type="number" min={1} max={20} value={concurrency} onChange={e => setConcurrency(parseInt(e.target.value))} className="w-24 px-3 py-2 border border-gray-300 rounded-lg" />
                    <button disabled={isRunning || items.length === 0} onClick={runAll} className="ml-auto inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300">
                        <PlayCircle size={16} /> تست همه
                    </button>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: progress + '%' }} />
                </div>
            </div>
        </div>
    );
}


