import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  animate?: boolean;
  onClick?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  icon?: React.ReactNode;
  gradient?: boolean;
  loading?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  hover = true,
  animate = true,
  onClick,
  header,
  footer,
  icon,
  gradient = false,
  loading = false,
}) => {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantClasses = {
    default: 'premium-card',
    elevated: 'premium-card-elevated',
    outlined: 'premium-card border-2 border-gray-200 bg-transparent',
    glass: 'premium-glass',
  };

  const cardContent = (
    <>
      {/* Header */}
      {header && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {icon && (
              <motion.div
                className="flex-shrink-0"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                {icon}
              </motion.div>
            )}
            <div className="flex-1">
              {header}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={cn(
        'flex-1',
        loading && 'relative'
      )}>
        {loading ? (
          <div className="space-y-3">
            <div className="premium-skeleton h-4 w-3/4"></div>
            <div className="premium-skeleton h-4 w-1/2"></div>
            <div className="premium-skeleton h-4 w-2/3"></div>
          </div>
        ) : (
          children
        )}
      </div>

      {/* Footer */}
      {footer && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          {footer}
        </div>
      )}
    </>
  );

  const cardElement = (
    <div
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        gradient && 'bg-gradient-to-br from-blue-50 to-purple-50',
        hover && 'premium-card',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {cardContent}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        whileHover={hover ? { y: -4 } : undefined}
        whileTap={onClick ? { scale: 0.98 } : undefined}
      >
        {cardElement}
      </motion.div>
    );
  }

  return cardElement;
};

// Specialized Card Components
export const MetricCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
}> = ({ title, value, change, trend, icon, loading, className }) => {
  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'down':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      default:
        return '→';
    }
  };

  return (
    <Card
      className={cn('text-center', className)}
      variant="elevated"
      icon={icon}
      loading={loading}
    >
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 persian-text">
          {title}
        </h3>
        
        <div className="flex items-center justify-center space-x-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-white persian-numbers">
            {value}
          </span>
          {trend && (
            <span className={cn(
              'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border',
              getTrendColor(trend)
            )}>
              {getTrendIcon(trend)} {Math.abs(change || 0)}%
            </span>
          )}
        </div>

        {change !== undefined && (
          <p className={cn(
            'text-sm font-medium',
            trend === 'up' ? 'text-green-600' : 
            trend === 'down' ? 'text-red-600' : 'text-gray-600'
          )}>
            {trend === 'up' ? '+' : ''}{change}% from last month
          </p>
        )}
      </div>
    </Card>
  );
};

export const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  loading?: boolean;
  className?: string;
}> = ({ title, value, subtitle, icon, color = 'blue', loading, className }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <Card
      className={cn('relative overflow-hidden', className)}
      variant="elevated"
      loading={loading}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 persian-text">
            {title}
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white persian-numbers">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
        
        {icon && (
          <div className={cn(
            'flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center',
            colorClasses[color]
          )}>
            <div className="text-white">
              {icon}
            </div>
          </div>
        )}
      </div>

      {/* Background decoration */}
      <div className={cn(
        'absolute top-0 right-0 w-32 h-32 opacity-5 bg-gradient-to-br',
        colorClasses[color]
      )} />
    </Card>
  );
};

export const InfoCard: React.FC<{
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  loading?: boolean;
  className?: string;
}> = ({ title, description, icon, action, variant = 'info', loading, className }) => {
  const variantClasses = {
    info: 'border-blue-200 bg-blue-50',
    success: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    error: 'border-red-200 bg-red-50',
  };

  const iconColors = {
    info: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
  };

  return (
    <Card
      className={cn(
        'border-l-4',
        variantClasses[variant],
        className
      )}
      variant="outlined"
      icon={icon}
      loading={loading}
    >
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          {icon && (
            <div className={cn('flex-shrink-0', iconColors[variant])}>
              {icon}
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white persian-text">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>
        
        {action && (
          <div className="flex justify-end">
            {action}
          </div>
        )}
      </div>
    </Card>
  );
};

// Add CardBody to the Card component
const CardWithBody = Object.assign(Card, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Body: CardBody,
  Footer: CardFooter,
});

export default CardWithBody;

// Sub-components for Card structure compatibility
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <h3 className={cn('text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-white', className)}>
    {children}
  </h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <p className={cn('text-sm text-gray-600 dark:text-gray-400', className)}>
    {children}
  </p>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('p-6 pt-0', className)}>
    {children}
  </div>
);

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('p-6', className)}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('flex items-center p-6 pt-0', className)}>
    {children}
  </div>
);