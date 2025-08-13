import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fa: {
    translation: {
      app: {
        title: 'داشبورد حقوقی ایران',
        subtitle: 'سامانه هوشمند مدیریت اطلاعات حقوقی',
        searchPlaceholder: 'جستجوی سریع...'
      },
      nav: {
        dashboard: 'داشبورد کلی',
        jobs: 'وب اسکرپینگ',
        documents: 'داده‌های جمع‌آوری شده',
        system: 'تحلیل و گزارش',
        proxies: 'پروکسی‌ها',
        settings: 'تنظیمات',
        help: 'راهنما'
      },
      commands: {
        goDashboard: 'رفتن به داشبورد',
        goJobs: 'رفتن به وب اسکرپینگ',
        goDocuments: 'رفتن به داده‌ها',
        goSystem: 'رفتن به تحلیل و گزارش',
        goProxies: 'مدیریت پروکسی',
        toggleTheme: 'تغییر حالت تم',
        toggleLang: 'تغییر زبان',
        focusSearch: 'تمرکز روی جستجوی سراسری',
        settings: 'تنظیمات سیستم',
        help: 'راهنما'
      },
      aria: {
        notifications: 'اعلان‌ها'
      },
      theme: {
        light: '☀️ روشن',
        dark: '🌙 تاریک'
      },
      palette: {
        noResults: 'نتیجه‌ای یافت نشد'
      }
    }
  },
  en: {
    translation: {
      app: {
        title: 'Iran Legal Dashboard',
        subtitle: 'Intelligent legal information management system',
        searchPlaceholder: 'Global search...'
      },
      nav: {
        dashboard: 'Dashboard',
        jobs: 'Web Scraping',
        documents: 'Collected Data',
        system: 'Analytics & Reports',
        proxies: 'Proxies',
        settings: 'Settings',
        help: 'Help'
      },
      commands: {
        goDashboard: 'Go to dashboard',
        goJobs: 'Go to web scraping',
        goDocuments: 'Go to documents',
        goSystem: 'Go to analytics & reports',
        goProxies: 'Manage proxies',
        toggleTheme: 'Toggle theme',
        toggleLang: 'Change language',
        focusSearch: 'Focus global search',
        settings: 'System settings',
        help: 'Help'
      },
      aria: {
        notifications: 'Notifications'
      },
      theme: {
        light: 'Light',
        dark: 'Dark'
      },
      palette: {
        noResults: 'No results'
      }
    }
  }
};

const DEFAULT_LANG = (typeof window !== 'undefined' && localStorage.getItem('lang') === 'en') ? 'en' : 'fa';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: DEFAULT_LANG,
    fallbackLng: 'fa',
    interpolation: { escapeValue: false }
  });

// Sync dir attribute
if (typeof document !== 'undefined') {
  const dir = i18n.language === 'fa' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', i18n.language);
}

export default i18n;