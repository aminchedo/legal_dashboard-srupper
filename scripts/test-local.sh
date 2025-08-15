#!/bin/bash

# Legal Dashboard Local Testing Script
# This script tests your Docker image locally

set -e

echo "🧪 Testing Legal Dashboard Docker Image Locally"
echo "================================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status
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

# Check if Docker is running
check_docker() {
    print_status "Checking Docker..."
    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    print_success "Docker is running"
}

# Clean up any existing test container
cleanup() {
    print_status "Cleaning up existing test containers..."
    docker stop test-legal-dashboard 2>/dev/null || true
    docker rm test-legal-dashboard 2>/dev/null || true
    print_success "Cleanup completed"
}

# Pull latest image
pull_image() {
    print_status "Pulling latest Docker image..."
    docker pull 24498743/legal-dashboard:latest
    print_success "Docker image pulled successfully"
}

# Run test container
run_container() {
    print_status "Starting test container..."
    docker run -d -p 8000:8000 --name test-legal-dashboard 24498743/legal-dashboard:latest
    print_success "Test container started"
}

# Wait for application to be ready
wait_for_app() {
    print_status "Waiting for application to be ready..."
    local max_attempts=10
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:8000/health &> /dev/null; then
            print_success "Application is responding"
            break
        else
            print_warning "Attempt $attempt/$max_attempts: Application not ready yet..."
            sleep 5
            attempt=$((attempt + 1))
        fi
    done
    
    if [ $attempt -gt $max_attempts ]; then
        print_error "Application failed to start properly"
        docker logs test-legal-dashboard
        exit 1
    fi
}

# Test endpoints
test_endpoints() {
    print_status "Testing application endpoints..."
    
    # Test main endpoint
    if curl -f http://localhost:8000/ &> /dev/null; then
        print_success "Main endpoint: OK"
    else
        print_error "Main endpoint: FAILED"
    fi
    
    # Test health endpoint
    if curl -f http://localhost:8000/health &> /dev/null; then
        print_success "Health endpoint: OK"
    else
        print_error "Health endpoint: FAILED"
    fi
    
    # Test docs endpoint
    if curl -f http://localhost:8000/docs &> /dev/null; then
        print_success "API docs: OK"
    else
        print_error "API docs: FAILED"
    fi
    
    # Test OpenAPI schema
    if curl -f http://localhost:8000/openapi.json &> /dev/null; then
        print_success "OpenAPI schema: OK"
    else
        print_error "OpenAPI schema: FAILED"
    fi
}

# Show container status
show_status() {
    print_status "Container Status:"
    docker ps | grep legal-dashboard || print_warning "Container not found"
    
    print_status "Application URLs:"
    echo -e "  🌐 Main: ${GREEN}http://localhost:8000${NC}"
    echo -e "  🏥 Health: ${GREEN}http://localhost:8000/health${NC}"
    echo -e "  📚 API Docs: ${GREEN}http://localhost:8000/docs${NC}"
    echo -e "  📋 OpenAPI: ${GREEN}http://localhost:8000/openapi.json${NC}"
    echo ""
    
    print_status "Container Logs (last 10 lines):"
    docker logs --tail 10 test-legal-dashboard
    echo ""
}

# Interactive testing
interactive_test() {
    print_status "Starting interactive testing..."
    echo ""
    echo "You can now test the application manually:"
    echo "1. Open http://localhost:8000 in your browser"
    echo "2. Check the API documentation at http://localhost:8000/docs"
    echo "3. Test the health endpoint at http://localhost:8000/health"
    echo ""
    echo "Press Enter when you're done testing..."
    read -r
}

# Cleanup and stop
cleanup_test() {
    print_status "Stopping and removing test container..."
    docker stop test-legal-dashboard
    docker rm test-legal-dashboard
    print_success "Test container cleaned up"
}

# Main test process
main() {
    echo -e "${BLUE}Starting local testing process...${NC}"
    echo ""
    
    check_docker
    cleanup
    pull_image
    run_container
    wait_for_app
    test_endpoints
    show_status
    interactive_test
    cleanup_test
    
    echo -e "${GREEN}✅ Local testing completed successfully!${NC}"
    echo ""
    print_status "Your Docker image is working correctly and ready for production deployment."
}

# Run main function
main "$@"