import React, { forwardRef } from 'react';
import { theme } from '../../styles/design-tokens';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'outline';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

/**
 * Professional Button component with enterprise-grade styling
 * 
 * @param variant - Visual style variant (primary, secondary, success, warning, error, ghost, outline)
 * @param size - Size variant (xs, sm, md, lg, xl)
 * @param isLoading - Whether button is in loading state
 * @param loadingText - Text to show when loading
 * @param leftIcon - Icon to display on the left
 * @param rightIcon - Icon to display on the right
 * @param fullWidth - Whether button should take full width
 * 
 * @example
 * <Button variant="primary" size="md" leftIcon={<PlusIcon />}>
 *   Add Item
 * </Button>
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    loadingText,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    className = '',
    children,
    ...props
  }, ref) => {
    const baseClasses = [
      'inline-flex items-center justify-center gap-2',
      'font-medium rounded-lg transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'active:scale-[0.98] transform',
    ];

    const sizeClasses = theme.componentVariants.button.sizes[size];
    const variantClasses = theme.componentVariants.button.variants[variant];
    
    const focusClasses = {
      primary: 'focus:ring-blue-500',
      secondary: 'focus:ring-gray-500',
      success: 'focus:ring-green-500',
      warning: 'focus:ring-yellow-500',
      error: 'focus:ring-red-500',
      ghost: 'focus:ring-gray-500',
      outline: 'focus:ring-gray-500',
    };

    const widthClass = fullWidth ? 'w-full' : '';
    
    const combinedClasses = [
      ...baseClasses,
      sizeClasses,
      variantClasses,
      focusClasses[variant],
      widthClass,
      className,
    ].join(' ');

    const isDisabled = disabled || isLoading;

    const LoadingSpinner = () => (
      <svg 
        className="animate-spin h-4 w-4" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
        aria-hidden="true"
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
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={combinedClasses}
        aria-disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            {loadingText || children}
          </>
        ) : (
          <>
            {leftIcon && (
              <span className="flex-shrink-0" aria-hidden="true">
                {leftIcon}
              </span>
            )}
            <span>{children}</span>
            {rightIcon && (
              <span className="flex-shrink-0" aria-hidden="true">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;