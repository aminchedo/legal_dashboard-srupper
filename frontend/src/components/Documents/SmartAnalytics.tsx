import React, { useEffect, useState } from 'react';
import Card from '../ui/Card';

export interface SmartAnalyticsProps {
  fetchAnalytics: () => Promise<{ total: number; avgScore: number; categories: Array<{ name: string; count: number }> }>;
}

const SmartAnalytics: React.FC<SmartAnalyticsProps> = ({ fetchAnalytics }) => {
  const [data, setData] = useState<{ total: number; avgScore: number; categories: Array<{ name: string; count: number }> } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      try {
        const d = await fetchAnalytics();
        if (alive) setData(d);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    const t = setInterval(load, 10000);
    return () => { alive = false; clearInterval(t); };
  }, [fetchAnalytics]);

  if (!data) {
    return (
      <Card variant="ghost" padding="sm">
        {loading ? <div className="text-sm text-neutral-500">در حال بارگذاری...</div> : <div className="text-sm text-neutral-500">داده‌ای موجود نیست</div>}
      </Card>
    );
  }

  return (
    <Card variant="ghost" padding="sm">
      <div className="flex items-center justify-between text-sm">
        <div>کل اسناد: <span className="font-semibold">{data.total.toLocaleString('fa-IR')}</span></div>
        <div>میانگین امتیاز: <span className="font-semibold">{Math.round(data.avgScore * 100)}%</span></div>
        <div>دسته‌ها: <span className="font-semibold">{data.categories.length.toLocaleString('fa-IR')}</span></div>
      </div>
    </Card>
  );
};

export default SmartAnalytics;