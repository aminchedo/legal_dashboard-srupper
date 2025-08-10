#!/bin/bash

# Legal Dashboard Production Deployment Script
# Usage: ./docker-deploy.sh [local|production]

set -e

DOCKER_USERNAME="24498743"
IMAGE_NAME="legal-dashboard"
CONTAINER_NAME="legal-dashboard"
DEPLOYMENT_MODE=${1:-production}

echo "🚀 Starting Legal Dashboard deployment in $DEPLOYMENT_MODE mode..."

# Function to check if container exists
container_exists() {
    docker ps -a --format "table {{.Names}}" | grep -q "^$1$"
}

# Function to check if container is running
container_running() {
    docker ps --format "table {{.Names}}" | grep -q "^$1$"
}

# Stop and remove existing container if it exists
if container_exists "$CONTAINER_NAME"; then
    echo "📦 Stopping existing container: $CONTAINER_NAME"
    docker stop "$CONTAINER_NAME" || true
    echo "🗑️  Removing existing container: $CONTAINER_NAME"
    docker rm "$CONTAINER_NAME" || true
fi

# Pull latest image from Docker Hub
echo "⬇️  Pulling latest image from Docker Hub..."
docker pull "$DOCKER_USERNAME/$IMAGE_NAME:latest"

# Deploy based on mode
if [ "$DEPLOYMENT_MODE" = "local" ]; then
    echo "🏠 Deploying in LOCAL mode..."
    docker run -d \
        --name "$CONTAINER_NAME" \
        -p 8000:8000 \
        --restart unless-stopped \
        -e ENVIRONMENT=development \
        -e DEBUG=true \
        "$DOCKER_USERNAME/$IMAGE_NAME:latest"
    
    echo "✅ Local deployment completed!"
    echo "🌐 Application URL: http://localhost:8000"
    
elif [ "$DEPLOYMENT_MODE" = "production" ]; then
    echo "🏭 Deploying in PRODUCTION mode..."
    docker run -d \
        --name "$CONTAINER_NAME-prod" \
        -p 80:8000 \
        --restart unless-stopped \
        -e ENVIRONMENT=production \
        -e DEBUG=false \
        --memory="512m" \
        --cpus="1.0" \
        --health-cmd="curl -f http://localhost:8000/health || exit 1" \
        --health-interval=30s \
        --health-timeout=10s \
        --health-retries=3 \
        "$DOCKER_USERNAME/$IMAGE_NAME:latest"
    
    echo "✅ Production deployment completed!"
    echo "🌐 Application URL: http://localhost"
    CONTAINER_NAME="$CONTAINER_NAME-prod"
    
else
    echo "❌ Invalid deployment mode. Use 'local' or 'production'"
    exit 1
fi

# Wait for container to start
echo "⏳ Waiting for container to start..."
sleep 5

# Check container status
if container_running "$CONTAINER_NAME"; then
    echo "✅ Container is running successfully!"
    
    # Show container info
    echo ""
    echo "📊 Container Status:"
    docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    # Show container logs (last 10 lines)
    echo ""
    echo "📝 Recent Logs:"
    docker logs --tail 10 "$CONTAINER_NAME"
    
    # Test health endpoint
    echo ""
    echo "🔍 Health Check:"
    if [ "$DEPLOYMENT_MODE" = "production" ]; then
        curl -f http://localhost/health 2>/dev/null || echo "Health check failed"
    else
        curl -f http://localhost:8000/health 2>/dev/null || echo "Health check failed"
    fi
    
else
    echo "❌ Container failed to start!"
    echo "📝 Container logs:"
    docker logs "$CONTAINER_NAME"
    exit 1
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo "📋 Useful commands:"
echo "   View logs:      docker logs -f $CONTAINER_NAME"
echo "   Stop container: docker stop $CONTAINER_NAME"
echo "   Restart:        docker restart $CONTAINER_NAME"
echo "   Remove:         docker rm -f $CONTAINER_NAME"