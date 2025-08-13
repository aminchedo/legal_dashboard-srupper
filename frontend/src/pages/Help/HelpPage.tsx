import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, FileText, MessageCircle, Phone, Mail, Search, 
  Star, ExternalLink, Download, Play, ChevronRight, 
  HelpCircle, Code, Settings, Monitor, Users, Database,
  Lightbulb, Zap, Shield, AlertCircle, CheckCircle,
  Clock, Bookmark, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { AnimatedCard, AnimatedButton, AnimatedList } from '../../components/ui/animations';
import { cn } from '../../lib/utils';
import { AnimatePresence } from 'framer-motion';

interface HelpSectionProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

const HelpSection: React.FC<HelpSectionProps> = ({ title, description, icon: Icon, children }) => (
  <AnimatedCard className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
    <div className="flex items-start space-x-4 space-x-reverse mb-6">
      <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
    {children}
  </AnimatedCard>
);

const ArticleCard: React.FC<{
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  rating: number;
  views: number;
  onClick: () => void;
}> = ({ title, excerpt, category, readTime, rating, views, onClick }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 cursor-pointer transition-shadow hover:shadow-md"
    onClick={onClick}
  >
    <div className="flex items-start justify-between mb-3">
      <span className="text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded">
        {category}
      </span>
      <div className="flex items-center space-x-1 space-x-reverse text-xs text-gray-500">
        <Clock className="w-3 h-3" />
        <span>{readTime}</span>
      </div>
    </div>
    <h4 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">{title}</h4>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{excerpt}</p>
    <div className="flex items-center justify-between text-xs text-gray-500">
      <div className="flex items-center space-x-2 space-x-reverse">
        <div className="flex items-center space-x-1 space-x-reverse">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span>{rating}</span>
        </div>
        <span>•</span>
        <span>{views} بازدید</span>
      </div>
      <ChevronRight className="w-4 h-4" />
    </div>
  </motion.div>
);

