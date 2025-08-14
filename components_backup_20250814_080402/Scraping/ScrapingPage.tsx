import { useState } from 'react';
import { GlobalOutlined, CaretRightOutlined, StopOutlined, DeleteOutlined, SettingOutlined, WarningOutlined } from '@ant-design/icons';
import { webScraper } from '../../lib/webScraper';
import { useScrapingSources } from '../../hooks/useDatabase';
import { ScrapingSettings, ScrapedItem } from '../../types';

interface ScrapingProgress {
  siteIndex: number;
  totalSites: number;
  currentSite: string;
  progress: number;
  status: string;
}

export default function ScrapingPage() {
  const { data: sourcesResponse } = useScrapingSources();
  const legalSites = (sourcesResponse?.sources || []).map((s: any, idx: number) => ({
    id: idx + 1,
    name: s.name,
    url: s.url || s.base_url,
    category: s.category || 'نامشخص',
    active: s.status !== 'inactive',
  }));

  const [selectedSites, setSelectedSites] = useState<number[]>([]);
  const [settings, setSettings] = useState<ScrapingSettings>({
    maxPages: 10,
    delay: 2,
    minContentLength: 100,
    enableRating: true
  });

  const [isScrapingActive, setIsScrapingActive] = useState(false);
  const [scrapingProgress, setScrapingProgress] = useState<ScrapingProgress | null>(null);
  const [scrapedResults, setScrapedResults] = useState<ScrapedItem[]>([]);
  const [completedScraping, setCompletedScraping] = useState(false);

  const handleSiteSelection = (siteId: number) => {
    setSelectedSites(prev =>
      prev.includes(siteId)
        ? prev.filter(id => id !== siteId)
        : [...prev, siteId]
    );
  };

  const startScraping = async () => {
    if (!legalSites || selectedSites.length === 0) return;

    setIsScrapingActive(true);
    setCompletedScraping(false);
    setScrapedResults([]);

    const sitesToScrape = legalSites.filter(site => selectedSites.includes(site.id));
    const allResults: ScrapedItem[] = [];

    try {
      for (let i = 0; i < sitesToScrape.length; i++) {
        const site = sitesToScrape[i]!;

        setScrapingProgress({
          siteIndex: i,
          totalSites: sitesToScrape.length,
          currentSite: site.name,
          progress: 0,
          status: `شروع اسکرپ از ${site.name}`
        });

        const siteResults = await webScraper.scrapeSite(
          site,
          settings,
          (progress, status) => {
            setScrapingProgress(prev => prev ? {
              ...prev,
              progress,
              status
            } : null);
          }
        );

        allResults.push(...siteResults);

        // Update final progress for this site
        setScrapingProgress({
          siteIndex: i + 1,
          totalSites: sitesToScrape.length,
          currentSite: i < sitesToScrape.length - 1 ? (sitesToScrape[i + 1]?.name ?? '') : '',
          progress: 100,
          status: `تکمیل شد - ${siteResults.length} آیتم جمع‌آوری شد`
        });

        // Add delay between sites
        if (i < sitesToScrape.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      setScrapedResults(allResults);
      setCompletedScraping(true);

    } catch (error) {
      console.error('Scraping error:', error);
    } finally {
      setIsScrapingActive(false);
      setScrapingProgress(null);
    }
  };

  const stopScraping = () => {
    setIsScrapingActive(false);
    setScrapingProgress(null);
  };

  const clearResults = () => {
    setScrapedResults([]);
    setCompletedScraping(false);
  };

  if (!legalSites) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="mx-auto mb-4 w-12 h-12">
            <div className="w-full h-full border-2 border-gray-200 border-t-blue-600 rounded-full" style={{animation: 'spin 1s linear infinite'}}></div>
          </div>
          <p className="text-gray-600">در حال بارگذاری منابع...</p>
        </div>
      </div>
    );
  }

  const overallProgress = scrapingProgress
    ? ((scrapingProgress.siteIndex / scrapingProgress.totalSites) * 100) + (scrapingProgress.progress / scrapingProgress.totalSites)
    : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">وب اسکرپینگ هوشمند</h1>
        <p className="text-gray-600">جمع‌آوری خودکار اطلاعات از منابع حقوقی معتبر</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Site Selection */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">انتخاب منابع</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {legalSites.map((site) => (
                <label key={site.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSites.includes(site.id)}
                    onChange={() => handleSiteSelection(site.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ml-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{site.name}</div>
                    <div className="text-sm text-gray-500">{site.category}</div>
                  </div>
                </label>
              ))}
            </div>

            {selectedSites.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <Globe className="inline ml-2" size={16} />
                  {selectedSites.length} منبع انتخاب شده
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Settings & Controls */}
        <div className="space-y-6">
          {/* Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <Settings className="inline ml-2" size={20} />
              تنظیمات
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  حداکثر صفحات هر منبع: {settings.maxPages}
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={settings.maxPages}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxPages: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  disabled={isScrapingActive}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاخیر بین درخواست‌ها: {settings.delay} ثانیه
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={settings.delay}
                  onChange={(e) => setSettings(prev => ({ ...prev, delay: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  disabled={isScrapingActive}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  حداقل طول محتوا: {settings.minContentLength}
                </label>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={settings.minContentLength}
                  onChange={(e) => setSettings(prev => ({ ...prev, minContentLength: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  disabled={isScrapingActive}
                />
              </div>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.enableRating}
                  onChange={(e) => setSettings(prev => ({ ...prev, enableRating: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ml-3"
                  disabled={isScrapingActive}
                />
                <span className="text-sm text-gray-700">رتبه‌بندی هوشمند محتوا</span>
              </label>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">وضعیت</h3>

            {isScrapingActive ? (
              <div className="text-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 mb-4">
                  <div className="w-4 h-4 ml-2">
                    <div className="w-full h-full border-2 border-gray-200 border-t-yellow-600 rounded-full" style={{animation: 'spin 1s linear infinite'}}></div>
                  </div>
                  در حال اسکرپ...
                </div>

                {scrapingProgress && (
                  <div>
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-700">{scrapingProgress.currentSite}</p>
                      <p className="text-xs text-gray-500">{scrapingProgress.status}</p>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${overallProgress}%` }}
                      />
                    </div>

                    <p className="text-xs text-gray-600">
                      {overallProgress.toFixed(1)}% تکمیل شده
                    </p>
                  </div>
                )}
              </div>
            ) : completedScraping ? (
              <div className="text-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-4">
                  ✅ تکمیل شده
                </div>
                <p className="text-sm text-gray-600">
                  {scrapedResults.length} آیتم جمع‌آوری شد
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  ⏸️ آماده
                </div>
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-3">
              <button
                onClick={startScraping}
                disabled={selectedSites.length === 0 || isScrapingActive}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
              >
                <Play size={20} />
                شروع اسکرپینگ
              </button>

              <button
                onClick={stopScraping}
                disabled={!isScrapingActive}
                className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
              >
                <Square size={20} />
                توقف اسکرپینگ
              </button>

              <button
                onClick={clearResults}
                disabled={scrapedResults.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
              >
                <Trash2 size={20} />
                پاک کردن نتایج
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {scrapedResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">نتایج اسکرپینگ</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{scrapedResults.length}</div>
              <div className="text-sm text-blue-700">کل آیتم‌ها</div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {new Set(scrapedResults.map(item => item.category)).size}
              </div>
              <div className="text-sm text-green-700">دسته‌بندی</div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {(scrapedResults.reduce((acc, item) => acc + item.ratingScore, 0) / scrapedResults.length * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-yellow-700">رتبه میانگین</div>
            </div>
          </div>

          {/* Sample Results */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">نمونه آیتم‌های جمع‌آوری شده:</h4>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {scrapedResults.slice(0, 10).map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{item.title}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{item.domain}</span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        {item.category}
                      </span>
                      <span>⭐ {(item.ratingScore * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {scrapedResults.length > 10 && (
              <p className="text-sm text-gray-500 mt-3 text-center">
                و {scrapedResults.length - 10} مورد دیگر...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Warning */}
      {selectedSites.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertCircle size={20} />
            <span className="font-medium">لطفاً حداقل یک منبع را انتخاب کنید</span>
          </div>
        </div>
      )}
    </div>
  );
}