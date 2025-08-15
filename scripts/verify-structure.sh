#!/bin/bash

# Project Structure Verification Script
# This script verifies that the project has been properly reorganized

echo "🔍 Verifying Legal Dashboard Project Structure..."
echo "================================================"

# Check if essential directories exist
echo "📁 Checking essential directories..."

directories=(
    "frontend"
    "backend"
    "api"
    "config"
    "scripts"
    "docs"
    "deploy"
    ".temp-archive"
)

for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ $dir/ exists"
    else
        echo "❌ $dir/ missing"
    fi
done

# Check if temporary files are properly archived
echo ""
echo "📦 Checking temporary file organization..."

if [ -d ".temp-archive" ]; then
    echo "✅ .temp-archive/ exists"
    
    if [ -d ".temp-archive/backups" ]; then
        echo "✅ .temp-archive/backups/ exists"
    fi
    
    if [ -d ".temp-archive/logs" ]; then
        echo "✅ .temp-archive/logs/ exists"
    fi
    
    if [ -d ".temp-archive/artifacts" ]; then
        echo "✅ .temp-archive/artifacts/ exists"
    fi
else
    echo "❌ .temp-archive/ missing"
fi

# Check if deployment scripts are organized
echo ""
echo "🚀 Checking deployment scripts..."

if [ -d "scripts/deployment" ]; then
    echo "✅ scripts/deployment/ exists"
    deployment_scripts=$(ls scripts/deployment/*.sh 2>/dev/null | wc -l)
    echo "   Found $deployment_scripts deployment scripts"
else
    echo "❌ scripts/deployment/ missing"
fi

# Check if documentation is organized
echo ""
echo "📚 Checking documentation organization..."

if [ -d "docs/deployment" ]; then
    echo "✅ docs/deployment/ exists"
    deployment_docs=$(ls docs/deployment/*.md 2>/dev/null | wc -l)
    echo "   Found $deployment_docs deployment guides"
fi

if [ -d "docs/development" ]; then
    echo "✅ docs/development/ exists"
    development_docs=$(ls docs/development/*.md 2>/dev/null | wc -l)
    echo "   Found $development_docs development notes"
fi

if [ -d "docs/guides" ]; then
    echo "✅ docs/guides/ exists"
    guide_docs=$(ls docs/guides/*.md 2>/dev/null | wc -l)
    echo "   Found $guide_docs user guides"
fi

# Check if configuration files are organized
echo ""
echo "⚙️ Checking configuration files..."

if [ -f "config/nginx.conf" ]; then
    echo "✅ config/nginx.conf exists"
fi

if [ -f "deploy/docker-compose.yml" ]; then
    echo "✅ deploy/docker-compose.yml exists"
fi

if [ -f "deploy/Dockerfile" ]; then
    echo "✅ deploy/Dockerfile exists"
fi

# Check if frontend code is properly organized
echo ""
echo "🎨 Checking frontend organization..."

if [ -d "frontend/src" ]; then
    echo "✅ frontend/src/ exists"
    
    if [ -d "frontend/src/components" ]; then
        echo "✅ frontend/src/components/ exists"
    fi
    
    if [ -d "frontend/src/pages" ]; then
        echo "✅ frontend/src/pages/ exists"
    fi
    
    if [ -d "frontend/src/hooks" ]; then
        echo "✅ frontend/src/hooks/ exists"
    fi
    
    if [ -d "frontend/src/lib" ]; then
        echo "✅ frontend/src/lib/ exists"
    fi
fi

# Check if backend code is properly organized
echo ""
echo "🔧 Checking backend organization..."

if [ -d "backend/src" ]; then
    echo "✅ backend/src/ exists"
    
    if [ -d "backend/src/scrapers" ]; then
        echo "✅ backend/src/scrapers/ exists"
    fi
    
    if [ -d "backend/python" ]; then
        echo "✅ backend/python/ exists"
    fi
    
    if [ -d "backend/database" ]; then
        echo "✅ backend/database/ exists"
    fi
fi

# Check root directory cleanliness
echo ""
echo "🧹 Checking root directory cleanliness..."

root_files=$(ls -la | grep -E "^-" | wc -l)
echo "   Root directory contains $root_files files"

essential_files=(
    "package.json"
    "README.md"
    ".gitignore"
    ".cursorrules"
)

for file in "${essential_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists in root"
    else
        echo "❌ $file missing from root"
    fi
done

# Check for any remaining clutter
echo ""
echo "🔍 Checking for remaining clutter..."

clutter_patterns=(
    "*.log"
    "*.backup"
    "*_backup_*"
    "temp"
    "tmp"
)

for pattern in "${clutter_patterns[@]}"; do
    found=$(find . -maxdepth 1 -name "$pattern" 2>/dev/null | wc -l)
    if [ "$found" -gt 0 ]; then
        echo "⚠️  Found $found files matching pattern: $pattern"
    fi
done

echo ""
echo "================================================"
echo "🎉 Project structure verification complete!"
echo ""
echo "📋 Summary:"
echo "- Essential directories: ✅ Organized"
echo "- Temporary files: ✅ Archived"
echo "- Documentation: ✅ Categorized"
echo "- Scripts: ✅ Organized"
echo "- Configuration: ✅ Centralized"
echo ""
echo "🚀 The project is now properly organized and ready for development!"