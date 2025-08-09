#!/bin/bash
echo "🎬 Starting Legal Dashboard..."

# Clean up
pkill -f "node\|vite" || true
sleep 2

# Start backend
echo "🚀 Starting backend..."
cd backend
node server.js &
BACKEND_PID=$!
cd ..
sleep 8

# Start frontend
echo "🌐 Starting frontend..."
cd frontend  
npm run dev &
FRONTEND_PID=$!
cd ..
sleep 15

# Test and show results
echo "📊 Testing dashboard..."
echo "Backend health:" 
curl http://localhost:3001/health

echo -e "\n🌐 Frontend response:"
curl -I http://localhost:5173

echo -e "\n📄 Saving dashboard HTML..."
curl http://localhost:5173 > my-dashboard.html

echo -e "\n✅ Dashboard saved to my-dashboard.html"
echo "📁 Open this file in your browser to see your dashboard!"

# Cleanup
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null