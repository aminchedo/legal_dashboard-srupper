import { ReactNode } from 'react';

type MetricCardProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: string;
};

export default function MetricCard({ icon, label, value, trend }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3">
        <div>{icon}</div>
        <div>
          <div className="text-gray-500 text-sm">{label}</div>
          <div className="text-2xl font-semibold">{value}</div>
          {trend && <div className="text-xs text-gray-400 mt-1">{trend}</div>}
        </div>
      </div>
    </div>
  );
}