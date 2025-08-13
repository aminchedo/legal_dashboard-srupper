import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled';
  onChange?: (value: string) => void;
  className?: string;
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  ({
    options,
    value,
    defaultValue,
    placeholder = 'انتخاب کنید...',
    label,
    error,
    hint,
    disabled = false,
    fullWidth = false,
    size = 'md',
    variant = 'default',
    onChange,
    className,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || defaultValue || '');
    
    const selectedOption = options.find(option => option.value === selectedValue);
    
    const handleSelect = (optionValue: string) => {
      setSelectedValue(optionValue);
      onChange?.(optionValue);
      setIsOpen(false);
    };

    const baseClasses = cn(
      'relative w-full rounded-lg border transition-all duration-200',
      'bg-white dark:bg-neutral-800',
      'text-neutral-900 dark:text-neutral-100',
      'focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400',
      'dark:focus:ring-primary-800 dark:focus:border-primary-600',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'rtl:text-right ltr:text-left'
    );

    const variants = {
      default: cn(
        'border-neutral-200 dark:border-neutral-700'
      ),
      filled: cn(
        'bg-neutral-50 dark:bg-neutral-900',
        'border-transparent',
        'focus:bg-white dark:focus:bg-neutral-800',
        'focus:border-primary-400 dark:focus:border-primary-600'
      )
    };

    const sizes = {
      sm: 'h-9 text-sm px-3',
      md: 'h-10 text-base px-4',
      lg: 'h-12 text-lg px-5'
    };

    const hasError = !!error;
    const errorClasses = hasError ? 'border-error-400 focus:border-error-400 focus:ring-error-200' : '';

    return (
      <div className={cn('relative', fullWidth ? 'w-full' : '')}>
        {label && (
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 rtl:text-right mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          <button
            ref={ref}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={cn(
              baseClasses,
              variants[variant],
              sizes[size],
              errorClasses,
              'flex items-center justify-between',
              'pr-10 rtl:pr-4 rtl:pl-10',
              className
            )}
            {...props}
          >
            <span className={cn(
              'block truncate',
              !selectedOption && 'text-neutral-400 dark:text-neutral-500'
            )}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            
            <ChevronDown 
              className={cn(
                'w-4 h-4 text-neutral-400 dark:text-neutral-500 transition-transform duration-200',
                'absolute left-3 rtl:left-auto rtl:right-3',
                isOpen && 'transform rotate-180'
              )}
            />
          </button>

          {/* Dropdown */}
          {isOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsOpen(false)}
              />
              
              {/* Options */}
              <div className={cn(
                'absolute z-20 w-full mt-1 bg-white dark:bg-neutral-800',
                'border border-neutral-200 dark:border-neutral-700',
                'rounded-lg shadow-lg max-h-60 overflow-auto',
                'py-1'
              )}>
                {options.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-neutral-500 dark:text-neutral-400 rtl:text-right">
                    هیچ گزینه‌ای در دسترس نیست
                  </div>
                ) : (
                  options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      disabled={option.disabled}
                      onClick={() => !option.disabled && handleSelect(option.value)}
                      className={cn(
                        'w-full text-right rtl:text-right ltr:text-left px-4 py-2 text-sm',
                        'flex items-center justify-between',
                        'hover:bg-neutral-50 dark:hover:bg-neutral-700',
                        'focus:outline-none focus:bg-neutral-50 dark:focus:bg-neutral-700',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        'transition-colors duration-150',
                        selectedValue === option.value && 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      )}
                    >
                      <span className="truncate">{option.label}</span>
                      {selectedValue === option.value && (
                        <Check className="w-4 h-4 flex-shrink-0 mr-2 rtl:mr-0 rtl:ml-2" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        {(error || hint) && (
          <div className="mt-2 min-h-[1.25rem]">
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

Select.displayName = 'Select';

export default Select;