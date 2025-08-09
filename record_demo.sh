#!/bin/bash
echo "🎬 Starting Legal Dashboard Demo..."

# Kill existing processes
pkill -f "vite" || true
pkill -f "node.*3001" || true
sleep 2

# Start backend
if [ -d "backend" ]; then
    echo "🚀 Starting backend..."
    cd backend
    npm start &
    BACKEND_PID=$!
    cd ..
fi

sleep 8

# Start frontend
if [ -d "frontend" ]; then
    echo "🌐 Starting frontend..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
fi

sleep 15

# Test endpoints
echo "🧪 Testing..."
curl -f http://localhost:3001/health || echo "Backend failed"
curl -f http://localhost:5173 || echo "Frontend failed"

echo "✅ Demo running!"
sleep 30

# Cleanup
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true