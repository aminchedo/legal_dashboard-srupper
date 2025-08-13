import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  asChild?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    loading = false,
    fullWidth = false,
    asChild = false,
    disabled,
    children,
    ...props
  }, ref) => {
    const baseClasses = [
      // Base styles
      'inline-flex items-center justify-center gap-2',
      'font-medium rounded-lg transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'relative overflow-hidden',
      
      // Touch targets for mobile
      'min-h-[44px]',
      
      // RTL support
      'rtl:flex-row-reverse',
    ];

    const variants = {
      primary: [
        'bg-primary-600 text-white',
        'hover:bg-primary-700 focus:ring-primary-500',
        'disabled:bg-primary-300',
        'shadow-sm hover:shadow-md',
      ],
      secondary: [
        'bg-neutral-200 text-neutral-800',
        'hover:bg-neutral-300 focus:ring-neutral-400',
        'disabled:bg-neutral-100 disabled:text-neutral-400',
        'shadow-sm hover:shadow-md',
      ],
      success: [
        'bg-success-600 text-white',
        'hover:bg-success-700 focus:ring-success-500',
        'disabled:bg-success-300',
        'shadow-sm hover:shadow-md',
      ],
      warning: [
        'bg-warning-600 text-white',
        'hover:bg-warning-700 focus:ring-warning-500',
        'disabled:bg-warning-300',
        'shadow-sm hover:shadow-md',
      ],
      error: [
        'bg-error-600 text-white',
        'hover:bg-error-700 focus:ring-error-500',
        'disabled:bg-error-300',
        'shadow-sm hover:shadow-md',
      ],
      ghost: [
        'bg-transparent text-neutral-700',
        'hover:bg-neutral-100 focus:ring-neutral-400',
        'disabled:bg-transparent disabled:text-neutral-400',
      ],
      outline: [
        'bg-transparent border border-neutral-300 text-neutral-700',
        'hover:bg-neutral-50 hover:border-neutral-400 focus:ring-neutral-400',
        'disabled:bg-transparent disabled:border-neutral-200 disabled:text-neutral-400',
      ],
    };

    const sizes = {
      sm: ['px-3 py-1.5 text-sm', 'min-h-[36px]'],
      md: ['px-4 py-2 text-sm', 'min-h-[44px]'],
      lg: ['px-6 py-3 text-base', 'min-h-[48px]'],
      xl: ['px-8 py-4 text-lg', 'min-h-[52px]'],
    };

    const widthClasses = fullWidth ? 'w-full' : 'w-auto';

    const iconSize = {
      sm: 'w-4 h-4',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      xl: 'w-6 h-6',
    };

    const LoadingSpinner = () => (
      <svg
        className={cn('animate-spin', iconSize[size])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    const renderIcon = () => {
      if (loading) {
        return <LoadingSpinner />;
      }
      
      if (Icon) {
        return <Icon className={iconSize[size]} />;
      }
      
      return null;
    };

    const renderContent = () => {
      if (iconPosition === 'right') {
        return (
          <>
            <span className={loading ? 'opacity-0' : ''}>{children}</span>
            {renderIcon()}
          </>
        );
      }

      return (
        <>
          {renderIcon()}
          <span className={loading ? 'opacity-0' : ''}>{children}</span>
        </>
      );
    };

    const Comp = asChild ? React.Fragment : 'button';
    const buttonProps = asChild ? {} : {
      disabled: disabled || loading,
      ...props
    };

    const content = (
      <>
        {/* Ripple effect container */}
        <span className="absolute inset-0 overflow-hidden rounded-lg">
          {/* You can add ripple effect here if needed */}
        </span>
        
        {/* Content */}
        <span className="relative flex items-center justify-center gap-2 rtl:flex-row-reverse">
          {renderContent()}
        </span>
      </>
    );

    if (asChild) {
      return React.cloneElement(
        children as React.ReactElement,
        {
          className: cn(
            baseClasses,
            variants[variant],
            sizes[size],
            widthClasses,
            className,
            (children as React.ReactElement).props.className
          ),
          ref,
        },
        content
      );
    }

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          widthClasses,
          className
        )}
        ref={ref}
        {...buttonProps}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
export { Button };