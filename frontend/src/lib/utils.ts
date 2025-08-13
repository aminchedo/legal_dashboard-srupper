import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (date: Date | string, locale: string = 'fa-IR') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(dateObj);
};

export const formatDateTime = (date: Date | string, locale: string = 'fa-IR') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }).format(dateObj);
};

export const formatTime = (date: Date | string, locale: string = 'fa-IR') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(dateObj);
};

export const formatDistanceToNow = (date: Date | string) => {
  const now = new Date();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const diff = now.getTime() - dateObj.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes} دقیقه پیش`;
  if (hours < 24) return `${hours} ساعت پیش`;
  return `${days} روز پیش`;
};

export const animationConfig = {
  card: {
    hover: { scale: 1.02, y: -4 },
    tap: { scale: 0.98 }
  },
  button: {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  },
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  },
  slideIn: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4 }
  }
};