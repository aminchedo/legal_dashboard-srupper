import React from 'react';
import { Card, Badge, ProgressBar, StatusIndicator, LoadingSpinner } from './atoms';
import { formatNumber, formatBytes, formatPercentage } from '../../lib/formatters';

// MOLECULES: Component combinations following atomic design

export interface MetricCardProps {
  title: string;
  value: number;
  unit?: string;
  trend?: number;
  status?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  loading?: boolean;
  formatType?: 'number' | 'bytes' | 'percentage' | 'currency';
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  unit, 
  trend, 
  status = 'neutral',
  loading = false,
  formatType = 'number',
  className = ''
}) => {
  const formatValue = () => {
    switch (formatType) {
      case 'bytes':
        return formatBytes(value);
      case 'percentage':
        return formatPercentage(value);
      case 'currency':
        return formatNumber(value);
      default:
        return formatNumber(value);
    }
  };

  const formattedValue = formatValue();
  
  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <Card className={`card-hover ${className}`} hover>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <Badge status={status}>
          <StatusIndicator status={status === 'success' ? 'online' : status === 'error' ? 'error' : 'warning'} size="sm" />
        </Badge>
      </div>
      <div className="mt-2">
        <span className="text-2xl font-semibold text-gray-900">
          {formattedValue}
        </span>
        {unit && <span className="text-sm text-gray-500 mr-1">{unit}</span>}
      </div>
      {trend !== undefined && (
        <div className="mt-2 flex items-center">
          <TrendIcon trend={trend} />
          <span className={`text-sm ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'}`}>
            {trend !== 0 && `${trend > 0 ? '+' : ''}${Math.abs(trend)}% از ماه گذشته`}
            {trend === 0 && 'بدون تغییر'}
          </span>
        </div>
      )}
    </Card>
  );
};

export interface SystemHealthCardProps {
  title: string;
  metrics: Array<{
    name: string;
    value: number;
    status?: 'normal' | 'warning' | 'danger';
  }>;
  className?: string;
}

export const SystemHealthCard: React.FC<SystemHealthCardProps> = ({ title, metrics, className = '' }) => {
  return (
    <Card className={className}>
      <div className="bg-gray-50 border-b border-gray-300 -mx-6 -mt-6 px-4 py-3 mb-4">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
      </div>
      
      <div className="space-y-3">
        {metrics.map((metric) => (
          <div key={metric.name} className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{metric.name}:</span>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <ProgressBar
                value={metric.value}
                status={metric.status}
                showText={true}
                className="w-20"
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export interface ActionCardProps {
  title: string;
  description: string;
  actions: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    disabled?: boolean;
  }>;
  icon?: React.ReactNode;
  className?: string;
}

export const ActionCard: React.FC<ActionCardProps> = ({ 
  title, 
  description, 
  actions, 
  icon,
  className = ''
}) => {
  return (
    <Card className={className}>
      <div className="flex items-start space-x-3 rtl:space-x-reverse">
        {icon && (
          <div className="flex-shrink-0">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                disabled={action.disabled}
                className={`
                  px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                  ${action.variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                  ${action.variant === 'secondary' ? 'bg-gray-200 text-gray-900 hover:bg-gray-300' : ''}
                  ${action.variant === 'outline' ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50' : ''}
                  ${action.variant === 'danger' ? 'bg-red-600 text-white hover:bg-red-700' : ''}
                  ${!action.variant ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export interface DataTableProps {
  headers: string[];
  rows: (string | number | React.ReactNode)[][];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export const DataTable: React.FC<DataTableProps> = ({ 
  headers, 
  rows, 
  loading = false,
  emptyMessage = 'داده‌ای موجود نیست',
  className = ''
}) => {
  if (loading) {
    return (
      <Card className={className}>
        <SkeletonTable />
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="px-6 py-4 text-center text-sm text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

// SKELETON COMPONENTS for loading states

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <Card className={`animate-fade-in ${className}`}>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  </Card>
);

export const SkeletonMetrics: React.FC = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center justify-between animate-fade-in">
        <div className="h-3 bg-gray-200 rounded w-16"></div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="w-20 h-2 bg-gray-200 rounded-full"></div>
          <div className="h-3 bg-gray-200 rounded w-8"></div>
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonTable: React.FC = () => (
  <div className="space-y-3">
    <div className="flex space-x-4 rtl:space-x-reverse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-4 bg-gray-200 rounded flex-1"></div>
      ))}
    </div>
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex space-x-4 rtl:space-x-reverse">
        {[1, 2, 3, 4].map((j) => (
          <div key={j} className="h-3 bg-gray-200 rounded flex-1"></div>
        ))}
      </div>
    ))}
  </div>
);

// HELPER COMPONENTS

const TrendIcon: React.FC<{ trend: number }> = ({ trend }) => {
  if (trend > 0) {
    return <span className="text-green-600 mr-1">↗️</span>;
  }
  if (trend < 0) {
    return <span className="text-red-600 mr-1">↘️</span>;
  }
  return <span className="text-gray-600 mr-1">➡️</span>;
};