import React, { forwardRef, useState } from 'react';
import { theme } from '../../styles/design-tokens';

type InputSize = 'sm' | 'md' | 'lg';
type InputState = 'default' | 'error' | 'success' | 'disabled';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  state?: InputState;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isRequired?: boolean;
  fullWidth?: boolean;
}

/**
 * Professional Input component with validation states and accessibility
 * 
 * @param size - Size variant (sm, md, lg)
 * @param state - Visual state (default, error, success, disabled)
 * @param label - Input label
 * @param helperText - Helper text below input
 * @param errorMessage - Error message (overrides helperText when present)
 * @param leftIcon - Icon to display on the left
 * @param rightIcon - Icon to display on the right
 * @param isRequired - Whether field is required
 * @param fullWidth - Whether input should take full width
 * 
 * @example
 * <Input
 *   label="Email Address"
 *   placeholder="Enter your email"
 *   state={emailError ? 'error' : 'default'}
 *   errorMessage={emailError}
 *   isRequired
 * />
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    size = 'md',
    state = 'default',
    label,
    helperText,
    errorMessage,
    leftIcon,
    rightIcon,
    isRequired = false,
    fullWidth = true,
    disabled,
    className = '',
    id,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    
    // Generate unique ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    // Determine actual state
    const actualState = disabled ? 'disabled' : (errorMessage ? 'error' : state);
    
    const baseClasses = [
      'block w-full rounded-lg border transition-all duration-200',
      'focus:outline-none focus:ring-1',
      'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
    ];

    const sizeClasses = theme.componentVariants.input.sizes[size];
    const stateClasses = theme.componentVariants.input.states[actualState];
    
    const containerClasses = [
      fullWidth ? 'w-full' : 'w-auto',
      className,
    ].join(' ');

    const inputClasses = [
      ...baseClasses,
      sizeClasses,
      stateClasses,
      leftIcon ? 'pl-10' : '',
      rightIcon ? 'pr-10' : '',
    ].join(' ');

    const labelClasses = [
      'block text-sm font-medium mb-1',
      actualState === 'error' ? 'text-red-700' : 'text-gray-700',
      isRequired ? "after:content-['*'] after:ml-0.5 after:text-red-500" : '',
    ].join(' ');

    const helperTextClasses = [
      'mt-1 text-xs',
      actualState === 'error' ? 'text-red-600' : 'text-gray-500',
    ].join(' ');

    const iconClasses = 'absolute top-1/2 transform -translate-y-1/2 h-4 w-4';
    const leftIconClasses = `${iconClasses} left-3 text-gray-400`;
    const rightIconClasses = `${iconClasses} right-3 text-gray-400`;

    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className={leftIconClasses} aria-hidden="true">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={inputClasses}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            aria-invalid={actualState === 'error'}
            aria-describedby={
              (errorMessage || helperText) ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          
          {rightIcon && (
            <div className={rightIconClasses} aria-hidden="true">
              {rightIcon}
            </div>
          )}
          
          {/* Focus ring indicator */}
          {isFocused && (
            <div
              className={`absolute inset-0 rounded-lg border-2 pointer-events-none transition-all duration-200 ${
                actualState === 'error' 
                  ? 'border-red-500' 
                  : actualState === 'success'
                  ? 'border-green-500'
                  : 'border-blue-500'
              }`}
              aria-hidden="true"
            />
          )}
        </div>
        
        {(errorMessage || helperText) && (
          <p id={`${inputId}-helper`} className={helperTextClasses}>
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;