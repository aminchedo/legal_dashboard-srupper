// =======================================================
// BACKEND: server.js
// PURPOSE: To serve dashboard data via REST API
// =======================================================
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());

// --- MOCK DATA ---
const MOCK_STATS_DATA = {
    totalItems: 47582,
    recentItems: 1843,
    categories: { 'Legal': 12450, 'Economic': 8920, 'Social': 7830, 'Cultural': 6240, 'Technical': 5100 },
    avgRating: 0.891,
    todayStats: { success_rate: 94.1 },
    weeklyTrend: [
        { day: 'Mon', success: 231 }, { day: 'Tue', success: 295 }, { day: 'Wed', success: 374 },
        { day: 'Thu', success: 345 }, { day: 'Fri', success: 396 }, { day: 'Sat', success: 281 }, { day: 'Sun', success: 150 }
    ],
    monthlyGrowth: 18.3
};

const MOCK_ACTIVITY_DATA = {
    items: [
        { id: '1', title: 'Labor Law - 2024 Amendment', domain: 'dastour.ir', status: 'completed' },
        { id: '2', title: 'E-Commerce Regulations Act', domain: 'majles.ir', status: 'completed' },
        { id: '3', title: 'Data Protection Directive', domain: 'president.ir', status: 'processing' },
        { id: '4', title: 'New Import/Export Tariffs', domain: 'customs.ir', status: 'failed' },
        { id: '5', title: 'National Cultural Development Plan', domain: 'farhang.gov.ir', status: 'completed' }
    ]
};

// --- API ENDPOINTS ---
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/dashboard/statistics', (req, res) => {
    console.log('GET /api/dashboard/statistics -> Sending stats data.');
    res.json(MOCK_STATS_DATA);
});

app.get('/api/dashboard/activity', (req, res) => {
    console.log('GET /api/dashboard/activity -> Sending activity data.');
    res.json(MOCK_ACTIVITY_DATA);
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});