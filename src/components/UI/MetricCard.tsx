import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { Card } from './Card';

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    type: 'increase' | 'decrease' | 'neutral';
    label?: string;
  };
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  className?: string;
  animate?: boolean;
  delay?: number;
}

const iconColorClasses = {
  blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
  red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  gray: 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
};

const changeColorClasses = {
  increase: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
  decrease: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
  neutral: 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800',
};

const sizeClasses = {
  sm: {
    container: 'p-4',
    icon: 'h-8 w-8',
    iconSize: 'h-4 w-4',
    title: 'text-xs',
    value: 'text-lg',
    change: 'text-xs',
  },
  md: {
    container: 'p-6',
    icon: 'h-12 w-12',
    iconSize: 'h-6 w-6',
    title: 'text-sm',
    value: 'text-2xl',
    change: 'text-sm',
  },
  lg: {
    container: 'p-8',
    icon: 'h-16 w-16',
    iconSize: 'h-8 w-8',
    title: 'text-base',
    value: 'text-3xl',
    change: 'text-base',
  },
};

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  iconColor = 'blue',
  size = 'md',
  loading = false,
  className,
  animate = true,
  delay = 0,
}) => {
  const sizeConfig = sizeClasses[size];

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  const getChangeIcon = () => {
    if (!change) return null;
    
    switch (change.type) {
      case 'increase':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        );
      case 'decrease':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        );
      default:
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
          </svg>
        );
    }
  };

  const getAriaDescription = () => {
    let description = `${title}: ${formatValue(value)}`;
    if (change) {
      const changeType = change.type === 'increase' ? 'increased' : 
                        change.type === 'decrease' ? 'decreased' : 'unchanged';
      description += `. ${changeType} by ${change.value}`;
      if (change.label) {
        description += ` ${change.label}`;
      }
    }
    return description;
  };

  if (loading) {
    return (
      <Card 
        className={cn(sizeConfig.container, className)} 
        animate={false}
        role="status"
        aria-label={`Loading ${title} metric`}
      >
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
            <div className={cn(sizeConfig.icon, "bg-gray-200 dark:bg-gray-700 rounded-lg")}></div>
          </div>
          <div className="mt-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          </div>
        </div>
      </Card>
    );
  }

  const content = (
    <Card 
      className={cn(sizeConfig.container, className)} 
      animate={false}
      variant="elevated"
      hover={true}
      focus={true}
      role="region"
      aria-label={`${title} metric`}
      aria-describedby={`metric-${title.replace(/\s+/g, '-').toLowerCase()}-description`}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className={cn(
            "font-medium text-gray-600 dark:text-gray-400",
            sizeConfig.title
          )}>
            {title}
          </p>
          <p 
            className={cn(
              "font-bold text-gray-900 dark:text-white mt-1",
              sizeConfig.value
            )}
            aria-live="polite"
          >
            {formatValue(value)}
          </p>
        </div>
        {Icon && (
          <div 
            className={cn(
              "rounded-lg flex items-center justify-center flex-shrink-0",
              sizeConfig.icon,
              iconColorClasses[iconColor]
            )}
            aria-hidden="true"
          >
            <Icon className={sizeConfig.iconSize} />
          </div>
        )}
      </div>
      
      {change && (
        <div 
          className="mt-4 flex items-center"
          id={`metric-${title.replace(/\s+/g, '-').toLowerCase()}-description`}
        >
          <div className={cn(
            "inline-flex items-center px-2 py-1 rounded-full font-medium",
            sizeConfig.change,
            changeColorClasses[change.type]
          )}>
            {getChangeIcon()}
            <span className="ml-1" aria-label={`Change: ${change.value}`}>
              {change.value}
            </span>
          </div>
          {change.label && (
            <span className={cn(
              "ml-2 text-gray-600 dark:text-gray-400",
              sizeConfig.change
            )}>
              {change.label}
            </span>
          )}
        </div>
      )}
      
      {/* Screen reader only description */}
      <span className="sr-only">
        {getAriaDescription()}
      </span>
    </Card>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.3 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default MetricCard;