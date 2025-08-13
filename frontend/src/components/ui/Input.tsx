import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'filled';
  inputSize?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    label,
    error,
    hint,
    icon: Icon,
    iconPosition = 'right',
    variant = 'default',
    inputSize = 'md',
    fullWidth = false,
    type = 'text',
    id,
    ...props
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    const baseClasses = cn(
      'w-full rounded-lg border transition-all duration-200',
      'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
      'focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400',
      'dark:focus:ring-primary-800 dark:focus:border-primary-600',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'rtl:text-right ltr:text-left'
    );

    const variants = {
      default: cn(
        'bg-white dark:bg-neutral-800',
        'border-neutral-200 dark:border-neutral-700',
        'text-neutral-900 dark:text-neutral-100'
      ),
      filled: cn(
        'bg-neutral-50 dark:bg-neutral-900',
        'border-transparent',
        'text-neutral-900 dark:text-neutral-100',
        'focus:bg-white dark:focus:bg-neutral-800',
        'focus:border-primary-400 dark:focus:border-primary-600'
      )
    };

    const sizes = {
      sm: 'h-9 text-sm',
      md: 'h-10 text-base',
      lg: 'h-12 text-lg'
    };

    const paddingWithIcon = {
      sm: Icon ? (iconPosition === 'right' ? 'pr-9 rtl:pr-3 rtl:pl-9' : 'pl-9 rtl:pl-3 rtl:pr-9') : 'px-3',
      md: Icon ? (iconPosition === 'right' ? 'pr-10 rtl:pr-4 rtl:pl-10' : 'pl-10 rtl:pl-4 rtl:pr-10') : 'px-4',
      lg: Icon ? (iconPosition === 'right' ? 'pr-12 rtl:pr-5 rtl:pl-12' : 'pl-12 rtl:pl-5 rtl:pr-12') : 'px-5'
    };

    const iconSizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    const iconPositions = {
      sm: iconPosition === 'right' ? 'right-3 rtl:right-auto rtl:left-3' : 'left-3 rtl:left-auto rtl:right-3',
      md: iconPosition === 'right' ? 'right-3 rtl:right-auto rtl:left-3' : 'left-3 rtl:left-auto rtl:right-3',
      lg: iconPosition === 'right' ? 'right-4 rtl:right-auto rtl:left-4' : 'left-4 rtl:left-auto rtl:right-4'
    };

    const hasError = !!error;
    const errorClasses = hasError ? 'border-error-400 focus:border-error-400 focus:ring-error-200' : '';

    return (
      <div className={cn('space-y-2', fullWidth ? 'w-full' : '')}>
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 rtl:text-right"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              baseClasses,
              variants[variant],
              sizes[inputSize],
              paddingWithIcon[inputSize],
              errorClasses,
              className
            )}
            {...props}
          />
          
          {Icon && (
            <Icon 
              className={cn(
                'absolute top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-500',
                iconSizes[inputSize],
                iconPositions[inputSize]
              )}
            />
          )}
        </div>

        {(error || hint) && (
          <div className="min-h-[1.25rem]">
            {error && (
              <p className="text-sm text-error-600 dark:text-error-400 rtl:text-right">
                {error}
              </p>
            )}
            {!error && hint && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 rtl:text-right">
                {hint}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;