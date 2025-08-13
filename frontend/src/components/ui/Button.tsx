import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  asChild?: boolean;
  children: React.ReactNode;
  ripple?: boolean; // Enable ripple effect
  bounce?: boolean; // Enable bounce animation
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    loading = false,
    fullWidth = false,
    asChild = false,
    disabled,
    children,
    ripple = true,
    bounce = false,
    onClick,
    ...props
  }, ref) => {
    const [isPressed, setIsPressed] = useState(false);
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

    const baseClasses = cn(
      'relative inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      'overflow-hidden', // For ripple effect
      'rtl:flex-row-reverse select-none'
    );

    const variants = {
      primary: cn(
        'bg-primary-600 text-white shadow-sm border border-primary-600',
        'hover:bg-primary-700 hover:border-primary-700 hover:shadow-md',
        'active:bg-primary-800 active:shadow-sm',
        'focus:ring-primary-200 dark:focus:ring-primary-800'
      ),
      secondary: cn(
        'bg-neutral-100 text-neutral-900 shadow-sm border border-neutral-200',
        'hover:bg-neutral-200 hover:border-neutral-300 hover:shadow-md',
        'active:bg-neutral-300 active:shadow-sm',
        'focus:ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700',
        'dark:hover:bg-neutral-700 dark:hover:border-neutral-600'
      ),
      success: cn(
        'bg-success-600 text-white shadow-sm border border-success-600',
        'hover:bg-success-700 hover:border-success-700 hover:shadow-md',
        'active:bg-success-800 active:shadow-sm',
        'focus:ring-success-200 dark:focus:ring-success-800'
      ),
      warning: cn(
        'bg-warning-600 text-white shadow-sm border border-warning-600',
        'hover:bg-warning-700 hover:border-warning-700 hover:shadow-md',
        'active:bg-warning-800 active:shadow-sm',
        'focus:ring-warning-200 dark:focus:ring-warning-800'
      ),
      error: cn(
        'bg-error-600 text-white shadow-sm border border-error-600',
        'hover:bg-error-700 hover:border-error-700 hover:shadow-md',
        'active:bg-error-800 active:shadow-sm',
        'focus:ring-error-200 dark:focus:ring-error-800'
      ),
      ghost: cn(
        'text-neutral-700 dark:text-neutral-300',
        'hover:bg-neutral-100 dark:hover:bg-neutral-800',
        'active:bg-neutral-200 dark:active:bg-neutral-700'
      ),
      outline: cn(
        'bg-transparent text-neutral-700 border border-neutral-300 shadow-sm',
        'hover:bg-neutral-50 hover:border-neutral-400 hover:shadow-md',
        'active:bg-neutral-100 active:shadow-sm',
        'focus:ring-neutral-200 dark:text-neutral-300 dark:border-neutral-600',
        'dark:hover:bg-neutral-800 dark:hover:border-neutral-500'
      )
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
      xl: 'h-14 px-8 text-lg'
    };

    const widthClasses = fullWidth ? 'w-full' : '';

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;

      // Create ripple effect
      if (ripple) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const newRipple = { id: Date.now(), x, y };
        
        setRipples(prev => [...prev, newRipple]);
        
        // Remove ripple after animation
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 600);
      }

      // Handle bounce effect
      if (bounce) {
        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 150);
      }

      onClick?.(e);
    };

    const renderContent = () => {
      if (loading) {
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 rtl:flex-row-reverse"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              {typeof children === 'string' ? 'در حال پردازش...' : children}
            </motion.div>
          </AnimatePresence>
        );
      }

      const content = (
        <>
          {Icon && iconPosition === 'left' && (
            <motion.div
              initial={false}
              animate={{ rotate: isPressed && bounce ? 360 : 0 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
            </motion.div>
          )}
          <span className="min-w-0">{children}</span>
          {Icon && iconPosition === 'right' && (
            <motion.div
              initial={false}
              animate={{ rotate: isPressed && bounce ? 360 : 0 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
            </motion.div>
          )}
        </>
      );

      return (
        <motion.div
          className="flex items-center gap-2 rtl:flex-row-reverse relative z-10"
          initial={false}
          animate={{ 
            scale: isPressed && bounce ? 0.95 : 1,
          }}
          transition={{ duration: 0.1, type: "spring", stiffness: 400 }}
        >
          {content}
        </motion.div>
      );
    };

    const buttonVariants = {
      idle: { scale: 1 },
      hover: { scale: 1.02 },
      tap: { scale: 0.98 }
    };

    if (asChild) {
      return React.cloneElement(
        children as React.ReactElement,
        {
          className: cn(
            baseClasses,
            variants[variant],
            sizes[size],
            widthClasses,
            className,
            (children as React.ReactElement).props.className
          ),
          ref,
          onClick: handleClick,
        }
      );
    }

    return (
      <motion.button
        ref={ref}
        disabled={disabled || loading}
        onClick={handleClick}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          widthClasses,
          className
        )}
        variants={buttonVariants}
        initial="idle"
        whileHover={!disabled && !loading ? "hover" : "idle"}
        whileTap={!disabled && !loading ? "tap" : "idle"}
        transition={{ duration: 0.15, ease: "easeOut" }}
        {...props}
      >
        {/* Ripple Effects */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              className="absolute bg-white/30 rounded-full pointer-events-none"
              style={{
                left: ripple.x - 20,
                top: ripple.y - 20,
                width: 40,
                height: 40,
              }}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>

        {/* Button Content */}
        {renderContent()}

        {/* Shine Effect on Hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ pointerEvents: "none" }}
        />
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;