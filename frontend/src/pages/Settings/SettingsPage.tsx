import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Settings, Bell, Shield, Database, Moon, Sun, Globe, 
  Save, Camera, Key, Trash2, Download, Upload, Clock, 
  Languages, Palette, Mail, Lock, Smartphone, AlertCircle
} from 'lucide-react';
import { AnimatedCard, AnimatedButton } from '../../components/ui/animations';
import { cn } from '../../lib/utils';

interface SettingsSectionProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, description, icon: Icon, children }) => (
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

const InputField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}> = ({ label, value, onChange, type = 'text', placeholder, disabled = false }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg",
        "bg-white dark:bg-gray-700 text-gray-900 dark:text-white",
        "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "transition-colors duration-200"
      )}
    />
  </div>
);

const SelectField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}> = ({ label, value, onChange, options }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const ToggleField: React.FC<{
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, description, checked, onChange }) => (
  <div className="flex items-start justify-between">
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      )}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        checked ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  </div>
);

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  
  // User Profile State
  const [profile, setProfile] = useState({
    firstName: 'احمد',
    lastName: 'محمدی',
    email: 'ahmad.mohammadi@example.com',
    phone: '+98 912 345 6789',
    organization: 'دادگستری تهران',
    position: 'کارشناس حقوقی'
  });

  // Preferences State
  const [preferences, setPreferences] = useState({
    language: 'fa',
    theme: 'auto',
    timezone: 'Asia/Tehran',
    dateFormat: 'persian',
    pageSize: '20',
    autoSave: true,
    compactMode: false
  });

  // Notifications State
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    systemAlerts: true,
    weeklyReport: true,
    jobCompletion: true,
    errorAlerts: true,
    maintenanceNotices: false
  });

  // Security State
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: '30',
    requirePasswordChange: false,
    loginAlerts: true
  });

  // System State
  const [system, setSystem] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    logLevel: 'info',
    debugMode: false,
    maintenanceMode: false
  });

  const tabs = [
    { id: 'profile', label: 'پروفایل کاربری', icon: User },
    { id: 'preferences', label: 'تنظیمات کلی', icon: Settings },
    { id: 'notifications', label: 'اعلان‌ها', icon: Bell },
    { id: 'security', label: 'امنیت', icon: Shield },
    { id: 'system', label: 'سیستم', icon: Database }
  ];

  const handleSave = () => {
    // Simulate save operation
    console.log('Saving settings...');
    setUnsavedChanges(false);
    // Show success toast
  };

  const updateProfile = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  const updatePreferences = (field: string, value: string | boolean) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  const updateNotifications = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  const updateSecurity = (field: string, value: string | boolean) => {
    setSecurity(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  const updateSystem = (field: string, value: string | boolean) => {
    setSystem(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-6 space-y-6"
      dir="rtl"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">تنظیمات سیستم</h1>
        <p className="text-blue-100">مدیریت تنظیمات کاربری و سیستم</p>
      </div>

      {/* Unsaved Changes Warning */}
      {unsavedChanges && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between"
        >
          <div className="flex items-center space-x-3 space-x-reverse">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800">تغییراتی ذخیره نشده دارید</span>
          </div>
          <div className="flex space-x-2 space-x-reverse">
            <AnimatedButton
              variant="ghost"
              onClick={() => setUnsavedChanges(false)}
              className="text-yellow-700 hover:bg-yellow-100"
            >
              لغو
            </AnimatedButton>
            <AnimatedButton
              variant="primary"
              onClick={handleSave}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              ذخیره
            </AnimatedButton>
          </div>
        </motion.div>
      )}

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
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <SettingsSection
                title="اطلاعات شخصی"
                description="مدیریت اطلاعات پروفایل کاربری"
                icon={User}
              >
                <div className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-6 space-x-reverse">
                    <div className="relative">
                      <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <button className="absolute -bottom-1 -right-1 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">تصویر پروفایل</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">JPG یا PNG، حداکثر ۲ مگابایت</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="نام"
                      value={profile.firstName}
                      onChange={(value) => updateProfile('firstName', value)}
                      placeholder="نام خود را وارد کنید"
                    />
                    <InputField
                      label="نام خانوادگی"
                      value={profile.lastName}
                      onChange={(value) => updateProfile('lastName', value)}
                      placeholder="نام خانوادگی خود را وارد کنید"
                    />
                    <InputField
                      label="ایمیل"
                      value={profile.email}
                      onChange={(value) => updateProfile('email', value)}
                      type="email"
                      placeholder="email@example.com"
                    />
                    <InputField
                      label="شماره تماس"
                      value={profile.phone}
                      onChange={(value) => updateProfile('phone', value)}
                      type="tel"
                      placeholder="+98 912 345 6789"
                    />
                    <InputField
                      label="سازمان"
                      value={profile.organization}
                      onChange={(value) => updateProfile('organization', value)}
                      placeholder="نام سازمان"
                    />
                    <InputField
                      label="سمت"
                      value={profile.position}
                      onChange={(value) => updateProfile('position', value)}
                      placeholder="سمت شغلی"
                    />
                  </div>

                  {/* Password Change */}
                  <div className="border-t pt-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">تغییر رمز عبور</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="رمز عبور فعلی"
                        value=""
                        onChange={() => {}}
                        type="password"
                        placeholder="رمز عبور فعلی"
                      />
                      <InputField
                        label="رمز عبور جدید"
                        value=""
                        onChange={() => {}}
                        type="password"
                        placeholder="رمز عبور جدید"
                      />
                    </div>
                  </div>
                </div>
              </SettingsSection>
            </motion.div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <SettingsSection
                title="تنظیمات کلی"
                description="شخصی‌سازی تجربه کاربری"
                icon={Settings}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectField
                    label="زبان رابط کاربری"
                    value={preferences.language}
                    onChange={(value) => updatePreferences('language', value)}
                    options={[
                      { value: 'fa', label: 'فارسی' },
                      { value: 'en', label: 'English' }
                    ]}
                  />
                  <SelectField
                    label="تم ظاهری"
                    value={preferences.theme}
                    onChange={(value) => updatePreferences('theme', value)}
                    options={[
                      { value: 'light', label: 'روشن' },
                      { value: 'dark', label: 'تیره' },
                      { value: 'auto', label: 'خودکار' }
                    ]}
                  />
                  <SelectField
                    label="منطقه زمانی"
                    value={preferences.timezone}
                    onChange={(value) => updatePreferences('timezone', value)}
                    options={[
                      { value: 'Asia/Tehran', label: 'تهران' },
                      { value: 'Asia/Dubai', label: 'دبی' },
                      { value: 'UTC', label: 'UTC' }
                    ]}
                  />
                  <SelectField
                    label="فرمت تاریخ"
                    value={preferences.dateFormat}
                    onChange={(value) => updatePreferences('dateFormat', value)}
                    options={[
                      { value: 'persian', label: 'شمسی' },
                      { value: 'gregorian', label: 'میلادی' }
                    ]}
                  />
                  <SelectField
                    label="تعداد آیتم در هر صفحه"
                    value={preferences.pageSize}
                    onChange={(value) => updatePreferences('pageSize', value)}
                    options={[
                      { value: '10', label: '۱۰' },
                      { value: '20', label: '۲۰' },
                      { value: '50', label: '۵۰' },
                      { value: '100', label: '۱۰۰' }
                    ]}
                  />
                </div>
                <div className="space-y-4 pt-4 border-t">
                  <ToggleField
                    label="ذخیره خودکار"
                    description="ذخیره خودکار تغییرات در فرم‌ها"
                    checked={preferences.autoSave}
                    onChange={(checked) => updatePreferences('autoSave', checked)}
                  />
                  <ToggleField
                    label="حالت فشرده"
                    description="نمایش بیشتر اطلاعات در فضای کمتر"
                    checked={preferences.compactMode}
                    onChange={(checked) => updatePreferences('compactMode', checked)}
                  />
                </div>
              </SettingsSection>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <SettingsSection
                title="تنظیمات اعلان‌ها"
                description="مدیریت انواع اعلان‌ها و نحوه دریافت آن‌ها"
                icon={Bell}
              >
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">روش‌های دریافت اعلان</h4>
                    <div className="space-y-4">
                      <ToggleField
                        label="اعلان‌های ایمیل"
                        description="دریافت اعلان‌ها از طریق ایمیل"
                        checked={notifications.emailNotifications}
                        onChange={(checked) => updateNotifications('emailNotifications', checked)}
                      />
                      <ToggleField
                        label="اعلان‌های push"
                        description="دریافت اعلان‌های فوری در مرورگر"
                        checked={notifications.pushNotifications}
                        onChange={(checked) => updateNotifications('pushNotifications', checked)}
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">انواع اعلان‌ها</h4>
                    <div className="space-y-4">
                      <ToggleField
                        label="هشدارهای سیستم"
                        description="اعلان‌های مهم سیستم و خطاها"
                        checked={notifications.systemAlerts}
                        onChange={(checked) => updateNotifications('systemAlerts', checked)}
                      />
                      <ToggleField
                        label="گزارش هفتگی"
                        description="خلاصه فعالیت‌های هفته"
                        checked={notifications.weeklyReport}
                        onChange={(checked) => updateNotifications('weeklyReport', checked)}
                      />
                      <ToggleField
                        label="تکمیل پروژه‌ها"
                        description="اعلان در صورت تکمیل پروژه‌های اسکرپینگ"
                        checked={notifications.jobCompletion}
                        onChange={(checked) => updateNotifications('jobCompletion', checked)}
                      />
                      <ToggleField
                        label="هشدارهای خطا"
                        description="اعلان فوری در صورت بروز خطا"
                        checked={notifications.errorAlerts}
                        onChange={(checked) => updateNotifications('errorAlerts', checked)}
                      />
                      <ToggleField
                        label="اعلان‌های نگهداری"
                        description="اطلاع‌رسانی نگهداری و به‌روزرسانی سیستم"
                        checked={notifications.maintenanceNotices}
                        onChange={(checked) => updateNotifications('maintenanceNotices', checked)}
                      />
                    </div>
                  </div>
                </div>
              </SettingsSection>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <SettingsSection
                title="تنظیمات امنیت"
                description="مدیریت امنیت حساب کاربری و دسترسی‌ها"
                icon={Shield}
              >
                <div className="space-y-6">
                  <ToggleField
                    label="احراز هویت دو مرحله‌ای"
                    description="افزایش امنیت با استفاده از تایید دو مرحله‌ای"
                    checked={security.twoFactorEnabled}
                    onChange={(checked) => updateSecurity('twoFactorEnabled', checked)}
                  />
                  
                  <SelectField
                    label="مهلت زمانی جلسه (دقیقه)"
                    value={security.sessionTimeout}
                    onChange={(value) => updateSecurity('sessionTimeout', value)}
                    options={[
                      { value: '15', label: '۱۵ دقیقه' },
                      { value: '30', label: '۳۰ دقیقه' },
                      { value: '60', label: '۱ ساعت' },
                      { value: '120', label: '۲ ساعت' },
                      { value: '480', label: '۸ ساعت' }
                    ]}
                  />

                  <ToggleField
                    label="الزام تغییر رمز عبور"
                    description="الزام تغییر رمز عبور در ورود بعدی"
                    checked={security.requirePasswordChange}
                    onChange={(checked) => updateSecurity('requirePasswordChange', checked)}
                  />

                  <ToggleField
                    label="هشدار ورود"
                    description="اطلاع‌رسانی ورود‌های جدید به حساب"
                    checked={security.loginAlerts}
                    onChange={(checked) => updateSecurity('loginAlerts', checked)}
                  />

                  {/* Active Sessions */}
                  <div className="border-t pt-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">جلسات فعال</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <Smartphone className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">جلسه فعلی</p>
                            <p className="text-sm text-gray-500">Chrome on Windows • تهران</p>
                          </div>
                        </div>
                        <span className="text-green-600 text-sm">فعال</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SettingsSection>
            </motion.div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <SettingsSection
                title="تنظیمات سیستم"
                description="مدیریت تنظیمات سیستم و نگهداری"
                icon={Database}
              >
                <div className="space-y-6">
                  <ToggleField
                    label="پشتیبان‌گیری خودکار"
                    description="پشتیبان‌گیری خودکار از داده‌ها"
                    checked={system.autoBackup}
                    onChange={(checked) => updateSystem('autoBackup', checked)}
                  />

                  <SelectField
                    label="فرکانس پشتیبان‌گیری"
                    value={system.backupFrequency}
                    onChange={(value) => updateSystem('backupFrequency', value)}
                    options={[
                      { value: 'hourly', label: 'ساعتی' },
                      { value: 'daily', label: 'روزانه' },
                      { value: 'weekly', label: 'هفتگی' },
                      { value: 'monthly', label: 'ماهانه' }
                    ]}
                  />

                  <SelectField
                    label="سطح گزارش‌دهی"
                    value={system.logLevel}
                    onChange={(value) => updateSystem('logLevel', value)}
                    options={[
                      { value: 'error', label: 'خطا' },
                      { value: 'warn', label: 'هشدار' },
                      { value: 'info', label: 'اطلاعات' },
                      { value: 'debug', label: 'دیباگ' }
                    ]}
                  />

                  <ToggleField
                    label="حالت دیباگ"
                    description="فعال‌سازی حالت دیباگ برای عیب‌یابی"
                    checked={system.debugMode}
                    onChange={(checked) => updateSystem('debugMode', checked)}
                  />

                  <ToggleField
                    label="حالت نگهداری"
                    description="قرار دادن سیستم در حالت نگهداری"
                    checked={system.maintenanceMode}
                    onChange={(checked) => updateSystem('maintenanceMode', checked)}
                  />

                  {/* System Actions */}
                  <div className="border-t pt-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">عملیات سیستم</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AnimatedButton
                        variant="secondary"
                        className="flex items-center justify-center space-x-2 space-x-reverse"
                      >
                        <Download className="w-4 h-4" />
                        <span>پشتیبان‌گیری دستی</span>
                      </AnimatedButton>
                      <AnimatedButton
                        variant="secondary"
                        className="flex items-center justify-center space-x-2 space-x-reverse"
                      >
                        <Upload className="w-4 h-4" />
                        <span>بازیابی از پشتیبان</span>
                      </AnimatedButton>
                      <AnimatedButton
                        variant="danger"
                        className="flex items-center justify-center space-x-2 space-x-reverse"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>پاک‌سازی کش</span>
                      </AnimatedButton>
                      <AnimatedButton
                        variant="secondary"
                        className="flex items-center justify-center space-x-2 space-x-reverse"
                      >
                        <Clock className="w-4 h-4" />
                        <span>تاریخچه عملیات</span>
                      </AnimatedButton>
                    </div>
                  </div>
                </div>
              </SettingsSection>
            </motion.div>
          )}

          {/* Save Button */}
          <div className="flex justify-end space-x-4 space-x-reverse pt-6 border-t">
            <AnimatedButton
              variant="ghost"
              onClick={() => setUnsavedChanges(false)}
            >
              لغو تغییرات
            </AnimatedButton>
            <AnimatedButton
              variant="primary"
              onClick={handleSave}
              disabled={!unsavedChanges}
              className="flex items-center space-x-2 space-x-reverse"
            >
              <Save className="w-4 h-4" />
              <span>ذخیره تغییرات</span>
            </AnimatedButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


