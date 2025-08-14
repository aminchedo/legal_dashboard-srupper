// Vercel serverless function for scraping statistics
export default async function handler(req, res) {
  // Set CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'فقط درخواست‌های GET مجاز هستند'
    });
  }

  try {
    // Scraping statistics data
    const scrapingStats = {
      totalSources: 12,
      activeSources: 8,
      recentlyScraped: 45,
      successRate: 94.1,
      failedJobs: 3,
      queuedJobs: 7,
      totalDocuments: 12450,
      lastScraped: '2024-01-15T10:30:00Z',
      sources: [
        {
          id: 'majles',
          name: 'مجلس شورای اسلامی',
          url: 'majles.ir',
          status: 'active',
          lastScraped: '2024-01-15T10:30:00Z',
          documentsCount: 4560,
          successRate: 96.2
        },
        {
          id: 'president',
          name: 'دفتر ریاست جمهوری',
          url: 'president.ir',
          status: 'active',
          lastScraped: '2024-01-15T09:15:00Z',
          documentsCount: 2340,
          successRate: 92.8
        },
        {
          id: 'dastour',
          name: 'دستور',
          url: 'dastour.ir',
          status: 'active',
          lastScraped: '2024-01-15T08:45:00Z',
          documentsCount: 1890,
          successRate: 89.5
        },
        {
          id: 'ilo',
          name: 'سازمان بین‌المللی کار',
          url: 'ilo.ir',
          status: 'active',
          lastScraped: '2024-01-15T07:30:00Z',
          documentsCount: 1560,
          successRate: 94.7
        },
        {
          id: 'customs',
          name: 'سازمان گمرک',
          url: 'customs.ir',
          status: 'active',
          lastScraped: '2024-01-15T06:20:00Z',
          documentsCount: 890,
          successRate: 91.3
        },
        {
          id: 'farhang',
          name: 'وزارت فرهنگ و ارشاد اسلامی',
          url: 'farhang.gov.ir',
          status: 'active',
          lastScraped: '2024-01-15T05:10:00Z',
          documentsCount: 720,
          successRate: 88.9
        },
        {
          id: 'consumer',
          name: 'سازمان حمایت از حقوق مصرف‌کنندگان',
          url: 'consumer.ir',
          status: 'inactive',
          lastScraped: '2024-01-14T15:45:00Z',
          documentsCount: 450,
          successRate: 85.2
        },
        {
          id: 'other',
          name: 'سایر منابع',
          url: 'other.gov.ir',
          status: 'active',
          lastScraped: '2024-01-15T04:30:00Z',
          documentsCount: 640,
          successRate: 87.6
        }
      ],
      recentJobs: [
        {
          id: 'job-001',
          source: 'majles.ir',
          status: 'completed',
          documentsFound: 45,
          documentsProcessed: 45,
          startTime: '2024-01-15T10:00:00Z',
          endTime: '2024-01-15T10:30:00Z',
          duration: '30m',
          successRate: 100
        },
        {
          id: 'job-002',
          source: 'president.ir',
          status: 'completed',
          documentsFound: 23,
          documentsProcessed: 23,
          startTime: '2024-01-15T09:00:00Z',
          endTime: '2024-01-15T09:15:00Z',
          duration: '15m',
          successRate: 100
        },
        {
          id: 'job-003',
          source: 'dastour.ir',
          status: 'failed',
          documentsFound: 12,
          documentsProcessed: 8,
          startTime: '2024-01-15T08:30:00Z',
          endTime: '2024-01-15T08:45:00Z',
          duration: '15m',
          successRate: 66.7,
          error: 'Connection timeout'
        }
      ],
      performance: {
        averageJobDuration: '25m',
        averageSuccessRate: 94.1,
        totalJobsToday: 12,
        successfulJobsToday: 11,
        failedJobsToday: 1
      }
    };

    // Return successful response
    return res.status(200).json({
      success: true,
      data: scrapingStats,
      message: 'آمار استخراج اطلاعات با موفقیت بارگذاری شد'
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'خطای سرور در بارگذاری آمار استخراج'
    });
  }
}