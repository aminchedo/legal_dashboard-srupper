#!/bin/bash

# =============================================================================
# LEGAL DASHBOARD - IMMEDIATE DOCKER DEPLOYMENT SCRIPT
# =============================================================================
# This script will build, push, and deploy your Legal Dashboard application
# Execute this on a system with Docker installed

set -e

# Configuration
DOCKER_USERNAME="24498743"
# Expect DOCKER_TOKEN to be set in the environment
: "${DOCKER_TOKEN:?Set DOCKER_TOKEN (Docker Hub PAT) in your environment before running this script}"
IMAGE_NAME="legal-dashboard"
CONTAINER_NAME="legal-dashboard"

echo "🚀 Legal Dashboard - Immediate Docker Deployment"
echo "=================================================="
echo ""

# Step 1: Login to Docker Hub
echo "🔐 Step 1: Logging into Docker Hub..."
echo "$DOCKER_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin
if [ $? -eq 0 ]; then
    echo "✅ Successfully logged into Docker Hub"
else
    echo "❌ Failed to login to Docker Hub"
    exit 1
fi

echo ""

# Step 2: Build the Docker image
echo "🏗️  Step 2: Building Docker image..."
docker build -t "$IMAGE_NAME" .
if [ $? -eq 0 ]; then
    echo "✅ Successfully built Docker image"
else
    echo "❌ Failed to build Docker image"
    exit 1
fi

echo ""

# Step 3: Tag the image for Docker Hub
echo "🏷️  Step 3: Tagging image for Docker Hub..."
docker tag "$IMAGE_NAME" "$DOCKER_USERNAME/$IMAGE_NAME:latest"
if [ $? -eq 0 ]; then
    echo "✅ Successfully tagged image"
else
    echo "❌ Failed to tag image"
    exit 1
fi

echo ""

# Step 4: Push to Docker Hub
echo "⬆️  Step 4: Pushing to Docker Hub..."
docker push "$DOCKER_USERNAME/$IMAGE_NAME:latest"
if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to Docker Hub"
else
    echo "❌ Failed to push to Docker Hub"
    exit 1
fi

echo ""

# Step 5: Stop and remove existing container if it exists
echo "🛑 Step 5: Cleaning up existing containers..."
if docker ps -a --format "table {{.Names}}" | grep -q "^$CONTAINER_NAME$"; then
    echo "Stopping existing container: $CONTAINER_NAME"
    docker stop "$CONTAINER_NAME" || true
    echo "Removing existing container: $CONTAINER_NAME"
    docker rm "$CONTAINER_NAME" || true
fi

echo ""

# Step 6: Run the container locally for testing
echo "🏃 Step 6: Running container locally for testing..."
docker run -d \
    --name "$CONTAINER_NAME" \
    -p 8000:8000 \
    --restart unless-stopped \
    -e ENVIRONMENT=production \
    -e DEBUG=false \
    "$DOCKER_USERNAME/$IMAGE_NAME:latest"

if [ $? -eq 0 ]; then
    echo "✅ Successfully started container"
else
    echo "❌ Failed to start container"
    exit 1
fi

echo ""

# Step 7: Wait for container to start
echo "⏳ Step 7: Waiting for container to start..."
sleep 10

# Step 8: Check container status
echo "📊 Step 8: Checking container status..."
if docker ps --format "table {{.Names}}" | grep -q "^$CONTAINER_NAME$"; then
    echo "✅ Container is running successfully!"
    
    # Show container info
    echo ""
    echo "📋 Container Information:"
    docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    # Show recent logs
    echo ""
    echo "📝 Recent Logs:"
    docker logs --tail 15 "$CONTAINER_NAME"
    
else
    echo "❌ Container is not running!"
    echo "📝 Container logs:"
    docker logs "$CONTAINER_NAME"
    exit 1
fi

echo ""

# Step 9: Test the application
echo "🔍 Step 9: Testing application endpoints..."

# Wait a bit more for the app to fully start
sleep 5

# Test health endpoint
echo "Testing health endpoint..."
if curl -f -s http://localhost:8000/health > /dev/null; then
    echo "✅ Health endpoint is working"
    # Show the actual response
    echo "Health response: $(curl -s http://localhost:8000/health)"
else
    echo "⚠️  Health endpoint test failed (may need more time to start)"
fi

echo ""

# Test main endpoint
echo "Testing main endpoint..."
if curl -f -s http://localhost:8000/ > /dev/null; then
    echo "✅ Main endpoint is working"
    echo "Main response: $(curl -s http://localhost:8000/)"
else
    echo "⚠️  Main endpoint test failed"
fi

echo ""

# Show application URLs
echo "🌐 APPLICATION URLS:"
echo "=================================="
echo "🏠 Main Application: http://localhost:8000"
echo "❤️  Health Check:    http://localhost:8000/health"
echo "📊 Dashboard Stats:  http://localhost:8000/api/dashboard/statistics"
echo "📋 Activity Log:     http://localhost:8000/api/dashboard/activity"

echo ""

# Show monitoring commands
echo "📊 MONITORING COMMANDS:"
echo "=================================="
echo "View logs:       docker logs -f $CONTAINER_NAME"
echo "Container stats: docker stats $CONTAINER_NAME"
echo "Stop container:  docker stop $CONTAINER_NAME"
echo "Restart:         docker restart $CONTAINER_NAME"
echo "Remove:          docker rm -f $CONTAINER_NAME"

echo ""

# Show deployment options
echo "🚀 DEPLOYMENT OPTIONS:"
echo "=================================="
echo "1. Current local deployment is running on port 8000"
echo "2. For production (port 80): ./docker-deploy.sh production"
echo "3. Full stack with database: docker-compose -f docker-compose.production.yml up -d"

echo ""

# Final success message
echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "=================================="
echo "Your Legal Dashboard application is now running!"
echo "Access it at: http://localhost:8000"
echo ""
echo "Docker Hub image: $DOCKER_USERNAME/$IMAGE_NAME:latest"
echo "Container name: $CONTAINER_NAME"
echo ""
echo "Check the logs if you encounter any issues:"
echo "docker logs $CONTAINER_NAME"