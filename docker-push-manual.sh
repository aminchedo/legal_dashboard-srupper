#!/bin/bash

# Manual Docker Push Script for Legal Dashboard
# Run this script when Docker is available on your system

set -euo pipefail

: "${DOCKER_USERNAME:?Set DOCKER_USERNAME to your Docker Hub username}"
: "${DOCKER_TOKEN:?Set DOCKER_TOKEN to your Docker Hub access token (PAT)}"

echo "🚀 Starting Docker build and push process..."

# Step 1: Build the Docker image
echo "📦 Building Docker image..."
docker build -t legal-dashboard .

echo "✅ Docker image built successfully!"

# Step 2: Login to Docker Hub
echo "🔐 Logging in to Docker Hub..."
echo "$DOCKER_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin

echo "✅ Successfully logged in to Docker Hub!"

# Step 3: Tag the image for Docker Hub
echo "🏷️  Tagging image for Docker Hub..."
TAG_TS=$(date +%Y%m%d-%H%M%S)
docker tag legal-dashboard "$DOCKER_USERNAME"/legal-dashboard:latest
docker tag legal-dashboard "$DOCKER_USERNAME"/legal-dashboard:"${TAG_TS}"

echo "✅ Images tagged successfully!"

# Step 4: Push to Docker Hub
echo "📤 Pushing images to Docker Hub..."
docker push "$DOCKER_USERNAME"/legal-dashboard:latest
docker push "$DOCKER_USERNAME"/legal-dashboard:"${TAG_TS}"

echo "🎉 SUCCESS! Images pushed to Docker Hub!"
echo ""
echo "📦 Available at:"
echo "   • https://hub.docker.com/r/${DOCKER_USERNAME}/legal-dashboard"
echo "   • docker pull ${DOCKER_USERNAME}/legal-dashboard:latest"
echo ""

# Step 5: Verify the push
echo "🔍 Verifying push..."
docker pull "$DOCKER_USERNAME"/legal-dashboard:latest >/dev/null

echo ""
echo "✅ Docker push process completed successfully!"
echo "Your image is now available at: ${DOCKER_USERNAME}/legal-dashboard:latest"