import React, { forwardRef } from 'react';
import { theme } from '../../styles/design-tokens';

type CardVariant = 'default' | 'elevated' | 'interactive' | 'ghost';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Professional Card component with variants and flexible layout
 * 
 * @param variant - Visual style variant (default, elevated, interactive, ghost)
 * @param padding - Padding size (none, sm, md, lg)
 * @param title - Card title
 * @param subtitle - Card subtitle
 * @param headerAction - Action element in header
 * @param footer - Footer content
 * 
 * @example
 * <Card 
 *   variant="elevated" 
 *   title="User Profile" 
 *   headerAction={<Button size="sm">Edit</Button>}
 * >
 *   Card content here
 * </Card>
 */
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({
    variant = 'default',
    padding = 'md',
    title,
    subtitle,
    headerAction,
    footer,
    children,
    className = '',
    ...props
  }, ref) => {
    const baseClasses = ['rounded-xl overflow-hidden'];
    const variantClasses = theme.componentVariants.card.variants[variant];
    const paddingClasses = theme.componentVariants.card.padding[padding];
    
    const cardClasses = [
      ...baseClasses,
      variantClasses,
      className,
    ].join(' ');

    const hasHeader = title || subtitle || headerAction;

    return (
      <div ref={ref} className={cardClasses} {...props}>
        {hasHeader && (
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                {title && (
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="mt-1 text-sm text-gray-500 truncate">
                    {subtitle}
                  </p>
                )}
              </div>
              {headerAction && (
                <div className="ml-4 flex-shrink-0">
                  {headerAction}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className={padding === 'none' ? '' : paddingClasses}>
          {children}
        </div>
        
        {footer && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;

// ===== METRIC CARD COMPONENT =====
// Keep the existing MetricCard as a specialized component

import { ReactNode } from 'react';

type MetricCardProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
};

export function MetricCard({ icon, label, value, trend, variant = 'default' }: MetricCardProps) {
  const variantClasses = {
    default: 'bg-white border-gray-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200',
  };

  const trendClasses = {
    default: 'text-gray-400',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
  };

  return (
    <div className={`rounded-xl border p-6 transition-all duration-200 hover:shadow-md ${variantClasses[variant]}`}>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">{icon}</div>
        <div className="min-w-0 flex-1">
          <div className="text-gray-500 text-sm font-medium">{label}</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
          {trend && (
            <div className={`text-xs mt-2 ${trendClasses[variant]}`}>
              {trend}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}