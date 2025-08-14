// Vercel serverless function for document statistics
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
    // Comprehensive statistics data
    const statistics = {
      overview: {
        totalDocuments: 12450,
        activeJobs: 12,
        systemHealth: 98,
        recentActivity: 234,
        documentsChange: 12.5,
        jobsChange: -3.2,
        healthChange: 1.8,
        activityChange: 8.7
      },
      categories: {
        'قانون مدنی': 3240,
        'قانون تجارت': 2150,
        'قانون کیفری': 1890,
        'قانون کار': 1560,
        'قانون مالیاتی': 980,
        'قانون خانواده': 890,
        'قانون اساسی': 450,
        'قانون اداری': 720,
        'قانون بین‌الملل': 620
      },
      sources: {
        'majles.ir': 4560,
        'president.ir': 2340,
        'dastour.ir': 1890,
        'ilo.ir': 1560,
        'customs.ir': 890,
        'farhang.gov.ir': 720,
        'consumer.ir': 450,
        'other': 640
      },
      status: {
        'completed': 11205,
        'processing': 890,
        'failed': 355
      },
      trends: {
        weekly: [
          { day: 'شنبه', documents: 231, jobs: 12 },
          { day: 'یکشنبه', documents: 295, jobs: 15 },
          { day: 'دوشنبه', documents: 374, jobs: 18 },
          { day: 'سه‌شنبه', documents: 345, jobs: 16 },
          { day: 'چهارشنبه', documents: 396, jobs: 20 },
          { day: 'پنج‌شنبه', documents: 281, jobs: 14 },
          { day: 'جمعه', documents: 150, jobs: 8 }
        ],
        monthly: [
          { month: 'فروردین', documents: 2840, growth: 12.5 },
          { month: 'اردیبهشت', documents: 3120, growth: 9.9 },
          { month: 'خرداد', documents: 2980, growth: -4.5 },
          { month: 'تیر', documents: 3250, growth: 9.1 },
          { month: 'مرداد', documents: 3410, growth: 4.9 },
          { month: 'شهریور', documents: 3180, growth: -6.7 }
        ]
      },
      performance: {
        processingSpeed: 78,
        accuracy: 92,
        userSatisfaction: 96,
        uptime: 99.9
      },
      recentActivity: [
        {
          id: 1,
          type: 'document',
          title: 'سند جدید آپلود شد',
          description: 'اصلاحیه قانون تجارت',
          time: '۵ دقیقه پیش',
          user: 'احمد محمدی',
          status: 'success'
        },
        {
          id: 2,
          type: 'job',
          title: 'وظیفه جدید ایجاد شد',
          description: 'پردازش ۲۳۴ سند',
          time: '۱۵ دقیقه پیش',
          user: 'فاطمه احمدی',
          status: 'processing'
        },
        {
          id: 3,
          type: 'system',
          title: 'بروزرسانی سیستم',
          description: 'نسخه ۲.۱.۰ نصب شد',
          time: '۱ ساعت پیش',
          user: 'سیستم',
          status: 'info'
        }
      ]
    };

    // Return successful response
    return res.status(200).json({
      success: true,
      data: statistics,
      message: 'آمار با موفقیت بارگذاری شد'
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'خطای سرور در بارگذاری آمار'
    });
  }
}