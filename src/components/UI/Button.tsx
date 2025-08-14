import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  gradient?: boolean;
  animate?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  onClick,
  className,
  type = 'button',
  gradient = false,
  animate = true,
}) => {
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: gradient 
      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-700'
      : 'bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg',
    secondary: 'bg-gray-100 text-gray-900 border border-gray-200 hover:bg-gray-200 hover:border-gray-300',
    outline: 'bg-transparent text-blue-600 border-2 border-blue-600 hover:bg-blue-50 hover:border-blue-700',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    danger: 'bg-red-600 text-white shadow-md hover:bg-red-700 hover:shadow-lg',
    success: 'bg-green-600 text-white shadow-md hover:bg-green-700 hover:shadow-lg',
  };

  const disabledClasses = disabled || loading
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : '';

  const buttonContent = (
    <div className="flex items-center justify-center space-x-2">
      {icon && iconPosition === 'left' && (
        <motion.div
          className="flex-shrink-0"
          animate={loading ? { rotate: 360 } : {}}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          {icon}
        </motion.div>
      )}
      
      <span className="persian-text">
        {loading ? 'در حال بارگذاری...' : children}
      </span>
      
      {icon && iconPosition === 'right' && (
        <motion.div
          className="flex-shrink-0"
          animate={loading ? { rotate: 360 } : {}}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          {icon}
        </motion.div>
      )}
    </div>
  );

  const buttonElement = (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'premium-button font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        sizeClasses[size],
        variantClasses[variant],
        disabledClasses,
        fullWidth && 'w-full',
        className
      )}
    >
      {buttonContent}
    </button>
  );

  if (animate) {
    return (
      <motion.div
        whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
        whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
        transition={{ duration: 0.1 }}
      >
        {buttonElement}
      </motion.div>
    );
  }

  return buttonElement;
};

// Specialized Button Components
export const IconButton: React.FC<{
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  tooltip?: string;
}> = ({ 
  icon, 
  variant = 'ghost', 
  size = 'md', 
  loading, 
  disabled, 
  onClick, 
  className,
  tooltip 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    ghost: 'bg-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'premium-button rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        sizeClasses[size],
        variantClasses[variant],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      whileHover={!disabled && !loading ? { scale: 1.05 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.95 } : undefined}
      title={tooltip}
    >
      <motion.div
        animate={loading ? { rotate: 360 } : {}}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        {icon}
      </motion.div>
    </motion.button>
  );
};

export const ActionButton: React.FC<{
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}> = ({ 
  children, 
  icon, 
  variant = 'primary', 
  size = 'md', 
  loading, 
  disabled, 
  onClick, 
  className 
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      loading={loading}
      disabled={disabled}
      onClick={onClick}
      icon={icon}
      iconPosition="left"
      className={cn('font-semibold', className)}
    >
      {children}
    </Button>
  );
};

export const FloatingActionButton: React.FC<{
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  tooltip?: string;
}> = ({ icon, onClick, className, tooltip }) => {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-50',
        className
      )}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.9 }}
      title={tooltip}
    >
      {icon}
    </motion.button>
  );
};

export default Button;