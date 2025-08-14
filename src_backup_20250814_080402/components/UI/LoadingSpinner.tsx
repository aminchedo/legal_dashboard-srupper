import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'progress' | 'fullscreen';
  text?: string;
  showProgress?: boolean;
  progress?: number;
  onComplete?: () => void;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'spinner',
  text,
  showProgress = false,
  progress = 0,
  onComplete
}) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('');
  const [dotIndex, setDotIndex] = useState(0);

  const loadingTexts = [
    'در حال بارگذاری...',
    'Loading...',
    'Analyzing data...',
    'Preparing dashboard...',
    'Almost ready...'
  ];

  useEffect(() => {
    if (showProgress) {
      const interval = setInterval(() => {
        setCurrentProgress(prev => {
          if (prev >= progress) {
            clearInterval(interval);
            if (onComplete) onComplete();
            return progress;
          }
          return prev + 1;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [progress, showProgress, onComplete]);

  useEffect(() => {
    if (text) {
      setLoadingText(text);
    } else {
      const interval = setInterval(() => {
        setLoadingText(prev => {
          const currentIndex = loadingTexts.indexOf(prev);
          const nextIndex = (currentIndex + 1) % loadingTexts.length;
          return loadingTexts[nextIndex];
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [text]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotIndex(prev => (prev + 1) % 3);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  if (variant === 'fullscreen') {
    return (
      <div className="premium-loading">
        <div className="flex flex-col items-center justify-center">
          {/* Logo */}
          <motion.div
            className="loading-logo mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-2xl">LD</span>
            </div>
          </motion.div>

          {/* Loading Text */}
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Legal Dashboard
            </h2>
            <p className="text-gray-600 persian-text">
              {loadingText}
            </p>
          </motion.div>

          {/* Progress Bar */}
          {showProgress && (
            <motion.div
              className="w-80 mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="loading-progress">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${currentProgress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <div className="text-center mt-2">
                <span className="text-sm text-gray-600 persian-numbers">
                  {currentProgress}%
                </span>
              </div>
            </motion.div>
          )}

          {/* Animated Dots */}
          <motion.div
            className="flex space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === dotIndex ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                animate={{
                  scale: index === dotIndex ? [1, 1.2, 1] : 1,
                  opacity: index === dotIndex ? 1 : 0.5
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: index * 0.1
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className="flex items-center space-x-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`${sizeClasses[size]} rounded-full bg-blue-500`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2
            }}
          />
        ))}
        {text && (
          <span className={`${textSizes[size]} text-gray-600 persian-text`}>
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'progress') {
    return (
      <div className="flex flex-col items-center space-y-3">
        <div className="relative">
          <svg
            className={`${sizeClasses[size]} transform -rotate-90`}
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ strokeDasharray: 283, strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * currentProgress) / 100 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`${textSizes[size]} font-semibold text-gray-900 persian-numbers`}>
              {currentProgress}%
            </span>
          </div>
        </div>
        {text && (
          <span className={`${textSizes[size]} text-gray-600 persian-text`}>
            {text}
          </span>
        )}
      </div>
    );
  }

  // Default spinner variant
  return (
    <div className="flex items-center space-x-3">
      <motion.div
        className={`${sizeClasses[size]} border-2 border-gray-200 border-t-blue-500 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      {text && (
        <span className={`${textSizes[size]} text-gray-600 persian-text`}>
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;