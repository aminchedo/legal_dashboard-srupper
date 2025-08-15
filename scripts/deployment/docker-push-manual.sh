#!/bin/bash

# Manual Docker Push Script for Legal Dashboard
# Run this script when Docker is available on your system

echo "🚀 Starting Docker build and push process..."

# Step 1: Build the Docker image
echo "📦 Building Docker image..."
docker build -t legal-dashboard .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed. Please check the Dockerfile and try again."
    exit 1
fi

echo "✅ Docker image built successfully!"

# Step 2: Login to Docker Hub
echo "🔐 Logging in to Docker Hub..."
echo "Ll12345678@" | docker login -u 24498743 --password-stdin

if [ $? -ne 0 ]; then
    echo "❌ Docker Hub login failed. Please check your credentials."
    exit 1
fi

echo "✅ Successfully logged in to Docker Hub!"

# Step 3: Tag the image for Docker Hub
echo "🏷️  Tagging image for Docker Hub..."
docker tag legal-dashboard 24498743/legal-dashboard:latest
docker tag legal-dashboard 24498743/legal-dashboard:$(date +%Y%m%d-%H%M%S)

echo "✅ Images tagged successfully!"

# Step 4: Push to Docker Hub
echo "📤 Pushing images to Docker Hub..."
docker push 24498743/legal-dashboard:latest
docker push 24498743/legal-dashboard:$(date +%Y%m%d-%H%M%S)

if [ $? -ne 0 ]; then
    echo "❌ Docker push failed. Please check your network connection and try again."
    exit 1
fi

echo "🎉 SUCCESS! Images pushed to Docker Hub!"
echo ""
echo "📦 Available at:"
echo "   • https://hub.docker.com/r/24498743/legal-dashboard"
echo "   • docker pull 24498743/legal-dashboard:latest"
echo ""

# Step 5: Verify the push
echo "🔍 Verifying push..."
docker search 24498743/legal-dashboard | head -5

echo ""
echo "✅ Docker push process completed successfully!"
echo "Your image is now available at: 24498743/legal-dashboard:latest"