// Vercel serverless function for document tags
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
    // Persian legal document tags
    const tags = [
      {
        id: 'law',
        name: 'قانون',
        nameEn: 'Law',
        count: 8560,
        color: '#3B82F6',
        category: 'general'
      },
      {
        id: 'civil',
        name: 'مدنی',
        nameEn: 'Civil',
        count: 3240,
        color: '#10B981',
        category: 'civil-law'
      },
      {
        id: 'commercial',
        name: 'تجاری',
        nameEn: 'Commercial',
        count: 2150,
        color: '#F59E0B',
        category: 'commercial-law'
      },
      {
        id: 'criminal',
        name: 'کیفری',
        nameEn: 'Criminal',
        count: 1890,
        color: '#EF4444',
        category: 'criminal-law'
      },
      {
        id: 'labor',
        name: 'کار',
        nameEn: 'Labor',
        count: 1560,
        color: '#8B5CF6',
        category: 'labor-law'
      },
      {
        id: 'tax',
        name: 'مالیاتی',
        nameEn: 'Tax',
        count: 980,
        color: '#06B6D4',
        category: 'tax-law'
      },
      {
        id: 'family',
        name: 'خانواده',
        nameEn: 'Family',
        count: 890,
        color: '#EC4899',
        category: 'family-law'
      },
      {
        id: 'constitutional',
        name: 'اساسی',
        nameEn: 'Constitutional',
        count: 450,
        color: '#84CC16',
        category: 'constitutional-law'
      },
      {
        id: 'administrative',
        name: 'اداری',
        nameEn: 'Administrative',
        count: 720,
        color: '#F97316',
        category: 'administrative-law'
      },
      {
        id: 'international',
        name: 'بین‌الملل',
        nameEn: 'International',
        count: 620,
        color: '#6366F1',
        category: 'international-law'
      },
      {
        id: 'contract',
        name: 'قرارداد',
        nameEn: 'Contract',
        count: 2340,
        color: '#059669',
        category: 'civil-law'
      },
      {
        id: 'property',
        name: 'اموال',
        nameEn: 'Property',
        count: 1890,
        color: '#DC2626',
        category: 'civil-law'
      },
      {
        id: 'inheritance',
        name: 'ارث',
        nameEn: 'Inheritance',
        count: 760,
        color: '#7C3AED',
        category: 'family-law'
      },
      {
        id: 'marriage',
        name: 'ازدواج',
        nameEn: 'Marriage',
        count: 540,
        color: '#DB2777',
        category: 'family-law'
      },
      {
        id: 'divorce',
        name: 'طلاق',
        nameEn: 'Divorce',
        count: 320,
        color: '#BE185D',
        category: 'family-law'
      },
      {
        id: 'employment',
        name: 'اشتغال',
        nameEn: 'Employment',
        count: 1280,
        color: '#A855F7',
        category: 'labor-law'
      },
      {
        id: 'social-security',
        name: 'تأمین اجتماعی',
        nameEn: 'Social Security',
        count: 980,
        color: '#8B5CF6',
        category: 'labor-law'
      },
      {
        id: 'customs',
        name: 'گمرک',
        nameEn: 'Customs',
        count: 890,
        color: '#0891B2',
        category: 'commercial-law'
      },
      {
        id: 'import-export',
        name: 'صادرات و واردات',
        nameEn: 'Import/Export',
        count: 670,
        color: '#0D9488',
        category: 'commercial-law'
      },
      {
        id: 'consumer-rights',
        name: 'حقوق مصرف‌کننده',
        nameEn: 'Consumer Rights',
        count: 450,
        color: '#EA580C',
        category: 'consumer-law'
      }
    ];

    // Group tags by category
    const tagsByCategory = tags.reduce((acc, tag) => {
      if (!acc[tag.category]) {
        acc[tag.category] = [];
      }
      acc[tag.category].push(tag);
      return acc;
    }, {});

    // Return successful response
    return res.status(200).json({
      success: true,
      data: {
        tags,
        tagsByCategory,
        total: tags.length,
        totalDocuments: 12450
      },
      message: 'برچسب‌ها با موفقیت بارگذاری شدند'
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'خطای سرور در بارگذاری برچسب‌ها'
    });
  }
}