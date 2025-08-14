// Vercel serverless function for analytics
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
    // Comprehensive analytics data
    const analytics = {
      totalDocuments: 12450,
      activeCases: 89,
      completionRate: 87.5,
      totalItems: 47582,
      recentItems: 1843,
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
      avgRating: 0.891,
      todayStats: { 
        success_rate: 94.1,
        documents_processed: 234,
        jobs_completed: 12,
        errors: 3
      },
      weeklyTrend: [
        { day: 'شنبه', success: 231, total: 245 },
        { day: 'یکشنبه', success: 295, total: 312 },
        { day: 'دوشنبه', success: 374, total: 398 },
        { day: 'سه‌شنبه', success: 345, total: 367 },
        { day: 'چهارشنبه', success: 396, total: 421 },
        { day: 'پنج‌شنبه', success: 281, total: 298 },
        { day: 'جمعه', success: 150, total: 165 }
      ],
      monthlyGrowth: 18.3,
      systemHealth: {
        cpu: 45.2,
        memory: 67.8,
        disk: 23.1,
        network: 89.5,
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
      data: analytics,
      message: 'داده‌های تحلیلی با موفقیت بارگذاری شدند'
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'خطای سرور در بارگذاری داده‌های تحلیلی'
    });
  }
}