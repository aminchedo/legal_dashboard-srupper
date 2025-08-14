import React from 'react';
import { LucideIcon } from 'lucide-react';
import { colors, spacing, shadows, transitions } from './theme';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  loading?: boolean;
  className?: string;
  'aria-label'?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  className = '',
  'aria-label': ariaLabel,
  type = 'button',
}) => {
  const getVariantStyles = () => {
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      borderRadius: '12px',
      fontWeight: '500',
      transition: `all ${transitions.normal}`,
      border: 'none',
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      textDecoration: 'none',
      outline: 'none',
    };

    const sizeStyles = {
      sm: { padding: `${spacing.sm} ${spacing.md}`, fontSize: '14px' },
      md: { padding: `${spacing.md} ${spacing.lg}`, fontSize: '16px' },
      lg: { padding: `${spacing.lg} ${spacing.xl}`, fontSize: '18px' },
    };

    const variantStyles = {
      primary: {
        background: colors.accent.primary,
        color: colors.text.primary,
        boxShadow: shadows.md,
      },
      secondary: {
        background: colors.background.secondary,
        color: colors.text.secondary,
        border: `1px solid ${colors.border.primary}`,
        boxShadow: shadows.sm,
      },
      success: {
        background: colors.status.success.bg,
        color: colors.status.success.text,
        boxShadow: shadows.md,
      },
      danger: {
        background: colors.status.error.bg,
        color: colors.status.error.text,
        boxShadow: shadows.md,
      },
      warning: {
        background: colors.status.warning.bg,
        color: colors.status.warning.text,
        boxShadow: shadows.md,
      },
    };

    const disabledStyles = disabled || loading ? {
      background: colors.background.surface,
      color: colors.text.muted,
      boxShadow: 'none',
      transform: 'none',
    } : {};

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...disabledStyles,
    };
  };

  const getHoverStyles = () => {
    if (disabled || loading) return {};
    
    const hoverStyles = {
      primary: { 
        background: '#2563eb', // blue-600
        boxShadow: shadows.lg,
        transform: 'translateY(-1px)' 
      },
      secondary: { 
        background: colors.background.tertiary,
        boxShadow: shadows.md 
      },
      success: { 
        background: '#047857', // emerald-700
        boxShadow: shadows.lg,
        transform: 'translateY(-1px)' 
      },
      danger: { 
        background: '#b91c1c', // red-700
        boxShadow: shadows.lg,
        transform: 'translateY(-1px)' 
      },
      warning: { 
        background: '#b45309', // amber-700
        boxShadow: shadows.lg,
        transform: 'translateY(-1px)' 
      },
    };
    
    return hoverStyles[variant];
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled && !loading && onClick) {
        onClick();
      }
    }
  };

  return (
    <button
      type={type}
      onClick={!disabled && !loading ? onClick : undefined}
      onKeyDown={handleKeyDown}
      disabled={disabled || loading}
      className={className}
      style={getVariantStyles()}
      aria-label={ariaLabel}
      aria-disabled={disabled || loading}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          Object.assign(e.currentTarget.style, getHoverStyles());
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          Object.assign(e.currentTarget.style, getVariantStyles());
        }
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.accent.primary}40`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = getVariantStyles().boxShadow as string;
      }}
    >
      {loading ? (
        <div 
          className="animate-spin rounded-full border-b-2 border-current"
          style={{
            width: size === 'sm' ? '16px' : size === 'md' ? '20px' : '24px',
            height: size === 'sm' ? '16px' : size === 'md' ? '20px' : '24px',
          }}
          aria-hidden="true"
        />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} aria-hidden="true" />
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;