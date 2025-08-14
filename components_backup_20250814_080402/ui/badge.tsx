import * as React from 'react';

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
    default: 'bg-blue-100 text-blue-800 border border-blue-200',
    secondary: 'bg-gray-100 text-gray-800 border border-gray-200',
    outline: 'border border-gray-300 text-gray-700',
    success: 'bg-green-100 text-green-800 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    destructive: 'bg-red-100 text-red-800 border border-red-200',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ className = '', variant = 'default', ...props }, ref) => {
    return (
        <span
            ref={ref}
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${variants[variant]} ${className}`}
            {...props}
        />
    );
});

Badge.displayName = 'Badge';


