import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Database, Activity, Zap, Shield } from 'lucide-react';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SpinnerVariant = 'primary' | 'white' | 'current' | 'dark' | 'gradient';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  text?: string;
  percentage?: number;
  onLoadComplete?: () => void;
  minDisplayTime?: number;
  animated?: boolean;
  responsive?: boolean;
  showProgress?: boolean;
  showBrandMessage?: boolean;
}

// Size classes that scale responsively
const sizeClasses = {
  xs: 'w-4 h-4',
  sm: 'w-5 h-5', 
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const variantClasses = {
  primary: 'text-blue-600',
  white: 'text-white',
  current: 'text-current',
  dark: 'text-blue-400',
  gradient: 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500',
};

// Floating particles component
const FloatingParticles: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
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

export default function LoadingSpinner({ 
  size = 'md', 
  variant = 'dark',
  fullScreen = false,
  overlay = false,
  text,
  percentage,
  onLoadComplete,
  minDisplayTime = 2000,
  animated = true,
  responsive = true,
  showProgress = true,
  showBrandMessage = true,
  className = '' 
}: LoadingSpinnerProps): JSX.Element | null {

  const [currentPercentage, setCurrentPercentage] = useState(percentage || 0);
  const [isVisible, setIsVisible] = useState(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Loading messages that rotate
  const loadingMessages = [
    'در حال بارگذاری داشبورد...',
    'در حال تهیه داده‌ها...',
    'تقریباً آماده است...',
    'در حال اتصال به سرویس‌ها...',
  ];

  // Rotate messages every 2 seconds
  useEffect(() => {
    if (!fullScreen) return;
    
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(messageInterval);
  }, [fullScreen]);

  // Handle loading progress animation
  useEffect(() => {
    if (!fullScreen || percentage !== undefined) return;

    const startTime = Date.now();
    let animationFrameId: number;
    let timeoutId: NodeJS.Timeout;

    const updatePercentage = () => {
      setCurrentPercentage(prev => {
        const newValue = prev + (Math.random() * 2 + 0.5);
        if (newValue < 95) {
          animationFrameId = requestAnimationFrame(() => {
            setTimeout(updatePercentage, 100);
          });
          return newValue;
        } else {
          // Complete loading
          setTimeout(() => {
            const elapsed = Date.now() - startTime;
            const remainingTime = Math.max(0, minDisplayTime - elapsed);
            
            timeoutId = setTimeout(() => {
              setIsVisible(false);
              onLoadComplete?.();
            }, remainingTime);
          }, 500);
          return 100;
        }
      });
    };

    updatePercentage();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [fullScreen, percentage, minDisplayTime, onLoadComplete]);

  // Don't render if not visible
  if (!isVisible && fullScreen) {
    return null;
  }

  // Simple spinner mode
  if (!fullScreen && !overlay) {
    const finalSize = responsive ? 'md' : size;
    return (
      <div className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${sizeClasses[finalSize]} ${variantClasses[variant]} ${className}`} role="status">
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // Enhanced full screen loading experience
  if (fullScreen) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)`,
          }} />
        </div>

        {/* Floating particles animation */}
        <FloatingParticles count={8} />

        <div className="relative z-10 flex flex-col items-center max-w-md mx-auto px-6 text-center">
          {/* Main logo/icon with animation */}
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8 relative"
          >
            <div className="relative inline-flex p-6 rounded-full bg-blue-500/10 backdrop-blur-sm border border-blue-400/20">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full border-4 border-blue-400/30 border-t-blue-400"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <Shield className="w-8 h-8 text-blue-400" />
                </motion.div>
              </div>
            </div>
            
            {/* Pulsing rings */}
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full border border-blue-400/20"
            />
            <motion.div 
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute inset-2 rounded-full border border-blue-400/10"
            />
          </motion.div>

          {/* App title and subtitle */}
          {showBrandMessage && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
                سیستم مدیریت حقوقی
              </h1>
              <p className="text-blue-200 md:text-lg opacity-90">
                سیستم جامع مدیریت اطلاعات حقوقی جمهوری اسلامی ایران
              </p>
            </motion.div>
          )}

          {/* Loading message with rotation */}
          <div className="mb-8 h-6">
            <AnimatePresence mode="wait">
              <motion.p 
                key={currentMessageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-blue-100 md:text-lg"
              >
                {text || loadingMessages[currentMessageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Progress bar */}
          {showProgress && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="w-full max-w-xs mb-4"
            >
              <div className="relative h-2 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${currentPercentage}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
                />
                <motion.div 
                  animate={{ x: [-100, 300] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
              </div>
              <div className="text-center mt-2">
                <motion.span 
                  key={Math.round(currentPercentage)}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-blue-300 text-sm font-medium"
                >
                  {Math.round(currentPercentage)}%
                </motion.span>
              </div>
            </motion.div>
          )}

          {/* System status icons */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex items-center space-x-4 space-x-reverse mt-4"
          >
            {[Database, Activity, Zap].map((Icon, index) => (
              <motion.div
                key={index}
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: index * 0.3 
                }}
                className="p-2 rounded-full bg-blue-500/10 border border-blue-400/20"
              >
                <Icon className="w-4 h-4 text-blue-400" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Overlay mode
  if (overlay) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl border">
          <div className="flex flex-col items-center space-y-4">
            <div className={`animate-spin rounded-full border-2 border-blue-600 border-t-transparent ${sizeClasses.lg}`} />
            {text && <p className="text-gray-600 dark:text-gray-300">{text}</p>}
            {showProgress && percentage !== undefined && (
              <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
}

// ===== RESPONSIVE SKELETON LOADER COMPONENT =====

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

/**
 * Responsive skeleton loader for content placeholders
 * 
 * @param width - Width of skeleton (responsive by default)
 * @param height - Height of skeleton (responsive by default)
 * @param rounded - Whether skeleton should be rounded
 * @param className - Additional CSS classes
 * 
 * @example
 * <Skeleton width="100%" height="clamp(16px, 2vw, 24px)" rounded />
 */
export function Skeleton({ 
  className = '', 
  width = '100%', 
  height = 'var(--space-4)',
  rounded = false 
}: SkeletonProps): JSX.Element {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  const skeletonClasses = [
    'animate-pulse bg-gray-200 dark:bg-gray-700',
    rounded ? 'rounded-full' : 'rounded-lg',
    'transition-all duration-200',
    className,
  ].join(' ');

  return <div className={skeletonClasses} style={style} aria-hidden="true" />;
}

// ===== RESPONSIVE LOADING OVERLAY COMPONENT =====

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  size?: SpinnerSize;
  className?: string;
}

/**
 * Responsive full-screen loading overlay
 * 
 * @param isVisible - Whether overlay is visible
 * @param message - Loading message to display
 * @param size - Spinner size (auto-scales responsively)
 * @param className - Additional CSS classes
 * 
 * @example
 * <LoadingOverlay isVisible={isLoading} message="Saving data..." size="lg" />
 */
export function LoadingOverlay({ 
  isVisible,
  message = 'Loading...',
  size = 'lg',
  className = '' 
}: LoadingOverlayProps): JSX.Element | null {
  if (!isVisible) return null;

  return (
    <LoadingSpinner
      overlay
      size={size}
      text={message}
      className={className}
      responsive
    />
  );
}