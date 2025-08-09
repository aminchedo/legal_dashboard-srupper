#!/bin/bash
echo "🎬 Simple Demo Start"

# Clean ports
sudo lsof -ti:3001,5173,5177 | xargs -r sudo kill -9 || true
sleep 2

# Start backend
if [ -d "backend" ]; then
    cd backend && node server.js &
    cd ..
    sleep 8
fi

# Start frontend  
if [ -d "frontend" ]; then
    cd frontend && PORT=5173 npm run dev &
    cd ..
    sleep 12
fi

echo "✅ Servers started"
sleep 20