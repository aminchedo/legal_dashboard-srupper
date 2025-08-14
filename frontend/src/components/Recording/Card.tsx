import React from 'react';
import { LucideIcon } from 'lucide-react';
import { colors, spacing, shadows, transitions, componentStyles } from './theme';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  icon?: LucideIcon;
  className?: string;
  style?: React.CSSProperties;
  hover?: boolean;
  padding?: keyof typeof spacing;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  icon: Icon,
  className = '',
  style = {},
  hover = true,
  padding = 'lg',
}) => {
  const cardStyles: React.CSSProperties = {
    background: colors.background.secondary,
    border: `1px solid ${colors.border.primary}`,
    borderRadius: '16px',
    padding: spacing[padding],
    boxShadow: shadows.md,
    transition: `all ${transitions.normal}`,
    ...style,
  };

  const hoverStyles: React.CSSProperties = hover ? {
    boxShadow: shadows.lg,
    transform: 'translateY(-2px)',
  } : {};

  return (
    <div
      className={className}
      style={cardStyles}
      onMouseEnter={(e) => {
        if (hover) {
          Object.assign(e.currentTarget.style, hoverStyles);
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          Object.assign(e.currentTarget.style, cardStyles);
        }
      }}
    >
      {(title || Icon) && (
        <div 
          className="flex items-center gap-3 mb-4"
          style={{ 
            marginBottom: spacing.lg,
            gap: spacing.md,
          }}
        >
          {Icon && (
            <Icon 
              size={24} 
              style={{ color: colors.accent.primary }}
              aria-hidden="true"
            />
          )}
          {title && (
            <h3 
              className="text-lg font-bold"
              style={{ 
                color: colors.text.primary,
                fontSize: '18px',
                fontWeight: '700',
                margin: 0,
              }}
            >
              {title}
            </h3>
          )}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Card;