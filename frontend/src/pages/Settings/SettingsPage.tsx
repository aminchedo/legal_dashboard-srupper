import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User,
  Shield,
  Bell,
  Monitor,
  Database,
  Mail,
  Smartphone,
  Globe,
  Palette,
  Lock,
  Key,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Upload,
  Download,
  Trash2,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Select,
  StatusBadge
} from '../../components/ui';
import { LEGAL_TERMINOLOGY } from '../../lib/terminology';
import { cn } from '../../lib/utils';

// Validation schemas
const generalSettingsSchema = z.object({
  organizationName: z.string().min(2, 'نام سازمان باید حداقل ۲ کاراکتر باشد'),
  organizationEmail: z.string().email('ایمیل معتبر وارد کنید'),
  organizationPhone: z.string().min(10, 'شماره تلفن معتبر وارد کنید'),
  organizationAddress: z.string().min(10, 'آدرس باید حداقل ۱۰ کاراکتر باشد'),
  language: z.enum(['fa', 'en']),
  timezone: z.string(),
  dateFormat: z.enum(['shamsi', 'miladi']),
  currency: z.string()
});

const securitySettingsSchema = z.object({
  twoFactorEnabled: z.boolean(),
  sessionTimeout: z.number().min(5).max(480), // 5 minutes to 8 hours
  passwordPolicy: z.enum(['basic', 'medium', 'strict']),
  allowedIpAddresses: z.string().optional(),
  encryptionLevel: z.enum(['standard', 'enhanced'])
});

const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  documentUpdates: z.boolean(),
  systemAlerts: z.boolean(),
  weeklyReports: z.boolean(),
  notificationEmail: z.string().email('ایمیل معتبر وارد کنید').optional(),
  notificationPhone: z.string().optional()
});

const systemSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  autoBackup: z.boolean(),
  backupFrequency: z.enum(['daily', 'weekly', 'monthly']),
  dataRetention: z.number().min(30).max(3650), // 30 days to 10 years
  maxFileSize: z.number().min(1).max(100), // 1MB to 100MB
  allowedFileTypes: z.string(),
  maintenanceMode: z.boolean()
});

type GeneralSettings = z.infer<typeof generalSettingsSchema>;
type SecuritySettings = z.infer<typeof securitySettingsSchema>;
type NotificationSettings = z.infer<typeof notificationSettingsSchema>;
type SystemSettings = z.infer<typeof systemSettingsSchema>;

