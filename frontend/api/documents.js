// Vercel serverless function for documents API
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Parse query parameters
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const query = searchParams.get('query') || '';
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 25;

  // Mock documents data
  const mockDocuments = {
    items: [
      {
        id: "1",
        title: "قانون کار - اصلاحیه ۱۴۰۳",
        domain: "dastour.ir",
        status: "completed",
        category: "حقوقی",
        created_at: "2024-01-15T10:30:00Z"
      },
      {
        id: "2", 
        title: "آیین‌نامه تجارت الکترونیک",
        domain: "majles.ir",
        status: "completed",
        category: "اقتصادی",
        created_at: "2024-01-14T15:45:00Z"
      },
      {
        id: "3",
        title: "قانون حفاظت از داده‌ها",
        domain: "president.ir",
        status: "processing",
        category: "فنی",
        created_at: "2024-01-14T12:20:00Z"
      }
    ],
    total: 12450,
    page: page,
    limit: limit,
    total_pages: Math.ceil(12450 / limit)
  };

  res.status(200).json(mockDocuments);
}