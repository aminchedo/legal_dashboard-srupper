// Vercel serverless function for analytics API
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

  // Mock analytics data
  const analyticsData = {
    total_documents: 12450,
    total_categories: 15,
    total_sources: 8,
    recent_uploads: 234,
    processing_jobs: 12,
    completed_jobs: 89,
    failed_jobs: 3,
    success_rate: 96.7,
    categories: [
      { name: "قراردادها", count: 45, percentage: 30.0 },
      { name: "آراء قضایی", count: 62, percentage: 41.3 },
      { name: "قوانین", count: 43, percentage: 28.7 }
    ],
    trends: [
      { date: "2024-01-01", documents: 120, growth: 5.2 },
      { date: "2024-01-02", documents: 135, growth: 12.5 },
      { date: "2024-01-03", documents: 142, growth: 5.2 },
      { date: "2024-01-04", documents: 158, growth: 11.3 },
      { date: "2024-01-05", documents: 168, growth: 6.3 }
    ],
    sources: [
      { name: "majles.ir", count: 45, status: "active" },
      { name: "dastour.ir", count: 38, status: "active" },
      { name: "ilo.ir", count: 22, status: "active" },
      { name: "consumer.ir", count: 15, status: "inactive" }
    ]
  };

  res.status(200).json({
    status: "success",
    message: "آمار کلی با موفقیت دریافت شد",
    data: analyticsData,
    timestamp: new Date().toISOString()
  });
}