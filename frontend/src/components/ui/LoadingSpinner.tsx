import React from 'react';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SpinnerVariant = 'primary' | 'white' | 'current';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
}

const sizeClasses = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const variantClasses = {
  primary: 'text-blue-600',
  white: 'text-white',
  current: 'text-current',
};

/**
 * Professional loading spinner component
 * 
 * @param size - Size variant (xs, sm, md, lg, xl)
 * @param variant - Color variant (primary, white, current)
 * @param className - Additional CSS classes
 * 
 * @example
 * <LoadingSpinner size="md" variant="primary" />
 */
export default function LoadingSpinner({ 
  size = 'md', 
  variant = 'primary',
  className = '' 
}: LoadingSpinnerProps): JSX.Element {
  const spinnerClasses = [
    'animate-spin',
    sizeClasses[size],
    variantClasses[variant],
    className,
  ].join(' ');

  return (
    <svg 
      className={spinnerClasses}
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
      role="status"
      aria-label="Loading"
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
}

// ===== SKELETON LOADER COMPONENT =====

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

/**
 * Skeleton loader for content placeholders
 * 
 * @param width - Width of skeleton
 * @param height - Height of skeleton  
 * @param rounded - Whether skeleton should be rounded
 * @param className - Additional CSS classes
 * 
 * @example
 * <Skeleton width="100%" height="20px" rounded />
 */
export function Skeleton({ 
  className = '', 
  width = '100%', 
  height = '1rem',
  rounded = false 
}: SkeletonProps): JSX.Element {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  const skeletonClasses = [
    'animate-pulse bg-gray-200',
    rounded ? 'rounded-full' : 'rounded',
    className,
  ].join(' ');

  return <div className={skeletonClasses} style={style} aria-hidden="true" />;
}

// ===== LOADING OVERLAY COMPONENT =====

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  size?: SpinnerSize;
  className?: string;
}

/**
 * Full-screen loading overlay
 * 
 * @param isVisible - Whether overlay is visible
 * @param message - Loading message to display
 * @param size - Spinner size
 * @param className - Additional CSS classes
 * 
 * @example
 * <LoadingOverlay isVisible={isLoading} message="Saving data..." />
 */
export function LoadingOverlay({ 
  isVisible,
  message = 'Loading...',
  size = 'lg',
  className = '' 
}: LoadingOverlayProps): JSX.Element | null {
  if (!isVisible) return null;

  const overlayClasses = [
    'fixed inset-0 z-50 flex items-center justify-center',
    'bg-black bg-opacity-50 backdrop-blur-sm',
    className,
  ].join(' ');

  return (
    <div className={overlayClasses} role="dialog" aria-modal="true" aria-label="Loading">
      <div className="flex flex-col items-center gap-4 bg-white rounded-lg p-8 shadow-xl">
        <LoadingSpinner size={size} variant="primary" />
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
}