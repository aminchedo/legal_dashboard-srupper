/**
 * Professional Persian Legal Terminology System
 * 
 * This file contains proper Persian translations for all legal and technical terms
 * used throughout the legal information management dashboard.
 */

export const LEGAL_TERMINOLOGY = {
  // === MAIN NAVIGATION & SECTIONS ===
  dashboard: 'داشبورد مدیریت حقوقی',
  overview: 'نمای کلی سیستم',

  // Page titles used in headers
  pages: {
    dashboard: 'داشبورد مدیریت حقوقی',
    documents: 'مدیریت اسناد',
    analytics: 'تحلیل و گزارش‌سازی',
    settings: 'تنظیمات',
    system: 'سیستم'
  },
  
  // Document Management
  documents: 'مدیریت اسناد حقوقی',
  allDocuments: 'تمام اسناد', // Fixed from "کال اسناد"
  documentsManagement: 'مدیریت و بایگانی اسناد',
  documentUpload: 'بارگذاری سند جدید',
  documentSearch: 'جستجو در اسناد',
  documentCategories: 'دسته‌بندی اسناد',
  
  // Data Extraction & Processing
  extraction: 'استخراج هوشمند اطلاعات', // Fixed from "تسریع استخریدیک"
  dataExtraction: 'استخراج و پردازش داده‌ها',
  webScraping: 'استخراج خودکار اطلاعات وب', // Fixed from "اسکربینگ"
  acceleratedExtraction: 'تسریع استخراج اطلاعات', // Fixed from "تسریع استخریدیک"
  
  // Analytics & Reporting  
  analytics: 'تحلیل و گزارش‌سازی', // Fixed from "آتالیز"
  analysis: 'تحلیل و بررسی داده‌ها',
  reports: 'گزارش‌های تخصصی',
  statisticalAnalysis: 'تحلیل آماری',
  
  // System Management
  system: 'مدیریت سیستم',
  systemHealth: 'وضعیت سلامت سیستم',
  systemStatus: 'در حال اجرا', // Fixed from "سپسام"
  systemMonitoring: 'نظارت بر عملکرد سیستم',
  
  // Settings & Configuration
  settings: 'تنظیمات عمومی',
  configuration: 'پیکربندی سیستم',
  userSettings: 'تنظیمات کاربری',
  
  // === LEGAL CATEGORIES ===
  legalCategories: {
    civilLaw: 'حقوق مدنی',
    commercialLaw: 'حقوق تجاری',
    criminalLaw: 'حقوق کیفری',
    administrativeLaw: 'حقوق اداری',
    constitutionalLaw: 'حقوق اساسی',
    laborLaw: 'حقوق کار',
    familyLaw: 'حقوق خانواده',
    taxLaw: 'حقوق مالیاتی',
    procedualLaw: 'آیین دادرسی',
    publicLaw: 'حقوق عمومی',
    privateLaw: 'حقوق خصوصی',
    internationalLaw: 'حقوق بین‌المللی',
  },
  
  // === DOCUMENT TYPES ===
  documentTypes: {
    law: 'قانون',
    regulation: 'آیین‌نامه',
    circular: 'بخشنامه',
    verdict: 'رأی',
    judgment: 'حکم',
    decree: 'تصویب‌نامه',
    instruction: 'دستورالعمل',
    guideline: 'راهنما',
    procedure: 'روش اجرایی',
    policy: 'سیاست',
    contract: 'قرارداد',
    agreement: 'موافقت‌نامه',
  },
  
  // === SYSTEM STATUS ===
  status: {
    active: 'فعال و عملیاتی',
    inactive: 'غیرفعال',
    running: 'در حال اجرا',
    stopped: 'متوقف شده',
    pending: 'در انتظار',
    processing: 'در حال پردازش',
    completed: 'تکمیل شده',
    failed: 'ناموفق',
    warning: 'نیاز به بررسی',
    error: 'خطا در سیستم',
    healthy: 'سالم',
    degraded: 'عملکرد کاهش یافته',
    operational: 'عملیاتی',
    // Additional statuses used by some pages
    archived: 'بایگانی شده',
    pending_review: 'در انتظار بررسی',
    under_revision: 'در حال ویرایش',
  },

  // === PRIORITY ===
  priority: {
    high: 'بالا',
    medium: 'متوسط',
    low: 'پایین',
  },
  
  // === TIME & DURATION ===
  time: {
    seconds: 'ثانیه', // Fixed from "کالپه" 
    minutes: 'دقیقه',
    hours: 'ساعت',
    days: 'روز',
    weeks: 'هفته',
    months: 'ماه',
    years: 'سال',
    
    // Time formatting
    fiveSeconds: '۵ ثانیه', // Fixed from "کالپه"
    tenSeconds: '۱۰ ثانیه',
    thirtySeconds: '۳۰ ثانیه',
    oneMinute: '۱ دقیقه',
    fiveMinutes: '۵ دقیقه',
    
    // Relative time
    now: 'اکنون',
    minutesAgo: 'دقیقه پیش',
    hoursAgo: 'ساعت پیش',
    daysAgo: 'روز پیش',
    today: 'امروز',
    yesterday: 'دیروز',
    thisWeek: 'این هفته',
    lastWeek: 'هفته گذشته',
  },
  
  // === ACTIONS & OPERATIONS ===
  actions: {
    create: 'ایجاد',
    edit: 'ویرایش',
    delete: 'حذف',
    save: 'ذخیره',
    cancel: 'انصراف',
    submit: 'ارسال',
    search: 'جستجو',
    filter: 'فیلتر',
    sort: 'مرتب‌سازی',
    export: 'خروجی',
    import: 'ورودی',
    upload: 'بارگذاری',
    download: 'دانلود',
    view: 'مشاهده',
    preview: 'پیش‌نمایش',
    print: 'چاپ',
    share: 'اشتراک‌گذاری',
    copy: 'کپی',
    paste: 'چسباندن',
    refresh: 'تازه‌سازی',
    reload: 'بارگذاری مجدد',
    start: 'شروع',
    stop: 'توقف',
    pause: 'مکث',
    resume: 'ادامه',
    restart: 'راه‌اندازی مجدد',
    
    // Emergency actions
    emergencyStop: 'توقف اضطراری',
    forceStop: 'توقف اجباری',
  },
  
  // === METRICS & MEASUREMENTS ===
  metrics: {
    total: 'کل',
    count: 'تعداد',
    amount: 'مقدار',
    percentage: 'درصد',
    ratio: 'نسبت',
    average: 'میانگین',
    maximum: 'حداکثر',
    minimum: 'حداقل',
    
    // Resource metrics
    cpu: 'پردازنده مرکزی',
    memory: 'حافظه سیستم',
    storage: 'فضای ذخیره‌سازی',
    network: 'شبکه',
    bandwidth: 'پهنای باند',
    
    // Performance metrics
    responseTime: 'زمان پاسخ',
    throughput: 'نرخ پردازش',
    uptime: 'زمان فعالیت',
    downtime: 'زمان عدم دسترسی',
    availability: 'در دسترس بودن',
    
    // Document metrics
    wordCount: 'تعداد کلمات',
    pageCount: 'تعداد صفحات',
    documentSize: 'حجم سند',
    createdDate: 'تاریخ ایجاد',
    modifiedDate: 'تاریخ تغییر',
    accessCount: 'تعداد دسترسی',
  },
  
  // === ERROR MESSAGES ===
  errors: {
    general: 'خطای عمومی سیستم',
    network: 'خطا در اتصال شبکه',
    server: 'خطا در سرور',
    database: 'خطا در پایگاه داده',
    authentication: 'خطا در احراز هویت',
    authorization: 'عدم دسترسی',
    validation: 'خطا در اعتبارسنجی',
    fileNotFound: 'فایل یافت نشد',
    fileCorrupted: 'فایل آسیب دیده',
    connectionTimeout: 'زمان اتصال به پایان رسید',
    serviceUnavailable: 'سرویس در دسترس نیست',
  },
  
  // === SUCCESS MESSAGES ===
  success: {
    saved: 'با موفقیت ذخیره شد',
    deleted: 'با موفقیت حذف شد',
    updated: 'با موفقیت به‌روزرسانی شد',
    uploaded: 'با موفقیت بارگذاری شد',
    processed: 'با موفقیت پردازش شد',
    completed: 'با موفقیت تکمیل شد',
    sent: 'با موفقیت ارسال شد',
    imported: 'با موفقیت وارد شد',
    exported: 'با موفقیت خروجی گرفته شد',
  },
  
  // === CONFIRMATION MESSAGES ===
  confirmations: {
    delete: 'آیا از حذف این مورد اطمینان دارید؟',
    save: 'آیا تغییرات ذخیره شود؟',
    cancel: 'آیا از انصراف اطمینان دارید؟',
    exit: 'آیا از خروج اطمینان دارید؟',
    overwrite: 'آیا فایل موجود جایگزین شود؟',
    restart: 'آیا سیستم راه‌اندازی مجدد شود؟',
    emergencyStop: 'آیا از توقف اضطراری تمام فرایندها اطمینان دارید؟',
  },
  
  // === FORM LABELS ===
  forms: {
    title: 'عنوان',
    description: 'توضیحات',
    category: 'دسته‌بندی',
    tags: 'برچسب‌ها',
    author: 'نویسنده',
    source: 'منبع',
    url: 'آدرس وب',
    date: 'تاریخ',
    status: 'وضعیت',
    priority: 'اولویت',
    type: 'نوع',
    format: 'قالب',
    language: 'زبان',
    version: 'نسخه',
    
    // Validation messages
    required: 'این فیلد اجباری است',
    invalid: 'مقدار وارد شده نامعتبر است',
    tooShort: 'مقدار وارد شده کوتاه است',
    tooLong: 'مقدار وارد شده طولانی است',
    invalidEmail: 'آدرس ایمیل نامعتبر است',
    invalidUrl: 'آدرس وب نامعتبر است',
    invalidDate: 'تاریخ نامعتبر است',
  },
  
  // === BUTTONS & UI ELEMENTS ===
  ui: {
    yes: 'بله',
    no: 'خیر',
    ok: 'تأیید',
    apply: 'اعمال',
    reset: 'بازنشانی',
    clear: 'پاک کردن',
    close: 'بستن',
    back: 'بازگشت',
    next: 'بعدی',
    previous: 'قبلی',
    first: 'اولین',
    last: 'آخرین',
    more: 'بیشتر',
    less: 'کمتر',
    showAll: 'نمایش همه',
    hideAll: 'مخفی کردن همه',
    selectAll: 'انتخاب همه',
    deselectAll: 'لغو انتخاب همه',
    
    // Loading states
    loading: 'در حال بارگذاری...',
    processing: 'در حال پردازش...',
    saving: 'در حال ذخیره...',
    uploading: 'در حال بارگذاری...',
    downloading: 'در حال دانلود...',
    searching: 'در حال جستجو...',
    
    // Empty states
    noData: 'داده‌ای یافت نشد',
    noResults: 'نتیجه‌ای یافت نشد',
    noDocuments: 'سندی یافت نشد',
    emptyList: 'فهرست خالی است',
    
    // Pagination
    page: 'صفحه',
    of: 'از',
    itemsPerPage: 'آیتم در هر صفحه',
    showing: 'نمایش',
    to: 'تا',
    results: 'نتیجه',
  },
  
  // === SYSTEM COMPONENTS ===
  components: {
    navbar: 'نوار ناوبری',
    sidebar: 'نوار کناری',
    footer: 'پاورقی',
    header: 'سربرگ',
    menu: 'منو',
    dropdown: 'فهرست کشویی',
    modal: 'پنجره موردی',
    dialog: 'دیالوگ',
    notification: 'اعلان',
    alert: 'هشدار',
    tooltip: 'راهنما',
    breadcrumb: 'مسیر ناوبری',
    tab: 'زبانه',
    panel: 'پانل',
    card: 'کارت',
    widget: 'ابزارک',
    chart: 'نمودار',
    graph: 'گراف',
    table: 'جدول',
    list: 'فهرست',
    grid: 'شبکه',
  },
} as const;

