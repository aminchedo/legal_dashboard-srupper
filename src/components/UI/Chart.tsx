import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface LineChartProps {
  data: ChartDataPoint[];
  height?: number;
  showGrid?: boolean;
  showAxes?: boolean;
  animate?: boolean;
  strokeWidth?: number;
  className?: string;
}

export interface BarChartProps {
  data: ChartDataPoint[];
  height?: number;
  showGrid?: boolean;
  showAxes?: boolean;
  animate?: boolean;
  className?: string;
}

export interface PieChartProps {
  data: ChartDataPoint[];
  size?: number;
  showLabels?: boolean;
  animate?: boolean;
  className?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 200,
  showGrid = true,
  showAxes = true,
  animate = true,
  strokeWidth = 2,
  className,
}) => {
  const width = 400;
  const padding = 40;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const valueRange = maxValue - minValue || 1;

  const points = data.map((point, index) => ({
    x: padding + (index / (data.length - 1)) * chartWidth,
    y: padding + ((maxValue - point.value) / valueRange) * chartHeight,
    ...point,
  }));

  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`)
    .join(' ');

  const gridLines = showGrid ? (
    <>
      {/* Horizontal grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
        <line
          key={`h-${index}`}
          x1={padding}
          y1={padding + ratio * chartHeight}
          x2={width - padding}
          y2={padding + ratio * chartHeight}
          stroke="currentColor"
          strokeOpacity="0.1"
          strokeWidth="1"
        />
      ))}
      {/* Vertical grid lines */}
      {data.map((_, index) => (
        <line
          key={`v-${index}`}
          x1={padding + (index / (data.length - 1)) * chartWidth}
          y1={padding}
          x2={padding + (index / (data.length - 1)) * chartWidth}
          y2={height - padding}
          stroke="currentColor"
          strokeOpacity="0.1"
          strokeWidth="1"
        />
      ))}
    </>
  ) : null;

  return (
    <div className={cn("text-gray-700 dark:text-gray-300", className)}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {gridLines}
        
        {/* Chart line */}
        <motion.path
          d={pathData}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={animate ? { pathLength: 0 } : {}}
          animate={animate ? { pathLength: 1 } : {}}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Data points */}
        {points.map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#3b82f6"
            stroke="white"
            strokeWidth="2"
            initial={animate ? { scale: 0 } : {}}
            animate={animate ? { scale: 1 } : {}}
            transition={{ delay: animate ? index * 0.1 + 0.5 : 0 }}
          />
        ))}

        {/* X-axis labels */}
        {showAxes &&
          data.map((point, index) => (
            <text
              key={index}
              x={padding + (index / (data.length - 1)) * chartWidth}
              y={height - 10}
              textAnchor="middle"
              fontSize="12"
              fill="currentColor"
              opacity="0.7"
            >
              {point.label}
            </text>
          ))}
      </svg>
    </div>
  );
};

const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 200,
  showGrid = true,
  showAxes = true,
  animate = true,
  className,
}) => {
  const width = 400;
  const padding = 40;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = chartWidth / data.length * 0.6;
  const barSpacing = chartWidth / data.length;

  return (
    <div className={cn("text-gray-700 dark:text-gray-300", className)}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Grid lines */}
        {showGrid &&
          [0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <line
              key={index}
              x1={padding}
              y1={padding + ratio * chartHeight}
              x2={width - padding}
              y2={padding + ratio * chartHeight}
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeWidth="1"
            />
          ))}

        {/* Bars */}
        {data.map((point, index) => {
          const barHeight = (point.value / maxValue) * chartHeight;
          const x = padding + index * barSpacing + (barSpacing - barWidth) / 2;
          const y = height - padding - barHeight;

          return (
            <motion.rect
              key={index}
              x={x}
              y={animate ? height - padding : y}
              width={barWidth}
              height={animate ? 0 : barHeight}
              fill={point.color || '#3b82f6'}
              rx="4"
              initial={animate ? {} : undefined}
              animate={animate ? { y, height: barHeight } : undefined}
              transition={animate ? { delay: index * 0.1, duration: 0.6 } : undefined}
            />
          );
        })}

        {/* X-axis labels */}
        {showAxes &&
          data.map((point, index) => (
            <text
              key={index}
              x={padding + index * barSpacing + barSpacing / 2}
              y={height - 10}
              textAnchor="middle"
              fontSize="12"
              fill="currentColor"
              opacity="0.7"
            >
              {point.label}
            </text>
          ))}
      </svg>
    </div>
  );
};

const PieChart: React.FC<PieChartProps> = ({
  data,
  size = 200,
  showLabels = true,
  animate = true,
  className,
}) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 20;

  const total = data.reduce((sum, point) => sum + point.value, 0);
  let currentAngle = -90; // Start from top

  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
    '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
  ];

  const segments = data.map((point, index) => {
    const angle = (point.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const largeArcFlag = angle > 180 ? 1 : 0;

    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');

    currentAngle += angle;

    return {
      pathData,
      color: point.color || colors[index % colors.length],
      ...point,
      percentage: ((point.value / total) * 100).toFixed(1),
    };
  });

  return (
    <div className={cn("text-gray-700 dark:text-gray-300", className)}>
      <svg width={size} height={size + (showLabels ? 60 : 0)}>
        {segments.map((segment, index) => (
          <motion.path
            key={index}
            d={segment.pathData}
            fill={segment.color}
            stroke="white"
            strokeWidth="2"
            initial={animate ? { scale: 0 } : {}}
            animate={animate ? { scale: 1 } : {}}
            transition={animate ? { delay: index * 0.1, duration: 0.6 } : {}}
            style={{ transformOrigin: `${centerX}px ${centerY}px` }}
          />
        ))}

        {showLabels && (
          <g>
            {segments.map((segment, index) => (
              <text
                key={index}
                x={20}
                y={size + 25 + index * 15}
                fontSize="12"
                fill="currentColor"
              >
                <circle
                  cx={10}
                  cy={-4}
                  r="4"
                  fill={segment.color}
                />
                {segment.label}: {segment.percentage}%
              </text>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
};

export { LineChart, BarChart, PieChart };