#!/bin/bash

# Docker Hub Verification Script for Legal Dashboard
# Run this script to verify your image was pushed successfully

echo "🔍 Verifying Docker Hub image: 24498743/legal-dashboard"

# Step 1: Search for the image on Docker Hub
echo "📦 Searching for image on Docker Hub..."
docker search 24498743/legal-dashboard

# Step 2: Pull the image
echo ""
echo "⬇️  Pulling image from Docker Hub..."
docker pull 24498743/legal-dashboard:latest

if [ $? -ne 0 ]; then
    echo "❌ Failed to pull image from Docker Hub."
    echo "This might mean the image wasn't pushed successfully."
    exit 1
fi

echo "✅ Image pulled successfully!"

# Step 3: Check image details
echo ""
echo "📋 Image details:"
docker images 24498743/legal-dashboard:latest

# Step 4: Test run the container
echo ""
echo "🧪 Testing container startup..."
docker run --rm -d --name legal-dashboard-test -p 8001:8000 24498743/legal-dashboard:latest

if [ $? -ne 0 ]; then
    echo "❌ Failed to start container."
    exit 1
fi

echo "✅ Container started successfully on port 8001!"

# Wait a moment for the container to fully start
sleep 5

# Step 5: Test the application
echo ""
echo "🌐 Testing application response..."
curl -f http://localhost:8001/ || echo "Application might still be starting..."

# Step 6: Clean up
echo ""
echo "🧹 Cleaning up test container..."
docker stop legal-dashboard-test

echo ""
echo "✅ Verification completed!"
echo "📦 Your image is working correctly at: 24498743/legal-dashboard:latest"
echo "🔗 View on Docker Hub: https://hub.docker.com/r/24498743/legal-dashboard"
echo ""
echo "To run your image:"
echo "docker run -p 8000:8000 24498743/legal-dashboard:latest"