#!/bin/bash
set -e

echo "🚀 Starting Legal Dashboard Deployment..."

# Build and push
echo "📦 Building and pushing to Docker Hub..."
echo "Ll12345678@" | docker login -u 24498743 --password-stdin

docker build -t legal-dashboard .
docker tag legal-dashboard 24498743/legal-dashboard:latest
docker push 24498743/legal-dashboard:latest

echo "✅ Deployment to Docker Hub completed!"
echo "🌐 Image: 24498743/legal-dashboard:latest"
echo "📝 Next: Configure Azure Web App with provided settings"