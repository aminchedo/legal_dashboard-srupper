import { useMemo, useState } from 'react';
import { CheckCircleOutlined, SafetyCertificateOutlined, ClockCircleOutlined, GlobalOutlined, EnvironmentOutlined, ClusterOutlined, EditOutlined, FieldTimeOutlined, WarningOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { ProxyRecord, ProxyType } from '../../../types';

interface Props {
    isLoading: boolean;
    items: ProxyRecord[];
    selected: string[];
    onSelectedChange: (ids: string[]) => void;
    onEdit: (record: ProxyRecord) => void;
    onFiltersChange: (filters: { status: ProxyRecord['status'][]; types: ProxyType[]; countries: string[] }) => void;
    allCountries: string[];
}

export default function ProxyTable({ isLoading, items, selected, onSelectedChange, onEdit, onFiltersChange, allCountries }: Props) {
    const [status, setStatus] = useState<ProxyRecord['status'][]>([]);
    const [types, setTypes] = useState<ProxyType[]>([]);
    const [countries, setCountries] = useState<string[]>([]);

    const toggleSelect = (id: string) => {
        onSelectedChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
    };

    const toggleAll = () => {
        if (selected.length === items.length) onSelectedChange([]);
        else onSelectedChange(items.map(i => i.id));
    };

    const filtered = useMemo(() => items, [items]);

    const emitFilters = (next: { status?: ProxyRecord['status'][]; types?: ProxyType[]; countries?: string[] }) => {
        const ns = next.status ?? status;
        const nt = next.types ?? types;
        const nc = next.countries ?? countries;
        setStatus(ns);
        setTypes(nt);
        setCountries(nc);
        onFiltersChange({ status: ns, types: nt, countries: nc });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex flex-wrap items-center gap-3">
                {/* Status filter */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">وضعیت:</span>
                    {(['online', 'offline', 'testing', 'unknown'] as const).map(s => (
                        <button key={s} onClick={() => emitFilters({ status: status.includes(s) ? status.filter(x => x !== s) : [...status, s] })} className={`px-2.5 py-1 rounded-md text-sm border ${status.includes(s) ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{s === 'online' ? 'آنلاین' : s === 'offline' ? 'آفلاین' : s === 'testing' ? 'درحال تست' : 'نامشخص'}</button>
                    ))}
                </div>
                {/* Types */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">نوع:</span>
                    {(['HTTP', 'HTTPS', 'SOCKS4', 'SOCKS5'] as const).map(t => (
                        <button key={t} onClick={() => emitFilters({ types: types.includes(t) ? types.filter(x => x !== t) : [...types, t] })} className={`px-2.5 py-1 rounded-md text-sm border ${types.includes(t) ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{t}</button>
                    ))}
                </div>
                {/* Country */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">کشور:</span>
                    <select multiple value={countries} onChange={e => emitFilters({ countries: Array.from(e.target.selectedOptions).map(o => o.value) })} className="min-w-[160px] max-w-[240px] px-2 py-1 border border-gray-200 rounded-md">
                        {allCountries.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="p-3 text-right"><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} /></th>
                            <th className="p-3 text-right">IP</th>
                            <th className="p-3 text-right">پرت</th>
                            <th className="p-3 text-right">نوع</th>
                            <th className="p-3 text-right">وضعیت</th>
                            <th className="p-3 text-right">تأخیر</th>
                            <th className="p-3 text-right">آخرین تست</th>
                            <th className="p-3 text-right">کشور</th>
                            <th className="p-3 text-right">برچسب‌ها</th>
                            <th className="p-3 text-right">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={10} className="p-6 text-center text-gray-500">در حال بارگذاری...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={10} className="p-10 text-center text-gray-500">موردی یافت نشد</td></tr>
                        ) : filtered.map(p => (
                            <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="p-3"><input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} /></td>
                                <td className="p-3 font-mono text-sm">{p.ip}</td>
                                <td className="p-3">{p.port}</td>
                                <td className="p-3">{p.type}</td>
                                <td className="p-3">
                                    {p.status === 'online' && <span className="inline-flex items-center gap-1 text-green-700"><CheckCircleOutlined /> آنلاین</span>}
                                    {p.status === 'offline' && <span className="inline-flex items-center gap-1 text-red-700"><CloseCircleOutlined /> آفلاین</span>}
                                    {p.status === 'testing' && <span className="inline-flex items-center gap-1 text-yellow-700"><ClockCircleOutlined /> درحال تست</span>}
                                    {p.status === 'unknown' && <span className="inline-flex items-center gap-1 text-gray-600"><WarningOutlined /> نامشخص</span>}
                                </td>
                                <td className="p-3">{p.lastLatencyMs ? `${p.lastLatencyMs} ms` : '-'}</td>
                                <td className="p-3">{p.lastTestedAt ? new Date(p.lastTestedAt).toLocaleString('fa-IR') : '-'}</td>
                                <td className="p-3">{p.country || '-'}</td>
                                <td className="p-3">
                                    <div className="flex flex-wrap gap-1">
                                        {(p.labels || []).map(l => <span key={l} className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded">{l}</span>)}
                                    </div>
                                </td>
                                <td className="p-3">
                                    <button onClick={() => onEdit(p)} className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"><EditOutlined /> ویرایش</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


