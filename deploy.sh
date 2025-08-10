#!/bin/bash
set -e

echo "🚀 Starting Legal Dashboard Deployment..."

# Build and push
echo "📦 Building and pushing to Docker Hub..."
echo "Ll12345678@" | docker login -u 24498743 --password-stdin

TAG_TS=$(date +%Y%m%d_%H%M%S)

docker build -t legal-dashboard .
docker tag legal-dashboard 24498743/legal-dashboard:latest
docker tag legal-dashboard 24498743/legal-dashboard:${TAG_TS}

docker push 24498743/legal-dashboard:latest
docker push 24498743/legal-dashboard:${TAG_TS}

echo "✅ Deployment to Docker Hub completed!"
echo "🌐 Image: 24498743/legal-dashboard:latest"
echo "🌐 Image (timestamp): 24498743/legal-dashboard:${TAG_TS}"
echo "📝 Next: Configure Azure Web App with provided settings"