/**
 * Utility functions for working with terminology
 */
export class TerminologyHelper {
  /**
   * Get a term by nested key path
   * @param path - Dot-separated path to the term (e.g., 'legalCategories.civilLaw')
   * @returns The term or the path if not found
   */
  static getTerm(path: string): string {
    const keys = path.split('.');
    let current: any = LEGAL_TERMINOLOGY;
    
    for (const key of keys) {
      if (current[key] !== undefined) {
        current = current[key];
      } else {
        console.warn(`Terminology not found for path: ${path}`);
        return path; // Return path as fallback
      }
    }
    
    return current;
  }
  
  /**
   * Format time duration in Persian
   * @param seconds - Duration in seconds
   * @returns Formatted Persian time string
   */
  static formatDuration(seconds: number): string {
    if (seconds < 60) {
      return `${seconds} ${LEGAL_TERMINOLOGY.time.seconds}`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} ${LEGAL_TERMINOLOGY.time.minutes}`;
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `${hours} ${LEGAL_TERMINOLOGY.time.hours}`;
    } else {
      const days = Math.floor(seconds / 86400);
      return `${days} ${LEGAL_TERMINOLOGY.time.days}`;
    }
  }
  
  /**
   * Format relative time in Persian
   * @param date - Date to compare with current time
   * @returns Formatted Persian relative time string
   */
  static formatRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes} ${LEGAL_TERMINOLOGY.time.minutesAgo}`;
    } else if (hours < 24) {
      return `${hours} ${LEGAL_TERMINOLOGY.time.hoursAgo}`;
    } else {
      return `${days} ${LEGAL_TERMINOLOGY.time.daysAgo}`;
    }
  }
  
  /**
   * Get status badge configuration
   * @param status - Status key
   * @returns Object with text and variant for status badge
   */
  static getStatusBadge(status: keyof typeof LEGAL_TERMINOLOGY.status) {
    const statusText = LEGAL_TERMINOLOGY.status[status];
    
    const variants = {
      active: 'success',
      running: 'success',
      operational: 'success',
      healthy: 'success',
      completed: 'success',
      
      warning: 'warning',
      degraded: 'warning',
      pending: 'warning',
      
      error: 'error',
      failed: 'error',
      stopped: 'error',
      
      inactive: 'neutral',
      processing: 'info',
    } as const;
    
    return {
      text: statusText,
      variant: variants[status] || 'neutral'
    };
  }
}

// Export as default for easier imports
export default LEGAL_TERMINOLOGY;