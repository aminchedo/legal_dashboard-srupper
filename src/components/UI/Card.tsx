import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { motion, MotionProps } from 'framer-motion';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'ghost' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  animate?: boolean;
  focus?: boolean;
  disabled?: boolean;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  divider?: boolean;
}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  divider?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps & MotionProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      hover = false,
      animate = true,
      focus = false,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out';

    const variantClasses = {
      default: 'rounded-xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 backdrop-blur-sm',
      bordered: 'rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
      elevated: 'rounded-xl shadow-lg border border-gray-200/40 dark:border-gray-700/40 shadow-gray-100/50 dark:shadow-gray-900/20',
      ghost: 'rounded-xl bg-transparent',
      gradient: 'rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200/60 dark:border-gray-700/60',
    };

    const paddingClasses = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
    };

    const hoverClasses = hover && !disabled
      ? 'hover:shadow-xl hover:shadow-gray-100/50 dark:hover:shadow-gray-900/20 hover:-translate-y-1 hover:scale-[1.02] cursor-pointer'
      : '';

    const focusClasses = focus
      ? 'focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-300 dark:focus-within:border-blue-500'
      : '';

    const disabledClasses = disabled
      ? 'opacity-60 cursor-not-allowed pointer-events-none'
      : '';

    const combinedClasses = cn(
      baseClasses,
      variantClasses[variant],
      paddingClasses[padding],
      hoverClasses,
      focusClasses,
      disabledClasses,
      className
    );

    const motionProps = animate ? {
      initial: { opacity: 0, y: 20, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: 20, scale: 0.95 },
      transition: { duration: 0.3, ease: "easeOut" }
    } : {};

    const cardProps = {
      ref,
      className: combinedClasses,
      role: hover ? 'button' : undefined,
      tabIndex: hover && !disabled ? 0 : undefined,
      'aria-disabled': disabled || undefined,
      ...props
    };

    if (animate) {
      return (
        <motion.div
          {...cardProps}
          {...motionProps}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div {...cardProps}>
        {children}
      </div>
    );
  }
);

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, divider = false, children, ...props }, ref) => {
    const classes = cn(
      'flex flex-col space-y-2',
      divider && 'pb-4 mb-4 border-b border-gray-200 dark:border-gray-700',
      className
    );

    return (
      <header ref={ref} className={classes} {...props}>
        {children}
      </header>
    );
  }
);

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => {
    const classes = cn('flex-1', className);

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, divider = false, children, ...props }, ref) => {
    const classes = cn(
      'flex items-center justify-between mt-4',
      divider && 'pt-4 border-t border-gray-200 dark:border-gray-700',
      className
    );

    return (
      <footer ref={ref} className={classes} {...props}>
        {children}
      </footer>
    );
  }
);

const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => {
    const classes = cn(
      'text-lg md:text-xl font-semibold leading-tight tracking-tight text-gray-900 dark:text-white',
      className
    );

    return (
      <h3 ref={ref} className={classes} {...props}>
        {children}
      </h3>
    );
  }
);

const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const classes = cn(
      'text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed',
      className
    );

    return (
      <p ref={ref} className={classes} {...props}>
        {children}
      </p>
    );
  }
);

// Skeleton Card for loading states
const CardSkeleton = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className }, ref) => {
    return (
      <Card 
        ref={ref} 
        className={cn("animate-pulse", className)} 
        animate={false}
      >
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </Card>
    );
  }
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardBody.displayName = 'CardBody';
CardFooter.displayName = 'CardFooter';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
CardSkeleton.displayName = 'CardSkeleton';

export { Card, CardHeader, CardBody, CardFooter, CardTitle, CardDescription, CardSkeleton };
export default Card;