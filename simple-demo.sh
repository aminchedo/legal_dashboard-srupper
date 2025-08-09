#!/bin/bash
echo "🎬 Starting Legal Dashboard Live Demo..."

# Clean up
echo "🧹 Cleaning up old processes..."
pkill -f "node\|vite" || true
lsof -ti:3001,5173,5177 | xargs kill 2>/dev/null || true
sleep 3

# Start backend
echo "🚀 Starting backend server..."
cd backend
node server.js &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
cd ..
sleep 8

# Test backend
echo "🧪 Testing backend..."
curl -s http://localhost:3001/health && echo " ✅ Backend OK" || echo " ❌ Backend failed"

# Start frontend
echo "🌐 Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
cd ..
sleep 15

# Test frontend
echo "🧪 Testing frontend..."
curl -s -I http://localhost:5173 && echo " ✅ Frontend OK" || echo " ❌ Frontend failed"

echo ""
echo "🎊 LEGAL DASHBOARD IS NOW LIVE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Dashboard URL: http://localhost:5173"
echo "📊 Backend API:   http://localhost:3001"
echo "🎬 Live Viewer:   Open live-dashboard-viewer.html"
echo ""
echo "💡 Next steps:"
echo "   1. Open live-dashboard-viewer.html in your browser"
echo "   2. Click 'Local Dashboard' to see your legal dashboard"
echo "   3. Test all features and functionality!"
echo ""
echo "⏱️ Demo will run for 5 minutes..."

# Keep alive for 5 minutes
for i in {1..30}; do
    echo "🔄 Demo running... ${i}/30 (10 seconds each)"
    sleep 10
done

echo ""
echo "🧹 Cleaning up..."
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
echo "🎬 Demo completed!"