import React from 'react';
import { cn } from '../../utils/cn';

export interface GridLayoutProps {
  children: React.ReactNode;
  cols?: {
    default?: number;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export interface GridItemProps {
  children: React.ReactNode;
  span?: {
    default?: number;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  className?: string;
}

const gapClasses = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

const GridLayout: React.FC<GridLayoutProps> = ({
  children,
  cols = { default: 1, md: 2, lg: 3, xl: 4 },
  gap = 'md',
  className,
}) => {
  const getColClasses = () => {
    const classes = [];
    
    if (cols.default) classes.push(`grid-cols-${cols.default}`);
    if (cols.xs) classes.push(`xs:grid-cols-${cols.xs}`);
    if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`);
    if (cols.md) classes.push(`md:grid-cols-${cols.md}`);
    if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`);
    if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`);
    if (cols['2xl']) classes.push(`2xl:grid-cols-${cols['2xl']}`);
    
    return classes.join(' ');
  };

  return (
    <div className={cn(
      'grid',
      getColClasses(),
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
};

const GridItem: React.FC<GridItemProps> = ({
  children,
  span = { default: 1 },
  className,
}) => {
  const getSpanClasses = () => {
    const classes = [];
    
    if (span.default) classes.push(`col-span-${span.default}`);
    if (span.xs) classes.push(`xs:col-span-${span.xs}`);
    if (span.sm) classes.push(`sm:col-span-${span.sm}`);
    if (span.md) classes.push(`md:col-span-${span.md}`);
    if (span.lg) classes.push(`lg:col-span-${span.lg}`);
    if (span.xl) classes.push(`xl:col-span-${span.xl}`);
    if (span['2xl']) classes.push(`2xl:col-span-${span['2xl']}`);
    
    return classes.join(' ');
  };

  return (
    <div className={cn(getSpanClasses(), className)}>
      {children}
    </div>
  );
};

// Predefined layout configurations for common dashboard patterns
export const DashboardGrids = {
  // Metrics cards layout
  metrics: {
    cols: { default: 1, sm: 2, lg: 4 },
    gap: 'lg' as const,
  },
  
  // Two column layout with sidebar
  twoColumn: {
    cols: { default: 1, lg: 3 },
    gap: 'lg' as const,
  },
  
  // Three column equal layout
  threeColumn: {
    cols: { default: 1, md: 2, lg: 3 },
    gap: 'md' as const,
  },
  
  // Mixed content layout
  mixed: {
    cols: { default: 1, md: 2, lg: 4, xl: 6 },
    gap: 'md' as const,
  },
  
  // Full width sections
  sections: {
    cols: { default: 1 },
    gap: 'xl' as const,
  },
};

// Helper component for common dashboard layouts
export const DashboardSection: React.FC<{
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
}> = ({ title, description, children, className, headerActions }) => {
  return (
    <section className={cn('space-y-4 md:space-y-6', className)}>
      {(title || description || headerActions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            {title && (
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm md:text-base text-gray-600 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          {headerActions && (
            <div className="flex-shrink-0">
              {headerActions}
            </div>
          )}
        </div>
      )}
      <div className="w-full">
        {children}
      </div>
    </section>
  );
};

export { GridLayout, GridItem };
export default GridLayout;