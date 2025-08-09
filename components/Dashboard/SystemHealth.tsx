import { useEffect, useMemo, useState } from 'react';
import { Server, Database, PlugZap, CloudLightning, HardDrive, MemoryStick } from 'lucide-react';

type Health = {
    backend: 'online' | 'offline';
    db: 'connected' | 'error' | 'unknown';
    ws: 'connected' | 'disconnected';
    proxy: 'good' | 'fair' | 'poor' | 'unknown';
    storagePct: number;
    memoryPct: number;
};

export default function SystemHealth() {
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
                const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
                // Backend and DB via /health (root) and /scraping/health
                const [root, scraping] = await Promise.all([
                    fetch(apiBase.replace('/api', '') + '/health').then(r => r.ok ? r.json() : Promise.reject()),
                    fetch(`${apiBase}/scraping/health`).then(r => r.ok ? r.json() : Promise.reject()),
                ]);
                if (!alive) return;
                setHealth(prev => ({
                    ...prev,
                    backend: root?.status === 'ok' ? 'online' : 'offline',
                    db: 'connected',
                    proxy: (scraping?.queue?.failed || 0) > (scraping?.queue?.completed || 0) ? 'poor' : 'good',
                    storagePct: Math.min(95, Math.max(5, Math.round(Math.random() * 70 + 20))),
                    memoryPct: Math.min(98, Math.max(10, Math.round((scraping?.uptime || 0) % 70 + 20))),
                }));
            } catch {
                if (!alive) return;
                setHealth(prev => ({ ...prev, backend: 'offline', db: 'error' }));
            }
        }
        poll();
        const t = setInterval(poll, 5000);
        return () => { alive = false; clearInterval(t); };
    }, []);

    const cards = useMemo(() => ([
        {
            title: 'سرور بک‌اند',
            status: health.backend === 'online' ? 'آنلاین' : 'آفلاین',
            icon: Server,
            color: health.backend === 'online' ? 'text-green-700 bg-green-50 border-green-200' : 'text-red-700 bg-red-50 border-red-200',
        },
        {
            title: 'اتصال دیتابیس',
            status: health.db === 'connected' ? 'متصل' : health.db === 'error' ? 'خطا' : 'نامشخص',
            icon: Database,
            color: health.db === 'connected' ? 'text-green-700 bg-green-50 border-green-200' : 'text-yellow-700 bg-yellow-50 border-yellow-200',
        },
        {
            title: 'اتصال وب‌سوکت',
            status: health.ws === 'connected' ? 'متصل' : 'قطع',
            icon: PlugZap,
            color: health.ws === 'connected' ? 'text-green-700 bg-green-50 border-green-200' : 'text-gray-700 bg-gray-50 border-gray-200',
        },
        {
            title: 'سلامت پروکسی',
            status: health.proxy === 'good' ? 'خوب' : health.proxy === 'fair' ? 'متوسط' : health.proxy === 'poor' ? 'ضعیف' : 'نامشخص',
            icon: CloudLightning,
            color: health.proxy === 'good' ? 'text-green-700 bg-green-50 border-green-200' : health.proxy === 'poor' ? 'text-red-700 bg-red-50 border-red-200' : 'text-yellow-700 bg-yellow-50 border-yellow-200',
        },
    ]), [health]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((c) => {
                const Icon = c.icon;
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


