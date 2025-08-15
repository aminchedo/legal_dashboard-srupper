/**
 * Number formatting utilities for the legal dashboard
 * Addresses the critical issue of long numbers display
 */

/**
 * Format large numbers with K/M suffixes (1,234,567 → 1.2M)
 */
export const formatNumber = (value: number): string => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString('fa-IR');
};

/**
 * Format bytes with proper Persian units
 */
export const formatBytes = (bytes: number): string => {
  const units = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت', 'ترابایت'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

/**
 * Format percentage values
 */
export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

/**
 * Format currency values in Persian
 */
export const formatCurrency = (value: number, currency: string = 'ریال'): string => {
  const formatted = formatNumber(value);
  return `${formatted} ${currency}`;
};

/**
 * Format time duration
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.round(seconds)} ثانیه`;
  }
  if (seconds < 3600) {
    return `${Math.round(seconds / 60)} دقیقه`;
  }
  if (seconds < 86400) {
    return `${Math.round(seconds / 3600)} ساعت`;
  }
  return `${Math.round(seconds / 86400)} روز`;
};

/**
 * Format Persian date
 */
export const formatPersianDate = (date: Date): string => {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

/**
 * Format short numbers for cards and widgets
 */
export const formatShortNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(0)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
};

/**
 * Format progress value (0-100)
 */
export const formatProgress = (value: number): string => {
  return `${Math.max(0, Math.min(100, Math.round(value)))}%`;
};

/**
 * Format decimal numbers with Persian locale
 */
export const formatDecimal = (value: number, decimals: number = 2): string => {
  return value.toLocaleString('fa-IR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Format metric values with units
 */
export const formatMetric = (value: number, unit: string): string => {
  const formatted = formatNumber(value);
  return `${formatted} ${unit}`;
};