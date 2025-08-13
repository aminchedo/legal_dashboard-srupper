import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'filled' | 'outline';
  inputSize?: 'sm' | 'md' | 'lg';
  error?: boolean;
  helperText?: string;
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = 'default',
      inputSize = 'md',
      error = false,
      helperText,
      label,
      leftIcon,
      rightIcon,
      fullWidth = false,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseClasses = 'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50';

    const variantClasses = {
      default: 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500',
      filled: 'border-0 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-800',
      outline: 'border-2 border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:ring-0 focus:border-blue-500',
    };

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg',
    };

    const errorClasses = error
      ? 'border-red-300 dark:border-red-600 text-red-900 dark:text-red-100 focus:ring-red-500 focus:border-red-500'
      : '';

    const widthClasses = fullWidth ? 'w-full' : '';

    const iconPaddingClasses = {
      left: leftIcon ? (inputSize === 'sm' ? 'pl-10' : inputSize === 'lg' ? 'pl-12' : 'pl-11') : '',
      right: rightIcon ? (inputSize === 'sm' ? 'pr-10' : inputSize === 'lg' ? 'pr-12' : 'pr-11') : '',
    };

    const inputClasses = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[inputSize],
      errorClasses,
      widthClasses,
      iconPaddingClasses.left,
      iconPaddingClasses.right,
      'rounded-lg',
      className
    );

    const iconSizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    const iconPositionClasses = {
      left: {
        sm: 'left-3',
        md: 'left-3',
        lg: 'left-4',
      },
      right: {
        sm: 'right-3',
        md: 'right-3',
        lg: 'right-4',
      },
    };

    return (
      <div className={cn('relative', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className={cn(
              'absolute inset-y-0 flex items-center pointer-events-none text-gray-400 dark:text-gray-500',
              iconPositionClasses.left[inputSize]
            )}>
              <div className={iconSizeClasses[inputSize]}>
                {leftIcon}
              </div>
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            {...props}
          />
          
          {rightIcon && (
            <div className={cn(
              'absolute inset-y-0 flex items-center pointer-events-none text-gray-400 dark:text-gray-500',
              iconPositionClasses.right[inputSize]
            )}>
              <div className={iconSizeClasses[inputSize]}>
                {rightIcon}
              </div>
            </div>
          )}
        </div>
        
        {helperText && (
          <p className={cn(
            'mt-2 text-sm',
            error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
          )}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;