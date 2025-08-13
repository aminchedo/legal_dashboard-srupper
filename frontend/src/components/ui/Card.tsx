import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  variant?: 'default' | 'bordered' | 'elevated' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  children: React.ReactNode;
  hover?: boolean;
  animated?: boolean;
  delay?: number; // Animation delay for staggered effects
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({
    className,
    variant = 'default',
    padding = 'md',
    interactive = false,
    children,
    hover = true,
    animated = true,
    delay = 0,
    ...props
  }, ref) => {
    const baseClasses = cn(
      'relative rounded-lg transition-all duration-200',
      'focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2'
    );

    const variants = {
      default: cn(
        'bg-white dark:bg-neutral-800',
        'border border-neutral-200 dark:border-neutral-700',
        'shadow-sm'
      ),
      bordered: cn(
        'bg-white dark:bg-neutral-800',
        'border-2 border-neutral-200 dark:border-neutral-700'
      ),
      elevated: cn(
        'bg-white dark:bg-neutral-800',
        'border border-neutral-200 dark:border-neutral-700',
        'shadow-lg'
      ),
      glass: cn(
        'bg-white/80 dark:bg-neutral-800/80',
        'border border-white/20 dark:border-neutral-700/50',
        'backdrop-blur-lg backdrop-saturate-150',
        'shadow-lg'
      )
    };

    const paddingClasses = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6'
    };

    const interactiveClasses = interactive 
      ? cn(
          'cursor-pointer',
          hover && 'hover:shadow-md hover:-translate-y-0.5',
          'active:translate-y-0 active:shadow-sm',
          'transition-all duration-200 ease-out'
        ) 
      : '';

    const cardVariants = {
      hidden: { 
        opacity: 0, 
        y: 20,
        scale: 0.95
      },
      visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: {
          duration: 0.4,
          delay,
          ease: "easeOut"
        }
      },
      hover: hover ? {
        y: -2,
        scale: 1.01,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        transition: {
          duration: 0.2,
          ease: "easeOut"
        }
      } : {},
      tap: interactive ? {
        scale: 0.98,
        y: 0,
        transition: {
          duration: 0.1,
          ease: "easeOut"
        }
      } : {}
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          paddingClasses[padding],
          interactiveClasses,
          className
        )}
        variants={animated ? cardVariants : undefined}
        initial={animated ? "hidden" : undefined}
        animate={animated ? "visible" : undefined}
        whileHover={interactive && hover ? "hover" : undefined}
        whileTap={interactive ? "tap" : undefined}
        layout
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

// Card Header Component
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animated?: boolean;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, animated = true, ...props }, ref) => {
    const headerVariants = {
      hidden: { opacity: 0, y: -10 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.3,
          delay: 0.1,
          ease: "easeOut"
        }
      }
    };

    return (
      <motion.div
        ref={ref}
        className={cn('flex flex-col space-y-1.5 p-6 pb-0', className)}
        variants={animated ? headerVariants : undefined}
        initial={animated ? "hidden" : undefined}
        animate={animated ? "visible" : undefined}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// Card Title Component
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  animated?: boolean;
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, as: Comp = 'h3', animated = true, ...props }, ref) => {
    const titleVariants = {
      hidden: { opacity: 0, x: -10 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: {
          duration: 0.3,
          delay: 0.15,
          ease: "easeOut"
        }
      }
    };

    return (
      <motion.div
        variants={animated ? titleVariants : undefined}
        initial={animated ? "hidden" : undefined}
        animate={animated ? "visible" : undefined}
      >
        <Comp
          ref={ref}
          className={cn(
            'text-lg font-semibold leading-none tracking-tight text-neutral-900 dark:text-neutral-100',
            'rtl:text-right',
            className
          )}
          {...props}
        >
          {children}
        </Comp>
      </motion.div>
    );
  }
);

CardTitle.displayName = 'CardTitle';

// Card Description Component
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  animated?: boolean;
}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, animated = true, ...props }, ref) => {
    const descriptionVariants = {
      hidden: { opacity: 0, x: -10 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: {
          duration: 0.3,
          delay: 0.2,
          ease: "easeOut"
        }
      }
    };

    return (
      <motion.p
        ref={ref}
        className={cn(
          'text-sm text-neutral-600 dark:text-neutral-400',
          'rtl:text-right',
          className
        )}
        variants={animated ? descriptionVariants : undefined}
        initial={animated ? "hidden" : undefined}
        animate={animated ? "visible" : undefined}
        {...props}
      >
        {children}
      </motion.p>
    );
  }
);

CardDescription.displayName = 'CardDescription';

// Card Content Component
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animated?: boolean;
  stagger?: boolean; // Enable stagger animation for children
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, animated = true, stagger = false, ...props }, ref) => {
    const contentVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.3,
          delay: 0.25,
          ease: "easeOut",
          ...(stagger && {
            staggerChildren: 0.1,
            delayChildren: 0.3
          })
        }
      }
    };

    const childVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.2,
          ease: "easeOut"
        }
      }
    };

    return (
      <motion.div
        ref={ref}
        className={cn('p-6 pt-0', className)}
        variants={animated ? contentVariants : undefined}
        initial={animated ? "hidden" : undefined}
        animate={animated ? "visible" : undefined}
        {...props}
      >
        {stagger && animated ? (
          React.Children.map(children, (child, index) => (
            <motion.div key={index} variants={childVariants}>
              {child}
            </motion.div>
          ))
        ) : children}
      </motion.div>
    );
  }
);

CardContent.displayName = 'CardContent';

// Card Footer Component
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animated?: boolean;
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, animated = true, ...props }, ref) => {
    const footerVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.3,
          delay: 0.3,
          ease: "easeOut"
        }
      }
    };

    return (
      <motion.div
        ref={ref}
        className={cn('flex items-center p-6 pt-0', className)}
        variants={animated ? footerVariants : undefined}
        initial={animated ? "hidden" : undefined}
        animate={animated ? "visible" : undefined}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export default Card;
export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter };