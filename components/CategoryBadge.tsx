import React from 'react';

type Variant = 'filled' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface CategoryBadgeProps {
    category: string;
    score?: number;
    color?: string; // hex or CSS color
    icon?: React.ReactNode;
    variant?: Variant;
    size?: Size;
}

export default function CategoryBadge({
    category,
    score,
    color = '#3B82F6',
    icon,
    variant = 'filled',
    size = 'md'
}: CategoryBadgeProps) {
    const base = 'inline-flex items-center gap-1 rounded-full font-medium';
    const paddings = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-4 py-1.5 text-sm' : 'px-3 py-1 text-sm';

    const styles =
        variant === 'filled'
            ? { backgroundColor: `${color}1A`, color, border: `1px solid ${color}33` }
            : variant === 'outline'
                ? { backgroundColor: 'transparent', color, border: `1px solid ${color}` }
                : { backgroundColor: 'transparent', color, border: '1px solid transparent' };

    return (
        <span className={`${base} ${paddings}`} style={styles} title={score ? `${score}` : undefined}>
            {icon && <span className="text-current">{icon}</span>}
            <span>{category}</span>
            {typeof score !== 'undefined' && (
                <span className="opacity-80">{score}</span>
            )}
        </span>
    );
}


