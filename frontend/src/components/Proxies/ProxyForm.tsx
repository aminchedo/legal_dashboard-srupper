import { useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { X } from '../../utils/iconRegistry';
import { ProxyRecord, ProxyType } from '../../types';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initial?: ProxyRecord;
    onSubmit: (values: Omit<ProxyRecord, 'id' | 'status'> & Partial<Pick<ProxyRecord, 'status' | 'lastLatencyMs' | 'lastTestedAt' | 'anonymity'>>) => Promise<void> | void;
}

export default function ProxyForm({ open, onOpenChange, initial, onSubmit }: Props) {
    type FormState = Omit<ProxyRecord, 'id' | 'status'> & {
        lastLatencyMs?: number;
        lastTestedAt?: Date;
        username?: string;
        password?: string;
        country?: string;
        region?: string;
    };
    const [form, setForm] = useState<FormState>({
        ip: '',
        port: 8080,
        type: 'HTTP',
        labels: [],
        timeoutMs: 5000,
        anonymity: 'unknown',
    });

    useEffect(() => {
        if (initial) {
            const { id, status, ...rest } = initial;
            setForm({
                ip: rest.ip,
                port: rest.port,
                type: rest.type,
                ...(rest.username ? { username: rest.username } : {}),
                ...(rest.password ? { password: rest.password } : {}),
                ...(rest.country ? { country: rest.country } : {}),
                ...(rest.region ? { region: rest.region } : {}),
                labels: rest.labels || [],
                ...(rest.timeoutMs ? { timeoutMs: rest.timeoutMs } : {}),
                ...(rest.lastLatencyMs ? { lastLatencyMs: rest.lastLatencyMs } : {}),
                ...(rest.lastTestedAt ? { lastTestedAt: rest.lastTestedAt } : {}),
                anonymity: rest.anonymity || 'unknown',
            });
        }
    }, [initial]);

    if (!open) return null;

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.ip || !/^\d{1,3}(?:\.\d{1,3}){3}$/.test(form.ip)) return alert('IP معتبر وارد کنید');
        if (!form.port || form.port < 1 || form.port > 65535) return alert('پرت معتبر نیست');
        await onSubmit(form);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">{initial ? 'ویرایش پروکسی' : 'افزودن پروکسی'}</h3>
                    <button onClick={() => onOpenChange(false)} aria-label="Close"><X /></button>
                </div>
                <form onSubmit={submit} className="p-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">IP</label>
                            <input value={form.ip} onChange={e => setForm(f => ({ ...f, ip: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">پرت</label>
                            <input type="number" value={form.port} onChange={e => setForm(f => ({ ...f, port: parseInt(e.target.value) }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" min={1} max={65535} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">نوع</label>
                            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as ProxyType }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                {(['HTTP', 'HTTPS', 'SOCKS4', 'SOCKS5'] as const).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">نام کاربری</label>
                            <input value={form.username || ''} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">گذرواژه</label>
                            <input type="password" value={form.password || ''} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">کشور</label>
                            <input value={form.country || ''} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">استان/منطقه</label>
                            <input value={form.region || ''} onChange={e => setForm(f => ({ ...f, region: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">برچسب‌ها (با , از هم جدا کنید)</label>
                            <input value={(form.labels || []).join(',')} onChange={e => setForm(f => ({ ...f, labels: e.target.value.split(',').map(x => x.trim()).filter(Boolean) }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Timeout (ms)</label>
                            <input type="number" value={form.timeoutMs ?? 5000} min={1000} max={60000} onChange={e => setForm(f => ({ ...f, timeoutMs: parseInt(e.target.value) }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
                        <button type="button" onClick={() => onOpenChange(false)} className="px-4 py-2 rounded-lg border border-gray-300">انصراف</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">ذخیره</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


