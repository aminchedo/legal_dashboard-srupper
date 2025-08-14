#!/bin/bash

# Vercel Deployment Script for Persian Legal Document Management System
# This script deploys the application to Vercel with proper configuration

set -e  # Exit on any error

echo "🚀 Starting Vercel deployment for Persian Legal Dashboard..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if we're in the right directory
if [ ! -f "vercel.json" ]; then
    print_error "vercel.json not found. Please run this script from the project root."
    exit 1
fi

# Check if frontend directory exists
if [ ! -d "frontend" ]; then
    print_error "frontend directory not found."
    exit 1
fi

print_status "Checking Vercel CLI installation..."
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

print_status "Building frontend application..."
cd frontend
npm install --legacy-peer-deps
npm run build
cd ..

print_status "Verifying build output..."
if [ ! -f "frontend/dist/index.html" ]; then
    print_error "Build failed - index.html not found in frontend/dist"
    exit 1
fi

print_success "Frontend build completed successfully"

print_status "Verifying API routes..."
api_routes=(
    "frontend/api/health.js"
    "frontend/api/analytics.js"
    "frontend/api/documents/search.js"
    "frontend/api/documents/categories.js"
    "frontend/api/documents/statistics.js"
    "frontend/api/documents/tags.js"
    "frontend/api/scraping/stats.js"
)

for route in "${api_routes[@]}"; do
    if [ ! -f "$route" ]; then
        print_error "API route not found: $route"
        exit 1
    fi
done

print_success "All API routes verified"

print_status "Deploying to Vercel..."
print_warning "This will deploy to production. Use --prod=false for preview deployment."

# Deploy to Vercel
if vercel --prod --yes; then
    print_success "Deployment completed successfully!"
    
    print_status "Testing deployed endpoints..."
    
    # Get the deployment URL (you'll need to extract this from vercel output)
    print_status "Please check the deployment URL provided by Vercel"
    print_status "Test the following endpoints:"
    echo "  - /api/health"
    echo "  - /api/analytics"
    echo "  - /api/documents/categories"
    echo "  - /api/documents/statistics"
    echo "  - /api/documents/tags"
    echo "  - /api/scraping/stats"
    
    print_success "Deployment script completed!"
else
    print_error "Deployment failed!"
    exit 1
fi