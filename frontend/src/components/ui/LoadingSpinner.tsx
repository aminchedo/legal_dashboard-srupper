import React, { useEffect, useState } from 'react';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SpinnerVariant = 'primary' | 'white' | 'current';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
}

interface LoadingScreenProps {
  onLoadComplete?: () => void;
  minDisplayTime?: number;
  percentage?: number;
  text?: string;
}

interface EnhancedLoadingSpinnerProps extends LoadingSpinnerProps {
  // Full screen loading options
  fullScreen?: boolean;
  overlay?: boolean;
  text?: string;
  percentage?: number;
  onLoadComplete?: () => void;
  minDisplayTime?: number;
  animated?: boolean;
  responsive?: boolean; // NEW: Auto-scale based on screen size
}

// Responsive size classes that scale with screen size
const sizeClasses = {
  xs: 'w-[clamp(0.75rem,2vw,1rem)] h-[clamp(0.75rem,2vw,1rem)]',
  sm: 'w-[clamp(1rem,2.5vw,1.25rem)] h-[clamp(1rem,2.5vw,1.25rem)]',
  md: 'w-[clamp(1.5rem,3vw,2rem)] h-[clamp(1.5rem,3vw,2rem)]',
  lg: 'w-[clamp(2rem,4vw,3rem)] h-[clamp(2rem,4vw,3rem)]',
  xl: 'w-[clamp(3rem,6vw,4rem)] h-[clamp(3rem,6vw,4rem)]',
};

const variantClasses = {
  primary: 'text-blue-600',
  white: 'text-white',
  current: 'text-current',
};

/**
 * Enhanced responsive loading spinner component that supports multiple modes
 * 
 * @param size - Size variant that scales responsively (xs, sm, md, lg, xl)
 * @param variant - Color variant (primary, white, current)
 * @param fullScreen - Show as full screen loading experience
 * @param overlay - Show with overlay background
 * @param text - Loading text to display
 * @param percentage - Loading percentage (0-100)
 * @param onLoadComplete - Callback when loading completes
 * @param minDisplayTime - Minimum time to show loading (ms)
 * @param animated - Enable advanced animations for full screen mode
 * @param responsive - Auto-scale size based on screen size
 * @param className - Additional CSS classes
 * 
 * @example
 * // Simple responsive spinner
 * <LoadingSpinner size="md" variant="primary" responsive />
 * 
 * // Full screen loading with responsive scaling
 * <LoadingSpinner fullScreen responsive onLoadComplete={() => console.log('Done')} />
 * 
 * // Mobile-optimized overlay
 * <LoadingSpinner overlay text="Processing..." percentage={75} responsive />
 */
