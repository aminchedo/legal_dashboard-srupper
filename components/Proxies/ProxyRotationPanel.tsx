import { useState } from 'react';
import { RotateCw } from 'lucide-react';
import { useRotationSettings, useSaveRotationSettings } from '../../hooks/useProxies';
import { ProxyRotationSettings } from '../../types';

export default function ProxyRotationPanel() {
    const { data: settings } = useRotationSettings();
    const save = useSaveRotationSettings();
    const [local, setLocal] = useState<ProxyRotationSettings | null>(null);
    const s = local || settings;

    const update = (patch: Partial<ProxyRotationSettings>) => {
        setLocal(prev => ({ ...(prev || (settings as ProxyRotationSettings)), ...patch }));
    };

    const persist = async () => {
        if (!s) return;
        await save.mutateAsync(s);
        setLocal(null);
    };

    if (!s) {
        return <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-sm text-gray-500">در حال بارگذاری تنظیمات چرخش...</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 inline-flex items-center gap-2"><RotateCw size={16} /> تنظیمات چرخش پروکسی</h3>
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm text-gray-600">استراتژی</label>
                        <select value={s.strategy} onChange={e => update({ strategy: e.target.value as any })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option value="sequential">Sequential</option>
                            <option value="random">Random</option>
                            <option value="roundrobin">Round-robin</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">فاصله زمانی (ثانیه)</label>
                        <input type="number" min={0} value={s.intervalSeconds} onChange={e => update({ intervalSeconds: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">تعداد درخواست به ازای هر پروکسی</label>
                        <input type="number" min={1} value={s.requestsPerProxy} onChange={e => update({ requestsPerProxy: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">آستانه خطا</label>
                        <input type="number" min={1} value={s.failureThreshold} onChange={e => update({ failureThreshold: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">مدت نشست چسبنده (ثانیه)</label>
                        <input type="number" min={0} value={s.stickySessionSeconds} onChange={e => update({ stickySessionSeconds: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button onClick={persist} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">ذخیره تنظیمات</button>
                </div>
            </div>
        </div>
    );
}


