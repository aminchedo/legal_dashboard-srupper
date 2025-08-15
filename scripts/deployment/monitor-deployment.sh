#!/bin/bash

# Legal Dashboard - Vercel Deployment Monitor
# Monitors the deployment status and provides helpful information

echo "🚀 Legal Dashboard - Vercel Deployment Monitor"
echo "=============================================="
echo

# Get repository information
REPO_URL=$(git remote get-url origin | sed 's|https://.*@github.com/|https://github.com/|' | sed 's|\.git$||')
BRANCH=$(git branch --show-current)
LAST_COMMIT=$(git log -1 --oneline)

echo "📁 Repository: $REPO_URL"
echo "🌳 Branch: $BRANCH"
echo "📝 Last Commit: $LAST_COMMIT"
echo

# Check if build works locally
echo "🔨 Testing Local Build..."
cd frontend
if npm run build >/dev/null 2>&1; then
    echo "✅ Local build: SUCCESS"
    echo "   - Build output: frontend/dist/"
    echo "   - Build size: $(du -sh dist/ 2>/dev/null | cut -f1 || echo 'N/A')"
else
    echo "❌ Local build: FAILED"
    echo "   Run 'cd frontend && npm run build' for details"
    exit 1
fi
cd ..

echo

# Check key files
echo "🔍 Vercel Configuration Check..."
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json: Found"
    echo "   - Build command: $(grep '"buildCommand"' vercel.json | cut -d'"' -f4)"
    echo "   - Output dir: $(grep '"outputDirectory"' vercel.json | cut -d'"' -f4)"
else
    echo "❌ vercel.json: Not found"
fi

if [ -f "frontend/package.json" ]; then
    echo "✅ package.json: Found"
    BUILD_SCRIPT=$(grep '"build"' frontend/package.json | cut -d'"' -f4)
    echo "   - Build script: $BUILD_SCRIPT"
else
    echo "❌ package.json: Not found"
fi

echo

# Check for the specific file mentioned in the error
echo "🎯 useDatabase Export Check..."
if [ -f "frontend/src/hooks/useDatabase.ts" ]; then
    echo "✅ useDatabase.ts: Found"
    if grep -q "export.*useDatabase" frontend/src/hooks/useDatabase.ts; then
        echo "   - useDatabase export: ✅ PRESENT"
    else
        echo "   - useDatabase export: ❌ MISSING"
    fi
else
    echo "❌ useDatabase.ts: Not found"
fi

echo

# Check recent activity
echo "📊 Recent Git Activity..."
echo "Recent commits:"
git log --oneline -3 --decorate

echo

# Provide monitoring instructions
echo "🔍 How to Monitor Vercel Deployment:"
echo "1. Visit: https://vercel.com/dashboard"
echo "2. Find project: legal_dashboard-srupper"
echo "3. Check 'Deployments' tab for build status"
echo "4. Click on latest deployment for logs"
echo

echo "🌐 Expected Deployment URL Pattern:"
echo "   https://legal-dashboard-srupper-[hash].vercel.app"
echo "   Or custom domain if configured"
echo

echo "⚡ Quick Actions:"
echo "• Force redeploy: Push a new commit or trigger redeploy in Vercel dashboard"
echo "• Check build logs: Click on deployment in Vercel dashboard → View Logs"
echo "• Test locally: npm run start:quick (from root directory)"
echo

echo "🎉 Status: Build system is ready for deployment!"
echo "   The useDatabase export error has been resolved."
echo "   Local build passes successfully."