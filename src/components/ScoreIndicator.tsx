import React from 'react';

type Variant = 'ring' | 'bar' | 'gauge';
type Size = 'sm' | 'md' | 'lg';

interface ScoreIndicatorProps {
    score: number; // 0-100
    maxScore?: number; // default 100
    variant?: Variant;
    size?: Size;
    color?: 'primary' | 'success' | 'warning' | 'error';
    animated?: boolean;
    showLabel?: boolean;
}

const sizeMap: Record<Size, number> = {
    sm: 56,
    md: 84,
    lg: 120,
};

export default function ScoreIndicator({
    score,
    maxScore = 100,
    variant = 'ring',
    size = 'md',
    color = 'primary',
    animated = true,
    showLabel = true,
}: ScoreIndicatorProps) {
    const percentage = Math.max(0, Math.min(100, (score / maxScore) * 100));
    const stroke = 8;
    const radius = (sizeMap[size] - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const colorClass =
        color === 'primary' ? 'text-blue-600' :
            color === 'success' ? 'text-green-600' :
                color === 'warning' ? 'text-yellow-600' :
                    'text-red-600';

    if (variant === 'bar') {
        return (
            <div className="w-full">
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full ${colorClass.replace('text-', 'bg-')}`}
                        style={{ width: `${percentage}%`, transition: animated ? 'width 300ms ease' : undefined }}
                    />
                </div>
                {showLabel && (
                    <div className="text-xs text-gray-600 mt-1 text-center">{Math.round(percentage)}%</div>
                )}
            </div>
        );
    }

    // Ring or gauge (semi-circle)
    const dimension = sizeMap[size];
    const center = dimension / 2;
    const circumferenceStyle = animated ? { transition: 'stroke-dashoffset 600ms ease' } : undefined;

    if (variant === 'gauge') {
        const semiCircumference = Math.PI * radius;
        const semiOffset = semiCircumference - (percentage / 100) * semiCircumference;
        return (
            <svg width={dimension} height={dimension / 2} viewBox={`0 0 ${dimension} ${dimension / 2}`}>
                <path
                    d={`M ${center - radius},${center} A ${radius},${radius} 0 0 1 ${center + radius},${center}`}
                    stroke="#e5e7eb"
                    strokeWidth={stroke}
                    fill="none"
                    strokeLinecap="round"
                />
                <path
                    d={`M ${center - radius},${center} A ${radius},${radius} 0 0 1 ${center + radius},${center}`}
                    stroke="currentColor"
                    className={colorClass}
                    strokeWidth={stroke}
                    fill="none"
                    strokeDasharray={semiCircumference}
                    strokeDashoffset={semiOffset}
                    style={circumferenceStyle}
                    strokeLinecap="round"
                />
            </svg>
        );
    }

    return (
        <div className="inline-flex items-center justify-center" style={{ width: dimension, height: dimension }}>
            <svg width={dimension} height={dimension}>
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="#e5e7eb"
                    strokeWidth={stroke}
                    fill="none"
                />
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="currentColor"
                    className={colorClass}
                    strokeWidth={stroke}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={circumferenceStyle}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${center} ${center})`}
                />
            </svg>
            {showLabel && (
                <div className="absolute text-sm font-semibold">
                    {Math.round(percentage)}%
                </div>
            )}
        </div>
    );
}


