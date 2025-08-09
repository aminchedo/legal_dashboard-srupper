#!/bin/bash
echo "🎬 Starting Legal Dashboard Demo..."

# Kill ALL processes on specific ports FIRST
echo "🧹 Cleaning up ports..."
sudo lsof -ti:3001 | xargs -r sudo kill -9 2>/dev/null || true
sudo lsof -ti:5173 | xargs -r sudo kill -9 2>/dev/null || true  
sudo lsof -ti:5177 | xargs -r sudo kill -9 2>/dev/null || true
sudo lsof -ti:8080 | xargs -r sudo kill -9 2>/dev/null || true

# Kill by process name
pkill -f "vite" || true
pkill -f "nodemon" || true
pkill -f "node.*3001" || true
pkill -f "node.*server" || true

# Wait for cleanup
sleep 5

# Start backend
if [ -d "backend" ]; then
    echo "🚀 Starting backend..."
    cd backend
    
    # Use node instead of nodemon for CI
    if [ "$CI" = "true" ]; then
        node server.js &
    else
        npm start &
    fi
    
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID"
    cd ..
fi

# Wait for backend
sleep 10

# Start frontend  
if [ -d "frontend" ]; then
    echo "🌐 Starting frontend..."
    cd frontend
    
    # Force specific port
    PORT=5173 npm run dev &
    FRONTEND_PID=$!
    echo "Frontend PID: $FRONTEND_PID"
    cd ..
fi

# Wait for frontend
sleep 15

# Test endpoints - try multiple ports
echo "🧪 Testing endpoints..."

# Test backend
curl -f http://localhost:3001/health -m 5 && echo "✅ Backend health OK" || echo "❌ Backend health failed"

# Test frontend - try both ports
curl -f http://localhost:5173 -m 5 && echo "✅ Frontend 5173 OK" || {
    curl -f http://localhost:5177 -m 5 && echo "✅ Frontend 5177 OK" || echo "❌ Frontend failed"
}

echo "📊 Servers running:"
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:5173 or http://localhost:5177"

# Show process status
echo "📋 Process status:"
ps aux | grep -E "(node|vite)" | grep -v grep || echo "No processes found"

# Keep running
sleep 30

# Cleanup
echo "🧹 Final cleanup..."
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
sudo lsof -ti:3001 | xargs -r sudo kill -9 2>/dev/null || true
sudo lsof -ti:5173,5177 | xargs -r sudo kill -9 2>/dev/null || true

echo "🎬 Demo completed!"