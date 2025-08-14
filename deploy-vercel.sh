#!/bin/bash

# Vercel Deployment Script for Persian Legal Dashboard
# This script handles the deployment of the fixed application to Vercel

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

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed. Please install it first:"
    echo "npm install -g vercel"
    exit 1
fi

print_status "Building frontend application..."
cd frontend

# Install dependencies
print_status "Installing frontend dependencies..."
npm install --legacy-peer-deps

# Build the application
print_status "Building frontend for production..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Frontend build completed successfully!"
else
    print_error "Frontend build failed!"
    exit 1
fi

cd ..

# Test Python handler
print_status "Testing Python handler..."
if python3 -c "from api.index import handler; print('Python handler test passed')" 2>/dev/null; then
    print_success "Python handler test passed!"
else
    print_error "Python handler test failed!"
    exit 1
fi

# Check API structure
print_status "Verifying API structure..."
if [ -d "api" ] && [ -f "api/index.py" ] && [ -f "api/documents/search.js" ]; then
    print_success "API structure verified!"
else
    print_error "API structure is incomplete!"
    exit 1
fi

# Deploy to Vercel
print_status "Deploying to Vercel..."
print_warning "This will deploy to production. Make sure you want to proceed."

read -p "Do you want to continue with deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Deployment cancelled by user."
    exit 0
fi

# Deploy to Vercel
print_status "Starting Vercel deployment..."
vercel --prod

if [ $? -eq 0 ]; then
    print_success "Deployment completed successfully!"
    print_status "Testing deployed endpoints..."
    
    # Get the deployment URL (you'll need to replace this with your actual domain)
    print_status "Please test the following endpoints on your deployed URL:"
    echo "  - Health check: /api/health"
    echo "  - Document search: /api/documents/search"
    echo "  - Analytics: /api/analytics"
    echo "  - Persian search test: /api/documents/search?category=%D9%87%D9%85%D9%87"
    
else
    print_error "Deployment failed!"
    exit 1
fi

print_success "🎉 Deployment process completed!"
print_status "Next steps:"
echo "  1. Test all API endpoints"
echo "  2. Verify Persian text handling"
echo "  3. Check dashboard functionality"
echo "  4. Monitor Vercel function logs"

echo ""
print_status "For monitoring, use: vercel logs --follow"