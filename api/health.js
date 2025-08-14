// Vercel serverless function for health check
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
    // Health check response
    const healthData = {
      status: 'healthy',
      service: 'Legal Dashboard API',
      timestamp: new Date().toISOString(),
      version: '2.1.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      features: {
        persianSupport: true,
        utf8Encoding: true,
        corsEnabled: true,
        apiEndpoints: [
          '/api/health',
          '/api/analytics',
          '/api/documents/search',
          '/api/documents/categories',
          '/api/documents/statistics',
          '/api/documents/tags',
          '/api/scraping/stats'
        ]
      }
    };

    // Return successful response
    return res.status(200).json({
      success: true,
      data: healthData,
      message: 'سیستم در وضعیت سالم است'
    });

  } catch (error) {
    console.error('Health Check Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'خطای سرور در بررسی سلامت سیستم'
    });
  }
}