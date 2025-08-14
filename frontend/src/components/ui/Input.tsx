import React, { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  success?: boolean;
  warning?: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  clearable?: boolean;
  className?: string;
  fullWidth?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  name?: string;
  id?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    type = 'text',
    placeholder,
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    disabled = false,
    loading = false,
    error,
    success = false,
    warning,
    label,
    helperText,
    required = false,
    size = 'md',
    variant = 'default',
    icon,
    iconPosition = 'left',
    clearable = false,
    className,
    fullWidth = false,
    autoFocus = false,
    maxLength,
    minLength,
    pattern,
    name,
    id,
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue || '');

    const currentValue = value !== undefined ? value : internalValue;

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-4 py-3 text-base',
    };

    const variantClasses = {
      default: 'premium-input',
      outlined: 'premium-input border-2 border-gray-200 bg-transparent',
      filled: 'premium-input bg-gray-50 border-gray-200',
    };

    const getStateClass = () => {
      if (error) return 'border-red-500 focus:border-red-500 focus:ring-red-500';
      if (warning) return 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500';
      if (success) return 'border-green-500 focus:border-green-500 focus:ring-green-500';
      if (isFocused) return 'border-blue-500 focus:border-blue-500 focus:ring-blue-500';
      return '';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleClear = () => {
      if (value === undefined) {
        setInternalValue('');
      }
      // Create a synthetic event for onChange
      const syntheticEvent = {
        target: { value: '', name: name || '' }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
    };

    const inputElement = (
      <div className={cn('relative', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <motion.label
            htmlFor={id}
            className={cn(
              'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 persian-text',
              required && 'after:content-["*"] after:ml-1 after:text-red-500'
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <motion.div
                className="text-gray-400"
                animate={loading ? { rotate: 360 } : {}}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                {icon}
              </motion.div>
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            type={type}
            id={id}
            name={name}
            value={currentValue}
            placeholder={placeholder}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled || loading}
            autoFocus={autoFocus}
            maxLength={maxLength}
            minLength={minLength}
            pattern={pattern}
            className={cn(
              'premium-input w-full transition-all duration-200',
              sizeClasses[size],
              variantClasses[variant],
              getStateClass(),
              icon && iconPosition === 'left' && 'pl-10',
              icon && iconPosition === 'right' && 'pr-10',
              clearable && currentValue && 'pr-10',
              disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
          />

          {/* Right Icon or Clear Button */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {loading && (
              <motion.div
                className="text-gray-400"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </motion.div>
            )}

            {!loading && icon && iconPosition === 'right' && (
              <div className="text-gray-400">
                {icon}
              </div>
            )}

            {!loading && clearable && currentValue && (
              <motion.button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}
          </div>

          {/* Focus Ring Animation */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                className="absolute inset-0 rounded-lg ring-2 ring-blue-500 ring-opacity-20 pointer-events-none"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Helper Text and Error Messages */}
        <AnimatePresence>
          {(helperText || error || warning) && (
            <motion.div
              className="mt-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400 persian-text">
                  {error}
                </p>
              )}
              {warning && !error && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 persian-text">
                  {warning}
                </p>
              )}
              {helperText && !error && !warning && (
                <p className="text-sm text-gray-500 dark:text-gray-400 persian-text">
                  {helperText}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Character Counter */}
        {maxLength && (
          <div className="mt-1 text-right">
            <span className={cn(
              'text-xs',
              currentValue.length > maxLength * 0.9 ? 'text-red-500' : 'text-gray-400'
            )}>
              {currentValue.length}/{maxLength}
            </span>
          </div>
        )}
      </div>
    );

    return inputElement;
  }
);

Input.displayName = 'Input';

// Specialized Input Components
export const SearchInput: React.FC<{
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: (value: string) => void;
  loading?: boolean;
  className?: string;
}> = ({ placeholder = 'جستجو...', value, onChange, onSearch, loading, className }) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch?.(e.currentTarget.value);
    }
  };

  return (
    <Input
      type="search"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyPress={handleKeyPress}
      loading={loading}
      icon={
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      iconPosition="left"
      className={cn('premium-input', className)}
    />
  );
};

export const PasswordInput: React.FC<{
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showToggle?: boolean;
  className?: string;
}> = ({ placeholder = 'رمز عبور', value, onChange, showToggle = true, className }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Input
      type={showPassword ? 'text' : 'password'}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      icon={
        showToggle ? (
          <button
            type="button"
            onClick={togglePassword}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        ) : undefined
      }
      iconPosition="right"
      className={cn('premium-input', className)}
    />
  );
};

export default Input;