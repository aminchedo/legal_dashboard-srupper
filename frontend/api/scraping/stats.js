// Vercel serverless function for scraping stats API
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

  // Mock scraping stats data
  const scrapingStats = {
    totalSources: 12,
    activeSources: 8,
    recentlyScraped: 45,
    successRate: 94.1,
    failedJobs: 3,
    queuedJobs: 7,
    sources: [
      { name: "majles.ir", status: "active", lastScraped: "2024-01-15T10:30:00Z", documents: 45 },
      { name: "dastour.ir", status: "active", lastScraped: "2024-01-15T09:15:00Z", documents: 38 },
      { name: "ilo.ir", status: "active", lastScraped: "2024-01-15T08:45:00Z", documents: 22 },
      { name: "consumer.ir", status: "inactive", lastScraped: "2024-01-14T15:20:00Z", documents: 15 }
    ]
  };

  res.status(200).json({
    status: "success",
    message: "آمار اسکرپینگ با موفقیت دریافت شد",
    data: scrapingStats,
    timestamp: new Date().toISOString()
  });
}