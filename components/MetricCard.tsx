import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  trend?: {
    value: number;
    label: string;
  };
}

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  yellow: 'from-yellow-500 to-yellow-600',
  red: 'from-red-500 to-red-600',
  purple: 'from-purple-500 to-purple-600',
} as const;

export default function MetricCard({ title, value, icon: Icon, color = 'blue', trend }: MetricCardProps) {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200/70 dark:border-slate-800 p-6 hover:shadow-elegant transition-shadow duration-300">
      <div className="pointer-events-none absolute -top-8 -left-8 w-32 h-32 bg-gradient-radial from-brand-500/20 to-transparent rounded-full" />
      <div className="flex items-center justify-between relative">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString('fa-IR') : value}
          </p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${trend.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend.value >= 0 ? '+' : ''}{trend.value}%
              </span>
              <span className="text-gray-500 text-sm mr-2">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={`bg-gradient-to-br ${colorClasses[color]} p-3 rounded-lg shadow-glass`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  );
}