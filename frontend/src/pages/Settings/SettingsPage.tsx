import React, { useState, useCallback } from 'react';
import { 
  Settings, User, Bell, Shield, Database, 
  Globe, Palette, Monitor, Save, RefreshCw,
  Key, Mail, Phone, MapPin, Building,
  Clock, Language, Moon, Sun, Eye, EyeOff,
  Upload, Download, Trash2, Check, X,
  AlertTriangle, Info
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, StatusBadge } from '../../components/ui';
import { LEGAL_TERMINOLOGY } from '../../lib/terminology';
import { cn, formatPersianNumber } from '../../lib/utils';

// Types
interface UserSettings {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    title: string;
    organization: string;
    address: string;
    avatar?: string;
  };
  preferences: {
    language: 'fa' | 'en';
    theme: 'light' | 'dark' | 'system';
    timezone: string;
    dateFormat: 'jalali' | 'gregorian';
    currency: 'IRR' | 'USD' | 'EUR';
    pageSize: number;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    documentProcessed: boolean;
    deadlineReminders: boolean;
    systemAlerts: boolean;
    weeklyReports: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    loginAlerts: boolean;
    passwordExpiry: number;
  };
  system: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    retentionPeriod: number;
    maxConcurrentJobs: number;
    enableDebugMode: boolean;
  };
}

const defaultSettings: UserSettings = {
  profile: {
    firstName: 'علی',
    lastName: 'احمدی',
    email: 'ali.ahmadi@example.com',
    phone: '09123456789',
    title: 'مشاور حقوقی ارشد',
    organization: 'مؤسسه حقوقی آسمان',
    address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳'
  },
  preferences: {
    language: 'fa',
    theme: 'light',
    timezone: 'Asia/Tehran',
    dateFormat: 'jalali',
    currency: 'IRR',
    pageSize: 20
  },
  notifications: {
    email: true,
    sms: false,
    push: true,
    documentProcessed: true,
    deadlineReminders: true,
    systemAlerts: true,
    weeklyReports: false
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 60,
    loginAlerts: true,
    passwordExpiry: 90
  },
  system: {
    autoBackup: true,
    backupFrequency: 'daily',
    retentionPeriod: 30,
    maxConcurrentJobs: 5,
    enableDebugMode: false
  }
};

// Components
const FormGroup: React.FC<{
  label: string;
  description?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}> = ({ label, description, required, error, children }) => (
  <div className="space-y-2">
    <div>
      <label className="text-sm font-medium text-neutral-900">
        {label}
        {required && <span className="text-error-600 mr-1">*</span>}
      </label>
      {description && (
        <p className="text-xs text-neutral-600 mt-1">{description}</p>
      )}
    </div>
    {children}
    {error && (
      <p className="text-xs text-error-600 flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        {error}
      </p>
    )}
  </div>
);

const ToggleSwitch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}> = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    onClick={() => !disabled && onChange(!checked)}
    disabled={disabled}
    className={cn(
      "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
      checked ? "bg-primary-600" : "bg-neutral-200",
      disabled && "opacity-50 cursor-not-allowed"
    )}
  >
    <span
      className={cn(
        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
        checked ? "translate-x-5" : "translate-x-0"
      )}
    />
  </button>
);

