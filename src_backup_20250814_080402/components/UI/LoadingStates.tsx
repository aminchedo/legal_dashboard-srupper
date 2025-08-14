import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { Card } from './Card';
import { GridLayout, DashboardGrids } from './GridLayout';

// Base skeleton component
export const Skeleton: React.FC<{
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave' | 'none';
}> = ({ 
  className, 
  variant = 'rectangular', 
  animation = 'pulse' 
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded',
  };
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse',
    none: '',
  };

  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      role="status"
      aria-label="Loading..."
    />
  );
};

// Metric card skeleton
export const MetricCardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Card className={cn("p-6", className)} animate={false}>
      <div className="animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-3 flex-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton variant="circular" className="h-12 w-12" />
        </div>
        <div className="mt-4">
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </Card>
  );
};

// Chart skeleton
export const ChartSkeleton: React.FC<{ 
  className?: string;
  height?: number;
  type?: 'line' | 'bar' | 'pie';
}> = ({ className, height = 200, type = 'line' }) => {
  return (
    <Card className={cn("p-6", className)} animate={false}>
      <div className="animate-pulse">
        <div className="space-y-3 mb-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="relative" style={{ height }}>
          {type === 'line' && (
            <div className="space-y-4">
              {/* Grid lines */}
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-px w-full" />
              ))}
              {/* Line path */}
              <div className="absolute inset-0 flex items-end justify-between px-8">
                {[...Array(7)].map((_, i) => (
                  <Skeleton 
                    key={i} 
                    variant="circular" 
                    className="h-2 w-2"
                    style={{ 
                      marginBottom: `${Math.random() * 60}px` 
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          
          {type === 'bar' && (
            <div className="flex items-end justify-between h-full px-8 space-x-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton 
                  key={i} 
                  className="w-8"
                  style={{ 
                    height: `${30 + Math.random() * 70}%` 
                  }}
                />
              ))}
            </div>
          )}
          
          {type === 'pie' && (
            <div className="flex items-center justify-center h-full">
              <Skeleton variant="circular" className="h-32 w-32" />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

// Activity item skeleton
export const ActivityItemSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("flex items-start space-x-3", className)}>
      <Skeleton variant="circular" className="h-8 w-8 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
};

// Navigation card skeleton
export const NavigationCardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Card className={cn("p-4", className)} animate={false}>
      <div className="animate-pulse">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton variant="circular" className="h-10 w-10" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <div className="text-right space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </div>
    </Card>
  );
};

// Quick action skeleton
export const QuickActionSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Card className={cn("p-4", className)} animate={false}>
      <div className="animate-pulse">
        <div className="flex items-center space-x-3">
          <Skeleton variant="circular" className="h-10 w-10" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </div>
    </Card>
  );
};

// Dashboard page skeleton
export const DashboardPageSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("p-4 md:p-6 space-y-6 md:space-y-8 max-w-7xl mx-auto", className)}>
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      {/* Metrics skeleton */}
      <div className="space-y-4">
        <GridLayout {...DashboardGrids.metrics}>
          {[...Array(4)].map((_, i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </GridLayout>
      </div>

      {/* Charts skeleton */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <GridLayout {...DashboardGrids.twoColumn}>
          <div className="lg:col-span-2">
            <ChartSkeleton type="line" height={300} />
          </div>
          <div>
            <ChartSkeleton type="bar" height={300} />
          </div>
        </GridLayout>
      </div>

      {/* Quick actions skeleton */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Card className="p-6">
          <GridLayout {...DashboardGrids.metrics}>
            {[...Array(4)].map((_, i) => (
              <QuickActionSkeleton key={i} />
            ))}
          </GridLayout>
        </Card>
      </div>

      {/* Bottom section skeleton */}
      <GridLayout {...DashboardGrids.twoColumn}>
        {/* Navigation cards skeleton */}
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-52" />
          </div>
          <Card className="p-6">
            <GridLayout cols={{ default: 1, md: 2 }} gap="md">
              {[...Array(6)].map((_, i) => (
                <NavigationCardSkeleton key={i} />
              ))}
            </GridLayout>
          </Card>
        </div>

        {/* Activity skeleton */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Card className="p-6">
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <ActivityItemSkeleton key={i} />
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Skeleton className="h-4 w-32" />
            </div>
          </Card>
        </div>
      </GridLayout>
    </div>
  );
};

// Loading spinner component
export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'primary' | 'white' | 'gray';
}> = ({ size = 'md', className, color = 'primary' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const colorClasses = {
    primary: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-400',
  };

  return (
    <motion.div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </motion.div>
  );
};

// Progressive loading component
export const ProgressiveLoader: React.FC<{
  progress?: number;
  className?: string;
  showPercentage?: boolean;
}> = ({ progress = 0, className, showPercentage = false }) => {
  return (
    <div className={cn("w-full", className)} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">Loading...</span>
        {showPercentage && (
          <span className="text-sm text-gray-600 dark:text-gray-400">{Math.round(progress)}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <motion.div
          className="bg-blue-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

export default {
  Skeleton,
  MetricCardSkeleton,
  ChartSkeleton,
  ActivityItemSkeleton,
  NavigationCardSkeleton,
  QuickActionSkeleton,
  DashboardPageSkeleton,
  LoadingSpinner,
  ProgressiveLoader,
};