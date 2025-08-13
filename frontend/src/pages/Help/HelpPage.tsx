import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Phone, 
  Mail, 
  Search,
  ChevronDown,
  ChevronRight,
  FileText,
  Video,
  Download,
  Users,
  Settings,
  BarChart3,
  Shield,
  Zap,
  Globe,
  Calendar,
  Clock
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { cn } from '../../lib/utils';
import LEGAL_TERMINOLOGY from '../../lib/terminology';

// FAQ Data
const faqData = [
  {
    id: 1,
    question: 'چگونه سند جدیدی به سیستم اضافه کنم؟',
    answer: 'برای افزودن سند جدید، به بخش "مدیریت اسناد" بروید و روی دکمه "بارگذاری سند" کلیک کنید. فایل مورد نظر را انتخاب کرده و اطلاعات مربوطه را تکمیل نمایید.',
    category: 'اسناد'
  },
  {
    id: 2,
    question: 'چگونه گزارش از سیستم بگیرم؟',
    answer: 'در بخش "تحلیل و گزارش‌سازی" می‌توانید انواع گزارش‌های مختلف را مشاهده و دانلود کنید. همچنین امکان تولید گزارش‌های سفارشی نیز فراهم است.',
    category: 'گزارش‌گیری'
  },
  {
    id: 3,
    question: 'وضعیت استخراج اطلاعات را چگونه بررسی کنم؟',
    answer: 'در داشبورد اصلی بخش "وضعیت سیستم" و همچنین صفحه "مدیریت پروژه‌ها" اطلاعات کاملی از وضعیت فرآیندهای استخراج ارائه می‌دهد.',
    category: 'استخراج'
  },
  {
    id: 4,
    question: 'چگونه تنظیمات سیستم را تغییر دهم؟',
    answer: 'از منوی جانبی وارد بخش "تنظیمات عمومی" شوید. در آنجا می‌توانید تنظیمات کاربری، سیستمی و امنیتی را مدیریت کنید.',
    category: 'تنظیمات'
  },
  {
    id: 5,
    question: 'امکان پشتیبان‌گیری از اطلاعات وجود دارد؟',
    answer: 'بله، سیستم به صورت خودکار از تمام اطلاعات پشتیبان‌گیری می‌کند. همچنین امکان دانلود فایل‌های پشتیبان دستی نیز فراهم است.',
    category: 'پشتیبانی'
  }
];

// Quick Links Data
const quickLinks = [
  {
    title: 'راهنمای شروع سریع',
    description: 'نحوه استفاده از ویژگی‌های اصلی سیستم',
    icon: Zap,
    color: 'blue'
  },
  {
    title: 'مدیریت اسناد',
    description: 'آموزش کامل بارگذاری و مدیریت اسناد',
    icon: FileText,
    color: 'green'
  },
  {
    title: 'تحلیل و گزارش‌گیری',
    description: 'نحوه تهیه گزارش‌های مختلف',
    icon: BarChart3,
    color: 'purple'
  },
  {
    title: 'تنظیمات امنیتی',
    description: 'راهنمای تنظیمات امنیت و دسترسی',
    icon: Shield,
    color: 'orange'
  }
];

// Support Contact Data
const supportContacts = [
  {
    type: 'تلفن پشتیبانی',
    value: '۰۲۱-۱۲۳۴۵۶۷۸',
    icon: Phone,
    available: '۲۴ ساعته'
  },
  {
    type: 'ایمیل پشتیبانی',
    value: 'support@legalsystem.ir',
    icon: Mail,
    available: 'پاسخ تا ۲۴ ساعت'
  },
  {
    type: 'چت آنلاین',
    value: 'در دسترس',
    icon: MessageCircle,
    available: '۸ صبح تا ۸ شب'
  }
];

interface FAQItemProps {
  faq: typeof faqData[0];
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ faq, isOpen, onToggle }) => {
  return (
    <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 text-right bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors flex items-center justify-between"
      >
        <span className="font-medium text-neutral-900 dark:text-white">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="h-5 w-5 text-neutral-500" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-700">
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {faq.answer}
          </p>
          <span className="inline-block mt-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full">
            {faq.category}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

interface QuickLinkProps {
  link: typeof quickLinks[0];
}

const QuickLink: React.FC<QuickLinkProps> = ({ link }) => {
  const colorVariants = {
    blue: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    green: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    purple: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
    orange: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        'p-4 rounded-xl border transition-all duration-200 cursor-pointer',
        colorVariants[link.color as keyof typeof colorVariants]
      )}
    >
      <div className="flex items-start gap-3">
        <link.icon className="h-6 w-6 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-semibold mb-1">{link.title}</h3>
          <p className="text-sm opacity-80">{link.description}</p>
        </div>
      </div>
    </motion.div>
  );
};

const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('همه');

  const categories = ['همه', ...Array.from(new Set(faqData.map(faq => faq.category)))];

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'همه' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
          مرکز راهنما و پشتیبانی
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          راهنمای جامع استفاده از سیستم، پاسخ به سوالات متداول و اطلاعات تماس پشتیبانی
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="جستجو در راهنما..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            دسترسی سریع به راهنماها
          </CardTitle>
          <CardDescription>
            راهنماهای مهم برای شروع کار با سیستم
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickLinks.map((link, index) => (
              <QuickLink key={index} link={link} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            سوالات متداول
          </CardTitle>
          <CardDescription>
            پاسخ به رایج‌ترین سوالات کاربران
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                    selectedCategory === category
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-3">
            {filteredFAQs.map((faq) => (
              <FAQItem
                key={faq.id}
                faq={faq}
                isOpen={openFAQ === faq.id}
                onToggle={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
              />
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-8">
              <HelpCircle className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                سوالی یافت نشد
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                لطفاً عبارت جستجو را تغییر دهید یا با پشتیبانی تماس بگیرید
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Support Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            تماس با پشتیبانی
          </CardTitle>
          <CardDescription>
            راه‌های ارتباط با تیم پشتیبانی فنی
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {supportContacts.map((contact, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <contact.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      {contact.type}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {contact.available}
                    </p>
                  </div>
                </div>
                <p className="font-medium text-neutral-900 dark:text-white">
                  {contact.value}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
                  ساعات کاری پشتیبانی
                </h4>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  شنبه تا چهارشنبه: ۸:۰۰ تا ۱۸:۰۰ | پنج‌شنبه: ۸:۰۰ تا ۱۴:۰۰
                </p>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  پشتیبانی اضطراری: ۲۴ ساعته در دسترس
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            اطلاعات سیستم
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">
                مشخصات نسخه
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">نسخه سیستم:</span>
                  <span className="font-medium">۲.۱.۴</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">تاریخ بروزرسانی:</span>
                  <span className="font-medium">۱۴۰۳/۱۰/۱۵</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">وضعیت:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">فعال</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">
                منابع مفید
              </h3>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  دانلود راهنمای کاربری (PDF)
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  ویدیوهای آموزشی
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Globe className="h-4 w-4 mr-2" />
                  وب‌سایت رسمی
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPage;


