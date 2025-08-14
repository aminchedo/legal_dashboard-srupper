// Vercel serverless function for document categories
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
    // Persian legal document categories
    const categories = [
      {
        id: 'all',
        name: 'همه',
        nameEn: 'All',
        count: 12450,
        description: 'تمام اسناد حقوقی',
        color: '#3B82F6'
      },
      {
        id: 'civil-law',
        name: 'قانون مدنی',
        nameEn: 'Civil Law',
        count: 3240,
        description: 'قوانین مدنی و حقوق خصوصی',
        color: '#10B981'
      },
      {
        id: 'commercial-law',
        name: 'قانون تجارت',
        nameEn: 'Commercial Law',
        count: 2150,
        description: 'قوانین تجاری و بازرگانی',
        color: '#F59E0B'
      },
      {
        id: 'criminal-law',
        name: 'قانون کیفری',
        nameEn: 'Criminal Law',
        count: 1890,
        description: 'قوانین کیفری و جزایی',
        color: '#EF4444'
      },
      {
        id: 'labor-law',
        name: 'قانون کار',
        nameEn: 'Labor Law',
        count: 1560,
        description: 'قوانین کار و تأمین اجتماعی',
        color: '#8B5CF6'
      },
      {
        id: 'tax-law',
        name: 'قانون مالیاتی',
        nameEn: 'Tax Law',
        count: 980,
        description: 'قوانین مالیاتی و عوارض',
        color: '#06B6D4'
      },
      {
        id: 'family-law',
        name: 'قانون خانواده',
        nameEn: 'Family Law',
        count: 890,
        description: 'قوانین خانواده و ازدواج',
        color: '#EC4899'
      },
      {
        id: 'constitutional-law',
        name: 'قانون اساسی',
        nameEn: 'Constitutional Law',
        count: 450,
        description: 'قوانین اساسی و حقوق اساسی',
        color: '#84CC16'
      },
      {
        id: 'administrative-law',
        name: 'قانون اداری',
        nameEn: 'Administrative Law',
        count: 720,
        description: 'قوانین اداری و استخدامی',
        color: '#F97316'
      },
      {
        id: 'international-law',
        name: 'قانون بین‌الملل',
        nameEn: 'International Law',
        count: 620,
        description: 'قوانین بین‌المللی و معاهدات',
        color: '#6366F1'
      }
    ];

    // Return successful response
    return res.status(200).json({
      success: true,
      data: {
        categories,
        total: categories.length,
        totalDocuments: 12450
      },
      message: 'دسته‌بندی‌ها با موفقیت بارگذاری شدند'
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'خطای سرور در بارگذاری دسته‌بندی‌ها'
    });
  }
}