const SettingItem: React.FC<{
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}> = ({ title, description, checked, onChange, disabled }) => (
  <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
    <div className="flex-1">
      <h4 className="text-sm font-medium text-neutral-900">{title}</h4>
      <p className="text-sm text-neutral-600 mt-1">{description}</p>
    </div>
    <ToggleSwitch checked={checked} onChange={onChange} disabled={disabled} />
  </div>
);

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const tabs = [
    { id: 'profile', label: 'پروفایل کاربری', icon: User },
    { id: 'preferences', label: 'تنظیمات نمایش', icon: Palette },
    { id: 'notifications', label: 'اعلان‌ها', icon: Bell },
    { id: 'security', label: 'امنیت', icon: Shield },
    { id: 'system', label: 'سیستم', icon: Database }
  ];

  const handleInputChange = useCallback((section: keyof UserSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
    
    // Clear error when field is changed
    if (errors[`${section}.${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`${section}.${field}`]: ''
      }));
    }
  }, [errors]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Profile validation
    if (!settings.profile.firstName.trim()) {
      newErrors['profile.firstName'] = 'نام الزامی است';
    }
    if (!settings.profile.lastName.trim()) {
      newErrors['profile.lastName'] = 'نام خانوادگی الزامی است';
    }
    if (!settings.profile.email.trim()) {
      newErrors['profile.email'] = 'ایمیل الزامی است';
    } else if (!/\S+@\S+\.\S+/.test(settings.profile.email)) {
      newErrors['profile.email'] = 'فرمت ایمیل صحیح نیست';
    }
    if (!settings.profile.phone.trim()) {
      newErrors['profile.phone'] = 'شماره تلفن الزامی است';
    } else if (!/^09\d{9}$/.test(settings.profile.phone.replace(/\s/g, ''))) {
      newErrors['profile.phone'] = 'فرمت شماره تلفن صحیح نیست';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasChanges(false);
      console.log('Settings saved:', settings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  const handleReset = useCallback(() => {
    setSettings(defaultSettings);
    setHasChanges(false);
    setErrors({});
  }, []);

  const handleExportSettings = useCallback(() => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'settings.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [settings]);

  const handleImportSettings = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings(importedSettings);
          setHasChanges(true);
        } catch (error) {
          console.error('Failed to import settings:', error);
        }
      };
      reader.readAsText(file);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {LEGAL_TERMINOLOGY.settings.title}
          </h1>
          <p className="text-neutral-600 mt-1">
            مدیریت تنظیمات کاربری و سیستم
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <div className="flex items-center gap-2 text-sm text-warning-600">
              <div className="w-2 h-2 bg-warning-500 rounded-full" />
              <span>تغییرات ذخیره نشده</span>
            </div>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset}
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4 ml-1" />
            بازگردانی
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleSave}
            loading={isLoading}
            disabled={!hasChanges}
          >
            <Save className="w-4 h-4 ml-1" />
            ذخیره تغییرات
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-right transition-all duration-200",
                        isActive
                          ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600"
                          : "text-neutral-600 hover:bg-neutral-50"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">عملیات سریع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportSettings}
                className="w-full justify-start"
              >
                <Download className="w-4 h-4 ml-1" />
                صادرات تنظیمات
              </Button>
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportSettings}
                  className="hidden"
                  id="import-settings"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('import-settings')?.click()}
                  className="w-full justify-start"
                >
                  <Upload className="w-4 h-4 ml-1" />
                  وارد کردن تنظیمات
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>اطلاعات پروفایل</CardTitle>
                <CardDescription>
                  مدیریت اطلاعات شخصی و حرفه‌ای
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormGroup
                    label="نام"
                    required
                    error={errors['profile.firstName']}
                  >
                    <input
                      type="text"
                      value={settings.profile.firstName}
                      onChange={(e) => handleInputChange('profile', 'firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </FormGroup>

                  <FormGroup
                    label="نام خانوادگی"
                    required
                    error={errors['profile.lastName']}
                  >
                    <input
                      type="text"
                      value={settings.profile.lastName}
                      onChange={(e) => handleInputChange('profile', 'lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </FormGroup>

                  <FormGroup
                    label="ایمیل"
                    required
                    error={errors['profile.email']}
                  >
                    <input
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </FormGroup>

                  <FormGroup
                    label="شماره تلفن"
                    required
                    error={errors['profile.phone']}
                  >
                    <input
                      type="tel"
                      value={settings.profile.phone}
                      onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="09123456789"
                    />
                  </FormGroup>

                  <FormGroup label="عنوان شغلی">
                    <input
                      type="text"
                      value={settings.profile.title}
                      onChange={(e) => handleInputChange('profile', 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </FormGroup>

                  <FormGroup label="نام سازمان">
                    <input
                      type="text"
                      value={settings.profile.organization}
                      onChange={(e) => handleInputChange('profile', 'organization', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </FormGroup>
                </div>

                <FormGroup label="آدرس">
                  <textarea
                    value={settings.profile.address}
                    onChange={(e) => handleInputChange('profile', 'address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </FormGroup>
              </CardContent>
            </Card>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <Card>
              <CardHeader>
                <CardTitle>تنظیمات نمایش</CardTitle>
                <CardDescription>
                  شخصی‌سازی رابط کاربری و تنظیمات نمایش
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormGroup label="زبان رابط کاربری">
                    <select
                      value={settings.preferences.language}
                      onChange={(e) => handleInputChange('preferences', 'language', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="fa">فارسی</option>
                      <option value="en">English</option>
                    </select>
                  </FormGroup>

                  <FormGroup label="تم نمایش">
                    <select
                      value={settings.preferences.theme}
                      onChange={(e) => handleInputChange('preferences', 'theme', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="light">روشن</option>
                      <option value="dark">تیره</option>
                      <option value="system">بر اساس سیستم</option>
                    </select>
                  </FormGroup>

                  <FormGroup label="منطقه زمانی">
                    <select
                      value={settings.preferences.timezone}
                      onChange={(e) => handleInputChange('preferences', 'timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="Asia/Tehran">تهران (GMT+3:30)</option>
                      <option value="UTC">UTC (GMT+0)</option>
                    </select>
                  </FormGroup>

                  <FormGroup label="فرمت تاریخ">
                    <select
                      value={settings.preferences.dateFormat}
                      onChange={(e) => handleInputChange('preferences', 'dateFormat', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="jalali">شمسی</option>
                      <option value="gregorian">میلادی</option>
                    </select>
                  </FormGroup>

                  <FormGroup label="واحد پول">
                    <select
                      value={settings.preferences.currency}
                      onChange={(e) => handleInputChange('preferences', 'currency', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="IRR">ریال ایران</option>
                      <option value="USD">دلار آمریکا</option>
                      <option value="EUR">یورو</option>
                    </select>
                  </FormGroup>

                  <FormGroup label="تعداد آیتم در صفحه">
                    <select
                      value={settings.preferences.pageSize}
                      onChange={(e) => handleInputChange('preferences', 'pageSize', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value={10}>۱۰</option>
                      <option value={20}>۲۰</option>
                      <option value={50}>۵۰</option>
                      <option value={100}>۱۰۰</option>
                    </select>
                  </FormGroup>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>تنظیمات اعلان‌ها</CardTitle>
                <CardDescription>
                  مدیریت نحوه دریافت اعلان‌ها و هشدارها
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h4 className="font-medium text-neutral-900">روش‌های دریافت اعلان</h4>
                  <SettingItem
                    title="اعلان‌های ایمیل"
                    description="دریافت اعلان‌ها از طریق ایمیل"
                    checked={settings.notifications.email}
                    onChange={(checked) => handleInputChange('notifications', 'email', checked)}
                  />
                  <SettingItem
                    title="اعلان‌های پیامکی"
                    description="دریافت اعلان‌ها از طریق پیامک"
                    checked={settings.notifications.sms}
                    onChange={(checked) => handleInputChange('notifications', 'sms', checked)}
                  />
                  <SettingItem
                    title="اعلان‌های فوری"
                    description="نمایش اعلان‌های فوری در مرورگر"
                    checked={settings.notifications.push}
                    onChange={(checked) => handleInputChange('notifications', 'push', checked)}
                  />
                </div>

                <div className="space-y-4 pt-6 border-t border-neutral-200">
                  <h4 className="font-medium text-neutral-900">نوع اعلان‌ها</h4>
                  <SettingItem
                    title="پردازش اسناد"
                    description="اعلان زمان تکمیل پردازش اسناد"
                    checked={settings.notifications.documentProcessed}
                    onChange={(checked) => handleInputChange('notifications', 'documentProcessed', checked)}
                  />
                  <SettingItem
                    title="یادآوری مهلت‌ها"
                    description="هشدار نزدیک شدن مهلت‌های مهم"
                    checked={settings.notifications.deadlineReminders}
                    onChange={(checked) => handleInputChange('notifications', 'deadlineReminders', checked)}
                  />
                  <SettingItem
                    title="هشدارهای سیستم"
                    description="اعلان مشکلات و خطاهای سیستم"
                    checked={settings.notifications.systemAlerts}
                    onChange={(checked) => handleInputChange('notifications', 'systemAlerts', checked)}
                  />
                  <SettingItem
                    title="گزارش‌های هفتگی"
                    description="دریافت خلاصه‌ای از فعالیت‌های هفته"
                    checked={settings.notifications.weeklyReports}
                    onChange={(checked) => handleInputChange('notifications', 'weeklyReports', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>تنظیمات امنیت</CardTitle>
                <CardDescription>
                  مدیریت امنیت حساب کاربری و دسترسی‌ها
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <SettingItem
                    title="احراز هویت دومرحله‌ای"
                    description="افزایش امنیت با استفاده از کد تأیید پیامکی"
                    checked={settings.security.twoFactorAuth}
                    onChange={(checked) => handleInputChange('security', 'twoFactorAuth', checked)}
                  />
                  <SettingItem
                    title="هشدار ورود"
                    description="اعلان ورود از دستگاه‌های جدید"
                    checked={settings.security.loginAlerts}
                    onChange={(checked) => handleInputChange('security', 'loginAlerts', checked)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-neutral-200">
                  <FormGroup 
                    label="مدت زمان نشست (دقیقه)"
                    description="خروج خودکار پس از عدم فعالیت"
                  >
                    <select
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value={15}>۱۵ دقیقه</option>
                      <option value={30}>۳۰ دقیقه</option>
                      <option value={60}>۱ ساعت</option>
                      <option value={120}>۲ ساعت</option>
                      <option value={240}>۴ ساعت</option>
                    </select>
                  </FormGroup>

                  <FormGroup 
                    label="انقضای کلمه عبور (روز)"
                    description="تغییر اجباری کلمه عبور"
                  >
                    <select
                      value={settings.security.passwordExpiry}
                      onChange={(e) => handleInputChange('security', 'passwordExpiry', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value={30}>۳۰ روز</option>
                      <option value={60}>۶۰ روز</option>
                      <option value={90}>۹۰ روز</option>
                      <option value={180}>۱۸۰ روز</option>
                      <option value={365}>۳۶۵ روز</option>
                    </select>
                  </FormGroup>
                </div>

                <div className="pt-6 border-t border-neutral-200">
                  <Button variant="outline" size="sm">
                    <Key className="w-4 h-4 ml-1" />
                    تغییر کلمه عبور
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <Card>
              <CardHeader>
                <CardTitle>تنظیمات سیستم</CardTitle>
                <CardDescription>
                  پیکربندی سیستم و عملیات پیشرفته
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <SettingItem
                    title="پشتیبان‌گیری خودکار"
                    description="پشتیبان‌گیری منظم از داده‌های سیستم"
                    checked={settings.system.autoBackup}
                    onChange={(checked) => handleInputChange('system', 'autoBackup', checked)}
                  />
                  <SettingItem
                    title="حالت دیباگ"
                    description="فعال‌سازی گزارش‌های تفصیلی برای عیب‌یابی"
                    checked={settings.system.enableDebugMode}
                    onChange={(checked) => handleInputChange('system', 'enableDebugMode', checked)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-neutral-200">
                  <FormGroup label="دوره پشتیبان‌گیری">
                    <select
                      value={settings.system.backupFrequency}
                      onChange={(e) => handleInputChange('system', 'backupFrequency', e.target.value)}
                      disabled={!settings.system.autoBackup}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                    >
                      <option value="daily">روزانه</option>
                      <option value="weekly">هفتگی</option>
                      <option value="monthly">ماهانه</option>
                    </select>
                  </FormGroup>

                  <FormGroup label="مدت نگهداری پشتیبان (روز)">
                    <select
                      value={settings.system.retentionPeriod}
                      onChange={(e) => handleInputChange('system', 'retentionPeriod', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value={7}>۷ روز</option>
                      <option value={14}>۱۴ روز</option>
                      <option value={30}>۳۰ روز</option>
                      <option value={90}>۹۰ روز</option>
                    </select>
                  </FormGroup>

                  <FormGroup label="حداکثر کارهای همزمان">
                    <select
                      value={settings.system.maxConcurrentJobs}
                      onChange={(e) => handleInputChange('system', 'maxConcurrentJobs', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value={1}>۱</option>
                      <option value={3}>۳</option>
                      <option value={5}>۵</option>
                      <option value={10}>۱۰</option>
                    </select>
                  </FormGroup>
                </div>

                <div className="pt-6 border-t border-neutral-200">
                  <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-warning-800">منطقه خطرناک</h4>
                        <p className="text-sm text-warning-700 mt-1">
                          عملیات زیر ممکن است باعث از دست رفتن داده‌ها شود. با احتیاط استفاده کنید.
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4 ml-1" />
                            پاک کردن تمام داده‌ها
                          </Button>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="w-4 h-4 ml-1" />
                            بازنشانی سیستم
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;


