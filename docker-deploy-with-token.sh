#!/bin/bash

# Docker deployment script with token authentication
# Usage: ./docker-deploy-with-token.sh

set -euo pipefail

# Configuration
: "${DOCKER_TOKEN:?Set DOCKER_TOKEN to your Docker Hub access token (PAT)}"
: "${DOCKER_USERNAME:?Set DOCKER_USERNAME to your Docker Hub username}"
IMAGE_NAME="legal-dashboard"
TAG="latest"
REGISTRY="registry-1.docker.io"

echo "🚀 Starting Docker deployment with token authentication..."

# Login to Docker Hub using token
echo "🔐 Authenticating with Docker Hub..."
echo "$DOCKER_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin

# Build the Docker image
echo "🔨 Building Docker image..."
docker build -t "$IMAGE_NAME:$TAG" .

# Tag the image for Docker Hub
echo "🏷️  Tagging image for Docker Hub..."
docker tag "$IMAGE_NAME:$TAG" "$DOCKER_USERNAME/$IMAGE_NAME:$TAG"

# Push to Docker Hub
echo "📤 Pushing image to Docker Hub..."
docker push "$DOCKER_USERNAME/$IMAGE_NAME:$TAG"

echo "✅ Docker image successfully deployed to Docker Hub!"
echo "📋 Image: $DOCKER_USERNAME/$IMAGE_NAME:$TAG"

# Optional: Deploy to a container platform
echo ""
echo "🌐 To deploy this container, you can use:"
echo "   - DigitalOcean App Platform"
echo "   - Google Cloud Run"
echo "   - AWS ECS/Fargate"
echo "   - Azure Container Instances"
echo "   - Railway"
echo "   - Render"
echo "   - Fly.io"

# Logout from Docker Hub
echo "🔓 Logging out from Docker Hub..."
docker logout

echo "🎉 Deployment script completed!"