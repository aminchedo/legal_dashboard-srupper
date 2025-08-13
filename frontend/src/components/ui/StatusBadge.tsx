import React from 'react';
import { cn } from '../../lib/utils';
import { LucideIcon } from 'lucide-react';
import { CheckCircle, AlertCircle, XCircle, Info, Clock, Zap } from 'lucide-react';

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'pending' | 'active' | 'inactive';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon | boolean;
  pulse?: boolean;
  children: React.ReactNode;
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({
    className,
    variant = 'info',
    size = 'md',
    icon,
    pulse = false,
    children,
    ...props
  }, ref) => {
    const baseClasses = [
      'inline-flex items-center gap-1.5 font-medium rounded-full',
      'transition-all duration-200',
      'rtl:flex-row-reverse',
    ];

    const variants = {
      success: [
        'bg-success-100 text-success-800 border border-success-200',
        'dark:bg-success-900/20 dark:text-success-400 dark:border-success-800',
      ],
      warning: [
        'bg-warning-100 text-warning-800 border border-warning-200',
        'dark:bg-warning-900/20 dark:text-warning-400 dark:border-warning-800',
      ],
      error: [
        'bg-error-100 text-error-800 border border-error-200',
        'dark:bg-error-900/20 dark:text-error-400 dark:border-error-800',
      ],
      info: [
        'bg-primary-100 text-primary-800 border border-primary-200',
        'dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800',
      ],
      pending: [
        'bg-neutral-100 text-neutral-800 border border-neutral-200',
        'dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700',
      ],
      active: [
        'bg-success-100 text-success-800 border border-success-200',
        'dark:bg-success-900/20 dark:text-success-400 dark:border-success-800',
      ],
      inactive: [
        'bg-neutral-100 text-neutral-600 border border-neutral-200',
        'dark:bg-neutral-800 dark:text-neutral-500 dark:border-neutral-700',
      ],
    };

    const sizes = {
      sm: ['px-2 py-0.5 text-xs', 'min-h-[20px]'],
      md: ['px-2.5 py-1 text-xs', 'min-h-[24px]'],
      lg: ['px-3 py-1.5 text-sm', 'min-h-[28px]'],
    };

    const iconSizes = {
      sm: 'w-3 h-3',
      md: 'w-3.5 h-3.5',
      lg: 'w-4 h-4',
    };

    const defaultIcons = {
      success: CheckCircle,
      warning: AlertCircle,
      error: XCircle,
      info: Info,
      pending: Clock,
      active: Zap,
      inactive: Clock,
    };

    const pulseClasses = pulse ? 'animate-pulse' : '';

    const renderIcon = () => {
      if (icon === false) return null;
      
      const IconComponent = typeof icon === 'function' ? icon : defaultIcons[variant];
      
      if (IconComponent) {
        return (
          <IconComponent
            className={cn(
              iconSizes[size],
              pulse && 'animate-pulse'
            )}
          />
        );
      }
      
      return null;
    };

    return (
      <span
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          pulseClasses,
          className
        )}
        ref={ref}
        {...props}
      >
        {renderIcon()}
        <span className="truncate">{children}</span>
      </span>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';

export { StatusBadge };