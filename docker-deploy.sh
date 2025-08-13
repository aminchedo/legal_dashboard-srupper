#!/bin/bash
# Legal Dashboard Production Deployment Script
# Usage: ./docker-deploy.sh [local|production] [--pull-latest]
set -e

# Configuration
DOCKER_USERNAME="${DOCKER_USERNAME:-}"
DOCKER_TOKEN="${DOCKER_TOKEN:-}"
IMAGE_NAME="legal-dashboard"
BASE_CONTAINER_NAME="legal-dashboard"
DEPLOYMENT_MODE=${1:-production}
PULL_LATEST=${2:-"--pull-latest"}

if [ -z "$DOCKER_USERNAME" ] || [ -z "$DOCKER_TOKEN" ]; then
  echo "❌ Missing Docker credentials. Set DOCKER_USERNAME and DOCKER_TOKEN environment variables."
  exit 1
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Legal Dashboard deployment in $DEPLOYMENT_MODE mode...${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Function to check if container exists
container_exists() {
    docker ps -a --format "{{.Names}}" | grep -wq "$1"
}

# Function to check if container is running
container_running() {
    docker ps --format "{{.Names}}" | grep -wq "$1"
}

# Function to check if port is available
port_available() {
    ! lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1
}

# Function to create data directory
create_data_directory() {
    local data_dir="./data/$DEPLOYMENT_MODE"
    if [ ! -d "$data_dir" ]; then
        print_info "Creating data directory: $data_dir"
        mkdir -p "$data_dir"
        chmod 755 "$data_dir"
    fi
    echo "$data_dir"
}

# Set container name and configuration based on mode
if [ "$DEPLOYMENT_MODE" = "production" ]; then
    CONTAINER_NAME="${BASE_CONTAINER_NAME}-prod"
    APP_PORT=80
    CONTAINER_PORT=8000
    ENV_ENVIRONMENT="production"
    ENV_DEBUG="false"
    MEMORY_LIMIT="1g"
    CPU_LIMIT="1.5"
elif [ "$DEPLOYMENT_MODE" = "local" ]; then
    CONTAINER_NAME="$BASE_CONTAINER_NAME"
    APP_PORT=8000
    CONTAINER_PORT=8000
    ENV_ENVIRONMENT="development"
    ENV_DEBUG="true"
    MEMORY_LIMIT="512m"
    CPU_LIMIT="1.0"
else
    print_error "Invalid deployment mode. Use 'local' or 'production'"
    exit 1
fi

# Check if port is available
if ! port_available $APP_PORT; then
    print_warning "Port $APP_PORT is already in use. Checking if it's our container..."
    if container_running "$CONTAINER_NAME"; then
        print_info "Our container is already running on port $APP_PORT"
    else
        print_error "Port $APP_PORT is occupied by another service"
        exit 1
    fi
fi

# Create data directory for persistence
DATA_DIR=$(create_data_directory)

# Stop and remove existing container if it exists
if container_exists "$CONTAINER_NAME"; then
    print_info "Stopping existing container: $CONTAINER_NAME"
    docker stop "$CONTAINER_NAME" || true
    print_info "Removing existing container: $CONTAINER_NAME"
    docker rm "$CONTAINER_NAME" || true
fi

# Pull latest image if requested
if [ "$PULL_LATEST" = "--pull-latest" ]; then
    print_info "Pulling latest image from Docker Hub..."
    
    # Login to Docker Hub (in case of private repos in future)
    echo "$DOCKER_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin >/dev/null 2>&1
    
    if docker pull "$DOCKER_USERNAME/$IMAGE_NAME:latest"; then
        print_status "Successfully pulled latest image"
    else
        print_error "Failed to pull latest image"
        exit 1
    fi
    
    # Logout for security
    docker logout >/dev/null 2>&1
else
    print_info "Skipping image pull (using local image)"
fi

# Create Docker network if it doesn't exist
NETWORK_NAME="legal-dashboard-network"
if ! docker network ls | grep -q "$NETWORK_NAME"; then
    print_info "Creating Docker network: $NETWORK_NAME"
    docker network create "$NETWORK_NAME" >/dev/null 2>&1
fi

# Deploy container
print_info "Deploying in $DEPLOYMENT_MODE mode..."

# Common Docker run parameters
DOCKER_COMMON_PARAMS="
    --name $CONTAINER_NAME
    --network $NETWORK_NAME
    -p $APP_PORT:$CONTAINER_PORT
    --restart unless-stopped
    -e ENVIRONMENT=$ENV_ENVIRONMENT
    -e DEBUG=$ENV_DEBUG
    -e TZ=UTC
    --memory=$MEMORY_LIMIT
    --cpus=$CPU_LIMIT
    --health-cmd=\"curl -f http://localhost:$CONTAINER_PORT/health || curl -f http://localhost:$CONTAINER_PORT/ || exit 1\"
    --health-interval=30s
    --health-timeout=10s
    --health-retries=3
    --health-start-period=15s
    -v $DATA_DIR:/app/data
    -v /var/log/legal-dashboard-$DEPLOYMENT_MODE:/app/logs
"

# Production-specific settings
if [ "$DEPLOYMENT_MODE" = "production" ]; then
    DOCKER_PROD_PARAMS="
        --read-only
        --tmpfs /tmp
        --tmpfs /var/tmp
        --security-opt=no-new-privileges:true
        --cap-drop=ALL
        --cap-add=NET_BIND_SERVICE
    "
    DOCKER_PARAMS="$DOCKER_COMMON_PARAMS $DOCKER_PROD_PARAMS"
else
    DOCKER_PARAMS="$DOCKER_COMMON_PARAMS"
fi

# Run the container
if docker run -d $DOCKER_PARAMS "$DOCKER_USERNAME/$IMAGE_NAME:latest"; then
    print_status "$DEPLOYMENT_MODE deployment initiated!"
else
    print_error "Failed to start container"
    exit 1
fi

# Wait for container to start
print_info "Waiting for container to start..."
sleep 10

# Check container status
if container_running "$CONTAINER_NAME"; then
    print_status "Container is running successfully!"
    
    # Show container info
    echo ""
    print_info "Container Status:"
    docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}"
    
    # Wait for health check
    print_info "Waiting for health check to pass..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        health_status=$(docker inspect --format='{{.State.Health.Status}}' "$CONTAINER_NAME" 2>/dev/null || echo "unknown")
        if [ "$health_status" = "healthy" ]; then
            print_status "Health check passed!"
            break
        else
            echo "Waiting for health check... ($timeout seconds remaining)"
            sleep 5
            timeout=$((timeout-5))
        fi
    done
else
    print_error "Container failed to start. Check logs with: docker logs $CONTAINER_NAME"
    exit 1
fi

# Display logs tail
print_info "Recent container logs:"
docker logs --tail 50 "$CONTAINER_NAME" || true

print_status "Deployment completed successfully!"