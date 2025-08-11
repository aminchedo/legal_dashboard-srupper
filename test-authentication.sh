#!/bin/bash

# 🔐 BULLETPROOF AUTHENTICATION TEST SCRIPT
# Tests all authentication methods locally before GitHub workflow

echo "🔐 Testing Bulletproof Docker Authentication Methods"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to test authentication method
test_auth_method() {
    local method_name="$1"
    local auth_command="$2"
    
    echo -e "${BLUE}📝 Testing $method_name...${NC}"
    
    if eval "$auth_command" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ $method_name successful!${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️ $method_name failed${NC}"
        return 1
    fi
}

# Test Method 1: Token Authentication
echo ""
echo -e "${BLUE}🔐 METHOD 1: Token Authentication${NC}"
test_auth_method "Token Authentication" 'echo "dckr_pat_11XAFYII0Y7K9QGZD0X5A11Z18" | docker login -u "24498743" --password-stdin'
TOKEN_SUCCESS=$?

# Test Method 2: Password Authentication
echo ""
echo -e "${BLUE}🔐 METHOD 2: Password Authentication${NC}"
test_auth_method "Password Authentication" 'echo "Ll12345678@" | docker login -u "24498743" --password-stdin'
PASSWORD_SUCCESS=$?

# Test Method 3: Direct Login
echo ""
echo -e "${BLUE}🔐 METHOD 3: Direct Login${NC}"
test_auth_method "Direct Login" 'docker login -u 24498743 -p Ll12345678@'
DIRECT_SUCCESS=$?

# Summary
echo ""
echo "=================================================="
echo -e "${BLUE}📊 AUTHENTICATION TEST SUMMARY${NC}"
echo "=================================================="

if [ $TOKEN_SUCCESS -eq 0 ]; then
    echo -e "${GREEN}✅ Token Authentication: WORKING${NC}"
elif [ $PASSWORD_SUCCESS -eq 0 ]; then
    echo -e "${GREEN}✅ Password Authentication: WORKING${NC}"
elif [ $DIRECT_SUCCESS -eq 0 ]; then
    echo -e "${GREEN}✅ Direct Login: WORKING${NC}"
else
    echo -e "${RED}❌ ALL METHODS FAILED${NC}"
    echo ""
    echo "Troubleshooting steps:"
    echo "1. Check Docker Hub credentials"
    echo "2. Verify internet connection"
    echo "3. Check Docker daemon status"
    echo "4. Review Docker Hub account status"
    exit 1
fi

# Test Docker Hub access
echo ""
echo -e "${BLUE}🔍 Testing Docker Hub access...${NC}"
if docker info | grep -i "registry" >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Docker Hub access verified!${NC}"
else
    echo -e "${YELLOW}⚠️ Docker Hub access check failed${NC}"
fi

# Test image pull capability
echo ""
echo -e "${BLUE}📦 Testing image pull capability...${NC}"
if docker pull hello-world:latest >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Image pull capability verified!${NC}"
    # Clean up test image
    docker rmi hello-world:latest >/dev/null 2>&1
else
    echo -e "${YELLOW}⚠️ Image pull capability check failed${NC}"
fi

echo ""
echo "=================================================="
echo -e "${GREEN}🎉 AUTHENTICATION TEST COMPLETED${NC}"
echo "=================================================="
echo ""
echo "Next steps:"
echo "1. Commit and push to trigger GitHub workflow"
echo "2. Monitor the build process"
echo "3. Check Docker Hub repository: https://hub.docker.com/r/24498743/legal-dashboard"
echo ""
echo -e "${GREEN}🚀 Ready for bulletproof deployment!${NC}"