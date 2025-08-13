import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { motion, MotionProps } from 'framer-motion';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  animate?: boolean;
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
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'bg-white dark:bg-gray-800 transition-all duration-200';

    const variantClasses = {
      default: 'rounded-lg shadow-sm border border-gray-200 dark:border-gray-700',
      bordered: 'rounded-lg border-2 border-gray-200 dark:border-gray-700',
      elevated: 'rounded-lg shadow-lg border border-gray-200 dark:border-gray-700',
      ghost: 'rounded-lg',
    };

    const paddingClasses = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
    };

    const hoverClasses = hover
      ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
      : '';

    const combinedClasses = cn(
      baseClasses,
      variantClasses[variant],
      paddingClasses[padding],
      hoverClasses,
      className
    );

    const motionProps = animate ? {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
      transition: { duration: 0.2 }
    } : {};

    if (animate) {
      return (
        <motion.div
          ref={ref}
          className={combinedClasses}
          {...motionProps}
          {...props}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={combinedClasses} {...props}>
        {children}
      </div>
    );
  }
);

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, divider = false, children, ...props }, ref) => {
    const classes = cn(
      'flex flex-col space-y-1.5',
      divider && 'pb-4 border-b border-gray-200 dark:border-gray-700',
      className
    );

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
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
      'flex items-center',
      divider && 'pt-4 border-t border-gray-200 dark:border-gray-700',
      className
    );

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => {
    const classes = cn(
      'text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-white',
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
      'text-sm text-gray-600 dark:text-gray-400',
      className
    );

    return (
      <p ref={ref} className={classes} {...props}>
        {children}
      </p>
    );
  }
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardBody.displayName = 'CardBody';
CardFooter.displayName = 'CardFooter';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';

export { Card, CardHeader, CardBody, CardFooter, CardTitle, CardDescription };
export default Card;