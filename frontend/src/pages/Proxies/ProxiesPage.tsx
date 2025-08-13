import { useMemo, useState } from 'react';
import { DownloadOutlined, FilterOutlined, GlobalOutlined, PlusOutlined, ReloadOutlined, SearchOutlined, SettingOutlined, UploadOutlined } from '@ant-design/icons';
import { Search, Plus, Upload, RefreshCw, Download } from '../../utils/iconRegistry';
import { useProxies, useProxyBulkImport, useProxyDelete, useProxyUpsert } from '../../hooks/useProxies';
import { ProxyRecord, ProxyType } from '../../types';
import ProxyTable from './components/ProxiesTable';
import ProxyForm from './components/ProxyForm';
// import ProxyTestingPanel from './ProxyTestingPanel';
import ProxyRotationPanel from './components/ProxyRotationPanel';
// import ProxyAnalyticsPanel from './ProxyAnalyticsPanel.tsx';
// import { databaseService } from '../../lib/database';

export default function ProxyPage() {
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<ProxyRecord['status'][]>([]);
    const [typeFilter, setTypeFilter] = useState<ProxyType[]>([]);
    const [countryFilter, setCountryFilter] = useState<string[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<ProxyRecord | null>(null);

    const { data: proxies, refetch, isLoading } = useProxies({ query, status: statusFilter, types: typeFilter, countries: countryFilter });
    const upsert = useProxyUpsert();
    const remove = useProxyDelete();
    const bulkImport = useProxyBulkImport();

    const allCountries = useMemo(() => Array.from(new Set((proxies || []).map(p => p.country).filter(Boolean))) as string[], [proxies]);

    const handleCreate = () => {
        setEditing(null);
        setShowForm(true);
    };

    const handleEdit = (record: ProxyRecord) => {
        setEditing(record);
        setShowForm(true);
    };

    const handleDeleteSelected = async () => {
        for (const id of selected) {
            await remove.mutateAsync(id);
        }
        setSelected([]);
        refetch();
    };

    const handleImportFile = async (file: File) => {
        const text = await file.text();
        await bulkImport.mutateAsync(text);
        refetch();
    };

    const handleSave = async (values: Omit<ProxyRecord, 'id' | 'status'> & Partial<Pick<ProxyRecord, 'status'>>) => {
        const id = values.ip && values.port ? `${values.ip}:${values.port}` : `proxy-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        await upsert.mutateAsync({
            id,
            ip: values.ip,
            port: values.port,
            type: values.type,
            username: values.username ?? '',
            password: values.password ?? '',
            country: values.country ?? '',
            region: values.region ?? '',
            labels: values.labels || [],
            timeoutMs: values.timeoutMs ?? 5000,
            status: values.status || 'unknown',
            lastLatencyMs: values.lastLatencyMs ?? 0,
            lastTestedAt: values.lastTestedAt ?? new Date(),
            anonymity: values.anonymity ?? 'unknown',
        });
        setShowForm(false);
        setEditing(null);
        refetch();
    };

    const handleExport = async (format: 'csv' | 'txt' | 'json') => {
        // Fallback export: fetch current filtered proxies from UI state
        const current = (proxies || []).filter(p => {
            return (
                (!query || `${p.ip}:${p.port}`.includes(query)) &&
                (!statusFilter.length || statusFilter.includes(p.status)) &&
                (!typeFilter.length || typeFilter.includes(p.type)) &&
                (!countryFilter.length || (p.country && countryFilter.includes(p.country)))
            );
        });
        const data = format === 'json' ? JSON.stringify(current, null, 2)
            : current.map(p => `${p.ip}:${p.port}${p.country ? `,${p.country}` : ''}`).join('\n');
        const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const date = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
        a.download = `proxies_${date}.${format}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">مدیریت پروکسی</h1>
                <p className="text-gray-600">پیکربندی، تست و چرخش پروکسی‌ها با پشتیبانی کامل</p>
            </div>

            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[240px]">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input value={query} onChange={e => setQuery(e.target.value)} placeholder="جستجو (IP، کشور، برچسب)" className="w-full pr-9 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <button onClick={handleCreate} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700">
                    <Plus size={18} /> افزودن پروکسی
                </button>
                <label className="inline-flex items-center gap-2 cursor-pointer text-blue-700 hover:text-blue-800">
                    <Upload size={18} />
                    <span>ورود گروهی</span>
                    <input type="file" accept=".txt,.csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) void handleImportFile(f); }} />
                </label>
                <button onClick={() => refetch()} className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900">
                    <RefreshCw size={18} /> بروزرسانی
                </button>
                <div className="relative inline-flex items-center gap-2 ml-auto">
                    <Download size={18} className="text-gray-700" />
                    <button onClick={() => handleExport('csv')} className="text-sm px-2 py-1 rounded border border-gray-200 hover:bg-gray-50">CSV</button>
                    <button onClick={() => handleExport('txt')} className="text-sm px-2 py-1 rounded border border-gray-200 hover:bg-gray-50">TXT</button>
                    <button onClick={() => handleExport('json')} className="text-sm px-2 py-1 rounded border border-gray-200 hover:bg-gray-50">JSON</button>
                </div>
                <button disabled={!selected.length} onClick={handleDeleteSelected} className="text-red-600 hover:text-red-700 disabled:text-gray-300">حذف انتخاب‌شده‌ها ({selected.length})</button>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                    <ProxyTable
                        isLoading={isLoading}
                        items={proxies || []}
                        selected={selected}
                        onSelectedChange={setSelected}
                        onEdit={handleEdit}
                        onFiltersChange={({ status, types, countries }) => { setStatusFilter(status); setTypeFilter(types); setCountryFilter(countries); }}
                        allCountries={allCountries}
                    />
                </div>
                <div className="space-y-6">
                    {/* <ProxyTestingPanel items={proxies || []} onAfterTest={() => refetch()} /> */}
                    <ProxyRotationPanel />
                    {/* <ProxyAnalyticsPanel /> */}
                </div>
            </div>

            {showForm && (
                <ProxyForm
                    open={showForm}
                    onOpenChange={setShowForm}
                    initial={editing as any}
                    onSubmit={handleSave}
                />
            )}
        </div>
    );
}


