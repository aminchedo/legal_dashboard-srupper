import React, { useState } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'fa',
    notifications: true,
    autoSave: true,
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = () => {
    // ذخیره تنظیمات
    console.log('ذخیره تنظیمات:', settings);
    alert('تنظیمات با موفقیت ذخیره شد!');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">⚙️ تنظیمات عمومی</h1>
      
      <div className="max-w-2xl">
        {/* تنظیمات ظاهری */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">🎨 ظاهر و نمایش</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تم رنگی
              </label>
              <select 
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="light">روشن</option>
                <option value="dark">تیره</option>
                <option value="auto">خودکار</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                زبان
              </label>
              <select 
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="fa">فارسی</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>

        {/* تنظیمات سیستم */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">🔧 تنظیمات سیستم</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                اعلان‌ها
              </span>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                className="rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                ذخیره خودکار
              </span>
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                className="rounded"
              />
            </div>
          </div>
        </div>

        {/* دکمه ذخیره */}
        <button
          onClick={saveSettings}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition"
        >
          💾 ذخیره تنظیمات
        </button>
      </div>
    </div>
  );
};

export default Settings;