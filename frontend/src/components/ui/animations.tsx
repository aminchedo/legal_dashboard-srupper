import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { cn } from '../../lib/utils';

// Animation variants
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export const scaleInOut: Variants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 }
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const bounceIn: Variants = {
  initial: { scale: 0.3, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

export const floatingAnimation: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const pulseAnimation: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Wrapper components for common animations
interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hoverScale?: number;
  clickScale?: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className,
  delay = 0,
  hoverScale = 1.02,
  clickScale = 0.98
}) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover={{ scale: hoverScale, y: -4 }}
      whileTap={{ scale: clickScale }}
      variants={fadeInUp}
      transition={{ duration: 0.3, delay }}
      className={cn(
        "cursor-pointer transition-shadow duration-300 hover:shadow-lg",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  className,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary'
}) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-600',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
        />
      ) : (
        children
      )}
    </motion.button>
  );
};

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 2,
  className,
  suffix = "",
  prefix = ""
}) => {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className={className}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {prefix}
      </motion.span>
      <motion.span
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration, ease: "easeOut" }}
      >
        {value.toLocaleString('fa-IR')}
      </motion.span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: duration * 0.8 }}
      >
        {suffix}
      </motion.span>
    </motion.span>
  );
};

interface AnimatedListProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  className,
  staggerDelay = 0.1
}) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className={className}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={fadeInUp}
          transition={{ delay: index * staggerDelay }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

interface AnimatedPageProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedPage: React.FC<AnimatedPageProps> = ({
  children,
  className
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 6,
  className
}) => {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Success animation component
export const SuccessCheckmark: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.1 
      }}
      className={cn("w-12 h-12 bg-green-100 rounded-full flex items-center justify-center", className)}
    >
      <motion.svg
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="text-green-600"
      >
        <motion.path
          d="M20 6L9 17l-5-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </motion.div>
  );
};