const FAQItem: React.FC<{
  question: string;
  answer: string;
  helpful: number;
  category: string;
}> = ({ question, answer, helpful, category }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-right flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="font-medium text-gray-900 dark:text-white">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <div className="flex items-center space-x-2 space-x-reverse mb-2">
                <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded">
                  {category}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{answer}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <span className="text-sm text-gray-500">آیا این پاسخ مفید بود؟</span>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button
                      onClick={() => setUserVote(userVote === 'up' ? null : 'up')}
                      className={cn(
                        "flex items-center space-x-1 space-x-reverse px-2 py-1 rounded text-sm transition-colors",
                        userVote === 'up' 
                          ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                          : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                      )}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{helpful + (userVote === 'up' ? 1 : 0)}</span>
                    </button>
                    <button
                      onClick={() => setUserVote(userVote === 'down' ? null : 'down')}
                      className={cn(
                        "p-1 rounded transition-colors",
                        userVote === 'down'
                          ? "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                          : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                      )}
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState('guide');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'guide', label: 'راهنمای کاربری', icon: BookOpen },
    { id: 'api', label: 'مستندات API', icon: Code },
    { id: 'faq', label: 'سوالات متداول', icon: HelpCircle },
    { id: 'support', label: 'پشتیبانی', icon: MessageCircle }
  ];

  const userGuideArticles = [
    {
      title: 'شروع کار با سیستم مدیریت حقوقی',
      excerpt: 'راهنمای گام به گام برای شروع کار با سیستم و آشنایی با امکانات اصلی',
      category: 'شروع کار',
      readTime: '۵ دقیقه',
      rating: 4.8,
      views: 1250
    },
    {
      title: 'مدیریت پروژه‌های اسکرپینگ',
      excerpt: 'نحوه ایجاد، پیکربندی و مدیریت پروژه‌های جمع‌آوری اطلاعات',
      category: 'اسکرپینگ',
      readTime: '۸ دقیقه',
      rating: 4.9,
      views: 890
    },
    {
      title: 'تنظیم و مدیریت پروکسی‌ها',
      excerpt: 'راهنمای کامل تنظیم پروکسی‌ها و بهینه‌سازی عملکرد',
      category: 'پروکسی',
      readTime: '۶ دقیقه',
      rating: 4.7,
      views: 670
    },
    {
      title: 'تحلیل و گزارش‌گیری از داده‌ها',
      excerpt: 'استفاده از ابزارهای تحلیل و تولید گزارش‌های مفصل',
      category: 'تحلیل',
      readTime: '۱۰ دقیقه',
      rating: 4.6,
      views: 1120
    },
    {
      title: 'تنظیمات امنیت و کنترل دسترسی',
      excerpt: 'پیکربندی تنظیمات امنیت و مدیریت کاربران',
      category: 'امنیت',
      readTime: '۷ دقیقه',
      rating: 4.8,
      views: 540
    },
    {
      title: 'عیب‌یابی مشکلات رایج',
      excerpt: 'راه‌حل مشکلات رایج و نکات مهم برای بهینه‌سازی',
      category: 'عیب‌یابی',
      readTime: '۱۲ دقیقه',
      rating: 4.5,
      views: 980
    }
  ];

  const faqData = [
    {
      question: 'چگونه پروژه اسکرپینگ جدید ایجاد کنم؟',
      answer: 'برای ایجاد پروژه جدید، به بخش "پروژه‌ها" بروید و روی دکمه "پروژه جدید" کلیک کنید. سپس اطلاعات مورد نیاز شامل نام پروژه، URL هدف، و تنظیمات اسکرپینگ را وارد کنید.',
      helpful: 24,
      category: 'اسکرپینگ'
    },
    {
      question: 'آیا می‌توانم از چندین پروکسی همزمان استفاده کنم؟',
      answer: 'بله، سیستم از استفاده همزمان از چندین پروکسی پشتیبانی می‌کند. می‌توانید در تنظیمات پروکسی، چندین پروکسی اضافه کرده و سیستم به صورت خودکار بین آن‌ها تناوب ایجاد می‌کند.',
      helpful: 18,
      category: 'پروکسی'
    },
    {
      question: 'چگونه از داده‌های جمع‌آوری شده پشتیبان‌گیری کنم؟',
      answer: 'در بخش تنظیمات، گزینه "پشتیبان‌گیری" را انتخاب کنید. می‌توانید پشتیبان‌گیری خودکار یا دستی را فعال کنید. فایل‌های پشتیبان در فرمت JSON قابل دانلود هستند.',
      helpful: 31,
      category: 'مدیریت داده'
    },
    {
      question: 'چرا سرعت اسکرپینگ کند است؟',
      answer: 'سرعت کند می‌تواند دلایل مختلفی داشته باشد: 1) تنظیمات تاخیر بین درخواست‌ها 2) کیفیت پروکسی 3) محدودیت‌های سایت هدف. در تنظیمات پیشرفته می‌توانید این موارد را بهینه‌سازی کنید.',
      helpful: 15,
      category: 'عیب‌یابی'
    },
    {
      question: 'آیا امکان صادرات داده‌ها به فرمت‌های مختلف وجود دارد؟',
      answer: 'بله، سیستم از صادرات به فرمت‌های مختلف شامل JSON، CSV، Excel و PDF پشتیبانی می‌کند. این امکان در بخش "اسناد" در دسترس است.',
      helpful: 22,
      category: 'صادرات'
    }
  ];

  const apiEndpoints = [
    {
      method: 'GET',
      endpoint: '/api/jobs',
      description: 'دریافت لیست پروژه‌های اسکرپینگ',
      parameters: 'page, limit, status'
    },
    {
      method: 'POST',
      endpoint: '/api/jobs',
      description: 'ایجاد پروژه اسکرپینگ جدید',
      parameters: 'name, url, settings'
    },
    {
      method: 'GET',
      endpoint: '/api/documents',
      description: 'دریافت اسناد جمع‌آوری شده',
      parameters: 'page, limit, category, date'
    },
    {
      method: 'PUT',
      endpoint: '/api/jobs/{id}',
      description: 'به‌روزرسانی تنظیمات پروژه',
      parameters: 'id, settings'
    },
    {
      method: 'DELETE',
      endpoint: '/api/jobs/{id}',
      description: 'حذف پروژه اسکرپینگ',
      parameters: 'id'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-6 space-y-6"
      dir="rtl"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">مرکز کمک و پشتیبانی</h1>
        <p className="text-blue-100">راهنماها، مستندات و پاسخ به سوالات شما</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="جستجو در مستندات..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-4 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg text-right transition-all duration-200",
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-4 border-blue-600"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Links */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">لینک‌های مفید</h4>
            <div className="space-y-2">
              <a href="#" className="flex items-center space-x-2 space-x-reverse text-sm text-blue-600 hover:text-blue-700">
                <Download className="w-4 h-4" />
                <span>دانلود راهنمای کامل</span>
              </a>
              <a href="#" className="flex items-center space-x-2 space-x-reverse text-sm text-blue-600 hover:text-blue-700">
                <Play className="w-4 h-4" />
                <span>ویدیوهای آموزشی</span>
              </a>
              <a href="#" className="flex items-center space-x-2 space-x-reverse text-sm text-blue-600 hover:text-blue-700">
                <ExternalLink className="w-4 h-4" />
                <span>انجمن کاربران</span>
              </a>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* User Guide Tab */}
          {activeTab === 'guide' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <HelpSection
                title="راهنمای کاربری"
                description="آموزش‌ها و راهنماهای گام به گام"
                icon={BookOpen}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userGuideArticles.map((article, index) => (
                    <ArticleCard
                      key={index}
                      {...article}
                      onClick={() => console.log('Open article:', article.title)}
                    />
                  ))}
                </div>
              </HelpSection>

              {/* Video Tutorials */}
              <HelpSection
                title="ویدیوهای آموزشی"
                description="آموزش‌های تصویری برای یادگیری بهتر"
                icon={Play}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { title: 'معرفی کلی سیستم', duration: '5:30' },
                    { title: 'ایجاد پروژه اسکرپینگ', duration: '8:45' },
                    { title: 'تنظیم پروکسی‌ها', duration: '6:15' },
                    { title: 'تحلیل داده‌ها', duration: '12:20' }
                  ].map((video, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div className="aspect-video bg-gray-200 dark:bg-gray-600 rounded-lg mb-3 flex items-center justify-center">
                        <Play className="w-8 h-8 text-gray-400" />
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">{video.title}</h4>
                      <p className="text-sm text-gray-500">{video.duration}</p>
                    </div>
                  ))}
                </div>
              </HelpSection>
            </motion.div>
          )}

          {/* API Documentation Tab */}
          {activeTab === 'api' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <HelpSection
                title="مستندات API"
                description="راهنمای کامل استفاده از API"
                icon={Code}
              >
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Base URL</h4>
                    <code className="text-sm bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                      https://api.legal-dashboard.ir/v1
                    </code>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">احراز هویت</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      برای استفاده از API، باید token احراز هویت را در header درخواست ارسال کنید:
                    </p>
                    <code className="text-sm bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded block">
                      Authorization: Bearer YOUR_API_TOKEN
                    </code>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Endpoints</h4>
                    <div className="space-y-3">
                      {apiEndpoints.map((endpoint, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                          <div className="flex items-center space-x-3 space-x-reverse mb-2">
                            <span className={cn(
                              "px-2 py-1 text-xs font-medium rounded",
                              endpoint.method === 'GET' && "bg-green-100 text-green-700",
                              endpoint.method === 'POST' && "bg-blue-100 text-blue-700",
                              endpoint.method === 'PUT' && "bg-yellow-100 text-yellow-700",
                              endpoint.method === 'DELETE' && "bg-red-100 text-red-700"
                            )}>
                              {endpoint.method}
                            </span>
                            <code className="text-sm font-mono">{endpoint.endpoint}</code>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{endpoint.description}</p>
                          <p className="text-xs text-gray-500">
                            <strong>Parameters:</strong> {endpoint.parameters}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 space-x-reverse mb-2">
                      <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">نمونه کد</h4>
                    </div>
                    <pre className="text-sm bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto">
{`curl -X GET "https://api.legal-dashboard.ir/v1/jobs" \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json"`}
                    </pre>
                  </div>
                </div>
              </HelpSection>
            </motion.div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <HelpSection
                title="سوالات متداول"
                description="پاسخ سوالات رایج کاربران"
                icon={HelpCircle}
              >
                <div className="space-y-4">
                  {faqData.map((faq, index) => (
                    <FAQItem key={index} {...faq} />
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center space-x-2 space-x-reverse mb-2">
                    <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">سوال شما پاسخ داده نشد؟</h4>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                    سوال خود را از طریق فرم پشتیبانی ارسال کنید تا در اسرع وقت پاسخ دهیم.
                  </p>
                  <AnimatedButton
                    variant="primary"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    ارسال سوال جدید
                  </AnimatedButton>
                </div>
              </HelpSection>
            </motion.div>
          )}

          {/* Support Tab */}
          {activeTab === 'support' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <HelpSection
                title="تماس با پشتیبانی"
                description="راه‌های ارتباط با تیم پشتیبانی"
                icon={MessageCircle}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 space-x-reverse p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                        <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-green-900 dark:text-green-100">ایمیل پشتیبانی</h4>
                        <p className="text-sm text-green-700 dark:text-green-300">support@legal-dashboard.ir</p>
                        <p className="text-xs text-green-600 dark:text-green-400">پاسخ در کمتر از ۲۴ ساعت</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 space-x-reverse p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                        <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-100">تلفن پشتیبانی</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">۰۲۱-۸۸۹۹۰۰۱۱</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">شنبه تا چهارشنبه ۹-۱۷</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 space-x-reverse p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                        <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-purple-900 dark:text-purple-100">چت آنلاین</h4>
                        <p className="text-sm text-purple-700 dark:text-purple-300">پاسخ فوری به سوالات</p>
                        <p className="text-xs text-purple-600 dark:text-purple-400">در حال حاضر آفلاین</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">ارسال تیکت پشتیبانی</h4>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          موضوع
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                          <option>مشکل فنی</option>
                          <option>درخواست ویژگی جدید</option>
                          <option>سوال کلی</option>
                          <option>مشکل حساب کاربری</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          عنوان
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="عنوان مشکل یا سوال"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          توضیحات
                        </label>
                        <textarea
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="توضیح کاملی از مشکل یا سوال خود ارائه دهید..."
                        />
                      </div>
                      <AnimatedButton
                        variant="primary"
                        className="w-full"
                      >
                        ارسال تیکت
                      </AnimatedButton>
                    </form>
                  </div>
                </div>
              </HelpSection>

              {/* System Status */}
              <HelpSection
                title="وضعیت سیستم"
                description="وضعیت فعلی سرویس‌ها و خدمات"
                icon={Monitor}
              >
                <div className="space-y-3">
                  {[
                    { name: 'API Gateway', status: 'operational', uptime: '99.9%' },
                    { name: 'پایگاه داده', status: 'operational', uptime: '99.8%' },
                    { name: 'سیستم اسکرپینگ', status: 'operational', uptime: '99.7%' },
                    { name: 'سیستم پروکسی', status: 'degraded', uptime: '98.5%' },
                    { name: 'سیستم احراز هویت', status: 'operational', uptime: '99.9%' }
                  ].map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          service.status === 'operational' && "bg-green-500",
                          service.status === 'degraded' && "bg-yellow-500",
                          service.status === 'down' && "bg-red-500"
                        )} />
                        <span className="font-medium text-gray-900 dark:text-white">{service.name}</span>
                      </div>
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <span className="text-sm text-gray-500">{service.uptime}</span>
                        <span className={cn(
                          "text-xs px-2 py-1 rounded",
                          service.status === 'operational' && "bg-green-100 text-green-700",
                          service.status === 'degraded' && "bg-yellow-100 text-yellow-700",
                          service.status === 'down' && "bg-red-100 text-red-700"
                        )}>
                          {service.status === 'operational' && 'عملیاتی'}
                          {service.status === 'degraded' && 'کندی'}
                          {service.status === 'down' && 'خارج از سرویس'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </HelpSection>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}


