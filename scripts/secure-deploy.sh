#!/bin/bash

# Secure Deployment Script with Environment Variable Management
# Usage: ./scripts/secure-deploy.sh [platform]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOCKER_USERNAME="${DOCKER_USERNAME:-24498743}"
IMAGE_NAME="legal-dashboard"
TAG="${TAG:-latest}"
PLATFORM="${1:-docker-hub}"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if required environment variable is set
check_env_var() {
    local var_name=$1
    local var_value=${!var_name}
    
    if [ -z "$var_value" ]; then
        print_error "Required environment variable $var_name is not set"
        print_status "Please set it using: export $var_name='your_value'"
        exit 1
    fi
}

# Function to validate Docker token
validate_docker_token() {
    if [ -z "$DOCKER_TOKEN" ]; then
        print_error "DOCKER_TOKEN environment variable is not set"
        print_status "Please set it using: export DOCKER_TOKEN='your_token'"
        exit 1
    fi
    
    # Test Docker Hub authentication
    print_status "Testing Docker Hub authentication..."
    if echo "$DOCKER_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin > /dev/null 2>&1; then
        print_success "Docker Hub authentication successful"
    else
        print_error "Docker Hub authentication failed"
        exit 1
    fi
}

# Function to build and push Docker image
build_and_push() {
    print_status "Building Docker image..."
    docker build -t "$IMAGE_NAME:$TAG" .
    
    print_status "Tagging image for Docker Hub..."
    docker tag "$IMAGE_NAME:$TAG" "$DOCKER_USERNAME/$IMAGE_NAME:$TAG"
    
    print_status "Pushing image to Docker Hub..."
    docker push "$DOCKER_USERNAME/$IMAGE_NAME:$TAG"
    
    print_success "Docker image successfully pushed to Docker Hub!"
    print_status "Image: $DOCKER_USERNAME/$IMAGE_NAME:$TAG"
}

# Function to deploy to DigitalOcean
deploy_digitalocean() {
    check_env_var "DIGITALOCEAN_ACCESS_TOKEN"
    
    print_status "Deploying to DigitalOcean App Platform..."
    
    # Create app specification
    cat > /tmp/do-app.yaml << EOF
name: legal-dashboard
services:
  - name: legal-dashboard
    source_dir: /
    dockerfile_path: Dockerfile
    environment_slug: docker
    instance_count: 1
    instance_size_slug: basic-xxs
    health_check:
      http_path: /health
    envs:
      - key: ENVIRONMENT
        value: production
      - key: DEBUG
        value: "false"
      - key: PYTHONUNBUFFERED
        value: "1"
      - key: PYTHONDONTWRITEBYTECODE
        value: "1"
      - key: PORT
        value: "8000"
EOF
    
    # Deploy using DigitalOcean CLI or API
    if command -v doctl &> /dev/null; then
        doctl apps create --spec /tmp/do-app.yaml
        print_success "Deployed to DigitalOcean using doctl"
    else
        print_warning "doctl not found, please deploy manually using the DigitalOcean console"
        print_status "Use the app specification in /tmp/do-app.yaml"
    fi
}

# Function to deploy to Railway
deploy_railway() {
    check_env_var "RAILWAY_TOKEN"
    
    print_status "Deploying to Railway..."
    
    # Set Railway token
    export RAILWAY_TOKEN="$RAILWAY_TOKEN"
    
    # Deploy using Railway CLI
    if command -v railway &> /dev/null; then
        railway login
        railway up
        print_success "Deployed to Railway"
    else
        print_warning "Railway CLI not found, please install it first"
        print_status "Install with: npm install -g @railway/cli"
    fi
}

# Function to deploy to Render
deploy_render() {
    check_env_var "RENDER_API_KEY"
    check_env_var "RENDER_SERVICE_ID"
    
    print_status "Deploying to Render..."
    
    # Trigger deployment via Render API
    curl -X POST "https://api.render.com/v1/services/$RENDER_SERVICE_ID/deploys" \
        -H "Authorization: Bearer $RENDER_API_KEY" \
        -H "Content-Type: application/json" \
        -d "{\"image\": \"$DOCKER_USERNAME/$IMAGE_NAME:$TAG\"}"
    
    print_success "Deployment triggered on Render"
}

# Function to deploy to Fly.io
deploy_fly_io() {
    check_env_var "FLY_API_TOKEN"
    
    print_status "Deploying to Fly.io..."
    
    # Authenticate with Fly.io
    echo "$FLY_API_TOKEN" | flyctl auth login
    
    # Deploy
    flyctl deploy --image "$DOCKER_USERNAME/$IMAGE_NAME:$TAG"
    
    print_success "Deployed to Fly.io"
}

# Function to deploy to Google Cloud Run
deploy_gcp() {
    check_env_var "GCP_SA_KEY"
    check_env_var "GCP_PROJECT_ID"
    check_env_var "GCP_REGION"
    
    print_status "Deploying to Google Cloud Run..."
    
    # Setup Google Cloud authentication
    echo "$GCP_SA_KEY" > /tmp/gcp-key.json
    export GOOGLE_APPLICATION_CREDENTIALS="/tmp/gcp-key.json"
    
    # Deploy to Cloud Run
    gcloud run deploy legal-dashboard \
        --image "$DOCKER_USERNAME/$IMAGE_NAME:$TAG" \
        --platform managed \
        --region "$GCP_REGION" \
        --allow-unauthenticated \
        --project "$GCP_PROJECT_ID"
    
    # Cleanup
    rm -f /tmp/gcp-key.json
    
    print_success "Deployed to Google Cloud Run"
}

# Main deployment logic
main() {
    print_status "Starting secure deployment to $PLATFORM..."
    
    # Validate Docker token for all deployments
    validate_docker_token
    
    # Build and push Docker image first
    build_and_push
    
    # Deploy to specific platform
    case $PLATFORM in
        "docker-hub")
            print_success "Image already pushed to Docker Hub"
            ;;
        "digitalocean")
            deploy_digitalocean
            ;;
        "railway")
            deploy_railway
            ;;
        "render")
            deploy_render
            ;;
        "fly-io")
            deploy_fly_io
            ;;
        "google-cloud-run"|"gcp")
            deploy_gcp
            ;;
        *)
            print_error "Unknown platform: $PLATFORM"
            print_status "Supported platforms: docker-hub, digitalocean, railway, render, fly-io, google-cloud-run"
            exit 1
            ;;
    esac
    
    print_success "Deployment completed successfully!"
    
    # Logout from Docker Hub
    docker logout > /dev/null 2>&1 || true
}

# Run main function
main "$@"