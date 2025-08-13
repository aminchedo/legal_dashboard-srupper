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
}

const sizeClasses = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const variantClasses = {
  primary: 'text-blue-600',
  white: 'text-white',
  current: 'text-current',
};

/**
 * Enhanced loading spinner component that supports both simple spinners and full loading screens
 * 
 * @param size - Size variant (xs, sm, md, lg, xl)
 * @param variant - Color variant (primary, white, current)
 * @param fullScreen - Show as full screen loading experience
 * @param overlay - Show with overlay background
 * @param text - Loading text to display
 * @param percentage - Loading percentage (0-100)
 * @param onLoadComplete - Callback when loading completes
 * @param minDisplayTime - Minimum time to show loading (ms)
 * @param animated - Enable advanced animations for full screen mode
 * @param className - Additional CSS classes
 * 
 * @example
 * // Simple spinner
 * <LoadingSpinner size="md" variant="primary" />
 * 
 * // Full screen loading
 * <LoadingSpinner fullScreen onLoadComplete={() => console.log('Done')} />
 * 
 * // Overlay with progress
 * <LoadingSpinner overlay text="Processing..." percentage={75} />
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

  // Full screen loading experience
  if (fullScreen) {
    if (!isVisible) return null;

    return (
      <div id="loading-screen" className={`fixed inset-0 z-50 ${isVisible ? '' : 'fade-out'}`}>
        <style>{`
          #loading-screen {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: 'Inter', sans-serif;
          }
          
          #loading-screen.fade-out {
            opacity: 0;
            transition: opacity 0.6s ease-out;
          }
          
          .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            animation: float 6s ease-in-out infinite;
          }
          
          .particle:nth-child(1) { top: 20%; left: 20%; animation-delay: 0s; }
          .particle:nth-child(2) { top: 60%; left: 80%; animation-delay: 1s; }
          .particle:nth-child(3) { top: 40%; left: 40%; animation-delay: 2s; }
          .particle:nth-child(4) { top: 80%; left: 10%; animation-delay: 3s; }
          .particle:nth-child(5) { top: 10%; left: 90%; animation-delay: 4s; }
          
          .geo-shape {
            position: absolute;
            width: 60px;
            height: 60px;
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            animation: rotate 20s linear infinite;
          }
          
          .geo-shape:nth-child(6) { top: 15%; left: 15%; }
          .geo-shape:nth-child(7) { top: 70%; left: 75%; animation-delay: -10s; }
          .geo-shape:nth-child(8) { top: 45%; right: 10%; animation-delay: -5s; }
          
          .loading-container {
            text-align: center;
            z-index: 10;
          }
          
          .loading-logo {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 2rem;
            text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          }
          
          .loading-icon {
            margin: 2rem 0;
          }
          
          .scale-container {
            position: relative;
            width: 80px;
            height: 60px;
            margin: 0 auto;
          }
          
          .scale-pillar {
            position: absolute;
            left: 50%;
            bottom: 0;
            transform: translateX(-50%);
            width: 4px;
            height: 40px;
            background: linear-gradient(to top, #4a89e8, #74b9ff);
            border-radius: 2px;
          }
          
          .scale-arm {
            position: absolute;
            left: 50%;
            top: 20px;
            transform: translateX(-50%);
            width: 60px;
            height: 3px;
            background: linear-gradient(to right, #4a89e8, #74b9ff);
            border-radius: 2px;
            animation: balance 3s ease-in-out infinite;
          }
          
          .scale-pan {
            position: absolute;
            top: 15px;
            width: 20px;
            height: 3px;
            background: linear-gradient(to right, #4a89e8, #74b9ff);
            border-radius: 2px;
          }
          
          .scale-pan:nth-child(3) { left: 5px; }
          .scale-pan:nth-child(4) { right: 5px; }
          
          .loading-text {
            font-size: 1.1rem;
            margin: 1rem 0;
            color: rgba(255, 255, 255, 0.9);
          }
          
          .loading-dots::after {
            content: '...';
            animation: dots 1.5s infinite;
          }
          
          .progress-container {
            margin-top: 2rem;
            width: 300px;
          }
          
          .loading-percentage {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: #74b9ff;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }
          
          .progress-bar {
            width: 100%;
            height: 8px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            overflow: hidden;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          
          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4a89e8, #74b9ff, #a29bfe);
            border-radius: 4px;
            transition: width 0.3s ease-out;
            box-shadow: 0 0 10px rgba(116, 185, 255, 0.5);
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(120deg); }
            66% { transform: translateY(5px) rotate(240deg); }
          }
          
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes balance {
            0%, 100% { transform: translateX(-50%) rotate(0deg); }
            50% { transform: translateX(-50%) rotate(2deg); }
          }
          
          @keyframes dots {
            0%, 20% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
          }
        `}</style>

        {/* Floating particles */}
        {animated && (
          <>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>

            {/* Geometric shapes */}
            <div className="geo-shape"></div>
            <div className="geo-shape"></div>
            <div className="geo-shape"></div>
          </>
        )}

        <div className="loading-container">
          <div className="loading-logo">⚖️ LEGAL DASHBOARD</div>

          {animated && (
            <div className="loading-icon">
              <div className="scale-container">
                <div className="scale-pillar"></div>
                <div className="scale-arm"></div>
                <div className="scale-pan"></div>
                <div className="scale-pan"></div>
              </div>
            </div>
          )}

          <div className="loading-text">
            {text || 'Initializing your workspace'}
            <span className="loading-dots"></span>
          </div>

          <div className="progress-container">
            <div className="loading-percentage">{Math.floor(currentPercentage)}%</div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${currentPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Overlay mode
  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4 bg-white rounded-lg p-8 shadow-xl">
          <svg 
            className={`animate-spin ${sizeClasses[size]} ${variantClasses[variant]}`}
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
          {text && <p className="text-gray-700 font-medium">{text}</p>}
          {percentage !== undefined && (
            <p className="text-sm text-gray-500">{Math.floor(currentPercentage)}%</p>
          )}
        </div>
      </div>
    );
  }

  // Simple spinner mode (default)
  const spinnerClasses = [
    'animate-spin',
    sizeClasses[size],
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

// ===== SKELETON LOADER COMPONENT =====

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

/**
 * Skeleton loader for content placeholders
 * 
 * @param width - Width of skeleton
 * @param height - Height of skeleton  
 * @param rounded - Whether skeleton should be rounded
 * @param className - Additional CSS classes
 * 
 * @example
 * <Skeleton width="100%" height="20px" rounded />
 */
export function Skeleton({ 
  className = '', 
  width = '100%', 
  height = '1rem',
  rounded = false 
}: SkeletonProps): JSX.Element {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  const skeletonClasses = [
    'animate-pulse bg-gray-200',
    rounded ? 'rounded-full' : 'rounded',
    className,
  ].join(' ');

  return <div className={skeletonClasses} style={style} aria-hidden="true" />;
}

// ===== LOADING OVERLAY COMPONENT =====

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  size?: SpinnerSize;
  className?: string;
}

/**
 * Full-screen loading overlay
 * 
 * @param isVisible - Whether overlay is visible
 * @param message - Loading message to display
 * @param size - Spinner size
 * @param className - Additional CSS classes
 * 
 * @example
 * <LoadingOverlay isVisible={isLoading} message="Saving data..." />
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
    />
  );
}