// Mock current settings
const mockSettings = {
  general: {
    organizationName: 'دفتر حقوقی آریا',
    organizationEmail: 'info@ariya-legal.ir',
    organizationPhone: '۰۲۱-۸۸۷۷۶۶۵۵',
    organizationAddress: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
    language: 'fa' as const,
    timezone: 'Asia/Tehran',
    dateFormat: 'shamsi' as const,
    currency: 'IRR'
  },
  security: {
    twoFactorEnabled: true,
    sessionTimeout: 60,
    passwordPolicy: 'medium' as const,
    allowedIpAddresses: '',
    encryptionLevel: 'enhanced' as const
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    documentUpdates: true,
    systemAlerts: true,
    weeklyReports: true,
    notificationEmail: 'notifications@ariya-legal.ir',
    notificationPhone: ''
  },
  system: {
    theme: 'auto' as const,
    autoBackup: true,
    backupFrequency: 'daily' as const,
    dataRetention: 365,
    maxFileSize: 10,
    allowedFileTypes: '.pdf,.doc,.docx,.txt,.jpg,.png',
    maintenanceMode: false
  }
};

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'system'>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Form hooks for each settings section
  const generalForm = useForm<GeneralSettings>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: mockSettings.general
  });

  const securityForm = useForm<SecuritySettings>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: mockSettings.security
  });

  const notificationForm = useForm<NotificationSettings>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: mockSettings.notifications
  });

  const systemForm = useForm<SystemSettings>({
    resolver: zodResolver(systemSettingsSchema),
    defaultValues: mockSettings.system
  });

  const handleSaveSettings = async (section: string, data: any) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`Saving ${section} settings:`, data);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    {
      id: 'general',
      label: 'عمومی',
      icon: SettingsIcon,
      description: 'تنظیمات کلی سازمان'
    },
    {
      id: 'security',
      label: 'امنیت',
      icon: Shield,
      description: 'تنظیمات امنیتی و دسترسی'
    },
    {
      id: 'notifications',
      label: 'اطلاع‌رسانی',
      icon: Bell,
      description: 'تنظیمات اعلانات و هشدارها'
    },
    {
      id: 'system',
      label: 'سیستم',
      icon: Monitor,
      description: 'تنظیمات سیستم و بک‌آپ'
    }
  ];

  const ToggleSwitch: React.FC<{
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    description?: string;
    disabled?: boolean;
  }> = ({ checked, onChange, label, description, disabled = false }) => {
    return (
      <div className="flex items-center justify-between py-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {label}
            </span>
          </div>
          {description && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {description}
            </p>
          )}
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
            checked ? 'bg-primary-600' : 'bg-neutral-200 dark:bg-neutral-700',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
              checked ? 'translate-x-6 rtl:translate-x-[-24px]' : 'translate-x-1 rtl:translate-x-[-4px]'
            )}
          />
        </button>
      </div>
    );
  };

  const renderGeneralSettings = () => (
    <form onSubmit={generalForm.handleSubmit((data) => handleSaveSettings('general', data))} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="نام سازمان"
          {...generalForm.register('organizationName')}
          error={generalForm.formState.errors.organizationName?.message}
          placeholder="نام سازمان خود را وارد کنید"
        />
        
        <Input
          label="ایمیل سازمان"
          type="email"
          {...generalForm.register('organizationEmail')}
          error={generalForm.formState.errors.organizationEmail?.message}
          placeholder="email@domain.com"
        />
        
        <Input
          label="شماره تلفن"
          {...generalForm.register('organizationPhone')}
          error={generalForm.formState.errors.organizationPhone?.message}
          placeholder="۰۲۱-۱۲۳۴۵۶۷۸"
        />
        
        <Select
          label="زبان سیستم"
          options={[
            { value: 'fa', label: 'فارسی' },
            { value: 'en', label: 'English' }
          ]}
          value={generalForm.watch('language')}
          onChange={(value) => generalForm.setValue('language', value as 'fa' | 'en')}
        />
      </div>
      
      <Input
        label="آدرس سازمان"
        {...generalForm.register('organizationAddress')}
        error={generalForm.formState.errors.organizationAddress?.message}
        placeholder="آدرس کامل سازمان"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Select
          label="منطقه زمانی"
          options={[
            { value: 'Asia/Tehran', label: 'تهران (UTC+3:30)' },
            { value: 'Asia/Dubai', label: 'دبی (UTC+4)' },
            { value: 'Europe/London', label: 'لندن (UTC+0)' }
          ]}
          value={generalForm.watch('timezone')}
          onChange={(value) => generalForm.setValue('timezone', value)}
        />
        
        <Select
          label="فرمت تاریخ"
          options={[
            { value: 'shamsi', label: 'شمسی (۱۴۰۳/۱۰/۱۵)' },
            { value: 'miladi', label: 'میلادی (2024/01/05)' }
          ]}
          value={generalForm.watch('dateFormat')}
          onChange={(value) => generalForm.setValue('dateFormat', value as 'shamsi' | 'miladi')}
        />
        
        <Select
          label="واحد پول"
          options={[
            { value: 'IRR', label: 'ریال (IRR)' },
            { value: 'IRT', label: 'تومان (IRT)' },
            { value: 'USD', label: 'دلار (USD)' }
          ]}
          value={generalForm.watch('currency')}
          onChange={(value) => generalForm.setValue('currency', value)}
        />
      </div>
      
      <div className="flex justify-end">
        <Button
          type="submit"
          loading={isLoading}
          icon={Save}
        >
          ذخیره تغییرات
        </Button>
      </div>
    </form>
  );

  const renderSecuritySettings = () => (
    <form onSubmit={securityForm.handleSubmit((data) => handleSaveSettings('security', data))} className="space-y-6">
      <div className="space-y-4">
        <ToggleSwitch
          checked={securityForm.watch('twoFactorEnabled')}
          onChange={(checked) => securityForm.setValue('twoFactorEnabled', checked)}
          label="احراز هویت دو مرحله‌ای"
          description="برای افزایش امنیت حساب کاربری فعال کنید"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              مدت زمان نشست (دقیقه)
            </label>
            <Select
              options={[
                { value: '15', label: '۱۵ دقیقه' },
                { value: '30', label: '۳۰ دقیقه' },
                { value: '60', label: '۱ ساعت' },
                { value: '120', label: '۲ ساعت' },
                { value: '480', label: '۸ ساعت' }
              ]}
              value={securityForm.watch('sessionTimeout').toString()}
              onChange={(value) => securityForm.setValue('sessionTimeout', parseInt(value))}
            />
          </div>
          
          <Select
            label="سطح امنیت رمز عبور"
            options={[
              { value: 'basic', label: 'ساده (حداقل ۶ کاراکتر)' },
              { value: 'medium', label: 'متوسط (۸ کاراکتر + اعداد)' },
              { value: 'strict', label: 'سخت (۱۲ کاراکتر + علائم)' }
            ]}
            value={securityForm.watch('passwordPolicy')}
            onChange={(value) => securityForm.setValue('passwordPolicy', value as any)}
          />
        </div>
        
        <Input
          label="آدرس‌های IP مجاز (اختیاری)"
          {...securityForm.register('allowedIpAddresses')}
          placeholder="192.168.1.1, 10.0.0.1"
          hint="آدرس‌های IP را با کامکا جدا کنید. خالی بگذارید تا همه IP ها مجاز باشند"
        />
        
        <Select
          label="سطح رمزگذاری"
          options={[
            { value: 'standard', label: 'استاندارد (AES-128)' },
            { value: 'enhanced', label: 'تقویت شده (AES-256)' }
          ]}
          value={securityForm.watch('encryptionLevel')}
          onChange={(value) => securityForm.setValue('encryptionLevel', value as any)}
        />
      </div>
      
      <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-warning-800 dark:text-warning-200">
              هشدار امنیتی
            </h4>
            <p className="text-sm text-warning-700 dark:text-warning-300 mt-1">
              تغییر تنظیمات امنیتی می‌تواند روی دسترسی کاربران تأثیر بگذارد. مطمئن شوید که تنظیمات را درست وارد کرده‌اید.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button
          type="submit"
          loading={isLoading}
          icon={Save}
          variant="warning"
        >
          ذخیره تنظیمات امنیتی
        </Button>
      </div>
    </form>
  );

  const renderNotificationSettings = () => (
    <form onSubmit={notificationForm.handleSubmit((data) => handleSaveSettings('notifications', data))} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
          روش‌های اطلاع‌رسانی
        </h3>
        
        <ToggleSwitch
          checked={notificationForm.watch('emailNotifications')}
          onChange={(checked) => notificationForm.setValue('emailNotifications', checked)}
          label="اطلاع‌رسانی ایمیل"
          description="دریافت اعلانات از طریق ایمیل"
        />
        
        <ToggleSwitch
          checked={notificationForm.watch('smsNotifications')}
          onChange={(checked) => notificationForm.setValue('smsNotifications', checked)}
          label="اطلاع‌رسانی پیامک"
          description="دریافت اعلانات از طریق پیامک"
        />
        
        <ToggleSwitch
          checked={notificationForm.watch('pushNotifications')}
          onChange={(checked) => notificationForm.setValue('pushNotifications', checked)}
          label="اعلانات فوری"
          description="دریافت اعلانات فوری در مرورگر"
        />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
          انواع اعلانات
        </h3>
        
        <ToggleSwitch
          checked={notificationForm.watch('documentUpdates')}
          onChange={(checked) => notificationForm.setValue('documentUpdates', checked)}
          label="به‌روزرسانی اسناد"
          description="اطلاع از تغییرات در اسناد و پرونده‌ها"
        />
        
        <ToggleSwitch
          checked={notificationForm.watch('systemAlerts')}
          onChange={(checked) => notificationForm.setValue('systemAlerts', checked)}
          label="هشدارهای سیستم"
          description="اطلاع از مشکلات و هشدارهای سیستم"
        />
        
        <ToggleSwitch
          checked={notificationForm.watch('weeklyReports')}
          onChange={(checked) => notificationForm.setValue('weeklyReports', checked)}
          label="گزارش‌های هفتگی"
          description="دریافت خلاصه فعالیت‌های هفتگی"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="ایمیل اطلاع‌رسانی"
          type="email"
          {...notificationForm.register('notificationEmail')}
          error={notificationForm.formState.errors.notificationEmail?.message}
          placeholder="notifications@example.com"
          hint="ایمیل مخصوص دریافت اعلانات"
        />
        
        <Input
          label="شماره موبایل (اختیاری)"
          {...notificationForm.register('notificationPhone')}
          placeholder="۰۹۱۲۳۴۵۶۷۸۹"
          hint="برای دریافت پیامک"
        />
      </div>
      
      <div className="flex justify-end">
        <Button
          type="submit"
          loading={isLoading}
          icon={Save}
        >
          ذخیره تنظیمات
        </Button>
      </div>
    </form>
  );

  const renderSystemSettings = () => (
    <form onSubmit={systemForm.handleSubmit((data) => handleSaveSettings('system', data))} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
          ظاهر و نمایش
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            تم رنگی سیستم
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'light', label: 'روشن', icon: Sun },
              { value: 'dark', label: 'تیره', icon: Moon },
              { value: 'auto', label: 'خودکار', icon: Laptop }
            ].map((theme) => {
              const IconComponent = theme.icon;
              return (
                <button
                  key={theme.value}
                  type="button"
                  onClick={() => systemForm.setValue('theme', theme.value as any)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all",
                    systemForm.watch('theme') === theme.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                  )}
                >
                  <IconComponent className="w-6 h-6" />
                  <span className="text-sm font-medium">{theme.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
          بک‌آپ و ذخیره‌سازی
        </h3>
        
        <ToggleSwitch
          checked={systemForm.watch('autoBackup')}
          onChange={(checked) => systemForm.setValue('autoBackup', checked)}
          label="بک‌آپ خودکار"
          description="تهیه نسخه پشتیبان به صورت خودکار"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="دوره بک‌آپ"
            options={[
              { value: 'daily', label: 'روزانه' },
              { value: 'weekly', label: 'هفتگی' },
              { value: 'monthly', label: 'ماهانه' }
            ]}
            value={systemForm.watch('backupFrequency')}
            onChange={(value) => systemForm.setValue('backupFrequency', value as any)}
            disabled={!systemForm.watch('autoBackup')}
          />
          
          <Input
            label="مدت نگهداری داده (روز)"
            type="number"
            {...systemForm.register('dataRetention', { valueAsNumber: true })}
            error={systemForm.formState.errors.dataRetention?.message}
            placeholder="365"
            hint="حداقل ۳۰ روز، حداکثر ۱۰ سال"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
          محدودیت‌های فایل
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="حداکثر حجم فایل (مگابایت)"
            type="number"
            {...systemForm.register('maxFileSize', { valueAsNumber: true })}
            error={systemForm.formState.errors.maxFileSize?.message}
            placeholder="10"
          />
          
          <Input
            label="فرمت‌های مجاز"
            {...systemForm.register('allowedFileTypes')}
            placeholder=".pdf,.doc,.docx,.txt,.jpg,.png"
            hint="فرمت‌ها را با کامای انگلیسی جدا کنید"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
          حالت نگهداری
        </h3>
        
        <ToggleSwitch
          checked={systemForm.watch('maintenanceMode')}
          onChange={(checked) => systemForm.setValue('maintenanceMode', checked)}
          label="حالت نگهداری سیستم"
          description="غیرفعال کردن دسترسی کاربران برای تعمیرات"
        />
        
        {systemForm.watch('maintenanceMode') && (
          <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-error-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-error-800 dark:text-error-200">
                  توجه: حالت نگهداری فعال است
                </h4>
                <p className="text-sm text-error-700 dark:text-error-300 mt-1">
                  در این حالت، کاربران عادی نمی‌توانند به سیستم دسترسی داشته باشند.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          icon={Download}
        >
          دانلود تنظیمات
        </Button>
        
        <Button
          type="submit"
          loading={isLoading}
          icon={Save}
        >
          ذخیره تنظیمات
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {LEGAL_TERMINOLOGY.pages.settings}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            مدیریت تنظیمات سیستم و تنظیمات کاربری
          </p>
        </div>
        
        {lastSaved && (
          <div className="flex items-center gap-2 text-sm text-success-600">
            <CheckCircle2 className="w-4 h-4" />
            <span>آخرین ذخیره: {lastSaved.toLocaleTimeString('fa-IR')}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        "w-full flex items-start gap-3 p-4 text-right transition-colors",
                        activeTab === tab.id
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-l-2 border-primary-500'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                      )}
                    >
                      <IconComponent className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{tab.label}</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                          {tab.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                {tabs.find(tab => tab.id === activeTab)?.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeTab === 'general' && renderGeneralSettings()}
              {activeTab === 'security' && renderSecuritySettings()}
              {activeTab === 'notifications' && renderNotificationSettings()}
              {activeTab === 'system' && renderSystemSettings()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;


