// Vercel serverless function for document search
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
    // Safely decode Persian text parameters
    const { query, category, source, status, dateFrom, dateTo, tags, minScore, maxScore, sortBy, sortOrder, page, limit } = req.query;
    
    // Handle Persian text decoding safely
    const safeDecode = (text) => {
      if (!text) return '';
      try {
        return decodeURIComponent(text);
      } catch (error) {
        console.warn('Failed to decode Persian text:', text);
        return text;
      }
    };

    // Decode Persian parameters
    const decodedQuery = safeDecode(query || '');
    const decodedCategory = safeDecode(category || '');
    const decodedSource = safeDecode(source || '');
    const decodedStatus = safeDecode(status || '');

    // Mock search results for demonstration
    const mockResults = {
      items: [
        {
          id: '1',
          title: 'قانون تجارت الکترونیکی',
          content: 'متن کامل قانون تجارت الکترونیکی جمهوری اسلامی ایران',
          category: 'قانون تجارت',
          source: 'majles.ir',
          status: 'completed',
          score: 0.95,
          tags: ['تجارت', 'الکترونیک', 'قانون'],
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          title: 'آیین‌نامه اجرایی قانون کار',
          content: 'آیین‌نامه اجرایی قانون کار و تأمین اجتماعی',
          category: 'قانون کار',
          source: 'ilo.ir',
          status: 'completed',
          score: 0.88,
          tags: ['کار', 'تأمین اجتماعی', 'آیین‌نامه'],
          createdAt: '2024-01-14T14:20:00Z',
          updatedAt: '2024-01-14T14:20:00Z'
        },
        {
          id: '3',
          title: 'قانون حمایت از حقوق مصرف‌کنندگان',
          content: 'قانون حمایت از حقوق مصرف‌کنندگان و آئین‌نامه‌های مربوطه',
          category: 'حقوق مصرف‌کننده',
          source: 'consumer.ir',
          status: 'processing',
          score: 0.92,
          tags: ['مصرف‌کننده', 'حقوق', 'حمایت'],
          createdAt: '2024-01-13T09:15:00Z',
          updatedAt: '2024-01-13T09:15:00Z'
        }
      ],
      total: 12450,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      filters: {
        query: decodedQuery,
        category: decodedCategory,
        source: decodedSource,
        status: decodedStatus
      }
    };

    // Apply filters if provided
    if (decodedQuery) {
      mockResults.items = mockResults.items.filter(item => 
        item.title.includes(decodedQuery) || 
        item.content.includes(decodedQuery)
      );
    }

    if (decodedCategory) {
      mockResults.items = mockResults.items.filter(item => 
        item.category === decodedCategory
      );
    }

    if (decodedSource) {
      mockResults.items = mockResults.items.filter(item => 
        item.source === decodedSource
      );
    }

    if (decodedStatus) {
      mockResults.items = mockResults.items.filter(item => 
        item.status === decodedStatus
      );
    }

    // Return successful response with Persian text
    return res.status(200).json({
      success: true,
      data: mockResults,
      message: 'جستجو با موفقیت انجام شد'
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'خطای سرور در پردازش درخواست'
    });
  }
}