export default function LoadingSpinner({ 
  size = 'md', 
  variant = 'primary',
  fullScreen = false,
  overlay = false,
  text,
  percentage,
  onLoadComplete,
  minDisplayTime = 2000,
  animated = true,
  responsive = true,
  className = '' 
}: EnhancedLoadingSpinnerProps): JSX.Element | null {

  // State for full screen mode
  const [currentPercentage, setCurrentPercentage] = useState(percentage || 0);
  const [isVisible, setIsVisible] = useState(true);

  // Handle full screen loading animation and timing
  useEffect(() => {
    if (!fullScreen || percentage !== undefined) return;

    const startTime = Date.now();
    let animationFrameId: number;
    let timeoutId: NodeJS.Timeout;

    const updatePercentage = () => {
      setCurrentPercentage(prev => {
        const newValue = prev + (Math.random() * 3 + 1);
        if (newValue < 100) {
          animationFrameId = requestAnimationFrame(() => {
            setTimeout(updatePercentage, 100);
          });
          return newValue;
        } else {
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

          timeoutId = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
              if (onLoadComplete) onLoadComplete();
            }, 600);
          }, remainingTime);

          return 100;
        }
      });
    };

    if (animated) {
      setTimeout(updatePercentage, 500);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
    };
  }, [fullScreen, percentage, minDisplayTime, onLoadComplete, animated]);

  // Update percentage when prop changes
  useEffect(() => {
    if (percentage !== undefined) {
      setCurrentPercentage(percentage);
    }
  }, [percentage]);

  // Full screen loading experience with responsive design
  if (fullScreen) {
    if (!isVisible) return null;

    return (
      <div 
        id="loading-screen" 
        className={`fixed inset-0 z-[9999] ${isVisible ? '' : 'fade-out'} safe-area-inset`}
        style={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'var(--font-family)',
          padding: 'var(--space-4)',
        }}
      >
        <style>{`
          #loading-screen.fade-out {
            opacity: 0;
            transition: opacity 0.6s ease-out;
          }
          
          .loading-particle {
            position: absolute;
            width: clamp(3px, 0.5vw, 6px);
            height: clamp(3px, 0.5vw, 6px);
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            animation: float-responsive 6s ease-in-out infinite;
          }
          
          .loading-particle:nth-child(1) { top: 20%; left: 20%; animation-delay: 0s; }
          .loading-particle:nth-child(2) { top: 60%; left: 80%; animation-delay: 1s; }
          .loading-particle:nth-child(3) { top: 40%; left: 40%; animation-delay: 2s; }
          .loading-particle:nth-child(4) { top: 80%; left: 10%; animation-delay: 3s; }
          .loading-particle:nth-child(5) { top: 10%; left: 90%; animation-delay: 4s; }
          
          .loading-geo-shape {
            position: absolute;
            width: clamp(40px, 5vw, 80px);
            height: clamp(40px, 5vw, 80px);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            animation: rotate-slow 20s linear infinite;
          }
          
          .loading-geo-shape:nth-child(6) { top: 15%; left: 15%; }
          .loading-geo-shape:nth-child(7) { top: 70%; left: 75%; animation-delay: -10s; }
          .loading-geo-shape:nth-child(8) { top: 45%; right: 10%; animation-delay: -5s; }
          
          .loading-main-container {
            text-align: center;
            z-index: 10;
            max-width: min(400px, 90vw);
            width: 100%;
          }
          
          .loading-main-logo {
            font-size: clamp(1.5rem, 5vw, 3rem);
            font-weight: 800;
            margin-bottom: clamp(1rem, 3vw, 2rem);
            text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            background: linear-gradient(135deg, #fff, #a8edea 50%, #fed6e3);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          
          .loading-scale-icon {
            margin: clamp(1rem, 3vw, 2rem) 0;
          }
          
          .loading-scale-container {
            position: relative;
            width: clamp(60px, 8vw, 100px);
            height: clamp(60px, 8vw, 100px);
            margin: 0 auto;
          }
          
          .loading-scale-pillar {
            position: absolute;
            left: 50%;
            bottom: 0;
            transform: translateX(-50%);
            width: 4px;
            height: 60%;
            background: linear-gradient(to top, #4a89e8, #74b9ff);
            border-radius: 2px;
          }
          
          .loading-scale-arm {
            position: absolute;
            left: 50%;
            top: 30%;
            transform: translateX(-50%);
            width: 80%;
            height: 3px;
            background: linear-gradient(to right, #4a89e8, #74b9ff);
            border-radius: 2px;
            animation: balance-responsive 3s ease-in-out infinite;
          }
          
          .loading-scale-pan {
            position: absolute;
            top: 25%;
            width: 20%;
            height: 3px;
            background: linear-gradient(to right, #4a89e8, #74b9ff);
            border-radius: 2px;
          }
          
          .loading-scale-pan:nth-child(3) { left: 5%; }
          .loading-scale-pan:nth-child(4) { right: 5%; }
          
          .loading-main-text {
            font-size: clamp(0.9rem, 2.5vw, 1.2rem);
            margin: clamp(1rem, 3vw, 1.5rem) 0;
            color: rgba(255, 255, 255, 0.9);
            line-height: var(--leading-relaxed);
          }
          
          .loading-dots-responsive::after {
            content: '...';
            animation: dots-responsive 1.5s infinite;
          }
          
          .loading-progress-container {
            margin-top: clamp(1rem, 3vw, 2rem);
            width: 100%;
            max-width: 300px;
            margin-left: auto;
            margin-right: auto;
          }
          
          .loading-main-percentage {
            font-size: clamp(1.2rem, 3vw, 2rem);
            font-weight: 700;
            margin-bottom: clamp(0.5rem, 2vw, 1rem);
            color: #74b9ff;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }
          
          .loading-progress-bar {
            width: 100%;
            height: clamp(6px, 1vw, 10px);
            background: rgba(255, 255, 255, 0.2);
            border-radius: clamp(3px, 0.5vw, 5px);
            overflow: hidden;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          
          .loading-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4a89e8, #74b9ff, #a29bfe);
            border-radius: clamp(3px, 0.5vw, 5px);
            transition: width 0.3s ease-out;
            box-shadow: 0 0 10px rgba(116, 185, 255, 0.5);
          }
          
          @keyframes float-responsive {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(clamp(-8px, -2vw, -15px)) rotate(120deg); }
            66% { transform: translateY(clamp(4px, 1vw, 8px)) rotate(240deg); }
          }
          
          @keyframes rotate-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes balance-responsive {
            0%, 100% { transform: translateX(-50%) rotate(0deg); }
            50% { transform: translateX(-50%) rotate(clamp(1deg, 0.3vw, 3deg)); }
          }
          
          @keyframes dots-responsive {
            0%, 20% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
          }
          
          /* Reduce motion for accessibility */
          @media (prefers-reduced-motion: reduce) {
            .loading-particle,
            .loading-geo-shape,
            .loading-scale-arm,
            .loading-dots-responsive::after {
              animation: none;
            }
          }
        `}</style>

        {/* Floating particles */}
        {animated && (
          <>
            <div className="loading-particle"></div>
            <div className="loading-particle"></div>
            <div className="loading-particle"></div>
            <div className="loading-particle"></div>
            <div className="loading-particle"></div>

            {/* Geometric shapes */}
            <div className="loading-geo-shape"></div>
            <div className="loading-geo-shape"></div>
            <div className="loading-geo-shape"></div>
          </>
        )}

        <div className="loading-main-container">
          <div className="loading-main-logo">⚖️ LEGAL DASHBOARD</div>

          {animated && (
            <div className="loading-scale-icon">
              <div className="loading-scale-container">
                <div className="loading-scale-pillar"></div>
                <div className="loading-scale-arm"></div>
                <div className="loading-scale-pan"></div>
                <div className="loading-scale-pan"></div>
              </div>
            </div>
          )}

          <div className="loading-main-text">
            {text || 'Initializing your workspace'}
            <span className="loading-dots-responsive"></span>
          </div>

          <div className="loading-progress-container">
            <div className="loading-main-percentage">{Math.floor(currentPercentage)}%</div>
            <div className="loading-progress-bar">
              <div
                className="loading-progress-fill"
                style={{ width: `${currentPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Overlay mode with mobile-first responsive design
  if (overlay) {
    return (
      <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm safe-area-inset">
        <div className="flex flex-col items-center gap-4 bg-white rounded-xl p-6 md:p-8 shadow-elegant mx-4 max-w-sm w-full">
          <svg 
            className={`animate-spin ${responsive ? sizeClasses[size] : sizeClasses[size]} ${variantClasses[variant]}`}
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            role="status"
            aria-label="Loading"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {text && (
            <p className="text-gray-700 font-medium text-center" style={{ fontSize: 'var(--text-sm)' }}>
              {text}
            </p>
          )}
          {percentage !== undefined && (
            <p className="text-gray-500 font-medium" style={{ fontSize: 'var(--text-sm)' }}>
              {Math.floor(currentPercentage)}%
            </p>
          )}
        </div>
      </div>
    );
  }

  // Simple spinner mode with responsive sizing
  const spinnerClasses = [
    'animate-spin',
    responsive ? sizeClasses[size] : sizeClasses[size],
    variantClasses[variant],
    className,
  ].join(' ');

  return (
    <svg 
      className={spinnerClasses}
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
      role="status"
      aria-label="Loading"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
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